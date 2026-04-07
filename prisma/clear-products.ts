/**
 * Borra todos los productos. Primero quita OrderItem (FK a Product).
 * ProductImage se elimina en cascada al borrar Product.
 * Los registros Order (cabecera del pedido) no se tocan; quedan sin ítems.
 *
 * Uso: npm run db:clear-products
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.orderItem.deleteMany({});
  const products = await prisma.product.deleteMany({});
  console.log(
    `Listo: eliminados ${items.count} ítems de pedidos y ${products.count} productos.`,
  );
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
