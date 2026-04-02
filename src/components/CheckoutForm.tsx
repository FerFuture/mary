"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatCurrency } from "@/lib/format";
import { ARGENTINA_PROVINCES } from "@/lib/argentina-provinces";

const initialShipping = {
  address: "",
  city: "",
  postalCode: "",
  state: "",
  country: "Argentina",
};

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const clear = useCartStore((s) => s.clear);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shipping, setShipping] = useState(initialShipping);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const [provinceOpen, setProvinceOpen] = useState(false);

  const subtotal = cartSubtotal(items);

  function resetForm() {
    setEmail("");
    setPhone("");
    setShipping(initialShipping);
    setHoneypot("");
    setProvinceOpen(false);
  }

  const provinceQuery = shipping.state.trim().toLowerCase();
  const provinceSuggestions =
    provinceQuery.length > 0
      ? ARGENTINA_PROVINCES.filter((p) =>
          p.toLowerCase().startsWith(provinceQuery),
        ).slice(0, 8)
      : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("loading");
    setMessage("");

    // Idempotencia simple para evitar duplicados si el usuario reintenta.
    // Se envía al backend como clave.
    const requestId =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email.trim(),
          customerPhone: phone.trim() || null,
          shippingAddress: shipping.address.trim(),
          shippingCity: shipping.city.trim(),
          shippingPostalCode: shipping.postalCode.trim(),
          shippingState: shipping.state.trim(),
          shippingCountry: shipping.country.trim() || null,
          // Honeypot anti-bots (debe quedar vacío)
          honeypot: honeypot.trim(),
          idempotencyKey: requestId,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        orderId?: string;
        total?: number;
        demo?: boolean;
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "No se pudo enviar el pedido.");
        return;
      }
      clear();
      resetForm();
      setStatus("success");
      const id = data.orderId ?? "";
      const shortRef = id.startsWith("demo-")
        ? id.slice(5, 13).toUpperCase()
        : id.slice(0, 8).toUpperCase();
      setMessage(
        shortRef
          ? `Te enviamos un resumen de tu pedido a tu correo. Te vamos a contactar por WhatsApp para coordinar el pago y el envío. Pedido #${shortRef}.`
          : "Te enviamos un resumen de tu pedido a tu correo. Te vamos a contactar por WhatsApp para coordinar el pago y el envío.",
      );
    } catch {
      setStatus("error");
      setMessage("Error de red. Intentá de nuevo más tarde.");
    }
  }

  if (items.length === 0 && status !== "success") {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
        <p className="text-muted">Tu carrito está vacío.</p>
        <Link
          href="/catalogo"
          className="mt-4 inline-block text-sm font-semibold text-maroon hover:underline"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <p className="font-serif text-xl font-semibold text-foreground">
          ¡Gracias por tu pedido!
        </p>
        <p className="mt-3 text-sm text-muted">{message}</p>
        <Link
          href="/catalogo"
          className="mt-6 inline-block rounded-full bg-maroon px-6 py-2.5 text-sm font-semibold text-white hover:bg-maroon-hover"
        >
          Seguir comprando
        </Link>
      </div>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-maroon/30";

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h2 className="font-serif text-xl font-semibold">Productos</h2>
        <ul className="mt-4 space-y-4">
          {items.map((line) => (
            <li
              key={line.productId}
              className="flex gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                <Image
                  src={line.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/catalogo/${line.slug}`}
                  className="font-medium hover:text-maroon"
                >
                  {line.name}
                </Link>
                <p className="text-sm text-muted">
                  {formatCurrency(line.unitPrice)} × {line.quantity}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="h-8 w-8 rounded border border-border"
                    onClick={() =>
                      setQuantity(line.productId, line.quantity - 1)
                    }
                    aria-label="Menos"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{line.quantity}</span>
                  <button
                    type="button"
                    className="h-8 w-8 rounded border border-border"
                    onClick={() =>
                      setQuantity(line.productId, line.quantity + 1)
                    }
                    aria-label="Más"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="ml-auto text-sm text-maroon hover:underline"
                    onClick={() => removeItem(line.productId)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold">Enviar pedido</h2>
          <p className="mt-2 text-sm text-muted">
            Completá tus datos y la dirección de envío. El costo de envío lo
            coordinamos por WhatsApp según tu zona. Sin pago online.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Honeypot anti-bots: bots suelen rellenarlo aunque esté oculto.
                Debe quedar vacío, el backend lo valida. */}
            <input
              type="text"
              name="company"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ display: "none" }}
            />
            <div>
              <label
                htmlFor="checkout-email"
                className="text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Correo electrónico *
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="checkout-phone"
                className="text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Teléfono / WhatsApp (recomendado)
              </label>
              <input
                id="checkout-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. +54 9 …"
                className={inputClass}
              />
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Datos de envío
              </p>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="ship-address" className="text-xs text-muted">
                    Dirección (calle, número, piso/depto) *
                  </label>
                  <input
                    id="ship-address"
                    required
                    autoComplete="street-address"
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, address: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ship-city" className="text-xs text-muted">
                      Ciudad *
                    </label>
                    <input
                      id="ship-city"
                      required
                      autoComplete="address-level2"
                      value={shipping.city}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, city: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ship-cp" className="text-xs text-muted">
                      Código postal *
                    </label>
                    <input
                      id="ship-cp"
                      required
                      autoComplete="postal-code"
                      value={shipping.postalCode}
                      onChange={(e) =>
                        setShipping((s) => ({
                          ...s,
                          postalCode: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ship-state" className="text-xs text-muted">
                      Provincia / estado *
                    </label>
                    <div className="relative">
                      <input
                        id="ship-state"
                        required
                        autoComplete="address-level1"
                        value={shipping.state}
                        onChange={(e) => {
                          const next = e.target.value;
                          setShipping((s) => ({ ...s, state: next }));
                          setProvinceOpen(true);
                        }}
                        onFocus={() => setProvinceOpen(true)}
                        onBlur={() => {
                          // Un pequeño delay para permitir que el click en una opción funcione.
                          window.setTimeout(() => setProvinceOpen(false), 120);
                        }}
                        className={inputClass}
                      />
                      {provinceOpen && provinceSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-background shadow-lg">
                          <ul className="max-h-56 overflow-auto py-1">
                            {provinceSuggestions.map((p) => (
                              <li key={p}>
                                <button
                                  type="button"
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-cream-dark/60"
                                  onClick={() => {
                                    setShipping((s) => ({ ...s, state: p }));
                                    setProvinceOpen(false);
                                  }}
                                >
                                  {p}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ship-country" className="text-xs text-muted">
                      País
                    </label>
                    <input
                      id="ship-country"
                      autoComplete="country-name"
                      value={shipping.country}
                      disabled
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, country: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t border-border pt-4 text-sm">
              <span className="text-muted">Total productos</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs text-muted">
              Precios confirmados al procesar el pedido. Envío aparte según
              zona.
            </p>
            <button
              type="submit"
              disabled={status === "loading" || items.length === 0}
              className="w-full rounded-full bg-maroon py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-maroon-hover disabled:opacity-50"
            >
              {status === "loading" ? "Enviando…" : "Confirmar pedido"}
            </button>
          </form>
          {message && status === "error" && (
            <p className="mt-4 text-sm text-maroon">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
