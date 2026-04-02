/**
 * Carga o actualiza productos en Postgres (p. ej. Supabase).
 * No usa el catálogo demo de `src/lib/demo-products.ts`.
 *
 * Uso: npm run db:upsert-products
 */
import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS: Array<{
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  featured: boolean;
  stock: number;
  active?: boolean;
}> = [
  {
    slug: "collar-terra-piedra",
    name: "Collar terra piedra",
    description:
      "Piezas en tonos tierra con piedras naturales en distintos tamaños y textura orgánica. Cadena regulable; look bohemio para el día o una salida informal.",
    price: 19000,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTNPJ6O_Y0N-2gDz-Im2Igfo_nJj8js7JPqkxTvCWbyyizcgu5koAmcpBjt0VUwUD7UjOeqXzWMMmBkhldfMKnZPVwX1zt9OTHhUSNJzZY",
    category: Category.COLLAR,
    featured: true,
    stock: 13,
    active: true,
  },
];

async function main() {
  for (const p of PRODUCTS) {
    const active = p.active ?? true;
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
        featured: p.featured,
        stock: p.stock,
        active,
      },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
        featured: p.featured,
        stock: p.stock,
      },
    });
    console.log("OK:", p.slug);
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
