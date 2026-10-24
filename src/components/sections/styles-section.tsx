import { siteConfig } from "@/config/site";
import styles from "./styles-section.module.css";

/** Los tres estilos de trabajo declarados por la artista. */
export function StylesSection() {
  return (
    <section className={styles.section} aria-labelledby="estilos-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.aside}>
          <p className="eyebrow">Estilos</p>
          <h2 id="estilos-title" className={styles.heading}>
            Tres maneras de dibujar sobre la piel
          </h2>
          <p className={styles.asideText}>
            Cada estilo responde a una intención distinta. Si dudas entre varios, se valora juntas
            en la solicitud de cita.
          </p>
        </div>

        <ul className={styles.list}>
          {siteConfig.styles.map((style, index) => (
            <li key={style.id} className={styles.item}>
              <div className={styles.itemHead}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.name}>{style.name}</h3>
              </div>
              <p className={styles.summary}>{style.summary}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
