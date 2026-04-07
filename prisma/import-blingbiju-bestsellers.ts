import { PrismaClient, Category } from "@prisma/client";

/**
 * Importa productos desde BlingBijú (más vendidos / destacados en su catálogo).
 * Nota: en este entorno el scraping no devuelve las imágenes con URL directa,
 * así que usamos un placeholder local para `imageUrl`.
 *
 * Para modificar stock/featured o reemplazar imágenes, ajustá el script.
 */
const prisma = new PrismaClient();

type SourceProduct = {
  originalName: string;
  productUrl: string;
  priceArs: number;
  // Mapeo heurístico: los modelos de Bling incluyen AROS/ANILLOS/PULSERAS/etc.
  // Tu schema solo tiene COLLAR, PULSERA, ANILLO.
  categoryHint: "ANILLO" | "PULSERA" | "AROS";
};

function categoryFromHint(hint: SourceProduct["categoryHint"]): Category {
  if (hint === "PULSERA") return Category.PULSERA;
  // Para AROS y ANILLOS usamos ANILLO (no existe categoría AROS en tu DB).
  return Category.ANILLO;
}

function slugFromProductUrl(productUrl: string): string {
  const last = productUrl
    .split("/")
    .filter(Boolean)
    .slice(-1)[0];
  return `blingbiju-${last}`.toLowerCase();
}

function modernizeName(p: SourceProduct): string {
  const n = p.originalName.trim();
  // Reescrituras simples (sin IA) para que suenen más actuales.
  if (n.startsWith("Anillo ")) {
    return `Anillo Acero — ${n.replace(/^Anillo\s+/i, "").replace(/\s+$/g, "")}`;
  }
  if (n.startsWith("Aro ")) {
    return `Aros Brillantes — ${n.replace(/^Aro\s+/i, "")}`;
  }
  if (n.startsWith("Arito ")) {
    return `Aros Modernos — ${n.replace(/^Arito\s+/i, "")}`;
  }
  if (n.startsWith("Abridor ")) {
    return `Aros Abridor Corazón — ${n.replace(/^Abridor\s+/i, "")}`;
  }
  if (n.startsWith("Pulsera ")) {
    return `Pulsera Cuerina — ${n.replace(/^Pulsera\s+/i, "")}`;
  }
  return `Bling Bijú — ${n}`;
}

function descriptionFromSource(p: SourceProduct): string {
  if (p.categoryHint === "PULSERA") {
    return `Pulsera de cuerina con estilo moderno y cierre magnético. Ideal para combinar con tu look diario.`;
  }
  if (p.originalName.startsWith("Anillo ")) {
    return `Anillo con terminación en acero, diseño versátil para sumar un toque moderno.`;
  }
  return `Set de accesorios con detalles llamativos y acabado resistente. Perfecto para regalar o sumar variedad.`;
}

// 20 productos detectados en el listado (orden de “Más vendidos/ Destacado” en la página de productos).
// Fuente: https://blingbiju.mitiendanube.com/productos/page/33/
const PRODUCTS: SourceProduct[] = [
  {
    originalName: "Anillo acero quirúrgico caja x36 XLA1071-A",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-quirurgico-caja-x36-xla1071-a-828sv/",
    priceArs: 27000,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Anillo acero quirúrgico caja x36 XL-78-A",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-quirurgico-caja-x36-xl-78-a-fmkac/",
    priceArs: 27000,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Anillo acero blanco caja x36 XL-A1076-C",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-blanco-caja-x36-xl-a1076-c-voyue/",
    priceArs: 38700,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Anillo acero quirúrgico caja x36 XL-A1049-A",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-quirurgico-caja-x36-xl-a1049-a-0x9ov/",
    priceArs: 27700,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Anillo acero dorado caja x36 XL-2055-B",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-dorado-caja-x36-xl-2055-b-cgo6e/",
    priceArs: 32300,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Aro strass pack x12 elegir color XL-2123",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/aro-strass-pack-x12-elegir-color-xl-2123-fzpt1/",
    priceArs: 18400,
    categoryHint: "AROS",
  },
  {
    originalName: "Arito colores pack x12 XL-2663",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/arito-colores-pack-x12-xl-2663-83ac0/",
    priceArs: 4700,
    categoryHint: "AROS",
  },
  {
    originalName: "Arito moño pack x12 elegir color XL-2130",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/arito-mono-pack-x12-elegir-color-xl-2130-m0839/",
    priceArs: 5900,
    categoryHint: "AROS",
  },
  {
    originalName: "Aro Colgate mariposa pack x12 elegir color XL-2159",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/aro-colgate-mariposa-pack-x12-elegir-color-xl-2159-2p7tk/",
    priceArs: 20700,
    categoryHint: "AROS",
  },
  {
    originalName: "Abridor corazón pack x12 acero quirúrgico elegir color XL-2673",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/abridor-corazon-pack-x12-acero-quirurgico-elegir-color-xl-2673-82jd7/",
    priceArs: 10800,
    categoryHint: "AROS",
  },
  {
    originalName: "Anillo acero dorado caja x36 XL-A1052-B",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-dorado-caja-x36-xl-a1052-b-rmqxe/",
    priceArs: 36300,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Anillo acero dorado caja x36 XL-A1023-B",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-dorado-caja-x36-xl-a1023-b-1rq92/",
    priceArs: 34000,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Anillo acero dorado caja x36 XL-A1007-B",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-dorado-caja-x36-xl-a1007-b-5mner/",
    priceArs: 34700,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Anillo acero quirúrgico caja x36 XL-A1053-A",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-quirurgico-caja-x36-xl-a1053-a-t2wwo/",
    priceArs: 25300,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Anillo acero dorado caja x36 XL-A152-B",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-dorado-caja-x36-xl-a152-b-7r0fs/",
    priceArs: 36300,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Anillo acero quirúrgico caja x36 XL-2055-A",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/anillo-acero-quirurgico-caja-x36-xl-2055-a-rlrj8/",
    priceArs: 25300,
    categoryHint: "ANILLO",
  },
  {
    originalName: "Pulsera cuerina moto magnetica",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/pulsera-cuerina-moto-magnetica-lnorx/",
    priceArs: 4200,
    categoryHint: "PULSERA",
  },
  {
    originalName: "Pulsera cuerina cruz magnetica",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/pulsera-cuerina-cruz-magnetica-0c405/",
    priceArs: 4200,
    categoryHint: "PULSERA",
  },
  {
    originalName: "Pulsera cuerina 2 calaveras magnetica",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/pulsera-cuerina-2-calaveras-magnetica-45pk0/",
    priceArs: 4200,
    categoryHint: "PULSERA",
  },
  {
    originalName: "Pulsera cuerina elegir color",
    productUrl:
      "https://blingbiju.mitiendanube.com/productos/pulsera-cuerina-elegir-color-mwha3/",
    priceArs: 4200,
    categoryHint: "PULSERA",
  },
];

async function main() {
  const placeholderImageUrl = "/next.svg";
  const stock = 20;

  for (const p of PRODUCTS) {
    const modernName = modernizeName(p);
    const slug = slugFromProductUrl(p.productUrl);

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: modernName,
        description: descriptionFromSource(p),
        price: p.priceArs,
        imageUrl: placeholderImageUrl,
        category: categoryFromHint(p.categoryHint),
        featured: true,
        active: true,
        stock,
      },
      create: {
        slug,
        name: modernName,
        description: descriptionFromSource(p),
        price: p.priceArs,
        imageUrl: placeholderImageUrl,
        category: categoryFromHint(p.categoryHint),
        featured: true,
        active: true,
        stock,
      },
    });

    console.log("OK:", slug);
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

