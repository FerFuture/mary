/**
 * Prisma exige que exista DATABASE_URL al leer el schema.
 * Si no está definida (p. ej. CI sin env todavía), usamos un placeholder solo para generate (no conecta).
 */
const { execSync } = require("child_process");

const env = { ...process.env };
if (!env.DATABASE_URL || !String(env.DATABASE_URL).trim()) {
  env.DATABASE_URL =
    "postgresql://build:build@127.0.0.1:5432/build?schema=public";
}

execSync("npx prisma generate", { stdio: "inherit", env, shell: true });
