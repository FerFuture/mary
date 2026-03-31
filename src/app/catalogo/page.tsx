import { Suspense } from "react";
import { Category } from "@prisma/client";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getProducts } from "@/lib/products";

type SearchParams = Record<string, string | string[] | undefined>;

function parseCategory(v: string | undefined): Category | null {
  if (!v) return null;
  return Object.values(Category).includes(v as Category) ? (v as Category) : null;
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const category = parseCategory(typeof sp.category === "string" ? sp.category : undefined);
  const minPrice =
    typeof sp.minPrice === "string" ? Number(sp.minPrice) : undefined;
  const maxPrice =
    typeof sp.maxPrice === "string" ? Number(sp.maxPrice) : undefined;

  const products = await getProducts({
    category,
    minPrice: minPrice != null && !Number.isNaN(minPrice) ? minPrice : null,
    maxPrice: maxPrice != null && !Number.isNaN(maxPrice) ? maxPrice : null,
    q: q ?? null,
    featured: null,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 text-center">
        <p className="font-serif text-lg text-maroon">Nuestra selección</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Catálogo
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          Filtrá por categoría, precio o palabra clave. Los precios se confirman
          al armar tu pedido.
        </p>
      </header>

      <Suspense
        fallback={
          <div
            className="mb-8 h-40 animate-pulse rounded-2xl bg-cream-dark/80"
            aria-hidden
          />
        }
      >
        <div className="mb-8">
          <CatalogFilters />
        </div>
      </Suspense>

      {category && (
        <p className="mb-4 text-sm text-muted">
          Categoría:{" "}
          <span className="font-medium text-foreground">
            {CATEGORY_LABELS[category]}
          </span>
        </p>
      )}

      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center text-muted">
          No hay productos con esos filtros. Probá ampliar el rango de precio o
          otra búsqueda.
        </p>
      ) : (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
