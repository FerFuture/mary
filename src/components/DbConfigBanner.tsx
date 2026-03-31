export function DbConfigBanner() {
  if (process.env.DATABASE_URL?.trim()) return null;

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950"
      role="status"
    >
      <strong>Modo sin base de datos:</strong> configurá{" "}
      <code className="rounded bg-amber-100/80 px-1">DATABASE_URL</code> (Postgres)
      para ver productos y registrar pedidos. La tienda carga igual para revisar diseño
      y deploy.
    </div>
  );
}
