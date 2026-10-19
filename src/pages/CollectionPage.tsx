import type { Look } from "../types/content";
import { BrandHero } from "../components/BrandHero";
import { CollectionGallery } from "../components/CollectionGallery";
import styles from "./CollectionPage.module.css";
export function CollectionPage({ onLook }: { onLook: (look: Look) => void }) {
  return (
    <>
      <h1 className={styles["sr-only"]}>The Barbino Maison collection</h1>
      <div className={styles["collection-page"] + " " + styles["dark"]}>
        <BrandHero collection />
        <div id="looks">
          <CollectionGallery onLook={onLook} />
        </div>
      </div>
    </>
  );
}
