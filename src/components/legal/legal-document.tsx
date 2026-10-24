import Link from "next/link";
import type { LegalDocument } from "@/content/legal";
import { legalReviewNotice } from "@/content/legal";
import { ArrowRight, StatusDot } from "@/components/ui/icons";
import styles from "./legal-document.module.css";

/**
 * Renderiza los fragmentos marcados como pendientes (`[[ … ]]`) de forma
 * visible, para que ningún dato inventado pueda pasar desapercibido.
 */
function renderWithPendingFields(text: string) {
  const parts = text.split(/(\[\[.+?\]\])/g);
  return parts.map((part, index) => {
    if (part.startsWith("[[") && part.endsWith("]]")) {
      return (
        <span
          key={`${part}-${index}`}
          className="pending-field"
          title="Dato pendiente de completar por la titular"
        >
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function slugifyHeading(heading: string): string {
  return heading
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  const sections = document.sections.map((section) => ({
    ...section,
    id: slugifyHeading(section.heading),
  }));

  return (
    <article>
      <header className={styles.pageHeader}>
        <div className="container">
          <div className={styles.pageHeaderTop}>
            <p className="eyebrow">
              <StatusDot />
              Información legal
            </p>
            <span className="label">Última revisión: {document.updatedAt}</span>
          </div>
          <h1 className={styles.pageTitle}>{document.title}</h1>
          <p className={styles.pageIntro}>{document.intro}</p>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="contenido-legal">
        <div className={`container ${styles.layout}`}>
          <aside className={styles.aside}>
            <h2 id="contenido-legal" className={styles.asideTitle}>
              Contenido
            </h2>
            <nav aria-label="Índice del documento">
              <ol className={styles.toc}>
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className={styles.tocLink}>
                      <span className={styles.tocIndex} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <p className={styles.reviewNotice}>{legalReviewNotice}</p>
            <Link href="/contacto" className="link-underline">
              Contactar
              <ArrowRight />
            </Link>
          </aside>

          <div className={styles.sections}>
            {sections.map((section) => (
              <section key={section.id} id={section.id} className={styles.sectionBlock}>
                <h2 className={styles.heading}>{section.heading}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.id}-${index}`} className={styles.paragraph}>
                    {renderWithPendingFields(paragraph)}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
