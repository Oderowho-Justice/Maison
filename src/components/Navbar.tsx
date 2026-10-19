import { useState } from "react";
import type { PageRoute } from "../types/content";
import { Brand } from "./Brand";
import { MobileMenu } from "./MobileMenu";
import styles from "./Navbar.module.css";
export function Navbar({
  route,
  saved,
  openSaved,
}: {
  route: PageRoute;
  saved: number;
  openSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header
        className={[
          styles.header,
          route === "service" ? styles.service : "",
        ].join(" ")}
      >
        <Brand />
        <nav className={styles["header-actions"]} aria-label="Quick links">
          <a
            className={styles["icon-button"]}
            href="#/service/care"
            aria-label="Garment care"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 10C4 4 13 1 13 8c6-5 10 4 3 5 6 6-4 10-5 3-6 5-10-4-3-5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
          </a>
          <button
            className={styles["icon-button"]}
            aria-label={`Saved looks (${saved})`}
            onClick={openSaved}
          >
            ♡
            {saved > 0 && (
              <span className={styles["saved-count"]}>{saved}</span>
            )}
          </button>
          <button
            className={styles["menu-toggle"]}
            aria-expanded={open}
            aria-controls="main-menu"
            onClick={() => setOpen(true)}
          >
            MENU <span>+</span>
          </button>
        </nav>
      </header>
      {open && (
        <MobileMenu
          route={route}
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
