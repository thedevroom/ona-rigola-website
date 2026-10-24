"use client";

import Link from "next/link";

/** Límite de error de la aplicación: evita pantallas rotas sin explicación. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section style={{ padding: "clamp(4rem, 10vw, 8rem) 0" }}>
      <div className="container">
        <p className="eyebrow">Error inesperado</p>
        <h1 className="h1" style={{ marginTop: "1.25rem", maxWidth: "18ch" }}>
          Algo no ha cargado correctamente.
        </h1>
        <p className="lede" style={{ marginTop: "1.25rem" }}>
          Puedes reintentar la carga o volver al inicio. No se ha enviado ningún dato.
        </p>
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem", flexWrap: "wrap" }}>
          <button type="button" className="btn" onClick={reset}>
            Reintentar
          </button>
          <Link href="/" className="link-underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
