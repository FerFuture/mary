/**
 * Corrige columna colors en productos_template.xlsx (Boca y Nudo de bruja).
 * node scripts/fix-productos-template-acero-colors.cjs
 */
const fs = require("node:fs");
const path = require("node:path");
const XLSX = require("xlsx");

const file = path.join(process.cwd(), "productos_template.xlsx");
if (!fs.existsSync(file)) {
  console.error("No existe:", file);
  process.exit(1);
}

const REPLACEMENTS = {
  "dije boca acero quirúrgico":
    "acero-quirurgico|acero-dorado|acero-blanco",
  "dije nudo de bruja acero quirúrgico elegir color y medida":
    "acero-quirurgico-chico|acero-quirurgico-mediano|acero-quirurgico-grande|acero-dorado-chico|acero-dorado-mediano|acero-dorado-grande|acero-blanco-chico|acero-blanco-mediano|acero-blanco-grande",
};

const wb = XLSX.readFile(file);
const sn = wb.SheetNames[0];
const sheet = wb.Sheets[sn];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
const header = rows[0].map((h) =>
  String(h ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ""),
);
const nameIdx = header.indexOf("name");
const colorsIdx = header.indexOf("colors");
if (nameIdx < 0 || colorsIdx < 0) {
  console.error("Faltan columnas name o colors");
  process.exit(1);
}

for (let i = 1; i < rows.length; i++) {
  const name = String(rows[i][nameIdx] ?? "")
    .trim()
    .toLowerCase();
  const val = REPLACEMENTS[name];
  if (val) {
    rows[i][colorsIdx] = val;
    console.log("Fila", i + 1, ":", name.slice(0, 50));
  }
}

wb.Sheets[sn] = XLSX.utils.aoa_to_sheet(rows);
XLSX.writeFile(wb, file);
console.log("Guardado:", file);
