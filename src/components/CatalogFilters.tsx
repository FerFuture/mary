"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { CATEGORY_LABELS } from "@/lib/categories";
import type { Category } from "@/types/product";

const categories: Category[] = ["COLLAR", "PULSERA", "ANILLO", "DIJE"];

export function CatalogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const apply = useCallback(
    (formData: FormData) => {
      const params = new URLSearchParams();
      const q = String(formData.get("q") ?? "").trim();
      const category = String(formData.get("category") ?? "").trim();
      const minPrice = String(formData.get("minPrice") ?? "").trim();
      const maxPrice = String(formData.get("maxPrice") ?? "").trim();

      if (q) params.set("q", q);
      if (category && categories.includes(category as Category))
        params.set("category", category);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      startTransition(() => {
        router.push(`/catalogo?${params.toString()}`);
      });
    },
    [router],
  );

  return (
    <form
      className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:p-5"
      onSubmit={(e) => {
        e.preventDefault();
        apply(new FormData(e.currentTarget));
      }}
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[160px] flex-1">
          <label
            htmlFor="filter-q"
            className="text-xs font-semibold uppercase tracking-wider text-muted"
          >
            Búsqueda
          </label>
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={searchParams.get("q") ?? ""}
            placeholder="Nombre o descripción"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-maroon/30"
          />
        </div>
        <div className="min-w-[140px]">
          <label
            htmlFor="filter-cat"
            className="text-xs font-semibold uppercase tracking-wider text-muted"
          >
            Categoría
          </label>
          <select
            id="filter-cat"
            name="category"
            defaultValue={searchParams.get("category") ?? ""}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-maroon/30"
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div>
            <label
              htmlFor="filter-min"
              className="text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Precio min
            </label>
            <input
              id="filter-min"
              name="minPrice"
              type="number"
              min={0}
              step={1}
              defaultValue={searchParams.get("minPrice") ?? ""}
              placeholder="0"
              className="mt-1 w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-maroon/30"
            />
          </div>
          <div>
            <label
              htmlFor="filter-max"
              className="text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Precio max
            </label>
            <input
              id="filter-max"
              name="maxPrice"
              type="number"
              min={0}
              step={1}
              defaultValue={searchParams.get("maxPrice") ?? ""}
              placeholder="999"
              className="mt-1 w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-maroon/30"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-hover disabled:opacity-60"
        >
          {pending ? "…" : "Aplicar filtros"}
        </button>
      </div>
    </form>
  );
}
