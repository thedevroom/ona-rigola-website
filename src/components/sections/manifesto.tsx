import Image from "next/image";
import Link from "next/link";
import { about } from "@/content/artist";
import { ArrowRight } from "@/components/ui/icons";
import styles from "./manifesto.module.css";

/** Bloque de filosofía con retrato editorial y cita tipográfica. */
export function Manifesto() {
  return (
    <section className={styles.section} aria-labelledby="filosofia-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.mediaColumn}>
          <div className={styles.imageWrap}>
            <Image
              src="/images/retrato/ona-rigola-retrato-editorial.jpg"
              alt="Ona Rigola posando de frente, en blanco y negro, con un tatuaje ornamental visible en el brazo"
              width={900}
              height={1200}
              sizes="(max-width: 68rem) 90vw, 34vw"
              className={styles.image}
            />
          </div>
          <p className={styles.caption}>
            <span>Ona Rigola</span>
            <span aria-hidden="true">Barcelona</span>
          </p>
        </div>

        <div className={styles.content}>
          <p className="eyebrow">Filosofía</p>
          <h2 id="filosofia-title" className={styles.quote}>
            {about.philosophy.quote}
          </h2>
          <div className={styles.text}>
            {about.philosophy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link href="/sobre-mi" className={`link-underline ${styles.link}`}>
            Conocer a la artista
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
