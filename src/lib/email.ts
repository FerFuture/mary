import { Resend } from "resend";
import nodemailer from "nodemailer";

export type OrderLineForEmail = {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type ShippingAddressForEmail = {
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
};

function siteName(): string {
  return process.env.NEXT_PUBLIC_SITE_NAME ?? "Mary Mirari";
}

/** Resend solo entrega a la cuenta si el remitente es @resend.dev (403 a otros destinatarios). */
function usesResendSandboxFrom(): boolean {
  return (process.env.EMAIL_FROM ?? "").toLowerCase().includes("resend.dev");
}

function sameEmail(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function buildResendSandboxBannerHtml(realCustomerEmail: string): string {
  return `<div style="margin-bottom:20px;padding:14px;background:#fff8e6;border:1px solid #e6d08c;border-radius:8px;font-family:system-ui,sans-serif;font-size:13px;line-height:1.5;color:#5c4a00">
    <strong>Modo prueba Resend:</strong> con <code>onboarding@resend.dev</code> Resend solo permite enviar a tu correo de cuenta. El cliente ingresó <strong>${escapeHtml(realCustomerEmail)}</strong>. Cuando verifiques tu dominio en Resend y uses un remitente propio, este mismo mensaje se enviará a esa dirección.
  </div>`;
}

function orderDisplayRef(orderId: string): string {
  return orderId.slice(0, 8).toUpperCase();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatMoneyArs(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

function buildLinesTextHtml(lines: OrderLineForEmail[]): string {
  return lines
    .map(
      (l) =>
        `<p style="margin:6px 0;font-family:Georgia,serif;font-size:15px;line-height:1.5;color:#1a1a1a">${l.quantity} x ${escapeHtml(l.name)} por ${formatMoneyArs(l.unitPrice)} cada uno.</p>`,
    )
    .join("");
}

function buildShippingBlockHtml(s: ShippingAddressForEmail): string {
  return `
  <p style="margin-top:20px;font-family:system-ui,sans-serif;font-size:13px;font-weight:600;color:#333">Datos de envío</p>
  <p style="margin:4px 0;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#333">
    <strong>Dirección:</strong> ${escapeHtml(s.address)}<br/>
    <strong>Ciudad:</strong> ${escapeHtml(s.city)}<br/>
    <strong>Código postal:</strong> ${escapeHtml(s.postalCode)}<br/>
    <strong>Provincia / Estado:</strong> ${escapeHtml(s.state)}<br/>
    <strong>País:</strong> ${escapeHtml(s.country || "—")}
  </p>`;
}

function contactParagraphHtml(): string {
  const custom = process.env.ORDER_EMAIL_CONTACT_NOTE?.trim();
  if (custom) {
    return `<p style="margin-top:18px;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#333">${escapeHtml(custom)}</p>`;
  }
  return `<p style="margin-top:18px;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#333">
    Te vamos a contactar por <strong>WhatsApp</strong> para coordinar el <strong>pago</strong> y el <strong>costo de envío</strong> (varía según la zona).
  </p>`;
}

function disclaimerHtml(): string {
  return `<p style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e0d8;font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;color:#777">
    Si no hiciste este pedido o estabas probando el sitio, podés desconsiderar este correo.
  </p>`;
}

function buildCustomerEmailHtml(params: {
  orderId: string;
  lines: OrderLineForEmail[];
  productsTotal: number;
  shipping: ShippingAddressForEmail;
}): string {
  const brand = siteName();
  const ref = orderDisplayRef(params.orderId);
  const linesHtml = buildLinesTextHtml(params.lines);

  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#f9f5f2">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:28px 24px;border:1px solid #e8e0d8;border-radius:8px">
    <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:18px;color:#1a1a1a">Gracias por comprar en <strong>${escapeHtml(brand)}</strong></p>
    <p style="margin:0 0 20px;font-family:system-ui,sans-serif;font-size:15px;color:#333">Tu pedido: <strong>#${escapeHtml(ref)}</strong></p>
    ${linesHtml}
    <p style="margin:16px 0 4px;font-family:system-ui,sans-serif;font-size:14px;color:#333">
      <strong>Costo de envío:</strong> a coordinar según tu zona (te lo confirmamos al contactarte).
    </p>
    <p style="margin:12px 0 0;font-family:Georgia,serif;font-size:17px;color:#1a1a1a">
      <strong>Total productos:</strong> ${formatMoneyArs(params.productsTotal)}
    </p>
    ${contactParagraphHtml()}
    ${buildShippingBlockHtml(params.shipping)}
    <p style="margin-top:24px;font-family:system-ui,sans-serif;font-size:14px;color:#333">Saludos,<br/><strong>${escapeHtml(brand)}</strong></p>
    ${disclaimerHtml()}
  </div>
</body></html>`;
}

function buildOwnerEmailHtml(params: {
  orderId: string;
  customerEmail: string;
  customerPhone: string | null;
  lines: OrderLineForEmail[];
  productsTotal: number;
  shipping: ShippingAddressForEmail;
}): string {
  const brand = siteName();
  const ref = orderDisplayRef(params.orderId);
  const linesHtml = buildLinesTextHtml(params.lines);
  const phoneLine = params.customerPhone
    ? `<strong>Tel / WhatsApp:</strong> ${escapeHtml(params.customerPhone)}<br/>`
    : "";

  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#f0ebe4">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:28px 24px;border:1px solid #ddd;border-radius:8px">
    <p style="margin:0;font-family:system-ui,sans-serif;font-size:16px;font-weight:700;color:#1a1a1a">Nuevo pedido — ${escapeHtml(brand)}</p>
    <p style="margin:12px 0 16px;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#333">
      <strong>Referencia:</strong> #${escapeHtml(ref)}<br/>
      <strong>ID interno:</strong> ${escapeHtml(params.orderId)}<br/>
      <strong>Cliente:</strong> ${escapeHtml(params.customerEmail)}<br/>
      ${phoneLine}
    </p>
    ${linesHtml}
    <p style="margin:16px 0 0;font-family:system-ui,sans-serif;font-size:14px"><strong>Total productos:</strong> ${formatMoneyArs(params.productsTotal)}</p>
    <p style="margin:8px 0 0;font-size:13px;color:#555">Envío: a cotizar según zona.</p>
    ${buildShippingBlockHtml(params.shipping)}
  </div>
</body></html>`;
}

async function sendWithResend(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY no configurada");
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM no configurada");
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
  if (error) throw new Error(error.message);
}

async function sendWithSmtp(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;
  if (!host || !from) throw new Error("SMTP_HOST o EMAIL_FROM no configurados");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
  await transporter.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    await sendWithResend(params);
    return;
  }
  await sendWithSmtp(params);
}

export async function sendOrderEmails(params: {
  orderId: string;
  customerEmail: string;
  customerPhone: string | null;
  lines: OrderLineForEmail[];
  productsTotal: number;
  shipping: ShippingAddressForEmail;
}): Promise<void> {
  const name = siteName();
  const ref = orderDisplayRef(params.orderId);
  const owner = process.env.OWNER_EMAIL;
  if (!owner) {
    console.warn("OWNER_EMAIL no configurada: no se notifica al dueño");
  }

  const customerBodyHtml = buildCustomerEmailHtml({
    orderId: params.orderId,
    lines: params.lines,
    productsTotal: params.productsTotal,
    shipping: params.shipping,
  });

  const sandbox = usesResendSandboxFrom();
  let customerTo = params.customerEmail;
  let customerSubject = `${name} — Tu pedido #${ref}`;
  let customerHtmlOut = customerBodyHtml;

  if (sandbox && owner) {
    if (!sameEmail(params.customerEmail, owner)) {
      customerTo = owner;
      customerSubject = `[Prueba Resend] Copia del mail al cliente — Pedido #${ref}`;
      customerHtmlOut =
        buildResendSandboxBannerHtml(params.customerEmail) + customerBodyHtml;
    }
  } else if (sandbox && !owner) {
    console.warn(
      "mary_mirari: EMAIL_FROM usa resend.dev pero OWNER_EMAIL no está definido; el mail al cliente puede fallar con 403 si no es tu correo de cuenta.",
    );
  }

  await sendEmail({
    to: customerTo,
    subject: customerSubject,
    html: customerHtmlOut,
  });

  if (owner) {
    const ownerHtml = buildOwnerEmailHtml({
      orderId: params.orderId,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      lines: params.lines,
      productsTotal: params.productsTotal,
      shipping: params.shipping,
    });
    await sendEmail({
      to: owner,
      subject: `${name} — Pedido nuevo #${ref}`,
      html: ownerHtml,
    });
  }
}
