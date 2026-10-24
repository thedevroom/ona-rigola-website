import Link from "next/link";
import { legalNavigation, mainNavigation, siteConfig } from "@/config/site";
import { StarGlyph, StatusDot } from "@/components/ui/icons";
import styles from "./footer.module.css";

export function SiteFooter() {
  const { contact } = siteConfig;

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.wordmark}>{siteConfig.wordmark}</p>
            <p className={styles.tagline}>{siteConfig.tagline}</p>
            <p className={styles.note}>
              {siteConfig.role} · {siteConfig.city}
            </p>
          </div>

          <nav aria-label="Explorar">
            <p className={styles.columnTitle}>Explorar</p>
            <ul className={styles.list}>
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <p className={styles.columnTitle}>Legal</p>
            <ul className={styles.list}>
              {legalNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={styles.columnTitle}>Contacto</p>
            <ul className={styles.list}>
              <li>
                <Link href="/contacto" className={styles.link}>
                  Solicitar una cita
                </Link>
              </li>
              {contact.email ? (
                <li>
                  <a href={`mailto:${contact.email}`} className={styles.link}>
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.phone ? (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className={styles.link}>
                    {contact.phone}
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
                    Instagram
                  </a>
                </li>
              ) : null}
              {!contact.email && !contact.phone && !contact.instagram ? (
                <li>
                  <p className={styles.note}>Los canales directos se publicarán al confirmarse.</p>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.signature}>
            <span>{siteConfig.wordmarkUpper}</span>
            <StarGlyph className={styles.signatureGlyph} size={13} />
            <span>{siteConfig.city}</span>
          </span>
          <span className={styles.copyright}>
            © {siteConfig.copyrightYear} {siteConfig.name}
          </span>
        </div>

        {siteConfig.contentStatus === "provisional" ? (
          <p className={styles.provisional}>
            <StatusDot aria-hidden="true" />
            Contenido provisional — pendiente de fotografías y datos reales
          </p>
        ) : null}
      </div>
    </footer>
  );
}
