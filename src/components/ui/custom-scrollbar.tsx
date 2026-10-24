"use client";

import { useCallback, useEffect, useRef } from "react";
import styles from "./custom-scrollbar.module.css";

/**
 * Barra de desplazamiento a medida.
 *
 * Sustituye (solo en escritorio con puntero fino) a la barra nativa por un
 * control dibujado: pista con regla de marcas, pastilla negra con agarre, lectura
 * de porcentaje y arrastre real mediante Pointer Events.
 *
 * Es accesible por teclado (`role="scrollbar"`, flechas, Inicio/Fin) y no
 * reimplementa el desplazamiento: siempre mueve la página con `window.scrollTo`,
 * así que el scroll con rueda, teclado y gestos sigue siendo el del navegador.
 * En táctil o en pantallas estrechas no se monta y queda la barra nativa.
 */
export function CustomScrollbar() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const frame = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);
  const drag = useRef<{ pointerId: number; startY: number; startScroll: number } | null>(null);

  const geometry = useRef({ max: 0, travel: 0, trackHeight: 0, thumbHeight: 0 });

  const paint = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const { max, travel, thumbHeight } = geometry.current;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    const percentage = Math.round(progress * 100);

    root.style.setProperty("--thumb-h", `${thumbHeight}px`);
    root.style.setProperty("--thumb-y", `${Math.round(progress * travel)}px`);
    root.setAttribute("aria-valuenow", String(percentage));
    root.dataset.atTop = progress <= 0.001 ? "true" : "false";
    root.dataset.atEnd = progress >= 0.999 ? "true" : "false";

    if (readoutRef.current) {
      readoutRef.current.textContent = String(percentage).padStart(2, "0");
    }
  }, []);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const trackHeight = track.clientHeight;
    const viewport = window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const max = total - viewport;

    if (trackHeight <= 0 || max <= 4) {
      root.dataset.visible = "false";
      return;
    }

    const thumbHeight = Math.max(48, Math.round((viewport / total) * trackHeight));
    geometry.current = { max, travel: trackHeight - thumbHeight, trackHeight, thumbHeight };

    root.dataset.visible = "true";
    paint();
  }, [paint]);

  const schedule = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null;
      paint();
    });
  }, [paint]);

  const wake = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.idle = "false";
    if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      if (!drag.current) root.dataset.idle = "true";
    }, 1600);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    /**
     * Se activa en escritorio con ratón. `pointer: none` (navegadores headless,
     * algunos entornos remotos) se trata como puntero fino: si no, convivirían
     * la barra nativa y la de diseño.
     */
    const syncMode = () => {
      const wide = window.matchMedia("(min-width: 64rem)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      if (wide && !coarse) {
        document.documentElement.dataset.scrollbar = "custom";
      } else {
        delete document.documentElement.dataset.scrollbar;
      }
    };

    syncMode();
    root.dataset.idle = "true";
    requestAnimationFrame(measure);

    const onScroll = () => {
      schedule();
      wake();
    };
    const onResize = () => {
      syncMode();
      measure();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);

    const observer = new ResizeObserver(() => measure());
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      observer.disconnect();
      delete document.documentElement.dataset.scrollbar;
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    };
  }, [measure, schedule, wake]);

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scrollToY(top: number) {
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    wake();
  }

  function onTrackPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const ratio = (event.clientY - rect.top) / rect.height;
    const { max, thumbHeight } = geometry.current;
    // El centro de la pastilla debe caer donde se ha pulsado.
    const top = ratio * (max + thumbHeight) - thumbHeight / 2;

    scrollToY(Math.min(max, Math.max(0, top)));
  }

  function onThumbPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget;
    element.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startScroll: window.scrollY,
    };
    if (rootRef.current) rootRef.current.dataset.dragging = "true";
    document.body.dataset.scrollDragging = "true";
    wake();
  }

  function onThumbPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;

    const { travel, max } = geometry.current;
    if (travel <= 0) return;

    const delta = ((event.clientY - current.startY) / travel) * max;
    window.scrollTo({ top: current.startScroll + delta, behavior: "auto" });
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (rootRef.current) rootRef.current.dataset.dragging = "false";
    delete document.body.dataset.scrollDragging;
    wake();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const { max } = geometry.current;
    if (max <= 0) return;

    const page = window.innerHeight * 0.9;
    const step = 96;

    switch (event.key) {
      case "ArrowDown":
        scrollToY(window.scrollY + step);
        break;
      case "ArrowUp":
        scrollToY(window.scrollY - step);
        break;
      case "PageDown":
        scrollToY(window.scrollY + page);
        break;
      case "PageUp":
        scrollToY(window.scrollY - page);
        break;
      case "Home":
        scrollToY(0);
        break;
      case "End":
        scrollToY(max);
        break;
      default:
        return;
    }

    event.preventDefault();
  }

  return (
    <div
      ref={rootRef}
      className={styles.root}
      role="scrollbar"
      aria-orientation="vertical"
      aria-label="Desplazamiento de la página"
      aria-controls="contenido"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      tabIndex={0}
      data-visible="false"
      data-idle="true"
      data-dragging="false"
      onKeyDown={onKeyDown}
      onPointerEnter={wake}
      onFocus={wake}
    >
      <div ref={trackRef} className={styles.track} onPointerDown={onTrackPointerDown}>
        <span className={styles.line} aria-hidden="true" />
        <span className={styles.ticks} aria-hidden="true" />

        <div
          className={styles.thumb}
          onPointerDown={onThumbPointerDown}
          onPointerMove={onThumbPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span className={styles.grip} aria-hidden="true" />
        </div>

        <span className={styles.readout} aria-hidden="true">
          <span ref={readoutRef}>00</span>
          <span className={styles.readoutUnit}>%</span>
        </span>
      </div>
    </div>
  );
}
