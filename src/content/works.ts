import type { TattooStyle } from "@/config/site";

export type WorkStatus = "publicado" | "demostracion";

export type WorkImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type Work = {
  slug: string;
  title: string;
  style: TattooStyle["id"];
  /** Etiqueta de estilo visible. */
  styleLabel: string;
  /** Zona del cuerpo, solo si se conoce. */
  bodyArea: string | null;
  /** Año o temporada, solo si se conoce. */
  year: string | null;
  status: WorkStatus;
  /** Resumen de una línea usado en listados. */
  summary: string;
  /** Texto de concepto de la pieza. */
  concept: string;
  images: WorkImage[];
  featured: boolean;
};

/**
 * Portfolio.
 *
 * IMPORTANTE — no hay fotografías reales de tatuajes en este repositorio.
 * Las entradas siguientes son FICHAS DE DEMOSTRACIÓN: documentan la plantilla de
 * trabajo, no piezas atribuidas a la artista. Se marcan como `demostracion`,
 * se excluyen del sitemap y se sirven con `noindex`.
 *
 * Para publicar una pieza real:
 *   1. Añade las fotografías en `public/images/trabajos/<slug>/`.
 *   2. Duplica una entrada, completa `title`, `style`, `bodyArea`, `concept` y
 *      `images` (con width/height reales) y marca `status: "publicado"`.
 *   3. `featured: true` la destaca en la página de inicio (máximo 4).
 */
export const works: Work[] = [
  {
    slug: "linea-fina-botanica",
    title: "Pieza botánica de línea fina",
    style: "linea-fina",
    styleLabel: "Línea fina",
    bodyArea: null,
    year: null,
    status: "demostracion",
    summary: "Ficha de demostración de una pieza de línea fina.",
    concept:
      "Esta ficha muestra cómo se presenta una pieza cuando existen fotografías reales: título, estilo, zona del cuerpo, concepto del diseño y galería. No describe un trabajo real de Ona Rigola.",
    images: [],
    featured: true,
  },
  {
    slug: "blackwork-mineral",
    title: "Pieza de blackwork",
    style: "blackwork",
    styleLabel: "Blackwork",
    bodyArea: null,
    year: null,
    status: "demostracion",
    summary: "Ficha de demostración de una pieza de blackwork.",
    concept:
      "Plantilla de ficha para una composición de masas negras. El contenido definitivo se escribirá a partir de la pieza real, con su propio relato de diseño.",
    images: [],
    featured: true,
  },
  {
    slug: "ornamental-simetrica",
    title: "Pieza ornamental simétrica",
    style: "ornamental",
    styleLabel: "Ornamental",
    bodyArea: null,
    year: null,
    status: "demostracion",
    summary: "Ficha de demostración de una pieza ornamental.",
    concept:
      "Plantilla de ficha para una pieza ornamental construida desde la simetría. Ejemplo de estructura editorial, sin fotografías atribuidas a la artista.",
    images: [],
    featured: true,
  },
  {
    slug: "linea-fina-floral",
    title: "Pieza floral de línea fina",
    style: "linea-fina",
    styleLabel: "Línea fina",
    bodyArea: null,
    year: null,
    status: "demostracion",
    summary: "Ficha de demostración de una pieza floral.",
    concept:
      "Plantilla de ficha para un motivo floral de trazo continuo. Se completará con las fotografías y el concepto reales en cuanto estén disponibles.",
    images: [],
    featured: true,
  },
];

/** Piezas publicadas (reales). Hoy no hay ninguna. */
export const publishedWorks = works.filter((work) => work.status === "publicado");

/** Piezas destacadas para la portada. */
export const featuredWorks = works.filter((work) => work.featured).slice(0, 4);

/** Número de huecos reservados que se muestran en la portada. */
export const portfolioSlots = 4;

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}

/**
 * Siguiente pieza publicada (navegación circular). Con el portfolio vacío no
 * hay siguiente: la interfaz simplemente no muestra ese enlace.
 */
export function getNextPublishedWork(slug: string): Work | undefined {
  if (publishedWorks.length === 0) return undefined;
  const index = publishedWorks.findIndex((work) => work.slug === slug);
  if (index === -1) return publishedWorks[0];
  return publishedWorks[(index + 1) % publishedWorks.length];
}
