import type { Category as DbCategory, Prisma, Product } from "@prisma/client";
import {
  DEMO_PRODUCT_DTOS,
  filterDemoProducts,
} from "@/lib/demo-products";
import { getPrisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/format";
import type { Category, ProductDTO } from "@/types/product";

export type { ProductDTO, Category };

function parseStringMap(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  return out;
}

type ProductWithImages = Product & {
  images?: { url: string; sortOrder: number }[];
};

function toDTO(p: ProductWithImages): ProductDTO {
  const ordered = [...(p.images ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const imageUrls =
    ordered.length > 0
      ? ordered.map((i) => i.url)
      : p.imageUrl
        ? [p.imageUrl]
        : [];
  const imageUrl = imageUrls[0] ?? p.imageUrl;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: decimalToNumber(p.price),
    imageUrl,
    imageUrls,
    category: p.category as Category,
    featured: p.featured,
    maxOrderQuantity: p.stock,
    colors: [...(p.colors ?? [])],
    colorLabels: parseStringMap(p.colorLabels),
  };
}

const productImageInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
} as const;

export type ProductFilters = {
  category?: DbCategory | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  q?: string | null;
  featured?: boolean | null;
};

/** true si hay al menos un producto activo en Postgres. */
export async function hasActiveDbProducts(): Promise<boolean> {
  const prisma = getPrisma();
  if (!prisma) return false;
  const n = await prisma.product.count({ where: { active: true } });
  return n > 0;
}

export async function getProducts(filters: ProductFilters): Promise<ProductDTO[]> {
  const prisma = getPrisma();
  if (!prisma || !(await hasActiveDbProducts())) {
    return filterDemoProducts(filters);
  }

  const where: Prisma.ProductWhereInput = { active: true, stock: { gt: 0 } };

  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.featured === true) {
    where.featured = true;
  }
  const priceFilter: Prisma.DecimalFilter = {};
  if (filters.minPrice != null && !Number.isNaN(filters.minPrice)) {
    priceFilter.gte = filters.minPrice;
  }
  if (filters.maxPrice != null && !Number.isNaN(filters.maxPrice)) {
    priceFilter.lte = filters.maxPrice;
  }
  if (Object.keys(priceFilter).length > 0) {
    where.price = priceFilter;
  }
  if (filters.q && filters.q.trim()) {
    const term = filters.q.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { slug: { contains: term, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.product.findMany({
    where,
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    include: productImageInclude,
  });
  return rows.map(toDTO);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const prisma = getPrisma();
  if (!prisma || !(await hasActiveDbProducts())) {
    return DEMO_PRODUCT_DTOS.find((p) => p.slug === slug) ?? null;
  }

  const p = await prisma.product.findFirst({
    where: { slug, active: true },
    include: productImageInclude,
  });
  return p ? toDTO(p) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDTO[]> {
  const prisma = getPrisma();
  if (!prisma || !(await hasActiveDbProducts())) {
    return filterDemoProducts({ featured: true }).slice(0, limit);
  }

  const rows = await prisma.product.findMany({
    where: { active: true, featured: true, stock: { gt: 0 } },
    take: limit,
    orderBy: { name: "asc" },
    include: productImageInclude,
  });
  return rows.map(toDTO);
}

function shuffleArray<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Productos activos con stock, mezclados al azar para el hero (cambia en cada carga).
 * Toma un pool reciente amplio y baraja en memoria para escalar sin SQL específico.
 */
export async function getHeroShowcaseProducts(limit = 8): Promise<ProductDTO[]> {
  const prisma = getPrisma();
  if (!prisma || !(await hasActiveDbProducts())) {
    const list = filterDemoProducts({});
    return shuffleArray(list).slice(0, Math.min(limit, list.length));
  }

  const pool = await prisma.product.findMany({
    where: { active: true, stock: { gt: 0 } },
    take: Math.min(48, Math.max(limit * 6, 24)),
    orderBy: { updatedAt: "desc" },
    include: productImageInclude,
  });
  return shuffleArray(pool.map(toDTO)).slice(0, limit);
}
