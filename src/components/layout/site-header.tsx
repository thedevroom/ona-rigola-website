"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "@/components/ui/icons";
import { MobileMenu } from "@/components/layout/mobile-menu";
import styles from "./header.module.css";

/** Navegación de escritorio: los cuatro accesos principales de la referencia. */
const desktopNav = [
  { label: "Inicio", href: "/" },
  { label: "Sobre mí", href: "/sobre-mi" },
  { label: "Trabajos", href: "/trabajos" },
  { label: "Proceso", href: "/proceso" },
];

/**
 * Cabecera editorial.
 *
 * Es un Client Component porque necesita conocer la ruta activa para marcar el
 * enlace actual (`aria-current`). No contiene estado de scroll ni animaciones.
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.shell}>
        <Link href="/" className={styles.wordmark} aria-label={`${siteConfig.name} — inicio`}>
          {siteConfig.wordmark}
        </Link>

        <nav className={styles.nav} aria-label="Navegación principal">
          <ul className={styles.navList}>
            {desktopNav.map((item, index) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href} className={styles.navItem}>
                  {index > 0 ? (
                    <span className={styles.separator} aria-hidden="true">
                      –
                    </span>
                  ) : null}
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <span className={styles.city}>
            {siteConfig.city}
            <span className={styles.cityGlyph} aria-hidden="true">
              ✦
            </span>
          </span>
          <Link href="/contacto" className={`btn ${styles.cta}`}>
            Solicita una cita
            <ArrowRight />
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
