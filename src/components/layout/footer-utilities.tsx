"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "@/components/ui/icons";
import styles from "./footer-utilities.module.css";

/**
 * Utilidades del pie: hora local del estudio y vuelta al inicio.
 *
 * Client Component mínimo y aislado: el reloj se rellena tras montar para no
 * romper la hidratación (el HTML del servidor no conoce la hora del visitante)
 * y la vuelta arriba respeta `prefers-reduced-motion`.
 */
export function FooterUtilities() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);

    return () => window.clearInterval(id);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <div className={styles.utilities}>
      <p className={styles.clock} suppressHydrationWarning>
        <span className={styles.clockDot} aria-hidden="true" />
        <span>Hora local</span>
        <span className={styles.clockTime}>{time ?? "--:--"}</span>
      </p>

      <button type="button" className={styles.toTop} onClick={scrollToTop}>
        <span>Volver arriba</span>
        <ArrowUp />
      </button>
    </div>
  );
}
