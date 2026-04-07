"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatCurrency } from "@/lib/format";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const drawerOpen = useCartStore((s) => s.drawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (drawerOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  const subtotal = cartSubtotal(items);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        aria-label="Cerrar carrito"
        onClick={closeDrawer}
      />
      <aside
        className="relative flex h-full w-full max-w-md flex-col bg-card shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id="cart-drawer-title"
            className="font-serif text-xl font-semibold"
          >
            Tu carrito
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-lg p-2 text-muted hover:bg-cream-dark hover:text-foreground"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted">Aún no agregaste productos.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((line) => (
                <li
                  key={`${line.productId}-${line.colorKey ?? ""}`}
                  className="flex gap-3 rounded-lg border border-border/80 bg-background/50 p-3 transition hover:border-maroon/20"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-cream-dark">
                    <Image
                      src={line.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/catalogo/${line.slug}`}
                      onClick={closeDrawer}
                      className="font-medium text-foreground hover:text-maroon line-clamp-2"
                    >
                      {line.name}
                    </Link>
                    <p className="text-sm text-muted">
                      {formatCurrency(line.unitPrice)} c/u
                    </p>
                    {line.colorLabel ? (
                      <p className="text-xs text-maroon">{line.colorLabel}</p>
                    ) : null}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-border text-lg leading-none transition hover:border-maroon/40"
                        onClick={() =>
                          setQuantity(
                            line.productId,
                            line.quantity - 1,
                            line.colorKey,
                          )
                        }
                        aria-label="Menos"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-border text-lg leading-none transition hover:border-maroon/40"
                        onClick={() =>
                          setQuantity(
                            line.productId,
                            line.quantity + 1,
                            line.colorKey,
                          )
                        }
                        aria-label="Más"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs text-maroon hover:underline"
                        onClick={() =>
                          removeItem(line.productId, line.colorKey)
                        }
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-5 py-4">
          <div className="mb-4 flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <Link
            href="/carrito"
            onClick={closeDrawer}
            className="block w-full rounded-full border-2 border-foreground bg-transparent py-3 text-center text-sm font-semibold uppercase tracking-wide text-foreground transition hover:bg-foreground hover:text-background"
          >
            Ir al carrito y pedido
          </Link>
        </div>
      </aside>
    </div>
  );
}
