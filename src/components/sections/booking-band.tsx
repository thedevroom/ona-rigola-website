import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "@/components/ui/icons";
import styles from "./booking-band.module.css";

/** Banda de reserva en negro, inspirada en la vista de contacto de la referencia. */
export function BookingBand() {
  return (
    <section className={styles.section} aria-labelledby="reserva-band-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.content}>
          <p className="eyebrow eyebrow--inverse">Reserva / Contacto</p>
          <h2 id="reserva-band-title" className={styles.heading}>
            Hagamos
            <br />
            que sea
            <br />
            personal.
          </h2>
          <p className={styles.intro}>
            ¿Tienes una idea, una pregunta o simplemente quieres saludar? Escríbeme y valoramos
            juntas el siguiente paso.
          </p>
        </div>

        <div className={styles.aside}>
          <dl className={styles.list}>
            <div className={styles.listItem}>
              <dt>Solicitud</dt>
              <dd className={styles.listValue}>Formulario de cita</dd>
            </div>
            <div className={styles.listItem}>
              <dt>Ubicación</dt>
              <dd className={styles.listValue}>{siteConfig.city}</dd>
            </div>
            <div className={styles.listItem}>
              <dt>Respuesta</dt>
              <dd className={styles.listValue}>Personal, por correo</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            <Link href="/contacto" className="btn btn--inverse-solid">
              Solicita una cita
              <ArrowRight />
            </Link>
            <Link href="/proceso" className={styles.link}>
              Cómo funciona
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
