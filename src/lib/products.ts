import type { Category as DbCategory, Prisma, Product } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/format";
import type { Category, ProductDTO } from "@/types/product";

export type { ProductDTO, Category };

function toDTO(p: Product): ProductDTO {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: decimalToNumber(p.price),
    imageUrl: p.imageUrl,
    category: p.category as Category,
    featured: p.featured,
  };
}

export type ProductFilters = {
  category?: DbCategory | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  q?: string | null;
  featured?: boolean | null;
};

export async function getProducts(filters: ProductFilters): Promise<ProductDTO[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  const where: Prisma.ProductWhereInput = { active: true };

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
      { name: { contains: term } },
      { description: { contains: term } },
    ];
  }

  const rows = await prisma.product.findMany({
    where,
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
  return rows.map(toDTO);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const p = await prisma.product.findFirst({
    where: { slug, active: true },
  });
  return p ? toDTO(p) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDTO[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  const rows = await prisma.product.findMany({
    where: { active: true, featured: true },
    take: limit,
    orderBy: { name: "asc" },
  });
  return rows.map(toDTO);
}

