import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { faqItems } from "@/content/faq";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, buildBreadcrumbList } from "@/lib/seo";
import styles from "./faq.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Preguntas frecuentes",
  description:
    "Dudas habituales antes de tatuarse en Barcelona: cómo solicitar cita, qué referencias enviar, cómo se define el tamaño, preparación de la sesión y cuidados posteriores.",
  pathname: "/preguntas-frecuentes",
  keywords: [
    "preguntas frecuentes tatuajes",
    "cómo pedir cita tatuaje",
    "cuidados tatuaje",
    "tatuaje Barcelona dudas",
  ],
});

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: siteConfig.language,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <PageHeader
        eyebrow="Preguntas frecuentes"
        index={`${faqItems.length} preguntas`}
        title={
          <>
            Todo lo que conviene
            <br />
            <span className="italic-accent">saber antes.</span>
          </>
        }
        lede="Respuestas claras para reducir dudas antes de enviar una solicitud de cita."
      />

      <section className={styles.section} aria-labelledby="lista-preguntas">
        <div className={`container ${styles.layout}`}>
          <div className={styles.aside}>
            <p className="eyebrow">Antes de reservar</p>
            <h2 id="lista-preguntas" className={styles.asideTitle}>
              Dudas razonables, respuestas honestas
            </h2>
            <p className={styles.asideText}>
              Si tu pregunta no aparece aquí, escríbeme a través del formulario: forma parte del
              proceso, no una molestia.
            </p>
            <Link href="/contacto" className="btn">
              Solicitar una cita
              <ArrowRight />
            </Link>
          </div>

          <div className={styles.list}>
            {faqItems.map((item, index) => (
              <article key={item.id} className={styles.item} id={item.id}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.content}>
                  <h3 className={styles.question}>{item.question}</h3>
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <JsonLd id="ld-faq" data={faqSchema} />
      <JsonLd
        id="ld-faq-breadcrumb"
        data={buildBreadcrumbList([
          { name: "Inicio", pathname: "/" },
          { name: "Preguntas frecuentes", pathname: "/preguntas-frecuentes" },
        ])}
      />
    </>
  );
}
