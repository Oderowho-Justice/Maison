import { useEffect, useRef, type ReactNode } from "react";
import { trapDialogFocus } from "../utils/dialogFocus";
import styles from "./Modal.module.css";
export function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement;
    dialog.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={styles["modal"]}
      onKeyDown={trapDialogFocus}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-label={title}
    >
      <div className={styles["modal-inner"]}>
        <button
          className={styles["close"]}
          onClick={close}
          aria-label="Close dialog"
        >
          ×
        </button>
        <h2>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
