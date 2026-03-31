import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailActions } from "@/components/ProductDetailActions";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getProductBySlug } from "@/lib/products";
import { formatCurrency } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/catalogo"
        className="text-sm text-muted transition hover:text-maroon"
      >
        ← Volver al catálogo
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-cream-dark shadow-sm">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
            priority
          />
        </div>
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
          <ProductDetailActions product={product} />
        </div>
      </div>
    </div>
  );
}
