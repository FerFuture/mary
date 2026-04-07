"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import type { ProductDTO } from "@/types/product";

type Props = {
  product: ProductDTO;
  /** Variante elegida (vacío si el producto no tiene colores). */
  selectedColorKey: string;
  selectedColorLabel: string;
  /** Miniatura / imagen según el color. */
  displayImageUrl: string;
};

export function ProductDetailActions({
  product,
  selectedColorKey,
  selectedColorLabel,
  displayImageUrl,
}: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const out = product.maxOrderQuantity < 1;
  const max = product.maxOrderQuantity;
  const needsColor = product.colors.length > 0;
  const colorOk = !needsColor || Boolean(selectedColorKey);

  const [quantityInput, setQuantityInput] = useState("1");
  const [quantityError, setQuantityError] = useState<string | null>(null);

  function parseQty(): number {
    const n = Number.parseInt(quantityInput.trim(), 10);
    return Number.isFinite(n) ? n : Number.NaN;
  }

  function clampForStep(next: number) {
    if (!Number.isFinite(next)) return 1;
    return Math.min(Math.max(1, Math.floor(next)), max);
  }

  function handleAdd() {
    setQuantityError(null);
    if (needsColor && !selectedColorKey) {
      setQuantityError("Elegí un color antes de agregar al carrito.");
      return;
    }
    const n = parseQty();
    if (!Number.isFinite(n) || n < 1) {
      setQuantityError("Ingresá una cantidad válida (mínimo 1).");
      return;
    }
    if (n > max) {
      setQuantityError(
        `La cantidad no puede superar el máximo disponible (${max} unidades).`,
      );
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: displayImageUrl,
      unitPrice: product.price,
      quantity: n,
      maxQuantity: max,
      colorKey: selectedColorKey,
      colorLabel: selectedColorLabel,
    });
  }

  return (
    <div className="mt-8 flex flex-col gap-3">
      {out ? (
        <p className="text-sm text-muted">No disponible por ahora.</p>
      ) : null}
      {!out ? (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="product-detail-quantity"
            className="text-xs font-semibold uppercase tracking-wider text-muted"
          >
            Cantidad
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background">
              <button
                type="button"
                className="h-10 w-10 text-lg leading-none transition hover:bg-cream-dark/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-maroon/30"
                aria-label="Menos una unidad"
                onClick={() => {
                  setQuantityError(null);
                  setQuantityInput(String(clampForStep(parseQty() - 1)));
                }}
              >
                −
              </button>
              <input
                id="product-detail-quantity"
                name="quantity"
                type="number"
                inputMode="numeric"
                min={1}
                value={quantityInput}
                onChange={(e) => {
                  setQuantityError(null);
                  setQuantityInput(e.target.value);
                }}
                onBlur={() => {
                  const n = parseQty();
                  if (!Number.isFinite(n) || n < 1) {
                    setQuantityInput("1");
                  }
                }}
                className="h-10 w-16 border-x border-border bg-transparent text-center text-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-maroon/30"
              />
              <button
                type="button"
                className="h-10 w-10 text-lg leading-none transition hover:bg-cream-dark/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-maroon/30"
                aria-label="Más una unidad"
                onClick={() => {
                  setQuantityError(null);
                  setQuantityInput(String(clampForStep(parseQty() + 1)));
                }}
              >
                +
              </button>
            </div>
            <p className="text-sm text-muted">
              Máximo {max} {max === 1 ? "unidad" : "unidades"} por pedido.
            </p>
          </div>
          {quantityError ? (
            <p
              id="product-quantity-validation"
              role="alert"
              className="text-sm text-maroon"
            >
              {quantityError}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={out || !colorOk}
          onClick={handleAdd}
          className="rounded-full bg-maroon px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-maroon-hover focus-visible:outline focus-visible:ring-2 focus-visible:ring-maroon/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {out ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
