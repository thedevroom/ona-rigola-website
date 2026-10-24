import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextPublishedWork, getWorkBySlug, works } from "@/content/works";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, buildBreadcrumbList } from "@/lib/seo";
import styles from "./detalle.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) {
    return buildPageMetadata({
      title: "Trabajo no encontrado",
      description: "La pieza solicitada no está disponible.",
      pathname: `/trabajos/${slug}`,
      noindex: true,
    });
  }

  const isSample = work.status === "muestra";

  return buildPageMetadata({
    title: `${work.title} — Tatuaje ${work.styleLabel.toLowerCase()}`,
    description: `${work.summary} Pieza de ${work.styleLabel.toLowerCase()} de Ona Rigola, tatuadora en Barcelona.`,
    pathname: `/trabajos/${work.slug}`,
    image: work.images[0]?.src,
    // Las muestras no se indexan como si fueran piezas reales.
    noindex: isSample,
  });
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) notFound();

  const isSample = work.status === "muestra";
  const nextWork = getNextPublishedWork(work.slug);
  const hasImages = work.images.length > 0;

  return (
    <>
      <nav aria-label="Migas de pan" className="container">
        <ol className={styles.breadcrumb}>
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li aria-hidden="true" className={styles.breadcrumbSeparator}>
            /
          </li>
          <li>
            <Link href="/trabajos">Trabajos</Link>
          </li>
          <li aria-hidden="true" className={styles.breadcrumbSeparator}>
            /
          </li>
          <li aria-current="page">{work.styleLabel}</li>
        </ol>
      </nav>

      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerTop}>
            <p className="eyebrow">Ficha de pieza</p>
          </div>

          <h1 className={styles.title}>{work.title}</h1>
          <p className={styles.lede}>{work.summary}</p>

          <dl className={styles.metaGrid}>
            <div>
              <dt className={styles.metaTerm}>Estilo</dt>
              <dd className={styles.metaValue}>{work.styleLabel}</dd>
            </div>
            <div>
              <dt className={styles.metaTerm}>Zona del cuerpo</dt>
              <dd className={styles.metaValue}>{work.bodyArea ?? "Por confirmar"}</dd>
            </div>
            <div>
              <dt className={styles.metaTerm}>Año</dt>
              <dd className={styles.metaValue}>{work.year ?? "—"}</dd>
            </div>
            <div>
              <dt className={styles.metaTerm}>Escala</dt>
              <dd className={styles.metaValue}>Dibujo a medida</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="pieza-contenido">
        <div className={`container ${styles.galleryLayout}`}>
          <div>
            <h2 id="pieza-contenido" className="visually-hidden">
              Imágenes y concepto de la pieza
            </h2>
            {hasImages ? (
              <div className={styles.gallery}>
                {work.images.map((image) => (
                  <div key={image.src} className={styles.galleryItem}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 68rem) 92vw, 42vw"
                      priority
                      className={styles.galleryImage}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.placeholder}>
                <p className={styles.placeholderText}>Fotografía pendiente</p>
              </div>
            )}

            <p className={styles.galleryNote}>
              {isSample
                ? "Imagen de muestra creada para la dirección de arte del sitio, pendiente de sustituir por la fotografía del trabajo real."
                : `Pieza realizada en ${siteConfig.city}.`}
            </p>
          </div>

          <aside className={styles.sidebar}>
            <p className="eyebrow">Concepto</p>
            <h2 className={styles.sidebarTitle}>Sobre esta pieza</h2>
            <p className={styles.bodyText}>{work.concept}</p>
            <Link href="/contacto" className="btn">
              Consultar un diseño
              <ArrowRight />
            </Link>
            <p className="label">
              {siteConfig.role} · {siteConfig.city}
            </p>
          </aside>
        </div>

        <div className="container">
          <div className={styles.navRow}>
            <div className={styles.navGroup}>
              <Link href="/trabajos" className="link-underline">
                Volver al portfolio
                <ArrowRight />
              </Link>
              {nextWork ? (
                <Link href={`/trabajos/${nextWork.slug}`} className="link-underline">
                  Siguiente pieza: {nextWork.title}
                  <ArrowRight />
                </Link>
              ) : null}
            </div>
            <Link href="/contacto" className="link-underline">
              Solicitar una cita
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <JsonLd
        id="ld-pieza"
        data={buildBreadcrumbList([
          { name: "Inicio", pathname: "/" },
          { name: "Trabajos", pathname: "/trabajos" },
          { name: work.title, pathname: `/trabajos/${work.slug}` },
        ])}
      />
    </>
  );
}
