import { Brand } from "./Brand";
import { navigation } from "../data/navigation";
import styles from "./Footer.module.css";
export function Footer() {
  return (
    <footer className={styles["footer"]}>
      <Brand className={styles.brand} />
      <nav aria-label="Footer navigation">
        {navigation.map(({ route, footerLabel }) => (
          <a href={`#/${route}`} key={route}>
            {footerLabel}
          </a>
        ))}
        <a href="#/service/care">Garment care</a>
      </nav>
      <div className={styles["footer-meta"]}>
        <span className={styles["eyebrow"]}>BARBINO MAISON</span>
        <p className={styles["footer-credit"]}>
          Built by <a href="https://astonesoft.com">Astonesoft</a>
        </p>
      </div>
    </footer>
  );
}
