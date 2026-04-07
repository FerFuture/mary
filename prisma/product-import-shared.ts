/**
 * Lógica compartida: import CSV y XLSX → upsert Product + ProductImage.
 */
import { Prisma, PrismaClient, Category } from "@prisma/client";

export const ALLOWED = new Set<string>(Object.values(Category));

export const REQUIRED_HEADERS = [
  "slug",
  "name",
  "description",
  "price",
  "imageurl",
  "category",
  "featured",
  "active",
  "stock",
] as const;

export const OPTIONAL_HEADERS = new Set([
  "extraimageurls",
  "colors",
  "colorlabels",
]);

/** Encabezados Excel/CSV → clave interna (ej. "Image URL" → "imageurl"). */
export function normalizeHeaderKey(h: string): string {
  return String(h ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

export function parseBool(raw: string, row: number, col: string): boolean {
  const v = raw.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes" || v === "si") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  throw new Error(`Fila ${row}: ${col} debe ser true/false (o 1/0), recibí "${raw}"`);
}

export function splitPipe(raw: string): string[] {
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildGalleryUrls(
  imageUrlCell: string,
  extraCell: string | undefined,
): string[] {
  const primaryField = imageUrlCell.trim();
  const fromMain = primaryField.includes("|")
    ? splitPipe(primaryField)
    : primaryField
      ? [primaryField]
      : [];
  const fromExtra = extraCell?.trim() ? splitPipe(extraCell) : [];
  const out: string[] = [...fromMain];
  for (const u of fromExtra) {
    if (!out.includes(u)) out.push(u);
  }
  return out;
}

export function parseColorLabelsCell(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of splitPipe(raw)) {
    const colon = part.indexOf(":");
    if (colon <= 0) continue;
    const k = part.slice(0, colon).trim().toLowerCase();
    const v = part.slice(colon + 1).trim();
    if (k && v) out[k] = v;
  }
  return out;
}

export function buildHeaderIndex(headerRow: string[]): Record<string, number> {
  const lower = headerRow.map((h) => normalizeHeaderKey(h));
  const idx: Record<string, number> = {};
  for (let i = 0; i < lower.length; i++) {
    const h = lower[i];
    if (!h) continue;
    if (idx[h] !== undefined) {
      throw new Error(`Encabezado duplicado: ${h}`);
    }
    idx[h] = i;
  }
  for (const r of REQUIRED_HEADERS) {
    if (idx[r] === undefined) {
      throw new Error(
        `Falta columna obligatoria "${r}". Obligatorias: ${REQUIRED_HEADERS.join(",")}`,
      );
    }
  }
  for (const h of lower) {
    if (!h) continue;
    if (
      !(REQUIRED_HEADERS as readonly string[]).includes(h) &&
      !OPTIONAL_HEADERS.has(h)
    ) {
      throw new Error(
        `Columna desconocida "${h}". Opcionales: ${[...OPTIONAL_HEADERS].join(", ")}`,
      );
    }
  }
  return idx;
}

export function cell(
  idx: Record<string, number>,
  row: string[],
  key: string,
): string {
  const i = idx[key];
  return i === undefined ? "" : (row[i] ?? "").trim();
}

export function slugify(text: string): string {
  const t = text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return t.slice(0, 72) || "producto";
}

export async function ensureUniqueProductSlug(
  prisma: PrismaClient,
  base: string,
): Promise<string> {
  let candidate = base;
  let n = 0;
  for (;;) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

function stringifyCell(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "number" && Number.isFinite(v)) {
    return String(v);
  }
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v).trim();
}

export function cellsFromExcelRow(
  width: number,
  row: unknown[],
): string[] {
  const out: string[] = [];
  for (let i = 0; i < width; i++) {
    out.push(stringifyCell(row[i]));
  }
  return out;
}

export async function upsertProductFromCells(
  prisma: PrismaClient,
  idx: Record<string, number>,
  cells: string[],
  rowNum: number,
): Promise<void> {
  const name = cell(idx, cells, "name");
  let slug = cell(idx, cells, "slug").trim();
  if (!slug) {
    if (!name.trim()) {
      throw new Error(`Fila ${rowNum}: falta slug y name (necesito al menos uno).`);
    }
    slug = await ensureUniqueProductSlug(prisma, slugify(name));
  }
  const description = cell(idx, cells, "description");
  const priceRaw = cell(idx, cells, "price");
  const imageUrlCell = cell(idx, cells, "imageurl");
  const categoryRaw = cell(idx, cells, "category");
  const featuredRaw = cell(idx, cells, "featured");
  const activeRaw = cell(idx, cells, "active");
  const stockRaw = cell(idx, cells, "stock");
  const extraImageUrlsRaw =
    idx.extraimageurls !== undefined
      ? cell(idx, cells, "extraimageurls")
      : undefined;

  const category = categoryRaw.trim().toUpperCase() as Category;
  if (!ALLOWED.has(category)) {
    throw new Error(
      `Fila ${rowNum}: categoría "${categoryRaw}" no válida. Usá COLLAR, PULSERA, ANILLO o DIJE.`,
    );
  }

  const price = Number(priceRaw.trim().replace(",", "."));
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Fila ${rowNum}: precio inválido "${priceRaw}"`);
  }

  const stock = Number.parseInt(stockRaw.trim(), 10);
  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error(`Fila ${rowNum}: stock inválido "${stockRaw}"`);
  }

  const featured = parseBool(featuredRaw, rowNum, "featured");
  const active = parseBool(activeRaw, rowNum, "active");

  const gallery = buildGalleryUrls(
    imageUrlCell,
    idx.extraimageurls !== undefined ? extraImageUrlsRaw : undefined,
  );
  if (gallery.length === 0) {
    throw new Error(
      `Fila ${rowNum}: falta al menos una imagen en imageUrl (o URLs separadas por |).`,
    );
  }
  const primaryImageUrl = gallery[0];

  const colorsRaw = cell(idx, cells, "colors");
  const colorKeys =
    idx.colors !== undefined
      ? splitPipe(colorsRaw).map((k) => k.toLowerCase())
      : undefined;

  const labelsObj =
    idx.colorlabels !== undefined
      ? parseColorLabelsCell(cell(idx, cells, "colorlabels"))
      : undefined;

  const createData: Parameters<typeof prisma.product.create>[0]["data"] = {
    slug,
    name: name.trim(),
    description: description.trim(),
    price,
    imageUrl: primaryImageUrl,
    category,
    featured,
    active,
    stock,
  };
  if (colorKeys !== undefined) createData.colors = colorKeys;
  if (labelsObj !== undefined) {
    createData.colorLabels =
      Object.keys(labelsObj).length > 0 ? labelsObj : Prisma.DbNull;
  }

  const updateData: Parameters<typeof prisma.product.update>[0]["data"] = {
    name: name.trim(),
    description: description.trim(),
    price,
    imageUrl: primaryImageUrl,
    category,
    featured,
    active,
    stock,
  };
  if (colorKeys !== undefined) updateData.colors = colorKeys;
  if (labelsObj !== undefined) {
    updateData.colorLabels =
      Object.keys(labelsObj).length > 0 ? labelsObj : Prisma.DbNull;
  }

  const product = await prisma.product.upsert({
    where: { slug },
    create: createData,
    update: updateData,
  });

  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.createMany({
    data: gallery.map((url, sortOrder) => ({
      productId: product.id,
      url,
      sortOrder,
    })),
  });

  const colorNote =
    colorKeys && colorKeys.length > 0 ? ` [${colorKeys.join(", ")}]` : "";
  console.log(
    "OK:",
    slug,
    gallery.length > 1 ? `(${gallery.length} imgs)` : "",
    colorNote,
  );
}
