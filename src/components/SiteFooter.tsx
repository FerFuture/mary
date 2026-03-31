import Link from "next/link";

const site = process.env.NEXT_PUBLIC_SITE_NAME ?? "Mary Mirari";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-cream-dark/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="font-serif text-lg font-semibold">{site}</p>
          <p className="mt-2 text-sm text-muted">
            Bijouterie y accesorios de moda. Diseños actuales con estética
            cuidada.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Horario
          </h3>
          <p className="mt-2 text-sm">Lun — Vie · 10:00 — 19:00</p>
          <p className="text-sm">Sáb · 10:00 — 14:00</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Enlaces
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link href="/catalogo" className="hover:text-maroon">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="hover:text-maroon">
                Carrito
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Pagos
          </h3>
          <p className="mt-2 text-sm text-muted">
            Coordinamos pago por transferencia o efectivo al confirmar tu
            pedido.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-muted">
            <span className="rounded border border-border bg-card px-2 py-1">
              Transferencia
            </span>
            <span className="rounded border border-border bg-card px-2 py-1">
              Efectivo
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-border/80 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site}
      </div>
    </footer>
  );
}
