/**
 * Importa productos desde CSV.
 *
 * Columnas obligatorias: slug,name,description,price,imageUrl,category,featured,active,stock
 * (el orden puede ser cualquiera; los nombres se comparan en minúsculas y sin espacios).
 *
 * Opcionales:
 * - extraImageUrls — más URLs separadas por | (además de las que vayan en imageUrl con |).
 * - colors — claves de color separadas por | (ej. dorado|plateado); se guardan en minúsculas.
 * - colorLabels — etiquetas por clave: clave:texto separados por | (ej. dorado:Dorado|plateado:Plateado).
 *
 * Varias imágenes base: en imageUrl podés poner varias URLs separadas por |.
 *
 * Uso: npm run db:import-csv -- "C:\\ruta\\productos.csv"
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import {
  buildHeaderIndex,
  cell,
  upsertProductFromCells,
} from "./product-import-shared";

const prisma = new PrismaClient();

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (c === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

async function main() {
  const file =
    process.argv[2] ?? path.join(process.cwd(), "productos_prisma.csv");
  const text = readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) throw new Error("CSV vacío o sin datos.");

  const headerCells = parseCsvLine(lines[0]);
  const idx = buildHeaderIndex(headerCells);

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    if (cells.length !== headerCells.length) {
      throw new Error(
        `Fila ${i + 1}: se esperaban ${headerCells.length} columnas, hay ${cells.length}`,
      );
    }

    if (!cell(idx, cells, "slug").trim() && !cell(idx, cells, "name").trim()) {
      continue;
    }

    await upsertProductFromCells(prisma, idx, cells, i + 1);
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
