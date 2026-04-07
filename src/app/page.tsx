import Image from "next/image";
import Link from "next/link";
import { HeroProductShowcase } from "@/components/HeroProductShowcase";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts, getHeroShowcaseProducts } from "@/lib/products";

const site = process.env.NEXT_PUBLIC_SITE_NAME ?? "Mary Mirari";

export default async function Home() {
  const [featured, heroShowcase] = await Promise.all([
    getFeaturedProducts(8),
    getHeroShowcaseProducts(8),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-cream-dark/40 via-background to-background">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6 sm:py-24 lg:items-center">
          <div className="animate-fade-up order-2 sm:order-1">
            <p className="font-serif text-lg text-maroon">Bijouterie & accesorios</p>
            <h1 className="mt-2 font-script text-5xl font-normal leading-tight text-maroon sm:text-6xl lg:text-7xl">
              Elegancia cotidiana
            </h1>
            <p className="mt-4 max-w-md text-muted leading-relaxed">
              Descubrí piezas delicadas para realzar tu estilo: collares,
              pulseras y anillos seleccionados con cuidado.
            </p>
            <Link
              href="/catalogo"
              className="mt-8 inline-flex items-center justify-center rounded-full border-2 border-foreground bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-widest text-foreground transition hover:bg-foreground hover:text-background"
            >
              Ver catálogo
            </Link>
          </div>
          <div className="relative order-1 aspect-[4/5] max-h-[420px] animate-fade-up animate-delay-1 sm:order-2 sm:max-h-none sm:min-h-[360px]">
            <HeroProductShowcase products={heroShowcase} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-center font-serif text-2xl font-semibold sm:text-3xl">
          Promociones y colecciones
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            href="/catalogo?category=COLLAR"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative z-10 max-w-[55%]">
              <p className="text-sm font-medium text-maroon">Novedad</p>
              <p className="mt-1 font-serif text-2xl font-semibold">
                Collares delicados
              </p>
              <p className="mt-2 text-sm text-muted">
                Desde $16.900 · Ver selección
              </p>
              <span className="mt-4 inline-block text-sm font-semibold underline-offset-4 group-hover:underline">
                Ver catálogo
              </span>
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1599643478518-a784e5fb4fb8?w=400&q=80"
                alt=""
                fill
                className="object-cover object-center opacity-90 transition duration-500 group-hover:scale-105"
                sizes="200px"
              />
            </div>
          </Link>
          <Link
            href="/catalogo?category=ANILLO"
            className="group relative overflow-hidden rounded-2xl border border-border bg-cream-dark/50 p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative z-10 max-w-[55%]">
              <p className="text-sm font-medium text-maroon">Destacados</p>
              <p className="mt-1 font-serif text-2xl font-semibold">
                Anillos y sets
              </p>
              <p className="mt-2 text-sm text-muted">
                Brillo y diseño · Ver todo
              </p>
              <span className="mt-4 inline-block text-sm font-semibold underline-offset-4 group-hover:underline">
                Ver catálogo
              </span>
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80"
                alt=""
                fill
                className="object-cover object-center opacity-90 transition duration-500 group-hover:scale-105"
                sizes="200px"
              />
            </div>
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-cream-dark/30 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="font-serif text-lg text-maroon">Novedades</p>
            <h2 className="mt-1 font-serif text-3xl font-semibold">
              Favoritos de {site}
            </h2>
          </div>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
