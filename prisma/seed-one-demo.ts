/**
 * Inserta un solo producto de ejemplo (joya) para probar el catálogo.
 * Uso: npm run db:seed-one-demo
 */
import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

const SLUG = "demo-aros-cristal-plateado";
const IMG =
  "https://res.cloudinary.com/dsezvvmmt/image/upload/v1775526029/whatsapp-image-2026-03-18-at-1-44-34-pm-1-c1b05c3dfb7592041c17738607062757-1024-1024_czzyaz.webp";

async function main() {
  const product = await prisma.product.upsert({
    where: { slug: SLUG },
    create: {
      slug: SLUG,
      name: "Aros con cristales — demo",
      description:
        "Par de aros tipo argolla con detalle en cristal. Producto de demostración para el catálogo Mary Mirari.",
      price: 4500,
      imageUrl: IMG,
      category: Category.COLLAR,
      featured: true,
      active: true,
      stock: 15,
      colors: [],
    },
    update: {
      name: "Aros con cristales — demo",
      description:
        "Par de aros tipo argolla con detalle en cristal. Producto de demostración para el catálogo Mary Mirari.",
      price: 4500,
      imageUrl: IMG,
      category: Category.COLLAR,
      featured: true,
      active: true,
      stock: 15,
    },
  });

  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.create({
    data: { productId: product.id, url: IMG, sortOrder: 0 },
  });

  console.log("Listo:", product.slug, product.id);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
