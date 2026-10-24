import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, StarGlyph } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o ha cambiado de dirección.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className={styles.section} aria-labelledby="notfound-title">
      <div className={`container ${styles.layout}`}>
        <p className="eyebrow">Error 404</p>
        <div className={styles.body}>
          <StarGlyph className={styles.glyph} size={20} />
          <h1 id="notfound-title" className={styles.title}>
            Esta página
            <br />
            <span className="italic-accent">no existe.</span>
          </h1>
          <p className={styles.text}>
            Puede que el enlace esté mal escrito o que la página haya cambiado de dirección. El
            trabajo de {siteConfig.name} sigue disponible desde el inicio.
          </p>
          <div className={styles.actions}>
            <Link href="/" className="btn">
              Volver al inicio
              <ArrowRight />
            </Link>
            <Link href="/trabajos" className="link-underline">
              Ver los trabajos
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
