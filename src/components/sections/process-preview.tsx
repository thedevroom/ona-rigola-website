import Link from "next/link";
import { bookingNote, processSteps } from "@/content/process";
import { ArrowRight } from "@/components/ui/icons";
import styles from "./process-preview.module.css";

/** Resumen del proceso de reserva (los tres primeros pasos). */
export function ProcessPreview() {
  const steps = processSteps.slice(0, 3);

  return (
    <section className={styles.section} aria-labelledby="proceso-preview-title">
      <div className="container">
        <div className={styles.head}>
          <div className={styles.headText}>
            <p className="eyebrow">Proceso</p>
            <h2 id="proceso-preview-title" className={styles.heading}>
              De la idea al dibujo
            </h2>
            <p className={styles.headSub}>
              Un recorrido breve y transparente para saber qué ocurre desde que escribes hasta que
              se confirma la cita.
            </p>
          </div>
          <Link href="/proceso" className="link-underline">
            Ver el proceso completo
            <ArrowRight />
          </Link>
        </div>

        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step.index} className={styles.step}>
              <span className={styles.stepIndex} aria-hidden="true">
                {step.index}
              </span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.summary}</p>
            </li>
          ))}
        </ol>

        <div className={styles.footer}>
          <p className={styles.footerText}>{bookingNote}</p>
          <Link href="/contacto" className="btn">
            Solicita una cita
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
