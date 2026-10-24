import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { homeIntro } from "@/content/artist";
import { ArrowRight, StarGlyph, StatusDot } from "@/components/ui/icons";
import styles from "./hero.module.css";

/**
 * Primera pantalla editorial: retrato de marca + titular tipográfico.
 * Server Component; toda la interacción son dos enlaces.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`}>
            <StatusDot className={styles.eyebrowDot} />
            {siteConfig.role} <span aria-hidden="true">—</span> {siteConfig.city}
          </p>

          <h1 id="hero-title" className={styles.title}>
            <span className={styles.titleLine} aria-hidden="true">
              Ona
            </span>
            <span className={`${styles.titleLine} ${styles.titleLineItalic}`} aria-hidden="true">
              Rigola
            </span>
            <span className="visually-hidden">
              Ona Rigola, tatuadora de línea fina en Barcelona
            </span>
          </h1>

          <p className={styles.mobileRole}>
            {siteConfig.roleShort} <span aria-hidden="true">·</span> {siteConfig.city}
          </p>

          <StarGlyph className={styles.mobileStar} size={22} />

          <p className={styles.mobileTagline}>{siteConfig.tagline}</p>

          <ul className={styles.styles} aria-label="Estilos de tatuaje">
            {siteConfig.styles.map((style, index) => (
              <li key={style.id} className={styles.styleItem}>
                <span className={styles.styleIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {style.name}
              </li>
            ))}
          </ul>

          <p className={styles.intro}>{homeIntro[0]}</p>

          <div className={styles.actions}>
            <Link href="/contacto" className="btn">
              Solicita una cita
              <ArrowRight />
            </Link>
            <Link href="/trabajos" className="link-underline">
              Ver trabajos seleccionados
              <ArrowRight />
            </Link>
          </div>
        </div>

        <figure className={styles.media}>
          <div className={styles.mediaPlate}>
            <span className={styles.index} aria-hidden="true">
              01 / 04
            </span>
            <div className={styles.imageWrap}>
              <Image
                src="/images/retrato/ona-rigola-retrato-principal.jpg"
                alt="Retrato en blanco y negro de Ona Rigola, tatuadora, con el cabello suelto y un tatuaje floral en el brazo"
                width={900}
                height={1200}
                priority
                fetchPriority="high"
                sizes="(max-width: 68rem) 100vw, 46vw"
                className={styles.image}
              />
            </div>
          </div>
          <figcaption className={styles.caption}>
            <span>Ona Rigola</span>
            <span aria-hidden="true">Barcelona</span>
          </figcaption>
        </figure>
      </div>

      <div className="container">
        <div className={styles.footer}>
          <span className={styles.scroll}>
            Scroll
            <span className={styles.scrollLine} aria-hidden="true" />
          </span>
        </div>
      </div>
    </section>
  );
}
