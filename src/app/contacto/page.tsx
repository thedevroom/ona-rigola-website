import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { BookingForm } from "@/components/forms/booking-form";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "@/components/ui/icons";
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

      <section className={styles.darkSection} aria-labelledby="formulario-title">
        <div className={`container ${styles.layout}`}>
          <div className={styles.aside}>
            <p className="eyebrow eyebrow--inverse">Solicitud de cita</p>
            <h2 id="formulario-title" className={styles.title}>
              Cuéntame
              <br />
              tu idea
            </h2>
            <p className={styles.lede}>
              ¿Tienes una idea, una pregunta o simplemente quieres saludar? Escríbeme y valoramos
              juntas el siguiente paso.
            </p>

            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt className={styles.factTerm}>Ubicación</dt>
                <dd className={styles.factValue}>{siteConfig.city}</dd>
              </div>
              <div className={styles.fact}>
                <dt className={styles.factTerm}>Estilos</dt>
                <dd className={styles.factValue}>
                  {siteConfig.styles.map((style) => style.name).join(" · ")}
                </dd>
              </div>
              <div className={styles.fact}>
                <dt className={styles.factTerm}>Respuesta</dt>
                <dd className={styles.factValue}>Personal, por correo</dd>
              </div>
            </dl>

            <p className={styles.note}>{siteConfig.booking.responseNote}</p>
          </div>

          <BookingForm />
        </div>
      </section>

      <section className={styles.lightSection} aria-labelledby="antes-de-enviar">
        <div className="container">
          <div className={styles.faqRow}>
            <div className={styles.faqBlock}>
              <p className="eyebrow" id="antes-de-enviar">
                Antes de enviar
              </p>
              <p className={styles.faqText}>
                Resolvemos las dudas más habituales sobre referencias, tamaños y preparación de la
                sesión.
              </p>
            </div>
            <Link href="/preguntas-frecuentes" className="btn">
              Ver preguntas frecuentes
              <ArrowRight />
            </Link>
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
