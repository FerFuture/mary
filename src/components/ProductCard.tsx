"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductDTO } from "@/types/product";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart";

type Props = { product: ProductDTO };

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-maroon/25 hover:shadow-lg">
      <Link
        href={`/catalogo/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-cream-dark"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/catalogo/${product.slug}`}>
          <h3 className="font-serif text-lg font-semibold leading-snug text-foreground transition group-hover:text-maroon">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {product.description}
        </p>
        <p className="mt-3 font-semibold text-foreground">
          {formatCurrency(product.price)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
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
            className="flex-1 min-w-[120px] rounded-full bg-maroon px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-maroon-hover focus-visible:outline focus-visible:ring-2 focus-visible:ring-maroon/50"
          >
            Agregar al carrito
          </button>
          <Link
            href={`/catalogo/${product.slug}`}
            className="rounded-full border border-border px-4 py-2.5 text-center text-sm font-medium transition hover:border-maroon/40 hover:text-maroon"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
