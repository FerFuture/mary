/**
 * Reemplaza la descripción "inserta descripcion ia" en la base (solo el campo description).
 * Uso: npm run db:patch-descriptions
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateDescriptionFromName(name: string): string {
  const n = name.trim();
  const lower = n.toLowerCase();

  const material = (() => {
    if (lower.includes("acero")) return "acero quirúrgico";
    if (lower.includes("platead") || lower.includes("plata")) return "tono plateado";
    if (lower.includes("dorado")) return "tono dorado";
    return "";
  })();

  const motif = (() => {
    const motifs = [
      "colibrí",
      "tortuga",
      "serpiente",
      "tulipán",
      "nudo de bruja",
      "luna",
      "corazón",
      "diamante",
      "zapatilla",
      "strass",
      "boca",
      "river",
    ];
    for (const m of motifs) {
      if (lower.includes(m)) return m;
    }
    return "";
  })();

  const isDije = lower.includes("dije");
  const unit = lower.includes("por unidad") || isDije ? "Se vende por unidad." : "";

  const sentence1 = isDije
    ? `Dije${motif ? ` de ${motif}` : ""}${material ? ` en ${material}` : ""}.`
    : `Accesorio${material ? ` en ${material}` : ""} para complementar tus looks.`;

  const sentence2 = material
    ? `Acabado ${material === "acero quirúrgico" ? "resistente e hipoalergénico" : "delicado"}; ideal para combinar con otras piezas.`
    : "Detalle delicado, ideal para combinar con otras piezas.";

  return `${n}. ${sentence1} ${sentence2} ${unit}`.replace(/\s+/g, " ").trim();
}

const BY_SLUG: Record<string, string> = {
  "dije-colgante-diamante-color-dorado-por-unidad":
    "Dije colgante en tono dorado con detalle tipo brillante. Se vende por unidad; ideal para collares, pulseras o combinar con otras piezas de bijou.",
  "dije-por-unidad-serpiente-color-dorado":
    "Dije serpiente en acabado dorado, por unidad. Diseño delicado para sumar a tus cadenas, chokers o proyectos de joyería artesanal.",
  "dije-tulipan-dorado-por-unidad-varios-colores":
    "Dije en forma de tulipán con base dorada. Disponible en varias combinaciones de color; elegí la variante que prefieras. Precio por unidad.",
  "dije-zapatilla-de-tutbool-acero-quirurgico":
    "Mini dije de zapatilla en acero quirúrgico, hipoalergénico y duradero. Elegí diseño Boca o River. Se vende por unidad.",
  "dije-por-unidad-luna-corazon":
    "Dije que combina luna y corazón; disponible en plateado o dorado. Por unidad, perfecto para regalo o para armar tu propia joyería.",
};

async function main() {
  for (const [slug, description] of Object.entries(BY_SLUG)) {
    const r = await prisma.product.updateMany({
      where: { slug },
      data: { description },
    });
    if (r.count > 0) console.log("OK:", slug);
  }

  const rest = await prisma.product.findMany({
    where: {
      description: { contains: "inserta descripcion", mode: "insensitive" },
      slug: { notIn: Object.keys(BY_SLUG) },
    },
    select: { id: true, slug: true, name: true },
  });
  for (const p of rest) {
    const description = generateDescriptionFromName(p.name);
    await prisma.product.update({
      where: { id: p.id },
      data: { description },
    });
    console.log("OK (genérico):", p.slug);
  }

  const toRewrite = await prisma.product.findMany({
    where: {
      description: {
        contains: "revisá fotos y variantes en la ficha del producto",
        mode: "insensitive",
      },
    },
    select: { id: true, slug: true, name: true },
  });
  for (const p of toRewrite) {
    const description = generateDescriptionFromName(p.name);
    await prisma.product.update({
      where: { id: p.id },
      data: { description },
    });
    console.log("OK (reemplazo frase):", p.slug);
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
