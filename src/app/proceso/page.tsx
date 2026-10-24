import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { BookingBand } from "@/components/sections/booking-band";
import { processSteps, bookingNote } from "@/content/process";
import { faqItems } from "@/content/faq";
import { ArrowRight } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, buildBreadcrumbList } from "@/lib/seo";
import styles from "./proceso.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Proceso — De la idea al tatuaje",
  description:
    "Cómo trabaja Ona Rigola paso a paso: envío de la idea, revisión de referencias, definición del diseño, preparación de la cita, sesión y cuidados posteriores.",
  pathname: "/proceso",
  keywords: ["proceso tatuaje", "cómo pedir cita tatuaje Barcelona", "diseño personalizado"],
});

export default function ProcessPage() {
  const faqPreview = faqItems.slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Proceso"
        index="06 pasos"
        title={
          <>
            De la idea
            <br />
            <span className="italic-accent">a la piel.</span>
          </>
        }
        lede="Un recorrido claro para saber qué ocurre desde que escribes hasta que la pieza está terminada."
      />

      <section className={styles.section} aria-labelledby="pasos-title">
        <div className={`container ${styles.layout}`}>
          <div className={styles.aside}>
            <p className="eyebrow">Cómo funciona</p>
            <h2 id="pasos-title" className={styles.heading}>
              Seis pasos, sin sorpresas
            </h2>
            <p className={styles.asideText}>
              Cada cita se acuerda por escrito: diseño, fecha, duración y condiciones. Nada se da
              por supuesto.
            </p>
            <Link href="/contacto" className="btn">
              Empezar la solicitud
              <ArrowRight />
            </Link>
          </div>

          <ol className={styles.steps}>
            {processSteps.map((step) => (
              <li key={step.index} className={styles.step}>
                <span className={styles.stepIndex} aria-hidden="true">
                  {step.index}
                </span>
                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepSummary}>{step.summary}</p>
                  <ul className={styles.details}>
                    {step.details.map((detail) => (
                      <li key={detail} className={styles.detail}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="container">
          <p className={styles.note}>{bookingNote}</p>
        </div>
      </section>

      <section className={styles.faqSection} aria-labelledby="dudas-title">
        <div className={`container ${styles.faqLayout}`}>
          <div>
            <p className="eyebrow">Preguntas frecuentes</p>
            <h2 id="dudas-title" className="h2">
              Antes de escribir
            </h2>
          </div>
          <div>
            <dl className={styles.miniFaq}>
              {faqPreview.map((item) => (
                <div key={item.id} className={styles.miniFaqItem}>
                  <dt className={styles.miniQuestion}>{item.question}</dt>
                  <dd className={styles.miniAnswer}>{item.answer}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.miniFooter}>
              <Link href="/preguntas-frecuentes" className="link-underline">
                Todas las preguntas
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BookingBand />

      <JsonLd
        id="ld-proceso"
        data={buildBreadcrumbList([
          { name: "Inicio", pathname: "/" },
          { name: "Proceso", pathname: "/proceso" },
        ])}
      />
    </>
  );
}
