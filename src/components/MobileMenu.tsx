import { useEffect, useRef } from "react";
import { gsap } from "../animations/gsap";
import { Brand } from "./Brand";
import { navigation } from "../data/navigation";
import type { PageRoute } from "../types/content";
import { trapDialogFocus } from "../utils/dialogFocus";
import styles from "./MobileMenu.module.css";
export function MobileMenu({
  route,
  onClose,
}: {
  route: PageRoute;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const motion = useRef<gsap.Context | null>(null);
  const closing = useRef(false);
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) onClose();
    else
      motion.current?.add(() => {
        gsap.to(dialog.current, {
          opacity: 0,
          duration: 0.2,
          onComplete: onClose,
        });
      });
  };
  useEffect(() => {
    const element = dialog.current!;
    const previous = document.activeElement as HTMLElement | null;
    element.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    motion.current = gsap.context(() => {
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        gsap.from(element.querySelectorAll("[data-menu-link]"), {
          y: 24,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
        });
      }
    }, element);
    return () => {
      motion.current?.revert();
      document.body.style.overflow = old;
      element.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      id="main-menu"
      aria-label="Main menu"
      onKeyDown={trapDialogFocus}
      className={styles["menu"]}
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className={styles["menu-top"]}>
        <Brand onNavigate={close} />
        <button className={styles["menu-toggle"]} onClick={close}>
          CLOSE <span>×</span>
        </button>
      </div>
      <nav aria-label="Main navigation">
        {navigation.map(({ route: path, label: name }, i) => (
          <a
            className={styles["menu-link"]}
            data-menu-link
            href={`#/${path}`}
            key={path}
            aria-current={route === path ? "page" : undefined}
            onClick={close}
          >
            <small>0{i + 1}</small>
            {name}
            <span>↗</span>
          </a>
        ))}
      </nav>
      <p className={styles["eyebrow"]}>BELLARO MILANO · A STUDY IN CONTRAST</p>
    </dialog>
  );
}
