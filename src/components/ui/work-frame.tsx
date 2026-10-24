import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/content/works";
import { ArrowRight, StarGlyph } from "@/components/ui/icons";
import styles from "./work-frame.module.css";

type Aspect = "portrait" | "tall" | "square" | "wide";

type WorkFrameProps = {
  work: Work;
  index: number;
  aspect?: Aspect;
  sizes: string;
  priority?: boolean;
  /** Enlace a la ficha individual. Solo se usa para piezas publicadas. */
  linkToWork?: boolean;
};

/**
 * Pieza del portfolio.
 *
 * - Con imágenes reales: imagen optimizada + título + estilo + enlace a ficha.
 * - Sin imágenes (fichas de demostración): marco vacío diseñado, sin simular
 *   una fotografía que no existe.
 */
export function WorkFrame({
  work,
  index,
  aspect = "portrait",
  sizes,
  priority = false,
  linkToWork = false,
}: WorkFrameProps) {
  const hasImages = work.images.length > 0;
  const firstImage = work.images[0];
  const number = String(index + 1).padStart(2, "0");

  const media = (
    <div className={styles.media} data-aspect={aspect}>
      {hasImages && firstImage ? (
        <Image
          src={firstImage.src}
          alt={firstImage.alt}
          width={firstImage.width}
          height={firstImage.height}
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
      ) : (
        <div className={styles.placeholder}>
          <StarGlyph className={styles.placeholderGlyph} size={18} />
          <span className={styles.placeholderText}>Fotografía pendiente</span>
        </div>
      )}
    </div>
  );

  const meta = (
    <div className={styles.meta}>
      <span className={styles.metaLeft}>
        <span className={styles.index} aria-hidden="true">
          {number}
        </span>
        <span className={styles.title}>
          {hasImages ? work.title : `${work.styleLabel} · por publicar`}
        </span>
      </span>
      {hasImages ? (
        <span className={styles.styleLabel}>{work.styleLabel}</span>
      ) : (
        <span className={styles.pendingTag}>Reservado</span>
      )}
    </div>
  );

  if (hasImages && linkToWork) {
    return (
      <Link
        href={`/trabajos/${work.slug}`}
        className={styles.link}
        aria-label={`Ver la pieza ${work.title}`}
      >
        {media}
        {meta}
      </Link>
    );
  }

  return (
    <figure className={styles.frame} aria-label={hasImages ? work.title : undefined}>
      {media}
      <figcaption>{meta}</figcaption>
    </figure>
  );
}

/** Enlace editorial reutilizable hacia el portfolio. */
export function PortfolioLink({ label = "Ver todos los trabajos" }: { label?: string }) {
  return (
    <Link href="/trabajos" className="link-underline">
      {label}
      <ArrowRight />
    </Link>
  );
}
