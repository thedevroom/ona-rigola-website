import Link from "next/link";
import { legalNavigation, mainNavigation, siteConfig } from "@/config/site";
import { ArrowRight, StarGlyph } from "@/components/ui/icons";
import { FooterUtilities } from "./footer-utilities";
import styles from "./footer.module.css";

/**
 * Pie editorial.
 *
 * Tres franjas: cierre con la promesa de la marca y los índices del sitio, un
 * rótulo tipográfico a sangre y una línea final de servicio. La hora local y la
 * vuelta arriba viven en `FooterUtilities` (Client Component aislado).
 */
export function SiteFooter() {
  const { contact } = siteConfig;
  const hasDirectChannels = Boolean(contact.email || contact.phone || contact.instagram);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.lead}>
          <p className={styles.eyebrow}>
            <StarGlyph size={11} />
            Estudio independiente · {siteConfig.city}
          </p>

          <p className={styles.statement}>
            Pequeños trazos.
            <span className={styles.statementAccent}>Grandes historias.</span>
          </p>

          <Link href="/contacto" className={`link-underline ${styles.leadCta}`}>
            Solicita una cita
            <ArrowRight />
          </Link>
        </div>

        <div className={styles.columns}>
          <nav aria-label="Explorar" className={styles.column}>
            <p className={styles.columnHead}>
              <span className={styles.columnIndex}>01</span>
              Explorar
            </p>
            <ul className={styles.list}>
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal" className={styles.column}>
            <p className={styles.columnHead}>
              <span className={styles.columnIndex}>02</span>
              Legal
            </p>
            <ul className={styles.list}>
              {legalNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.column}>
            <p className={styles.columnHead}>
              <span className={styles.columnIndex}>03</span>
              Contacto
            </p>
            <ul className={styles.list}>
              <li>
                <Link href="/contacto" className={styles.link}>
                  <span>Formulario de cita</span>
                </Link>
              </li>
              {contact.email ? (
                <li>
                  <a href={`mailto:${contact.email}`} className={styles.link}>
                    <span>{contact.email}</span>
                  </a>
                </li>
              ) : null}
              {contact.phone ? (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className={styles.link}>
                    <span>{contact.phone}</span>
                  </a>
                </li>
              ) : null}
              {contact.instagram ? (
                <li>
                  <a
                    href={`https://www.instagram.com/${contact.instagram.replace(/^@/, "")}/`}
                    className={styles.link}
                    rel="noopener noreferrer me"
                    target="_blank"
                  >
                    <span>Instagram</span>
                  </a>
                </li>
              ) : null}
              {!hasDirectChannels ? (
                <li className={styles.note}>
                  Respondo personalmente a cada solicitud a través del formulario.
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.monogram} aria-hidden="true">
        <span className={styles.monogramWord}>Ona</span>
        <StarGlyph className={styles.monogramGlyph} size={48} />
        <span className={`${styles.monogramWord} ${styles.monogramItalic}`}>Rigola</span>
      </div>

      <div className={styles.baseline}>
        <div className={`container ${styles.baselineInner}`}>
          <p className={styles.signature}>
            <span>{siteConfig.wordmarkUpper}</span>
            <StarGlyph className={styles.signatureGlyph} size={12} />
            <span>{siteConfig.city}</span>
          </p>

          <FooterUtilities />

          <p className={styles.copyright}>
            © {siteConfig.copyrightYear} · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
