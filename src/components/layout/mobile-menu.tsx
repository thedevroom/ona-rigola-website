"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { mainNavigation, legalNavigation, siteConfig } from "@/config/site";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import styles from "./mobile-menu.module.css";

/**
 * Menú móvil a pantalla completa.
 *
 * Client Component acotado: solo gestiona apertura, foco, Escape y bloqueo del
 * scroll. La navegación real son enlaces de Next.js.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // El menú se cierra al navegar: cada enlace lo cierra en su propio `onClick`,
  // sin efectos que sincronicen estado con la ruta.
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const triggerElement = triggerRef.current;
    document.body.dataset.scrollLocked = "true";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      delete document.body.dataset.scrollLocked;
      (previouslyFocused ?? triggerElement)?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls="menu-movil"
        aria-label="Abrir menú de navegación"
        onClick={() => setOpen(true)}
        data-testid="mobile-menu-trigger"
      >
        <MenuIcon />
      </button>

      {open
        ? createPortal(
            <div
              ref={panelRef}
              id="menu-movil"
              className={styles.overlay}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <div className={styles.topBar}>
                <span className={styles.wordmark} id={titleId}>
                  {siteConfig.wordmark}
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  className={styles.closeButton}
                  onClick={close}
                  aria-label="Cerrar menú de navegación"
                  data-testid="mobile-menu-close"
                >
                  <span className={styles.closeLabel} aria-hidden="true">
                    Cerrar
                  </span>
                  <CloseIcon />
                </button>
              </div>

              <div className={styles.body}>
                <nav aria-label="Navegación móvil">
                  <ul className={styles.list}>
                    {mainNavigation.map((item, index) => {
                      const active =
                        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                      return (
                        <li key={item.href} className={styles.item}>
                          <Link
                            href={item.href}
                            className={`${styles.link} ${active ? styles.linkActive : ""}`}
                            aria-current={active ? "page" : undefined}
                            onClick={close}
                          >
                            {item.label}
                            <span className={styles.number} aria-hidden="true">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className={styles.aside}>
                  <Link href="/contacto" className="btn btn--solid btn--block" onClick={close}>
                    Solicita una cita
                  </Link>
                  <div className={styles.asideRow}>
                    <span>{siteConfig.city}</span>
                    <span aria-hidden="true">✦</span>
                    <span>{siteConfig.roleShort}</span>
                  </div>
                  <div className={styles.legalLinks}>
                    {legalNavigation.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={styles.legalLink}
                        onClick={close}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
