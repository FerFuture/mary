import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getDemoProductById } from "@/lib/demo-products";
import { getPrisma } from "@/lib/prisma";
import { hasActiveDbProducts } from "@/lib/products";
import { decimalToNumber } from "@/lib/format";
import { sendOrderEmails } from "@/lib/email";

// Rate limiting simple (en memoria) para frenar spam.
// Nota: en serverless puede no persistir entre instancias, pero igualmente reduce abuso.
const ORDER_RATE_LIMIT = {
  windowMs: 60_000, // 1 minuto
  maxRequestsPerWindow: 8,
};

const rateBuckets = new Map<string, number[]>(); // ip -> timestamps

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  const xRealIp = request.headers.get("x-real-ip");
  const ip =
    (xff?.split(",")[0]?.trim() ?? "") ||
    (xRealIp?.trim() ?? "") ||
    "unknown";
  return ip;
}

function isRateLimited(ip: string, nowMs: number): boolean {
  const bucket = rateBuckets.get(ip) ?? [];
  const cutoff = nowMs - ORDER_RATE_LIMIT.windowMs;
  const filtered = bucket.filter((t) => t >= cutoff);
  if (filtered.length >= ORDER_RATE_LIMIT.maxRequestsPerWindow) {
    // Guardamos el bucket “limpiado” igual para que no crezca infinito.
    rateBuckets.set(ip, filtered);
    return true;
  }
  filtered.push(nowMs);
  rateBuckets.set(ip, filtered);

  // Limpieza simple para buckets vacíos.
  if (filtered.length === 0) rateBuckets.delete(ip);
  return false;
}

function aggregateItemQuantities(
  lines: { productId: string; quantity: number }[],
): { productId: string; quantity: number }[] {
  const m = new Map<string, number>();
  for (const line of lines) {
    m.set(line.productId, (m.get(line.productId) ?? 0) + line.quantity);
  }
  return [...m.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

const bodySchema = z.object({
  customerEmail: z.string().email(),
  customerPhone: z
    .string()
    .trim()
    .regex(/^[0-9+()\\-\\s]{6,25}$/u)
    .optional()
    .nullable(),
  shippingAddress: z.string().trim().min(3).max(500),
  shippingCity: z.string().trim().min(2).max(120),
  shippingPostalCode: z.string().trim().regex(/^\d{2,8}$/u),
  // Validación razonable para evitar texto totalmente inválido.
  // Sigue siendo "texto libre" (opción 2), pero sin caracteres raros.
  shippingState: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[\p{L}\s.,'-]+$/u),
  shippingCountry: z
    .string()
    .trim()
    .regex(/^[\p{L}\s.'-]{2,80}$/u)
    .optional()
    .nullable(),
  // Anti-bots: el cliente legítimo no lo toca; los bots suelen rellenarlo.
  honeypot: z.string().optional().nullable(),
  // Idempotencia (evita duplicar órdenes si el cliente reintenta).
  idempotencyKey: z.string().min(8).max(200).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(120),
        quantity: z.number().int().positive().max(50),
      }),
    )
    .min(1)
    .max(10),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);
  const nowMs = Date.now();
  if (isRateLimited(ip, nowMs)) {
    return NextResponse.json(
      { error: "Demasiados pedidos. Esperá un momento." },
      { status: 429 },
    );
  }

  const prisma = getPrisma();
  const useDemoCheckout = !prisma || !(await hasActiveDbProducts());

  const {
    customerEmail,
    customerPhone,
    shippingAddress,
    shippingCity,
    shippingPostalCode,
    shippingState,
    shippingCountry: _countryRaw,
    honeypot,
    idempotencyKey,
    items,
  } = parsed.data;

  if (honeypot && String(honeypot).trim().length > 0) {
    return NextResponse.json(
      { error: "Solicitud inválida" },
      { status: 400 },
    );
  }

  // El backend fuerza el país porque por ahora tu tienda envía a Argentina.
  const shippingCountry = "Argentina";

  const phone =
    customerPhone && String(customerPhone).trim()
      ? String(customerPhone).trim()
      : null;

  if (useDemoCheckout) {
    const aggregatedDemo = aggregateItemQuantities(items);
    for (const { productId, quantity } of aggregatedDemo) {
      const p = getDemoProductById(productId);
      if (!p) {
        return NextResponse.json(
          { error: "Producto no disponible", productId },
          { status: 400 },
        );
      }
      if (quantity > p.maxOrderQuantity) {
        return NextResponse.json(
          {
            error: "La cantidad pedida no está disponible para este producto",
            productId,
          },
          { status: 400 },
        );
      }
    }

    const resolvedDemo: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      name: string;
    }> = [];

    for (const line of items) {
      const p = getDemoProductById(line.productId);
      if (!p) {
        return NextResponse.json(
          { error: "Producto no disponible", productId: line.productId },
          { status: 400 },
        );
      }
      resolvedDemo.push({
        productId: p.id,
        quantity: line.quantity,
        unitPrice: p.price,
        name: p.name,
      });
    }

    let productsTotal = 0;
    const emailLines = resolvedDemo.map((l) => {
      const lineTotal = l.unitPrice * l.quantity;
      productsTotal += lineTotal;
      return {
        name: l.name,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        lineTotal,
      };
    });

    const orderId = `demo-${Date.now()}`;
    const shippingPayload = {
      address: shippingAddress,
      city: shippingCity,
      postalCode: shippingPostalCode,
      state: shippingState,
      country: shippingCountry,
    };

    try {
      await sendOrderEmails({
        orderId,
        customerEmail,
        customerPhone: phone,
        lines: emailLines,
        productsTotal,
        shipping: shippingPayload,
      });
    } catch (e) {
      console.error("Email send failed (pedido demo)", e);
    }

    return NextResponse.json({
      orderId,
      total: productsTotal,
      lines: emailLines,
      demo: true,
    });
  }

  const ids = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, active: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const line of items) {
    if (!byId.has(line.productId)) {
      return NextResponse.json(
        { error: "Producto no disponible", productId: line.productId },
        { status: 400 },
      );
    }
  }

  const aggregatedDb = aggregateItemQuantities(items);
  for (const { productId, quantity } of aggregatedDb) {
    const p = byId.get(productId)!;
    if (quantity > p.stock) {
      return NextResponse.json(
        {
          error: "La cantidad pedida no está disponible para este producto",
          productId,
        },
        { status: 400 },
      );
    }
  }

  // Idempotencia: si el cliente reintenta con la misma clave,
  // evitamos duplicar el pedido y hacer decrementos de stock dos veces.
  const deterministicOrderId = idempotencyKey
    ? `ord_${idempotencyKey}`
    : null;

  if (deterministicOrderId) {
    const existing = await prisma.order.findUnique({
      where: { id: deterministicOrderId },
      include: { items: true },
    });

    if (existing) {
      const existingProductIds = [
        ...new Set(existing.items.map((it) => it.productId)),
      ];
      const existingProducts = await prisma.product.findMany({
        where: { id: { in: existingProductIds } },
        select: { id: true, name: true },
      });
      const nameById = new Map(existingProducts.map((p) => [p.id, p.name]));

      const lines = existing.items.map((it) => {
        const unit = decimalToNumber(it.unitPrice);
        return {
          name: nameById.get(it.productId) ?? "Producto",
          quantity: it.quantity,
          unitPrice: unit,
          lineTotal: unit * it.quantity,
        };
      });

      return NextResponse.json({
        orderId: existing.id,
        total: decimalToNumber(existing.total),
        lines,
      });
    }
  }

  let productsTotal = 0;
  const resolvedLines: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    name: string;
  }> = [];

  for (const line of items) {
    const p = byId.get(line.productId)!;
    const unit = decimalToNumber(p.price);
    productsTotal += unit * line.quantity;
    resolvedLines.push({
      productId: p.id,
      quantity: line.quantity,
      unitPrice: unit,
      name: p.name,
    });
  }

  const shippingPayload = {
    address: shippingAddress,
    city: shippingCity,
    postalCode: shippingPostalCode,
    state: shippingState,
    country: shippingCountry,
  };

  let orderId: string;
  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const { productId, quantity } of aggregatedDb) {
        const updated = await tx.product.updateMany({
          where: {
            id: productId,
            active: true,
            stock: { gte: quantity },
          },
          data: { stock: { decrement: quantity } },
        });
        if (updated.count !== 1) {
          throw new Error(`STOCK_CONFLICT:${productId}`);
        }
      }

      const o = await tx.order.create({
        data: {
          ...(deterministicOrderId ? { id: deterministicOrderId } : {}),
          customerEmail,
          customerPhone: phone,
          shippingAddress,
          shippingCity,
          shippingPostalCode,
          shippingState,
          shippingCountry,
          total: productsTotal,
        },
      });
      for (const line of resolvedLines) {
        await tx.orderItem.create({
          data: {
            orderId: o.id,
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          },
        });
      }
      return o;
    });
    orderId = order.id;
  } catch (e) {
    console.error("Order transaction failed", e);
    const msg = e instanceof Error ? e.message : "";
    const isUniqueIdConflict =
      deterministicOrderId &&
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002";

    if (isUniqueIdConflict && deterministicOrderId) {
      const existing = await prisma.order.findUnique({
        where: { id: deterministicOrderId },
        include: { items: true },
      });

      if (existing) {
        const existingProductIds = [
          ...new Set(existing.items.map((it) => it.productId)),
        ];
        const existingProducts = await prisma.product.findMany({
          where: { id: { in: existingProductIds } },
          select: { id: true, name: true },
        });
        const nameById = new Map(existingProducts.map((p) => [p.id, p.name]));

        const lines = existing.items.map((it) => {
          const unit = decimalToNumber(it.unitPrice);
          return {
            name: nameById.get(it.productId) ?? "Producto",
            quantity: it.quantity,
            unitPrice: unit,
            lineTotal: unit * it.quantity,
          };
        });

        return NextResponse.json({
          orderId: existing.id,
          total: decimalToNumber(existing.total),
          lines,
        });
      }
    }
    if (msg.startsWith("STOCK_CONFLICT:")) {
      return NextResponse.json(
        {
          error:
            "No hay suficientes unidades disponibles. Actualizá el carrito e intentá de nuevo.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "No se pudo guardar el pedido" },
      { status: 500 },
    );
  }

  const emailLines = resolvedLines.map((l) => ({
    name: l.name,
    quantity: l.quantity,
    unitPrice: l.unitPrice,
    lineTotal: l.unitPrice * l.quantity,
  }));

  try {
    await sendOrderEmails({
      orderId,
      customerEmail,
      customerPhone: phone,
      lines: emailLines,
      productsTotal,
      shipping: shippingPayload,
    });
  } catch (e) {
    console.error("Email send failed (pedido guardado)", e);
  }

  return NextResponse.json({
    orderId,
    total: productsTotal,
    lines: emailLines,
  });
}
