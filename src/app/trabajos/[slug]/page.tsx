import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextPublishedWork, getWorkBySlug, works } from "@/content/works";
import { siteConfig } from "@/config/site";
import { Notice } from "@/components/ui/notice";
import { ArrowRight, StarGlyph } from "@/components/ui/icons";
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

  const isDemo = work.status === "demostracion";

  return buildPageMetadata({
    title: isDemo ? `${work.title} (ficha de demostración)` : work.title,
    description: isDemo
      ? "Ficha de demostración de la plantilla de trabajos del portfolio. Todavía no incluye fotografías reales."
      : `${work.summary} Pieza de ${work.styleLabel.toLowerCase()} de Ona Rigola, tatuadora en Barcelona.`,
    pathname: `/trabajos/${work.slug}`,
    // Las fichas de demostración nunca se indexan.
    noindex: isDemo,
  });
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) notFound();

  const isDemo = work.status === "demostracion";
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
            {isDemo ? (
              <span className="pending-badge">Contenido de demostración</span>
            ) : (
              <span className="label">{work.year ?? "Barcelona"}</span>
            )}
          </div>

          <h1 className={styles.title}>{work.title}</h1>
          <p className={styles.lede}>
            {hasImages
              ? work.summary
              : "Esta ficha muestra la estructura con la que se presentará cada pieza: imágenes, concepto, estilo y zona del cuerpo."}
          </p>

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
              <dt className={styles.metaTerm}>Estado</dt>
              <dd className={styles.metaValue}>{isDemo ? "Demostración" : "Publicada"}</dd>
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
                      sizes="(max-width: 68rem) 90vw, 40vw"
                      className={styles.galleryImage}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.placeholder}>
                <StarGlyph size={22} />
                <p className={styles.placeholderText}>Fotografía real pendiente</p>
              </div>
            )}

            {isDemo ? (
              <div className={styles.fullNotice}>
                <Notice
                  eyebrow="Ficha de demostración"
                  title="Sin imágenes atribuidas a la artista"
                  link={{ href: "/contacto", label: "Consultar un diseño" }}
                >
                  Esta página documenta la plantilla de ficha de trabajo y no representa una pieza
                  real de Ona Rigola. Cuando existan fotografías de trabajos reales, aparecerán aquí
                  con su propio concepto y descripción.
                </Notice>
              </div>
            ) : null}
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
