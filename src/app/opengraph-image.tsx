import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Ona Rigola — Tatuadora independiente en Barcelona";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagen para compartir en redes.
 *
 * Se compone en el servidor con la tipografía de marca (Instrument Serif) sin
 * depender de servicios externos. Satori no admite woff2, por lo que se lee la
 * versión woff incluida en `src/fonts/og/`.
 */
export default async function OpengraphImage() {
  const [serif, serifItalic] = await Promise.all([
    readFile(path.join(process.cwd(), "src/fonts/og/instrument-serif-latin-400-normal.woff")),
    readFile(path.join(process.cwd(), "src/fonts/og/instrument-serif-latin-400-italic.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f0ede4",
          color: "#16150f",
          padding: "64px 72px",
          fontFamily: "Instrument Serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(22,21,15,0.25)",
            paddingBottom: "22px",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <span>Tatuadora independiente</span>
          <span>Barcelona</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 208, lineHeight: 0.82, letterSpacing: -6 }}>Ona</div>
          <div
            style={{
              fontSize: 208,
              lineHeight: 0.82,
              letterSpacing: -6,
              fontStyle: "italic",
              marginLeft: 2,
            }}
          >
            Rigola
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(22,21,15,0.25)",
            paddingTop: "22px",
            fontSize: 26,
            letterSpacing: 3,
          }}
        >
          <span>Pequeños trazos. Grandes historias.</span>
          <span>Línea fina · Blackwork · Ornamental</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: serifItalic, style: "italic", weight: 400 },
      ],
    },
  );
}
