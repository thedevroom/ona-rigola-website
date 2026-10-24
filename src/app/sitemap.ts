import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Sitemap.
 *
 * Solo incluye páginas públicas e indexables. Las fichas de muestra del
 * portfolio quedan fuera (además llevan `noindex`) para no generar contenido de
 * relleno en los resultados de búsqueda.
 */
const lastModified = new Date("2026-10-24T00:00:00Z");

const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/trabajos", changeFrequency: "monthly", priority: 0.9 },
  { path: "/sobre-mi", changeFrequency: "yearly", priority: 0.8 },
  { path: "/proceso", changeFrequency: "yearly", priority: 0.7 },
  { path: "/contacto", changeFrequency: "yearly", priority: 0.9 },
  { path: "/preguntas-frecuentes", changeFrequency: "yearly", priority: 0.6 },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.2 },
  { path: "/aviso-legal", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
