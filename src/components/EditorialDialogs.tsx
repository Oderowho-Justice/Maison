import type { Look } from "../types/content";
import { looks } from "../data/looks";
import { Picture } from "./Picture";
import { EditorialImage } from "./EditorialImage";
import { Modal } from "./Modal";
import styles from "./EditorialDialogs.module.css";
export function EditorialDialogs({
  selected,
  showSaved,
  showCraft,
  saved,
  setSelected,
  setShowSaved,
  setShowCraft,
  toggleSaved,
}: {
  selected: Look | null;
  showSaved: boolean;
  showCraft: boolean;
  saved: string[];
  setSelected: (look: Look | null) => void;
  setShowSaved: (open: boolean) => void;
  setShowCraft: (open: boolean) => void;
  toggleSaved: (name: string) => void;
}) {
  return (
    <>
      {selected && (
        <Modal title={selected.name} close={() => setSelected(null)}>
          <Picture
            name={selected.image}
            alt={selected.description}
            parallax={false}
            className={styles["detail-photo"]}
            sizes="(max-width: 700px) 78vw, 590px"
          />
          <p>{selected.description}</p>
          <button
            className={styles["button"]}
            onClick={() => toggleSaved(selected.name)}
            aria-pressed={saved.includes(selected.name)}
          >
            {saved.includes(selected.name)
              ? "REMOVE FROM SAVED LOOKS −"
              : "SAVE THIS LOOK ♡"}
          </button>
          <p className={styles["small-note"]}>
            An editorial lookbook. Product availability and purchasing details
            are not listed here.
          </p>
        </Modal>
      )}
      {showSaved && (
        <Modal title="Your saved looks" close={() => setShowSaved(false)}>
          {saved.length ? (
            <div className={styles["saved-grid"]}>
              {looks
                .filter((l) => saved.includes(l.name))
                .map((l) => (
                  <div key={l.name}>
                    <button
                      className={styles["saved-look"]}
                      onClick={() => {
                        setShowSaved(false);
                        setSelected(l);
                      }}
                    >
                      <EditorialImage
                        name={l.image}
                        alt={l.description}
                        sizes="(max-width: 700px) 35vw, 280px"
                      />
                      <span>{l.name} ↗</span>
                    </button>
                    <button
                      className={styles["text-link"]}
                      onClick={() => toggleSaved(l.name)}
                    >
                      Remove {l.name}
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <>
              <p>
                A place for the silhouettes that stay with you. Open a look in
                the collection and select “Save this look”.
              </p>
              <a
                className={styles["button"]}
                href="#/collection/looks"
                onClick={() => setShowSaved(false)}
              >
                EXPLORE THE LOOKBOOK ↗
              </a>
            </>
          )}
        </Modal>
      )}
      {showCraft && (
        <Modal
          title="From sketch to silhouette"
          close={() => setShowCraft(false)}
        >
          <Picture
            name="craft"
            alt="Fabric being cut in the atelier"
            className={styles["detail-photo"]}
            sizes="(max-width: 700px) 78vw, 590px"
            parallax={false}
          />
          <p>
            A garment is a sequence of decisions: proportion, fabric, cut and
            finish. Each contributes to the relationship between structure and
            movement.
          </p>
          <a
            className={styles["text-link"]}
            href="#/service/care"
            onClick={() => setShowCraft(false)}
          >
            EXPLORE GARMENT CARE ↗
          </a>
        </Modal>
      )}
    </>
  );
}
