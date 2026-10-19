import { useLayoutEffect, useRef } from "react";
import { gsap, revealText } from "../animations/gsap";
import { Picture } from "./Picture";
import styles from "./BrandHero.module.css";
export function BrandHero({ collection = false }: { collection?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        revealText(root.current!);
      },
      root,
    );
    return () => media.revert();
  }, []);
  return (
    <section
      ref={root}
      className={[
        styles.maison,
        collection ? styles["collection-maison"] : "",
      ].join(" ")}
      aria-labelledby="maison-title"
    >
      <div className={styles["maison-curve"]} />
      <h2 id="maison-title" className={styles["maison-word"]}>
        MAISON
      </h2>
      <div className={styles["maison-content"] + " " + styles["wrap"]}>
        <div className={styles["maison-copy"]} data-reveal>
          {collection ? (
            <>
              <p>
                There is no single way to be yourself. A wardrobe can hold every
                mood, every contrast, every possibility.
              </p>
              <p>
                Discover silhouettes that leave room for your own expression.
              </p>
              <span
                className={styles["eyebrow"] + " " + styles["atelier-credit"]}
              >
                THE COLLECTION
                <br />
                BARBINO MAISON
              </span>
            </>
          ) : (
            <>
              <h3>
                A distinct
                <br />
                point of view
              </h3>
              <p>
                Beyond a uniform. Beyond the expected. Individuality is the
                starting point.
              </p>
              <p>
                From a precise cropped line to a sweeping full-length
                silhouette, contrast gives each look its character.
              </p>
              <a className={styles["button"]} href="#/collection">
                EXPLORE THE COLLECTION <span>↗</span>
              </a>
            </>
          )}
        </div>
        <Picture
          name={collection ? "collection" : "atelier"}
          alt={
            collection
              ? "Sculptural black evening look with strong shoulders"
              : "Atelier designer working on a black garment"
          }
          className={styles["oval"] + " " + styles["maison-photo"]}
        />
        <div
          className={styles["maison-copy"] + " " + styles["right-story"]}
          data-reveal
        >
          {collection ? (
            <>
              <h3>
                A distinct
                <br />
                point of view
              </h3>
              <p>
                Bold proportions. Considered details. A collection shaped around
                individual expression.
              </p>
              <p>
                Explore the interplay of sculptural tailoring and fluid,
                full-length forms.
              </p>
              <a className={styles["button"]} href="#/collection/looks">
                VIEW THE LOOKBOOK <span>↗</span>
              </a>
            </>
          ) : (
            <>
              <p>
                A woman is never just one thing. Neither is the way she chooses
                to dress.
              </p>
              <p>
                Our design language makes space for that freedom: expressive,
                assured and entirely your own.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
