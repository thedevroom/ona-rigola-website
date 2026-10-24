import Link from "next/link";
import { portfolioSlots, works } from "@/content/works";
import { WorkFrame, PortfolioLink } from "@/components/ui/work-frame";
import styles from "./portfolio-preview.module.css";

/**
 * Vista previa del portfolio en la portada.
 *
 * Cada pieza enlaza con su ficha. Las que aún están en `status: "muestra"`
 * (imágenes de dirección de arte, no trabajos reales) se marcan con `noindex`
 * y una nota al pie, nunca se presentan como trabajos de la artista.
 */
export function PortfolioPreview() {
  const items = works.slice(0, portfolioSlots);
  const aspects = ["tall", "portrait", "portrait", "wide"] as const;

  return (
    <section className={styles.section} aria-labelledby="portfolio-preview-title">
      <div className="container">
        <div className={styles.head}>
          <div className={styles.headTitle}>
            <h2 id="portfolio-preview-title" className={styles.title}>
              Trabajos seleccionados
            </h2>
            <span className={styles.count}>01 / {String(items.length).padStart(2, "0")}</span>
          </div>
          <PortfolioLink label="Ver el portfolio completo" />
        </div>

        <div className={styles.grid}>
          {items.map((work, index) => (
            <div key={work.slug} className={styles.item}>
              <WorkFrame
                work={work}
                index={index}
                aspect={aspects[index] ?? "portrait"}
                sizes="(max-width: 60rem) 48vw, 34vw"
                linkToWork
              />
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p className={styles.note}>
            Cada pieza se dibuja para una persona y una zona del cuerpo. Una selección breve de
            trabajos de línea fina, blackwork y ornamental.
          </p>
          <Link href="/contacto" className="link-underline">
            Consultar una pieza personalizada
          </Link>
        </div>
      </div>
    </section>
  );
}
