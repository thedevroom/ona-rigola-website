import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import styles from "./notice.module.css";

type NoticeProps = {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  link?: { href: string; label: string };
};

/** Aviso editorial para estados provisionales y estados vacíos. */
export function Notice({ eyebrow, title, children, link }: NoticeProps) {
  return (
    <div className={styles.notice} role="note">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.body}>
        <p className={styles.text}>{children}</p>
        {link ? (
          <Link href={link.href} className={styles.link}>
            {link.label}
            <ArrowRight className="visually-hidden" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
