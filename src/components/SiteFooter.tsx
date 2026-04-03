import Link from "next/link";

const site = process.env.NEXT_PUBLIC_SITE_NAME ?? "Mary Mirari";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 16.5A4.5 4.5 0 1 0 12 7.5a4.5 4.5 0 0 0 0 9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M17.5 6.5h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 3v12.2c0 2-1.7 3.8-3.8 3.8-2.1 0-3.7-1.7-3.7-3.7 0-2.1 1.7-3.8 3.8-3.8.5 0 1 .1 1.4.3V7.4c-.5-.1-1-.2-1.5-.2C6 7.2 3.7 9.6 3.7 12.6c0 3 2.4 5.4 5.4 5.4 2.7 0 5-2 5.3-4.7.1-.6.1-1.2.1-1.8V8.1c1 .8 2.2 1.2 3.5 1.2V6.9c-1.9 0-3.5-1.5-3.5-3.5H14Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
            <li>
              <Link href="/como-comprar" className="hover:text-maroon">
                Cómo comprar
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

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">
            Redes
          </h3>
          <div className="mt-3 flex items-center gap-3 text-muted">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/40 opacity-60"
              aria-label="Instagram (próximamente)"
              title="Instagram (próximamente)"
            >
              <InstagramIcon />
            </span>
            <a
              href="https://www.tiktok.com/@mary_mirari?_r=1&_t=ZS-95DztGJ7jfw"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/40 transition hover:border-maroon/40 hover:text-maroon"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/80 py-4 text-center text-xs text-muted">
        <p>© {new Date().getFullYear()} {site}</p>
        <p className="mt-2">
          Defensa de las y los consumidores: para reclamos ingresá{" "}
          <a
            href="https://autogestion.produccion.gob.ar/consumidores"
            target="_blank"
            rel="noreferrer"
            className="hover:text-maroon underline underline-offset-2"
          >
            acá
          </a>{" "}
          y luego vas al portal.
        </p>
      </div>
    </footer>
  );
}
