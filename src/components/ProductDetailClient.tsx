"use client";

import { useMemo, useState } from "react";
import { ProductColorSelector } from "@/components/ProductColorSelector";
import { ProductDetailActions } from "@/components/ProductDetailActions";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { CATEGORY_LABELS } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import { colorDisplayLabel } from "@/lib/product-variants";
import type { ProductDTO } from "@/types/product";

export function ProductDetailClient({ product }: { product: ProductDTO }) {
  const [colorKey, setColorKey] = useState(
    product.colors[0] ?? "",
  );

  const galleryUrls = useMemo(
    () =>
      product.imageUrls.length > 0 ? [...product.imageUrls] : [product.imageUrl],
    [product],
  );

  const colorLabel = colorDisplayLabel(colorKey, product.colorLabels);
  const displayImageUrl = product.imageUrl;

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductImageGallery images={galleryUrls} alt={product.name} />
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-maroon">
          {CATEGORY_LABELS[product.category]}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          {product.description}
        </p>
        <p className="mt-6 font-serif text-2xl font-semibold">
          {formatCurrency(product.price)}
        </p>

        <ProductColorSelector
          colors={product.colors}
          labels={product.colorLabels}
          value={colorKey}
          onChange={setColorKey}
        />

        <ProductDetailActions
          product={product}
          selectedColorKey={colorKey}
          selectedColorLabel={colorLabel}
          displayImageUrl={displayImageUrl}
        />
      </div>
    </div>
  );
}
