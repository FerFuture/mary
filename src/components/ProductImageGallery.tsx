"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export function ProductImageGallery({ images, alt }: Props) {
  const urls = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const main = urls[index] ?? urls[0];

  const closeLightbox = useCallback(() => setLightbox(false), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox]);

  if (!main) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-cream-dark text-sm text-muted">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-cream-dark shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-maroon/40"
        onClick={() => setLightbox(true)}
        aria-label={`Ampliar imagen: ${alt}`}
      >
        <Image
          src={main}
          alt={alt}
          fill
          className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out group-hover:scale-[1.18] group-focus-visible:scale-[1.08]"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-foreground/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-background opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:text-xs">
          Clic para ampliar
        </span>
      </button>

      {urls.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {urls.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === index
                  ? "border-maroon ring-2 ring-maroon/20"
                  : "border-border opacity-80 hover:opacity-100"
              }`}
              aria-label={`Ver imagen ${i + 1} de ${urls.length}`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      ) : null}

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            Cerrar
          </button>
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[min(78vh,820px)] w-full overflow-hidden rounded-lg bg-black/30 sm:h-[min(85vh,880px)]">
              <Image
                src={main}
                alt={alt}
                fill
                className="object-contain p-3 sm:p-6"
                sizes="100vw"
                priority
              />
            </div>
            {urls.length > 1 ? (
              <div className="mt-3 flex justify-center gap-2">
                {urls.map((src, i) => (
                  <button
                    key={`lb-${src}-${i}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIndex(i);
                    }}
                    className={`relative h-12 w-12 overflow-hidden rounded-md border-2 ${
                      i === index ? "border-white" : "border-white/30"
                    }`}
                    aria-label={`Imagen ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
