"use client";

import { useEffect, useRef, useState } from "react";
import { StarGlyph } from "@/components/ui/icons";
import styles from "./preloader.module.css";

/** Tiempo mínimo en pantalla: la animación debe poder leerse. */
const MIN_DURATION = 1100;
/** Tope absoluto, aunque algún recurso tarde en cargar. */
const MAX_DURATION = 2600;
/** Debe coincidir con la transición de salida del CSS. */
const EXIT_DURATION = 820;

type Phase = "loading" | "leaving" | "done";

/**
 * Portada de carga.
 *
 * Se muestra en cada carga completa del documento (no en la navegación interna,
 * porque el layout no se remonta). El contador avanza con `requestAnimationFrame`
 * y solo llega a 100 cuando el documento ha terminado de cargar; la salida es un
 * corte de cortina que descubre la página.
 *
 * Nunca bloquea la interacción (`pointer-events: none`) y es puramente
 * decorativa: el contenido real ya está renderizado debajo.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const frame = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Sin animación no hay portada: se retira en el siguiente fotograma.
      frame.current = window.requestAnimationFrame(() => setPhase("done"));
      return () => {
        if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      };
    }

    const start = performance.now();
    let loaded = document.readyState === "complete";
    let finished = false;

    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener("load", onLoad);

    const finish = () => {
      if (finished) return;
      finished = true;
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      window.removeEventListener("load", onLoad);
      setProgress(100);
      setPhase("leaving");
      exitTimer.current = window.setTimeout(() => setPhase("done"), EXIT_DURATION);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const eased = 1 - Math.pow(1 - Math.min(elapsed / MIN_DURATION, 1), 3);
      const ready = loaded && elapsed >= MIN_DURATION;

      setProgress(Math.round(ready ? 100 : Math.min(94, eased * 94)));

      if (ready || elapsed >= MAX_DURATION) {
        finish();
        return;
      }

      frame.current = window.requestAnimationFrame(tick);
    };

    frame.current = window.requestAnimationFrame(tick);

    return () => {
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={styles.root} data-phase={phase} data-testid="preloader" aria-hidden="true">
      <div className={styles.frame}>
        <div className={styles.head}>
          <span className={styles.brand}>Ona Rigola</span>
          <span className={styles.meta}>Tatuaje · Barcelona</span>
        </div>

        <span className={styles.watermark} aria-hidden="true">
          <StarGlyph size={480} />
        </span>

        <div className={styles.title}>
          <span className={styles.line}>
            <span className={styles.lineInner}>Ona</span>
          </span>
          <span className={`${styles.line} ${styles.lineIndent}`}>
            <span className={`${styles.lineInner} ${styles.lineInnerItalic}`}>Rigola</span>
          </span>
          <p className={styles.caption}>Línea fina, blackwork y ornamental.</p>
        </div>

        <div className={styles.meterRow}>
          <div className={styles.meter}>
            <span className={styles.meterFill} style={{ transform: `scaleX(${progress / 100})` }} />
          </div>

          <div className={styles.readout}>
            <span className={styles.star} style={{ transform: `rotate(${progress * 3.6}deg)` }}>
              <StarGlyph size={13} />
            </span>
            <span className={styles.counter}>
              {String(progress).padStart(3, "0")}
              <span className={styles.unit}>%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
