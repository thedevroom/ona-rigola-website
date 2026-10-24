import type { TattooStyle } from "@/config/site";

/**
 * Estado editorial de la pieza.
 *
 * - `publicado`: pieza que la artista ha aprobado publicar (imagen propia).
 * - `muestra`: imagen de muestra usada mientras no existen fotografías reales.
 *   La ficha lo indica de forma visible y se sirve con `noindex`.
 */
export type WorkStatus = "publicado" | "muestra";

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
 * Las cuatro imágenes actuales son MUESTRAS de dirección de arte: sirven para
 * mostrar la composición editorial del portfolio mientras no existan fotografías
 * de trabajos reales. Se declaran como `muestra` (aviso visible + `noindex`) y
 * nunca se presentan como piezas ejecutadas por la artista.
 *
 * Sustituir una muestra por una pieza real:
 *   1. Guarda las fotografías en `design/portfolio-muestras/<archivo>.png`
 *      (o edita `scripts/prepare-assets.mjs` para tu propia ruta).
 *   2. Cambia el `source` en `WORKS` de `scripts/prepare-assets.mjs` y ejecuta
 *      `npm run assets`: genera `public/images/trabajos/<slug>/01.jpg|webp`
 *      recortado en 4:5 y en monocromo.
 *   3. En esta lista, ajusta `title`, `bodyArea`, `year`, `summary` y `concept`
 *      con la información real y pon `status: "publicado"`.
 *   4. `featured: true` la destaca en la portada (máximo 4).
 */
export const works: Work[] = [
  {
    slug: "linea-fina-botanica",
    title: "Botánica de línea fina",
    style: "linea-fina",
    styleLabel: "Línea fina",
    bodyArea: "Antebrazo",
    year: null,
    status: "muestra",
    summary: "Ramo de flores silvestres dibujado con un solo peso de línea.",
    concept:
      "Una composición botánica de trazo continuo: tallo fino, hojas pequeñas y tres flores abiertas que respiran sobre la piel. El dibujo se adapta a la curva del antebrazo para que la línea no se cierre ni se pierda con el gesto.",
    images: [
      {
        src: "/images/trabajos/linea-fina-botanica/01.jpg",
        width: 1400,
        height: 1750,
        alt: "Tatuaje de línea fina en el antebrazo con un tallo, hojas pequeñas y tres flores silvestres",
      },
    ],
    featured: true,
  },
  {
    slug: "linea-fina-ramita",
    title: "Ramita de línea fina",
    style: "linea-fina",
    styleLabel: "Línea fina",
    bodyArea: "Brazo",
    year: null,
    status: "muestra",
    summary: "Una sola rama, hoja a hoja, en el interior del brazo.",
    concept:
      "Menos es más: una rama ligera que sube por el brazo con hojas alternas. La escala pequeña y el trazo uniforme hacen que la pieza gane con el tiempo, cuando la línea se asienta y el contraste se suaviza.",
    images: [
      {
        src: "/images/trabajos/linea-fina-ramita/01.jpg",
        width: 1400,
        height: 1751,
        alt: "Tatuaje de línea fina en el brazo con una rama de hojas alternas dibujada en trazo continuo",
      },
    ],
    featured: true,
  },
  {
    slug: "blackwork-floral",
    title: "Blackwork floral",
    style: "blackwork",
    styleLabel: "Blackwork",
    bodyArea: "Hombro",
    year: null,
    status: "muestra",
    summary: "Masa negra con reservas botánicas: contraste y presencia.",
    concept:
      "Una pieza de contraste pleno: el negro construye la forma y el dibujo aparece en negativo, como una lámina botánica revelada dentro de la tinta. La silueta sigue la redondez del hombro.",
    images: [
      {
        src: "/images/trabajos/blackwork-floral/01.jpg",
        width: 1400,
        height: 1750,
        alt: "Tatuaje de blackwork en el hombro con una forma negra y motivos florales en negativo",
      },
    ],
    featured: true,
  },
  {
    slug: "ornamental-clavicula",
    title: "Ornamental de clavícula",
    style: "ornamental",
    styleLabel: "Ornamental",
    bodyArea: "Clavícula",
    year: null,
    status: "muestra",
    summary: "Simetría fina que acompaña la línea natural del cuerpo.",
    concept:
      "Un dibujo ornamental pensado para el escote: eje central, simetría medida y detalles mínimos. La pieza se apoya en la anatomía en lugar de competir con ella, con líneas que siguen la clavícula.",
    images: [
      {
        src: "/images/trabajos/ornamental-clavicula/01.jpg",
        width: 1400,
        height: 1750,
        alt: "Tatuaje ornamental simétrico en la clavícula con una flor central y líneas finas laterales",
      },
    ],
    featured: true,
  },
];

/** Piezas publicadas (reales). */
export const publishedWorks = works.filter((work) => work.status === "publicado");

/** Piezas destacadas para la portada. */
export const featuredWorks = works.filter((work) => work.featured).slice(0, 4);

/** Número de piezas que se muestran en la vista previa de la portada. */
export const portfolioSlots = 4;

/** ¿Hay alguna pieza publicada de verdad? */
export const hasPublishedWorks = publishedWorks.length > 0;

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}

/**
 * Siguiente pieza publicada (navegación circular). Mientras no haya piezas
 * publicadas se usa la siguiente muestra para no dejar la navegación muerta.
 */
export function getNextPublishedWork(slug: string): Work | undefined {
  const pool = hasPublishedWorks ? publishedWorks : works;
  const index = pool.findIndex((work) => work.slug === slug);
  if (index === -1) return pool[0];
  return pool[(index + 1) % pool.length];
}
