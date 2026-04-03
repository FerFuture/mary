import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Raleway } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const site = process.env.NEXT_PUBLIC_SITE_NAME ?? "Mary Mirari";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: `${site} — Bijouterie y accesorios`,
    template: `%s · ${site}`,
  },
  description:
    "Accesorios de moda elegantes: collares, pulseras y anillos. Diseño sofisticado para tu estilo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${raleway.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CartDrawer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
