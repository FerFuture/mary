"use client";

import { useCartStore } from "@/store/cart";
import type { ProductDTO } from "@/types/product";

export function ProductDetailActions({ product }: { product: ProductDTO }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() =>
          addItem({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            imageUrl: product.imageUrl,
            unitPrice: product.price,
            quantity: 1,
          })
        }
        className="rounded-full bg-maroon px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-maroon-hover focus-visible:outline focus-visible:ring-2 focus-visible:ring-maroon/50"
      >
        Agregar al carrito
      </button>
    </div>
  );
}
