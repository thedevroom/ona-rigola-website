import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { about } from "@/content/artist";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/ui/page-header";
import { BookingBand } from "@/components/sections/booking-band";
import { ArrowRight } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, buildBreadcrumbList } from "@/lib/seo";
import { profilePageSchema } from "@/lib/structured-data";
import styles from "@/components/sections/editorial.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Sobre mí — Tatuadora en Barcelona",
  description:
    "Conoce a Ona Rigola: su forma de dibujar, su filosofía de trabajo y cómo convierte una idea en una pieza de tatuaje personalizada en Barcelona.",
  pathname: "/sobre-mi",
  keywords: ["tatuadora en Barcelona", "artista del tatuaje Barcelona", "diseños personalizados"],
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sobre mí"
        index="Barcelona · ES"
        title={
          <>
            Dibujar despacio,
            <br />
            <span className="italic-accent">tatuar con intención.</span>
          </>
        }
        lede={about.lead}
      />

      <section className={styles.section} aria-labelledby="retrato-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.mediaColumn}>
            <div className={styles.imageWrap}>
              <Image
                src="/images/retrato/ona-rigola-retrato-editorial.jpg"
                alt="Retrato en blanco y negro de Ona Rigola mirando a cámara, con los tatuajes del brazo visibles"
                width={900}
                height={1200}
                sizes="(max-width: 68rem) 90vw, 34vw"
                priority
                className={styles.image}
              />
            </div>
            <p className={styles.caption}>
              <span>Ona Rigola</span>
              <span>{siteConfig.role}</span>
            </p>
          </div>

          <div className={styles.body}>
            <p className="eyebrow">Retrato</p>
            <h2 id="retrato-title" className={styles.bodyTitle}>
              El dibujo antes que la aguja
            </h2>
            <div className={styles.paragraphs}>
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className={styles.ctaRow}>
              <Link href="/trabajos" className="link-underline">
                Ver el portfolio
                <ArrowRight />
              </Link>
              <Link href="/contacto" className="link-underline">
                Solicitar una cita
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.quoteBand} aria-labelledby="filosofia-page-title">
        <div className={`container ${styles.quoteLayout}`}>
          <p className="eyebrow" id="filosofia-page-title">
            Filosofía
          </p>
          <div>
            <blockquote className={styles.quoteText}>{about.philosophy.quote}</blockquote>
            {about.philosophy.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.quoteBody}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="influencias-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.body}>
            <p className="eyebrow">Influencias</p>
            <h2 id="influencias-title" className={styles.bodyTitle}>
              Lo que alimenta el dibujo
            </h2>
            <div className={styles.paragraphs}>
              <p>
                La mirada de Ona Rigola se construye desde referentes gráficos y editoriales que
                influyen en la composición de cada pieza.
              </p>
            </div>
            <ul className={styles.plainList}>
              {about.influences.items.map((item, index) => (
                <li key={item}>
                  <span className={styles.plainListIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className={styles.note}>{about.influences.note}</p>
          </div>

          <div className={styles.board}>
            <span className={styles.boardGlyph} aria-hidden="true">
              ✦
            </span>
            <p className={styles.boardQuote}>
              Prefiero una línea que respire a una acumulación de detalles.
            </p>
            <p className={styles.boardFooter}>
              <span>Ona Rigola</span>
              <span aria-hidden="true">Barcelona</span>
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="metodo-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.body}>
            <p className="eyebrow">Método</p>
            <h2 id="metodo-title" className={styles.bodyTitle}>
              {about.approach.title}
            </h2>
            <p className={styles.note}>
              Cada proyecto se revisa antes de la sesión para que el diseño final sea el que
              esperabas.
            </p>
          </div>
          <div className={styles.rows}>
            {about.approach.steps.map((step, index) => (
              <div key={step.title} className={styles.row}>
                <span className={styles.rowIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.rowTitle}>{step.title}</h3>
                <p className={styles.rowText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingBand />

      <JsonLd
        id="ld-profile"
        data={[
          profilePageSchema("/sobre-mi"),
          buildBreadcrumbList([
            { name: "Inicio", pathname: "/" },
            { name: "Sobre mí", pathname: "/sobre-mi" },
          ]),
        ]}
      />
    </>
  );
}
