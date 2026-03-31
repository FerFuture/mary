import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = {
  title: "Carrito",
};

export default function CarritoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
        Carrito
      </h1>
      <p className="mt-2 text-sm text-muted">
        Revisá tus productos y envianos tu pedido. Te respondemos por correo.
      </p>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
