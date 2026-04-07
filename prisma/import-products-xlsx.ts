/**
 * Importa productos desde Excel (.xlsx). Mismas columnas que el CSV.
 *
 * Uso: npm run db:import-xlsx -- "productos_template.xlsx"
 * Por defecto busca ./productos_template.xlsx en la raíz del proyecto.
 */
import path from "node:path";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import {
  buildHeaderIndex,
  cell,
  cellsFromExcelRow,
  upsertProductFromCells,
} from "./product-import-shared";

const prisma = new PrismaClient();

async function main() {
  const file =
    process.argv[2] ?? path.join(process.cwd(), "productos_template.xlsx");

  const wb = XLSX.readFile(file, { type: "file", cellDates: true });
  const name = wb.SheetNames[0];
  if (!name) throw new Error("El archivo no tiene hojas.");
  const sheet = wb.Sheets[name];
  const rows = XLSX.utils.sheet_to_json<(string | number | boolean | Date | null | undefined)[]>(
    sheet,
    { header: 1, defval: "", raw: false },
  );

  if (rows.length < 2) throw new Error("La hoja está vacía o solo tiene encabezados.");

  const headerCells = (rows[0] ?? []).map((c) =>
    c instanceof Date ? c.toISOString() : String(c ?? "").trim(),
  );
  const width = headerCells.length;
  const idx = buildHeaderIndex(headerCells);

  for (let r = 1; r < rows.length; r++) {
    const raw = rows[r] ?? [];
    const cells = cellsFromExcelRow(width, raw);
    if (!cell(idx, cells, "slug").trim() && !cell(idx, cells, "name").trim()) {
      continue;
    }
    await upsertProductFromCells(prisma, idx, cells, r + 1);
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
