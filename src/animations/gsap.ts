import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
// Shared reveal timing; each section creates and reverts its own scoped matchMedia context.
export function revealText(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) =>
    gsap.from(element.children.length > 1 ? element.children : element, {
      y: 24,
      opacity: 0,
      stagger: 0.09,
      duration: 0.85,
      ease: "power2.out",
      scrollTrigger: { trigger: element, start: "top 94%", once: true },
    }),
  );
}
