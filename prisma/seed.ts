import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

const products: Array<{
  slug: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: Category;
  featured: boolean;
}> = [
  {
    slug: "collar-perlas-clasico",
    name: "Collar de perlas clásico",
    description: "Perlas cultivadas con cierre plateado. Ideal para eventos.",
    price: "45.99",
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5fb4fb8?w=800&q=80",
    category: Category.COLLAR,
    featured: true,
  },
  {
    slug: "collar-minimal-oro-rosa",
    name: "Collar minimal oro rosa",
    description: "Cadena fina con barra horizontal. Acabado elegante.",
    price: "32.5",
    imageUrl:
      "https://images.unsplash.com/photo-1617032213171-28fe518b4be6?w=800&q=80",
    category: Category.COLLAR,
    featured: true,
  },
  {
    slug: "gargantilla-velvet",
    name: "Gargantilla terciopelo",
    description: "Choker ajustable con detalle metálico central.",
    price: "24",
    imageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    category: Category.COLLAR,
    featured: false,
  },
  {
    slug: "collar-capas-dorado",
    name: "Collar multicapas dorado",
    description: "Tres hebras delicadas con cierre ajustable.",
    price: "38",
    imageUrl:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    category: Category.COLLAR,
    featured: true,
  },
  {
    slug: "cadena-snake-plateada",
    name: "Cadena snake plateada",
    description: "Eslabón serpiente brillante, largo medio.",
    price: "29.99",
    imageUrl:
      "https://images.unsplash.com/photo-1617032213171-28fe518b4be6?w=800&q=80",
    category: Category.COLLAR,
    featured: false,
  },
  {
    slug: "pulsera-charms-corazon",
    name: "Pulsera charms corazón",
    description: "Dijes móviles en tonos plateados.",
    price: "22.5",
    imageUrl:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
    category: Category.PULSERA,
    featured: true,
  },
  {
    slug: "pulsera-trenzada-boho",
    name: "Pulsera trenzada boho",
    description: "Hilos entrelazados con detalles dorados.",
    price: "18.9",
    imageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    category: Category.PULSERA,
    featured: false,
  },
  {
    slug: "esclava-fina-oro",
    name: "Esclava fina oro",
    description: "Perfil delgado, cierre de seguridad.",
    price: "41",
    imageUrl:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    category: Category.PULSERA,
    featured: true,
  },
  {
    slug: "set-pulseras-mix",
    name: "Set de pulseras mix",
    description: "Pack de 5 piezas combinables en tonos neutros.",
    price: "35",
    imageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    category: Category.PULSERA,
    featured: false,
  },
  {
    slug: "pulsera-cuentas-cristal",
    name: "Pulsera cuentas cristal",
    description: "Reflejos suaves, elástica.",
    price: "19.5",
    imageUrl:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    category: Category.PULSERA,
    featured: false,
  },
  {
    slug: "anillo-solitario-estilo",
    name: "Anillo solitario estilo",
    description: "Circonita central con engaste minimal.",
    price: "27",
    imageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    category: Category.ANILLO,
    featured: true,
  },
  {
    slug: "anillo-set-apilables",
    name: "Set anillos apilables",
    description: "Tres piezas finas para combinar.",
    price: "33",
    imageUrl:
      "https://images.unsplash.com/photo-1603561596112-0a1327573412?w=800&q=80",
    category: Category.ANILLO,
    featured: true,
  },
  {
    slug: "anillo-floral-vintage",
    name: "Anillo floral vintage",
    description: "Diseño inspirado en art déco.",
    price: "25.99",
    imageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    category: Category.ANILLO,
    featured: false,
  },
  {
    slug: "anillo-band-geom",
    name: "Anillo banda geométrica",
    description: "Líneas limpias, baño dorado.",
    price: "21.5",
    imageUrl:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    category: Category.ANILLO,
    featured: false,
  },
  {
    slug: "anillo-perla-mini",
    name: "Anillo perla mini",
    description: "Perla sintética en montura plateada.",
    price: "16.9",
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5fb4fb8?w=800&q=80",
    category: Category.ANILLO,
    featured: false,
  },
  {
    slug: "collar-medallon-inicial",
    name: "Collar medallón",
    description: "Medallón liso para personalizar. Cadena larga.",
    price: "30",
    imageUrl:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    category: Category.COLLAR,
    featured: false,
  },
  {
    slug: "pulsera-cadena-gruesa",
    name: "Pulsera cadena gruesa",
    description: "Eslabón statement con cierre mosquetón.",
    price: "36",
    imageUrl:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
    category: Category.PULSERA,
    featured: true,
  },
  {
    slug: "anillo-cz-halo",
    name: "Anillo halo circonitas",
    description: "Brillo intenso, perfecto para noche.",
    price: "39.99",
    imageUrl:
      "https://images.unsplash.com/photo-1603561596112-0a1327573412?w=800&q=80",
    category: Category.ANILLO,
    featured: false,
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    await prisma.product.create({ data: p });
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
