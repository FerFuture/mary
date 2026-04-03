import Link from "next/link";

const site = process.env.NEXT_PUBLIC_SITE_NAME ?? "Mary Mirari";

export default function ComoComprarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 text-center">
        <p className="font-serif text-lg text-maroon">Información</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Cómo comprar
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
          Comprá en pocos pasos. Al confirmar tu pedido te enviamos un resumen
          por correo y luego te contactamos por WhatsApp para coordinar el
          pago y el envío.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-card/40 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#arrepentimiento"
            className="rounded-full bg-maroon px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-maroon-hover"
          >
            Arrepentimiento
          </a>
          <Link
            href="/catalogo"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground transition hover:border-maroon/40 hover:text-maroon"
          >
            Volver al catálogo
          </Link>
        </div>

        <h2 className="mt-6 font-serif text-xl font-semibold">Pasos</h2>

        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>
            Entrá a <span className="font-medium text-foreground">Catálogo</span>{" "}
            y elegí el producto.
          </li>
          <li>
            Tocá <span className="font-medium text-foreground">Agregar al carrito</span>{" "}
            y luego abrí <span className="font-medium text-foreground">Carrito</span>.
          </li>
          <li>
            Completá tus datos y la dirección de envío.
          </li>
          <li>
            Elegí <span className="font-medium text-foreground">Confirmar pedido</span>.
            Al procesarse el pedido te llega un resumen al correo y
            posteriormente te contactamos por WhatsApp para coordinar el pago
            y el envío.
          </li>
        </ol>

        <div className="mt-5">
          <h3 className="font-semibold text-foreground">Pagos</h3>
          <p className="mt-2 text-sm text-muted">
            Coordinamos el pago por transferencia o efectivo al confirmar tu
            pedido. El envío se coordina según tu zona.
          </p>
        </div>
      </div>

      <div
        id="arrepentimiento"
        className="mt-8 rounded-2xl border border-border bg-card/50 p-6 shadow-sm"
      >
        <h2 className="font-serif text-xl font-semibold">Arrepentimiento</h2>
        <p className="mt-2 text-sm text-muted">
          En compras a distancia, podés ejercer el derecho de arrepentimiento
          en los términos de la normativa vigente. Para conocer plazos y
          condiciones, consultá el portal oficial de{" "}
          <a
            href="https://autogestion.produccion.gob.ar/consumidores"
            target="_blank"
            rel="noreferrer"
            className="text-maroon hover:underline"
          >
            Defensa del Consumidor
          </a>
          .
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card/40 p-6 shadow-sm">
        <h2 className="font-serif text-xl font-semibold">
          Defensa de las y los consumidores
        </h2>
        <p className="mt-2 text-sm text-muted">
          Para reclamos ingresá{" "}
          <a
            href="https://autogestion.produccion.gob.ar/consumidores"
            target="_blank"
            rel="noreferrer"
            className="text-maroon hover:underline"
          >
            acá
          </a>{" "}
          y luego van al portal oficial.
        </p>
        <p className="mt-3 text-xs text-muted">
          {site} · La información brindada es orientativa. Para casos concretos,
          consultá con un profesional o el canal oficial.
        </p>
      </div>
    </div>
  );
}

