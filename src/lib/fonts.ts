import localFont from "next/font/local";

/**
 * Tipografías autoalojadas con next/font (sin peticiones a Google Fonts).
 *
 * - Instrument Serif (SIL Open Font License 1.1): titulares editoriales de alto
 *   contraste e itálica de acento. Solo un peso, que es lo que la familia ofrece.
 * - Newsreader (SIL OFL 1.1): serif de lectura en variable, para cuerpo de texto
 *   y citas.
 * - Instrument Sans (SIL OFL 1.1): sans neutra para navegación, etiquetas,
 *   metadatos y controles.
 */
export const instrumentSerif = localFont({
  src: [
    {
      path: "../fonts/instrument-serif-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/instrument-serif-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
  fallback: ["Times New Roman", "Times", "serif"],
});

export const newsreader = localFont({
  src: [
    {
      path: "../fonts/newsreader-latin-wght-normal.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "../fonts/newsreader-latin-wght-italic.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  variable: "--font-newsreader",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const instrumentSans = localFont({
  src: [
    {
      path: "../fonts/instrument-sans-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-instrument-sans",
  display: "swap",
  preload: true,
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const fontClassNames = `${instrumentSerif.variable} ${newsreader.variable} ${instrumentSans.variable}`;
