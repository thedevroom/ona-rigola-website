import type { MetadataRoute } from "next";
import { absoluteUrl, isPreviewEnvironment } from "@/lib/seo";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Nunca se indexan entornos locales o de pruebas.
  if (isPreviewEnvironment()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(siteUrl).host,
  };
}
