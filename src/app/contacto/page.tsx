import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { BookingForm } from "@/components/forms/booking-form";
import { siteConfig } from "@/config/site";
import { processSteps } from "@/content/process";
import { ArrowRight, StarGlyph } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, buildBreadcrumbList } from "@/lib/seo";
import styles from "./contacto.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Reserva una cita — Contacto",
  description:
    "Solicita una cita con Ona Rigola, tatuadora en Barcelona. Cuéntame tu idea, el estilo y la zona del cuerpo para valorar tu proyecto de tatuaje.",
  pathname: "/contacto",
  keywords: ["reservar cita tatuaje Barcelona", "contacto tatuadora Barcelona"],
});

/** Los tres primeros pasos reales del proceso, como avance de lo que ocurre. */
const previewSteps = processSteps.slice(0, 3);

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reserva / Contacto"
        index="Barcelona · ES"
        title={
          <>
            Hagamos que sea
            <br />
            <span className="italic-accent">personal.</span>
          </>
        }
        lede="Cada pieza empieza con un mensaje. Cuéntame la idea con tus palabras: no hace falta que tengas el diseño resuelto."
      />

      <section className={styles.stage} aria-labelledby="formulario-title">
        <div className={styles.glyphLayer} aria-hidden="true">
          <StarGlyph className={styles.glyph} size={620} />
        </div>

        <div className={`container ${styles.layout}`}>
          <div className={styles.aside}>
            <p className="eyebrow eyebrow--inverse">
              <StarGlyph size={10} />
              Solicitud de cita
            </p>

            <h2 id="formulario-title" className={styles.title}>
              Cuéntame
              <br />
              <span className={styles.titleAccent}>tu idea</span>
            </h2>

            <p className={styles.lede}>
              ¿Tienes una idea, una pregunta o simplemente quieres saludar? Escríbeme y valoramos
              juntas el siguiente paso.
            </p>

            <ol className={styles.steps}>
              {previewSteps.map((step) => (
                <li key={step.index} className={styles.step}>
                  <span className={styles.stepIndex} aria-hidden="true">
                    {step.index}
                  </span>
                  <span className={styles.stepTitle}>{step.title}</span>
                </li>
              ))}
            </ol>

            <ul className={styles.tags} aria-label="Estilos">
              {siteConfig.styles.map((style) => (
                <li key={style.id} className={styles.tag}>
                  {style.name}
                </li>
              ))}
            </ul>

            <p className={styles.note}>
              <StarGlyph size={11} />
              {siteConfig.booking.responseNote}
            </p>
          </div>

          <div className={styles.panel}>
            <BookingForm />
          </div>
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="antes-de-enviar">
        <div className="container">
          <div className={styles.closingRow}>
            <div className={styles.closingBlock}>
              <p className="eyebrow" id="antes-de-enviar">
                Antes de enviar
              </p>
              <p className={styles.closingText}>
                Si prefieres resolver dudas antes de escribir, aquí están las respuestas a lo que
                más se pregunta: referencias, tamaños y preparación de la sesión.
              </p>
            </div>

            <div className={styles.closingLinks}>
              <Link href="/preguntas-frecuentes" className={styles.bigLink}>
                <span>Preguntas frecuentes</span>
                <ArrowRight />
              </Link>
              <Link href="/proceso" className={styles.bigLink}>
                <span>Cómo funciona, paso a paso</span>
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        id="ld-contacto"
        data={buildBreadcrumbList([
          { name: "Inicio", pathname: "/" },
          { name: "Contacto", pathname: "/contacto" },
        ])}
      />
    </>
  );
}
