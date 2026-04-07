"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductDTO } from "@/types/product";
import { formatCurrency } from "@/lib/format";

type Props = { products: ProductDTO[] };

export function HeroProductShowcase({ products }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollNext = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || products.length <= 1) return;
    const step = el.clientWidth;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const next =
      el.scrollLeft + step >= maxScroll - 2 ? 0 : el.scrollLeft + step;
    el.scrollTo({ left: next, behavior: "smooth" });
  }, [products.length]);

  useEffect(() => {
    if (products.length <= 1) return;
    const id = window.setInterval(scrollNext, 5000);
    return () => window.clearInterval(id);
  }, [products.length, scrollNext]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || products.length <= 1) return;
    const onScroll = () => {
      const w = el.clientWidth || 1;
      const i = Math.min(
        products.length - 1,
        Math.max(0, Math.round(el.scrollLeft / w)),
      );
      setActive(i);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [products.length]);

  if (products.length === 0) {
    return (
      <div className="relative flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-cream-dark/80 p-8 text-center shadow-inner">
        <p className="font-serif text-lg text-maroon">Catálogo</p>
        <p className="max-w-xs text-sm text-muted">
          Pronto vas a ver aquí una muestra de productos. Entrá al catálogo para
          explorar.
        </p>
        <Link
          href="/catalogo"
          className="rounded-full border-2 border-maroon bg-transparent px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-maroon transition hover:bg-maroon/10"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="group/showcase relative h-full min-h-[320px]">
      <div
        ref={scrollerRef}
        className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Muestra de productos del catálogo"
      >
        {products.map((p, i) => (
          <Link
            key={p.id}
            href={`/catalogo/${p.slug}`}
            className="relative h-[min(100%,520px)] min-h-[320px] w-full min-w-full shrink-0 snap-center overflow-hidden rounded-2xl bg-cream-dark shadow-inner ring-1 ring-border/40 transition hover:ring-maroon/30"
          >
            <Image
              src={p.imageUrl}
              alt={p.name}
              fill
              className="object-cover opacity-95 transition duration-700 group-hover/showcase:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority={i === 0}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="line-clamp-2 font-serif text-lg font-semibold leading-snug drop-shadow sm:text-xl">
                {p.name}
              </p>
              <p className="mt-1 text-sm font-medium tabular-nums opacity-95">
                {formatCurrency(p.price)}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-white/85">
                Ver detalle →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {products.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Producto anterior"
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/40 bg-black/35 px-2.5 py-2 text-white backdrop-blur-sm transition hover:bg-black/50 sm:block"
            onClick={() => {
              const el = scrollerRef.current;
              if (!el) return;
              const step = el.clientWidth;
              const prev =
                el.scrollLeft <= 2
                  ? el.scrollWidth - el.clientWidth
                  : el.scrollLeft - step;
              el.scrollTo({ left: prev, behavior: "smooth" });
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Siguiente producto"
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/40 bg-black/35 px-2.5 py-2 text-white backdrop-blur-sm transition hover:bg-black/50 sm:block"
            onClick={scrollNext}
          >
            ›
          </button>
          <div
            className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5"
            aria-hidden
          >
            {products.map((p, i) => (
              <span
                key={p.id}
                className={`h-1.5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                  i === active ? "w-5 opacity-100" : "w-1.5 opacity-50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
