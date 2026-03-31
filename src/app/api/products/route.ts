import { NextResponse } from "next/server";
import { Category } from "@prisma/client";
import { getProducts } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const q = searchParams.get("q");
  const featured = searchParams.get("featured");

  const cat =
    category && Object.values(Category).includes(category as Category)
      ? (category as Category)
      : null;

  const products = await getProducts({
    category: cat,
    minPrice: minPrice ? Number(minPrice) : null,
    maxPrice: maxPrice ? Number(maxPrice) : null,
    q: q ?? null,
    featured: featured === "true" ? true : null,
  });

  return NextResponse.json(products);
}
