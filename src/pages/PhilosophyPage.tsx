import type { Look } from "../types/content";
import { BrandPhilosophy } from "../components/BrandPhilosophy";
import { BrandHero } from "../components/BrandHero";
import { CollectionGallery } from "../components/CollectionGallery";
import styles from "./PhilosophyPage.module.css";
export function PhilosophyPage({ onLook }: { onLook: (look: Look) => void }) {
  return (
    <>
      <BrandPhilosophy />
      <div className={styles["barbino-word"]} aria-hidden="true">
        BARBINO
      </div>
      <div className={styles["editorial"]}>
        <BrandHero />
        <CollectionGallery onLook={onLook} />
      </div>
    </>
  );
}
