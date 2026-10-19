import { useLayoutEffect, useRef, useState } from "react";
import { gsap, revealText } from "../animations/gsap";
import { looks } from "../data/looks";
import type { Look } from "../types/content";
import { Picture } from "./Picture";
import { Arrow } from "./Arrow";
import styles from "./CollectionGallery.module.css";
export function CollectionGallery({
  onLook,
}: {
  onLook: (look: Look) => void;
}) {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        revealText(root.current!);
        root
          .current!.querySelectorAll("[data-look]")
          .forEach((element, index) =>
            gsap.from(element, {
              y: 25,
              opacity: 0,
              delay: index * 0.07,
              duration: 0.8,
              scrollTrigger: { trigger: element, start: "top 98%", once: true },
            }),
          );
      },
      root,
    );
    return () => media.revert();
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  function move(direction: number) {
    const track = ref.current!;
    const max = track.scrollWidth - track.clientWidth;
    const next =
      direction > 0 && track.scrollLeft >= max - 2
        ? 0
        : direction < 0 && track.scrollLeft <= 2
          ? max
          : track.scrollLeft + direction * track.clientWidth * 0.5;
    track.scrollTo({
      left: next,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section
      ref={root}
      className={styles["lookbook"]}
      aria-label="Collection lookbook"
    >
      <div
        className={styles["lookbook-track"]}
        data-lookbook-track
        ref={ref}
        onScroll={() =>
          setPosition(
            Math.round(
              (ref.current!.scrollLeft /
                Math.max(
                  1,
                  ref.current!.scrollWidth - ref.current!.clientWidth,
                )) *
                100,
            ),
          )
        }
      >
        {looks.map((look, i) => (
          <button
            key={look.name}
            className={styles["look"]}
            data-look
            onClick={() => onLook(look)}
            aria-label={`View look ${i + 1}: ${look.name}`}
          >
            <Picture
              name={look.image}
              alt={look.description}
              parallax={false}
            />
            <span className={styles["look-caption"]} data-look-caption>
              <span>
                0{i + 1} / {look.name}
              </span>
              <span>↗</span>
            </span>
          </button>
        ))}
      </div>
      <div className={styles["collection-notes"] + " " + styles["wrap"]}>
        <div data-reveal>
          <h2>
            The art of
            <br />
            black & white
          </h2>
          <p>
            Two colours. A world of possibilities.
            <br />
            The collection explores the dialogue between light and dark,
            softness and strength.
          </p>
          <p>
            Black gives a silhouette its intensity. White brings space, texture
            and light. Together, they let the cut speak.
          </p>
        </div>
        <div className={styles["gallery-side"]}>
          <div className={styles["gallery-controls"]}>
            <button aria-label="Previous looks" onClick={() => move(-1)}>
              <Arrow direction="left" />
            </button>
            <button aria-label="Next looks" onClick={() => move(1)}>
              <Arrow />
            </button>
          </div>
          <div className={styles["gallery-progress"]} aria-hidden="true">
            <span style={{ left: `${position * 0.65}%` }} />
          </div>
          <div className={styles["season"]} aria-hidden="true">
            <span>04</span>
            <div>
              looks
              <br />
              <small>ONE EXPRESSION</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
