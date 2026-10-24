import type { Metadata } from "next";
import { siteConfig, siteUrl } from "@/config/site";

/** Detecta entornos locales o de pruebas que nunca deben indexarse. */
export function isPreviewEnvironment(url: string = siteUrl): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".e2b.app")
    );
  } catch {
    return true;
  }
}

/** Construye una URL absoluta a partir de una ruta interna. */
export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, `${siteUrl}/`).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  /** Ruta interna, siempre con barra inicial. */
  pathname: string;
  /** Imagen social específica (ruta interna). */
  image?: string;
  keywords?: string[];
  noindex?: boolean;
};

/** Metadatos homogéneos por página: título, descripción, canonical y social. */
export function buildPageMetadata({
  title,
  description,
  pathname,
  image,
  keywords,
  noindex = false,
}: PageMetadataInput): Metadata {
  const ogImage = image ?? "/opengraph-image";
  const preview = isPreviewEnvironment();

  return {
    title,
    description,
    keywords,
    alternates: { canonical: pathname },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: absoluteUrl(pathname),
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${siteConfig.name} — ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noindex || preview ? { index: false, follow: false, nocache: true } : undefined,
  };
}

export type Breadcrumb = { name: string; pathname: string };

export function buildBreadcrumbList(items: Breadcrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.pathname),
    })),
  };
}
