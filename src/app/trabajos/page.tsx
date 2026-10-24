import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { WorkFrame } from "@/components/ui/work-frame";
import { BookingBand } from "@/components/sections/booking-band";
import { works } from "@/content/works";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, buildBreadcrumbList } from "@/lib/seo";
import styles from "./trabajos.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Trabajos — Portfolio de tatuajes",
  description:
    "Portfolio de tatuajes de Ona Rigola en Barcelona: piezas de línea fina, blackwork y diseños ornamentales dibujados a medida para cada cuerpo.",
  pathname: "/trabajos",
  keywords: [
    "portfolio de tatuajes",
    "tatuajes de línea fina en Barcelona",
    "blackwork Barcelona",
    "tatuajes ornamentales",
  ],
});

export default function WorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trabajos seleccionados"
        index={`${String(works.length).padStart(2, "0")} piezas`}
        title={
          <>
            Piezas dibujadas
            <br />
            <span className="italic-accent">una a una.</span>
          </>
        }
        lede="Cada tatuaje se plantea como una pieza gráfica: escala, línea y espacio. Una selección de trabajos de línea fina, blackwork y ornamental."
      />

      <section className={styles.section} aria-labelledby="portfolio-title">
        <div className="container">
          <h2 id="portfolio-title" className="visually-hidden">
            Galería de trabajos
          </h2>

          <div className={styles.grid}>
            {works.map((work, index) => (
              <div key={work.slug} className={styles.item} data-slot={index + 1}>
                <WorkFrame
                  work={work}
                  index={index}
                  aspect={index === 0 || index === 3 ? "tall" : "portrait"}
                  sizes="(max-width: 46rem) 92vw, (max-width: 68rem) 45vw, 42vw"
                  priority={index === 0}
                  linkToWork
                />
              </div>
            ))}
          </div>

          <div className={styles.after}>
            <p className={styles.afterText}>
              ¿Tienes una idea para una pieza? El portfolio crece con cada proyecto, pero el
              siguiente diseño puede ser el tuyo.
            </p>
            <Link href="/contacto" className="btn">
              Solicita una cita
              <ArrowRight />
            </Link>
          </div>

          <p className={styles.sampleNote}>
            Las imágenes de esta primera selección son muestras de la dirección de arte del
            portfolio. Se sustituirán por las fotografías de los trabajos realizados en{" "}
            {siteConfig.city}.
          </p>
        </div>
      </section>

      <BookingBand />

      <JsonLd
        id="ld-trabajos"
        data={buildBreadcrumbList([
          { name: "Inicio", pathname: "/" },
          { name: "Trabajos", pathname: "/trabajos" },
        ])}
      />
    </>
  );
}
