/**
 * Carga o actualiza productos en Postgres (p. ej. Supabase).
 * Soporta varias imágenes por producto (`ProductImage`); la primera es la principal.
 *
 * Uso: npm run db:upsert-products
 */
import { Prisma, PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS: Array<{
  slug: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  featured: boolean;
  stock: number;
  active?: boolean;
  /** URLs en orden de galería; la primera se guarda también en `imageUrl`. */
  images: string[];
  colors?: string[];
  colorLabels?: Record<string, string>;
}> = [
  {
    slug: "dije-nudo-bruja-plateado-brillo",
    name: "Dije por unidad nudo de bruja plateado con brillo",
    description:
      "Dije por unidad, diseño nudo de bruja en tono plateado con brillo. Ideal para armar tus propias piezas o reemplazar dijes en collares y pulseras.",
    price: 1200,
    category: Category.DIJE,
    featured: false,
    stock: 100,
    active: true,
    images: [
      "https://res.cloudinary.com/dsezvvmmt/image/upload/v1775520498/img_7816-42c3047d7770b1527017694384619548-640-0_jalaaz.webp",
      "https://res.cloudinary.com/dsezvvmmt/image/upload/v1775520498/img_7818-f62f0dd2410327d1d717694384616526-640-0_merirh.webp",
      "https://res.cloudinary.com/dsezvvmmt/image/upload/v1775520498/img_7817-2951a11ddb51dca7b417694384617174-640-0_kq1en1.webp",
    ],
    colors: ["dorado", "plateado"],
    colorLabels: { dorado: "Dorado", plateado: "Plateado" },
  },
];

async function main() {
  for (const p of PRODUCTS) {
    if (p.images.length === 0) {
      console.warn("Saltando (sin imágenes):", p.slug);
      continue;
    }
    const primary = p.images[0];
    const active = p.active ?? true;
    const colors = p.colors ?? [];
    const colorLabels =
      p.colorLabels && Object.keys(p.colorLabels).length > 0
        ? p.colorLabels
        : Prisma.DbNull;

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.upsert({
        where: { slug: p.slug },
        create: {
          slug: p.slug,
          name: p.name,
          description: p.description,
          price: p.price,
          imageUrl: primary,
          category: p.category,
          featured: p.featured,
          stock: p.stock,
          active,
          colors,
          colorLabels,
        },
        update: {
          name: p.name,
          description: p.description,
          price: p.price,
          imageUrl: primary,
          category: p.category,
          featured: p.featured,
          stock: p.stock,
          active,
          colors,
          colorLabels,
        },
      });

      await tx.productImage.deleteMany({ where: { productId: product.id } });
      await tx.productImage.createMany({
        data: p.images.map((url, sortOrder) => ({
          productId: product.id,
          url,
          sortOrder,
        })),
      });
    });

    console.log("OK:", p.slug, `(${p.images.length} imgs)`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
