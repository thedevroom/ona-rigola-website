import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Notice } from "@/components/ui/notice";
import { WorkFrame } from "@/components/ui/work-frame";
import { BookingBand } from "@/components/sections/booking-band";
import { works } from "@/content/works";
import { ArrowRight } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, buildBreadcrumbList } from "@/lib/seo";
import styles from "./trabajos.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Trabajos — Portfolio de tatuajes",
  description:
    "Portfolio de tatuajes de Ona Rigola en Barcelona: piezas de línea fina, blackwork y diseños ornamentales. Colección en preparación, sin imágenes de archivo.",
  pathname: "/trabajos",
  keywords: [
    "portfolio de tatuajes",
    "tatuajes de línea fina en Barcelona",
    "blackwork Barcelona",
    "tatuajes ornamentales",
  ],
});

export default function WorksPage() {
  const demoSlug = works[0]?.slug;

  return (
    <>
      <PageHeader
        eyebrow="Trabajos seleccionados"
        index="01 / 04"
        title={
          <>
            Piezas dibujadas
            <br />
            <span className="italic-accent">una a una.</span>
          </>
        }
        lede="Cada tatuaje se plantea como una pieza gráfica: escala, línea y espacio. El portfolio reúne los trabajos que la artista irá publicando."
      />

      <section className={styles.section} aria-labelledby="portfolio-title">
        <div className="container">
          <h2 id="portfolio-title" className="visually-hidden">
            Galería de trabajos
          </h2>

          <Notice
            eyebrow="Portfolio en preparación"
            title="Las fotografías reales están por llegar"
            link={
              demoSlug
                ? { href: `/trabajos/${demoSlug}`, label: "Ver plantilla de ficha" }
                : undefined
            }
          >
            Esta galería conserva los huecos reservados a las piezas reales de Ona Rigola: no se han
            añadido fotografías de archivo que pudieran atribuirse a su trabajo. Cada pieza tendrá
            su propia ficha con imágenes, estilo y concepto.
          </Notice>

          <div className={styles.grid}>
            {works.map((work, index) => (
              <div key={work.slug} className={styles.item} data-slot={index + 1}>
                <WorkFrame
                  work={work}
                  index={index}
                  aspect={index === 0 || index === 3 ? "tall" : "portrait"}
                  sizes="(max-width: 46rem) 92vw, (max-width: 68rem) 45vw, 42vw"
                  priority={index === 0}
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
