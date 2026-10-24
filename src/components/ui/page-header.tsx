import { StatusDot } from "@/components/ui/icons";
import styles from "./page-header.module.css";

type PageHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  index?: string;
};

/** Cabecera editorial reutilizable para páginas interiores. */
export function PageHeader({ eyebrow, title, lede, index }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.top}>
          <p className="eyebrow">
            <StatusDot />
            {eyebrow}
          </p>
          <span className="label">{index ?? "Barcelona · ES"}</span>
        </div>

        <div className={styles.layout}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{title}</h1>
          </div>
          <div>
            <p className={styles.lede}>{lede}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
