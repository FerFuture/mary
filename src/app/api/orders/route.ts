import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/format";
import { sendOrderEmails } from "@/lib/email";

const bodySchema = z.object({
  customerEmail: z.string().email(),
  customerPhone: z.string().optional().nullable(),
  shippingAddress: z.string().trim().min(3).max(500),
  shippingCity: z.string().trim().min(2).max(120),
  shippingPostalCode: z.string().trim().min(2).max(20),
  shippingState: z.string().trim().min(2).max(120),
  shippingCountry: z.string().trim().max(80).optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
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

  const {
    customerEmail,
    customerPhone,
    shippingAddress,
    shippingCity,
    shippingPostalCode,
    shippingState,
    shippingCountry: countryRaw,
    items,
  } = parsed.data;

  const shippingCountry =
    countryRaw && countryRaw.trim().length > 0
      ? countryRaw.trim()
      : "Argentina";

  const phone =
    customerPhone && String(customerPhone).trim()
      ? String(customerPhone).trim()
      : null;

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
      const o = await tx.order.create({
        data: {
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
