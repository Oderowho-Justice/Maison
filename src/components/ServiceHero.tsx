import { Picture } from "./Picture";
import { AtelierSection } from "./AtelierSection";
import styles from "./ServiceHero.module.css";
export function ServiceHero({ openCraft }: { openCraft: () => void }) {
  return (
    <section className={styles["service-stage"] + " " + styles["dark"]}>
      <Picture
        name="service"
        alt="White textured fashion ensemble, styled with sculptural sunglasses"
        className={styles["service-campaign"] + " " + styles["oval"]}
        parallax={false}
      />
      <div className={styles["service-nav"] + " " + styles["wrap"]}>
        <p>Customer service</p>
        <nav aria-label="Customer service topics">
          <a href="#/service/delivery">ORDER INFORMATION</a>
          <a href="#/service/care">GARMENT CARE</a>
          <a href="#/service/contact">GET IN TOUCH</a>
        </nav>
      </div>
      <h1 className={styles["service-title"]}>
        <span>CUSTOMER</span>
        <span>SERVICE</span>
      </h1>
      <div className={styles["craft-film"]}>
        <Picture
          name="craft"
          alt="Atelier hands cutting dark fabric"
          className={styles["oval"]}
        />
        <button
          onClick={openCraft}
          aria-label="Read about the making of a garment"
        >
          ↗
        </button>
      </div>
      <AtelierSection />
    </section>
  );
}
