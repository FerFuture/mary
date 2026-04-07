import type { Category, ProductDTO } from "@/types/product";

export const DEMO_DEFAULT_STOCK = 20;

export type DemoProductSeed = {
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  featured: boolean;
  /** Stock inicial en seed / modo demo (por defecto 20). */
  stock?: number;
};

export const DEMO_PRODUCT_SEEDS: DemoProductSeed[] = [
  {
    slug: "collar-perlas-fantasia",
    name: "Collar perlas fantasía",
    description:
      "Strand largo de perlas sintéticas con nudo satinado. Look clásico para el día.",
    price: 18900,
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5fb4fb8?w=900&q=80",
    category: "COLLAR",
    featured: true,
  },
  {
    slug: "gargantilla-cadena-fina",
    name: "Gargantilla cadena fina",
    description: "Choker de eslabones plateados con extensor.",
    price: 12400,
    imageUrl:
      "https://images.unsplash.com/photo-1617032213171-28fe518b4be6?w=900&q=80",
    category: "COLLAR",
    featured: true,
  },
  {
    slug: "collar-capas-dorado",
    name: "Collar multicapas dorado",
    description: "Tres hebras delicadas con cierre carabiner. Baño dorado.",
    price: 21500,
    imageUrl:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=900&q=80",
    category: "COLLAR",
    featured: true,
  },
  {
    slug: "medallon-corazon",
    name: "Collar medallón corazón",
    description: "Dije corazón calado en cadena larga. Ideal para regalo.",
    price: 15900,
    imageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&q=80",
    category: "COLLAR",
    featured: false,
  },
  {
    slug: "collar-minimal-barra",
    name: "Collar minimal barra",
    description: "Barra horizontal y cadena fina. Estilo urbano discreto.",
    price: 13900,
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7e0886c084de?w=900&q=80",
    category: "COLLAR",
    featured: false,
  },
  {
    slug: "pulsera-charms-mix",
    name: "Pulsera charms mix",
    description: "Dijes móviles: estrella, luna y corazón. Cierre ajustable.",
    price: 11200,
    imageUrl:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80",
    category: "PULSERA",
    featured: true,
  },
  {
    slug: "esclava-brillo",
    name: "Esclava brillo",
    description: "Media esclava con fila de strass. Cierre de seguridad.",
    price: 17800,
    imageUrl:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=900&q=80",
    category: "PULSERA",
    featured: true,
  },
  {
    slug: "set-pulseras-boho",
    name: "Set pulseras boho (×5)",
    description: "Pack combinado: cuentas, hilo y dijes dorados.",
    price: 16500,
    imageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=80",
    category: "PULSERA",
    featured: false,
  },
  {
    slug: "pulsera-elastica-cristal",
    name: "Pulsera elástica cristal",
    description: "Cuentas facetadas tonos champagne. Elástica, talle único.",
    price: 8900,
    imageUrl:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80",
    category: "PULSERA",
    featured: false,
  },
  {
    slug: "pulsera-cadena-gruesa",
    name: "Pulsera cadena gruesa",
    description: "Eslabón statement plateado. Mosquetón grande.",
    price: 19900,
    imageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=80",
    category: "PULSERA",
    featured: true,
  },
  {
    slug: "pulsera-trenzada-dorada",
    name: "Pulsera trenzada dorada",
    description: "Trenzado metalizado con broche magnético.",
    price: 9800,
    imageUrl:
      "https://images.unsplash.com/photo-1576059578837-aa5a6c9d62e0?w=900&q=80",
    category: "PULSERA",
    featured: false,
  },
  {
    slug: "anillo-solitario-cz",
    name: "Anillo solitario circonita",
    description: "Montura plateada con piedra central. Brillo tipo diamante.",
    price: 14900,
    imageUrl:
      "https://images.unsplash.com/photo-1603561596112-0a1327573412?w=900&q=80",
    category: "ANILLO",
    featured: true,
  },
  {
    slug: "set-anillos-apilables",
    name: "Set anillos apilables (×3)",
    description: "Tres aros finos: liso, texturado y con mini punto de luz.",
    price: 13200,
    imageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=80",
    category: "ANILLO",
    featured: true,
  },
  {
    slug: "anillo-floral-vintage",
    name: "Anillo floral vintage",
    description: "Diseño calado estilo art déco. Baño oro envejecido.",
    price: 11800,
    imageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&q=80",
    category: "ANILLO",
    featured: false,
  },
  {
    slug: "anillo-banda-geom",
    name: "Anillo banda geométrica",
    description: "Líneas asimétricas. Cómodo para uso diario.",
    price: 9900,
    imageUrl:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=900&q=80",
    category: "ANILLO",
    featured: false,
  },
  {
    slug: "anillo-perla-mini",
    name: "Anillo perla mini",
    description: "Perla sintética en montura baja. Tono marfil.",
    price: 8500,
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5fb4fb8?w=900&q=80",
    category: "ANILLO",
    featured: false,
  },
  {
    slug: "anillo-halo-noche",
    name: "Anillo halo fiesta",
    description: "Circonitas en corona. Ideal para salidas y eventos.",
    price: 16900,
    imageUrl:
      "https://images.unsplash.com/photo-1603561596112-0a1327573412?w=900&q=80",
    category: "ANILLO",
    featured: true,
  },
  {
    slug: "collar-cuentas-color",
    name: "Collar cuentas de color",
    description: "Cuentas esmaltadas en tonos pasteles. Cordón ajustable.",
    price: 10500,
    imageUrl:
      "https://images.unsplash.com/photo-1610375462340-0b7d65a8cb21?w=900&q=80",
    category: "COLLAR",
    featured: false,
  },
];

const demoId = (slug: string) => `demo-${slug}`;

export const DEMO_PRODUCT_DTOS: ProductDTO[] = DEMO_PRODUCT_SEEDS.map((p) => ({
  id: demoId(p.slug),
  slug: p.slug,
  name: p.name,
  description: p.description,
  price: p.price,
  imageUrl: p.imageUrl,
  imageUrls: [p.imageUrl],
  category: p.category,
  featured: p.featured,
  maxOrderQuantity: p.stock ?? DEMO_DEFAULT_STOCK,
  colors: [],
  colorLabels: {},
}));

const demoById = new Map(DEMO_PRODUCT_DTOS.map((p) => [p.id, p] as const));

export function getDemoProductById(id: string): ProductDTO | undefined {
  return demoById.get(id);
}

export function filterDemoProducts(filters: {
  category?: Category | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  q?: string | null;
  featured?: boolean | null;
}): ProductDTO[] {
  let list = [...DEMO_PRODUCT_DTOS];

  if (filters.category) {
    list = list.filter((p) => p.category === filters.category);
  }
  if (filters.featured === true) {
    list = list.filter((p) => p.featured);
  }
  if (filters.minPrice != null && !Number.isNaN(filters.minPrice)) {
    list = list.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null && !Number.isNaN(filters.maxPrice)) {
    list = list.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.q && filters.q.trim()) {
    const term = filters.q.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term),
    );
  }

  list = list.filter((p) => p.maxOrderQuantity > 0);

  list.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name, "es");
  });
  return list;
}
