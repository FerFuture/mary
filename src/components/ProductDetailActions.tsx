"use client";

import { useCartStore } from "@/store/cart";
import type { ProductDTO } from "@/types/product";

export function ProductDetailActions({ product }: { product: ProductDTO }) {
  const addItem = useCartStore((s) => s.addItem);
  const out = product.maxOrderQuantity < 1;

  return (
    <div className="mt-8 flex flex-col gap-3">
      {out ? (
        <p className="text-sm text-muted">No disponible por ahora.</p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={out}
          onClick={() =>
            addItem({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              imageUrl: product.imageUrl,
              unitPrice: product.price,
              quantity: 1,
              maxQuantity: product.maxOrderQuantity,
            })
          }
          className="rounded-full bg-maroon px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-maroon-hover focus-visible:outline focus-visible:ring-2 focus-visible:ring-maroon/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {out ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
