/**
 * Corrige variantes de color en productos de acero (claves con | y etiquetas legibles).
 * Uso: npm run db:fix-acero-colors
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PATCHES: Array<{
  slug: string;
  nameHint: string;
  colors: string[];
  colorLabels: Record<string, string>;
}> = [
  {
    slug: "dije-boca-acero-quirurgico",
    nameHint: "boca acero",
    colors: ["acero-quirurgico", "acero-dorado", "acero-blanco"],
    colorLabels: {
      "acero-quirurgico": "Acero quirúrgico",
      "acero-dorado": "Acero dorado",
      "acero-blanco": "Acero blanco",
    },
  },
  {
    slug: "dije-nudo-de-bruja-acero-quirurgico-elegir-color-y-medida",
    nameHint: "nudo de bruja",
    colors: [
      "acero-quirurgico-chico",
      "acero-quirurgico-mediano",
      "acero-quirurgico-grande",
      "acero-dorado-chico",
      "acero-dorado-mediano",
      "acero-dorado-grande",
      "acero-blanco-chico",
      "acero-blanco-mediano",
      "acero-blanco-grande",
    ],
    colorLabels: {
      "acero-quirurgico-chico": "Acero quirúrgico chico",
      "acero-quirurgico-mediano": "Acero quirúrgico mediano",
      "acero-quirurgico-grande": "Acero quirúrgico grande",
      "acero-dorado-chico": "Acero dorado chico",
      "acero-dorado-mediano": "Acero dorado mediano",
      "acero-dorado-grande": "Acero dorado grande",
      "acero-blanco-chico": "Acero blanco chico",
      "acero-blanco-mediano": "Acero blanco mediano",
      "acero-blanco-grande": "Acero blanco grande",
    },
  },
];

async function main() {
  for (const p of PATCHES) {
    const bySlug = await prisma.product.updateMany({
      where: { slug: p.slug },
      data: { colors: p.colors, colorLabels: p.colorLabels },
    });
    if (bySlug.count > 0) {
      console.log("OK slug:", p.slug);
      continue;
    }
    const found = await prisma.product.findFirst({
      where: { name: { contains: p.nameHint, mode: "insensitive" } },
      select: { id: true, slug: true },
    });
    if (found) {
      await prisma.product.update({
        where: { id: found.id },
        data: { colors: p.colors, colorLabels: p.colorLabels },
      });
      console.log("OK por nombre →", found.slug);
    } else {
      console.warn("No encontrado:", p.slug);
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
