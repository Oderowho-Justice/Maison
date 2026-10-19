import { useLayoutEffect, useRef } from "react";
import { gsap, revealText } from "../animations/gsap";
import { Picture } from "./Picture";
import styles from "./AtelierSection.module.css";
export function AtelierSection() {
  const root = useRef<HTMLDivElement>(null);
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
    <div
      ref={root}
      className={styles["service-story"] + " " + styles["wrap"]}
      id="craftsmanship"
    >
      <figure className={styles["atelier-card"]}>
        <span className={styles["eyebrow"]}>
          A CLOSER LOOK
          <br />
          THE ATELIER
        </span>
        <Picture
          name="sketch"
          alt="Close-up of a fashion sketch in progress"
          className={styles["oval"]}
        />
        <figcaption>
          From line to form
          <br />
          <a href="#/philosophy">OUR PHILOSOPHY ↗</a>
        </figcaption>
      </figure>
      <div className={styles["service-copy"]} data-reveal>
        <h2>
          The thinking behind
          <br />
          every garment
        </h2>
        <p>
          A silhouette starts long before it is worn. A sketch explores its
          proportions; fabric gives it weight and movement. Every detail is part
          of the whole.
        </p>
        <p>
          Our approach to clothing is rooted in attention: the balance of a
          shoulder, the line of a seam, the way a piece feels in motion.
          Craftsmanship is as much about the quiet details as the first
          impression.
        </p>
        <p>
          That conversation continues with the wearer. Thoughtful care helps
          preserve the shape, texture and character that drew you to a piece in
          the first place.
        </p>
      </div>
    </div>
  );
}
