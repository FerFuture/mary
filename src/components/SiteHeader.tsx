"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cart";

const site = process.env.NEXT_PUBLIC_SITE_NAME ?? "Mary Mirari";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0),
  );
  const openDrawer = useCartStore((s) => s.openDrawer);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {site}
        </Link>

        <form
          action="/catalogo"
          method="get"
          className="hidden min-w-0 flex-1 md:block"
        >
          <label htmlFor="site-search" className="sr-only">
            Buscar productos
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Buscar collares, pulseras…"
              className="w-full rounded-full border border-border bg-card py-2 pl-10 pr-4 text-sm outline-none ring-maroon/30 transition-shadow placeholder:text-muted focus:ring-2"
            />
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-8 md:flex">
          <NavLink href="/">Inicio</NavLink>
          <NavLink href="/catalogo">Catálogo</NavLink>
          <NavLink href="/carrito">Carrito</NavLink>
          <button
            type="button"
            onClick={openDrawer}
            className="relative rounded-full border border-border bg-card p-2 text-foreground transition hover:border-maroon/40 hover:shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-maroon/40"
            aria-label="Abrir carrito lateral"
          >
            <BagIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-maroon px-1 text-[11px] font-semibold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={openDrawer}
            className="relative rounded-full border border-border bg-card p-2"
            aria-label="Carrito"
          >
            <BagIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="rounded-lg border border-border p-2"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Menú"
          >
            {mobileOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <form action="/catalogo" method="get" className="mb-4">
            <input
              name="q"
              type="search"
              placeholder="Buscar…"
              className="w-full rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-maroon/30"
            />
          </form>
          <nav className="flex flex-col gap-3">
            <MobileNavLink href="/" onNavigate={() => setMobileOpen(false)}>
              Inicio
            </MobileNavLink>
            <MobileNavLink
              href="/catalogo"
              onNavigate={() => setMobileOpen(false)}
            >
              Catálogo
            </MobileNavLink>
            <MobileNavLink
              href="/carrito"
              onNavigate={() => setMobileOpen(false)}
            >
              Carrito
            </MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium uppercase tracking-wider text-foreground/80 transition hover:text-maroon"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="text-base font-medium text-foreground py-1"
    >
      {children}
    </Link>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm0 0L21 21"
      />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        d="M6 7h15l-1.5 12H7.5L6 7Zm0 0L5 3H2M9 11v6m6-6v6M9 7V5a3 3 0 0 1 6 0v2"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M4 7h16M4 12h16M4 17h16"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M6 6l12 12M18 6L6 18"
      />
    </svg>
  );
}
