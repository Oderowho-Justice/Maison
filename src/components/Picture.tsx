import { useLayoutEffect, useRef } from "react";
import { gsap } from "../animations/gsap";
import type { ImageName } from "../types/content";
import { EditorialImage } from "./EditorialImage";
import styles from "./Picture.module.css";
export function Picture({
  name,
  alt,
  className = "",
  parallax = true,
  sizes,
}: {
  name: ImageName;
  alt: string;
  className?: string;
  parallax?: boolean;
  sizes?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!parallax) return;
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.fromTo(
          root.current!.querySelector("img"),
          { yPercent: -2, scale: 1.055 },
          {
            yPercent: 2,
            scale: 1.055,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      },
      root,
    );
    return () => media.revert();
  }, [parallax]);
  return (
    <div
      className={[styles.picture, className].join(" ")}
      ref={root}
      data-picture
      data-parallax={parallax || undefined}
    >
      <EditorialImage name={name} alt={alt} sizes={sizes} />
    </div>
  );
}
