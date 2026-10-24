import type { Metadata } from "next";
import { siteConfig, siteUrl } from "@/config/site";
import { isPreviewEnvironment } from "@/lib/seo";

/**
 * Metadatos base compartidos. Cada página define su propio título, descripción
 * y canonical mediante `buildMetadata`.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — Tatuadora de línea fina en Barcelona`,
    template: `%s — ${siteConfig.name}`,
  },
  description:
    "Ona Rigola, tatuadora independiente en Barcelona. Piezas de línea fina, blackwork y diseños ornamentales dibujados a medida. Solicita una cita.",
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "art",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Tatuadora de línea fina en Barcelona`,
    description: "Piezas de línea fina, blackwork y ornamentales dibujadas a medida en Barcelona.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Tatuadora en Barcelona`,
    description: "Piezas de línea fina, blackwork y ornamentales dibujadas a medida en Barcelona.",
  },
  formatDetection: { telephone: false, email: false, address: false },
  // Evita indexar entornos locales o de pruebas (localhost, 127.0.0.1, .local).
  robots: isPreviewEnvironment(siteUrl)
    ? { index: false, follow: false, nocache: true }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      },
};
