import type { Viewport } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { CustomScrollbar } from "@/components/ui/custom-scrollbar";
import { Preloader } from "@/components/ui/preloader";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { fontClassNames } from "@/lib/fonts";
import { baseMetadata } from "@/lib/metadata";
import { personSchema, webSiteSchema } from "@/lib/structured-data";
import "./globals.css";

export const metadata = baseMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0ede4" },
    { media: "(prefers-color-scheme: dark)", color: "#16150f" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontClassNames}>
      <body>
        <Preloader />
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
        <CustomScrollbar />
        <JsonLd id="ld-website" data={webSiteSchema()} />
        <JsonLd id="ld-person" data={personSchema()} />
      </body>
    </html>
  );
}
