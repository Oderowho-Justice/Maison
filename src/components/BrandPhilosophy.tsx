import { useLayoutEffect, useRef } from "react";
import { gsap, revealText } from "../animations/gsap";
import { Picture } from "./Picture";
import styles from "./BrandPhilosophy.module.css";
export function BrandPhilosophy() {
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
      className={styles["philosophy"] + " " + styles["wrap"]}
      aria-labelledby="philosophy-title"
    >
      <h1 id="philosophy-title" data-reveal>
        <span>Philosophy</span>
        <span>of the brand</span>
      </h1>
      <p className={styles["intro-note"]} data-reveal>
        Barbino Maison celebrates the woman at the centre of her own story — her
        confidence, her strength and her individuality.
      </p>
      <figure className={styles["founder"]}>
        <Picture
          name="designer"
          alt="Designer considering the shape of a garment in the atelier"
          className={styles["oval"]}
        />
        <figcaption>
          <span className={styles["eyebrow"]}>
            THE ATELIER
            <br />
            BARBINO MAISON
            <br />
            <br />
            DESIGN & EXPRESSION
          </span>
          <span>
            A considered silhouette
            <br />
            <a href="#/service/craftsmanship">EXPLORE OUR APPROACH ↗</a>
          </span>
        </figcaption>
      </figure>
      <div className={styles["philosophy-copy"]} data-reveal>
        <p>
          It begins with a line. A fabric’s weight, the way it falls, the space
          between a garment and the body. Our design philosophy brings these
          details into focus.
        </p>
        <p>
          Barbino Maison is a conversation between elegance and edge. Clothes to
          interpret in your own way, with a silhouette that feels unmistakably
          yours.
        </p>
      </div>
      <Picture
        name="sketch"
        alt="Hands drawing a fashion sketch"
        className={styles["oval"] + " " + styles["sketch"]}
      />
      <p className={styles["closing-note"]} data-reveal>
        A considered cut follows the body without defining the person.
        Structure, movement and a sense of ease belong together.
      </p>
    </section>
  );
}
