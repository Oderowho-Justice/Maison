import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";
import imageManifest from "./image-manifest.json";

gsap.registerPlugin(ScrollTrigger);
const looks = [
  {
    image: "look-01",
    name: "Soft structure",
    description:
      "A textured white jacket brings a gentle volume to a sharply defined silhouette.",
  },
  {
    image: "look-02",
    name: "After hours",
    description:
      "A black halter neckline and a long, fluid line. An exploration of simplicity and presence.",
  },
  {
    image: "look-03",
    name: "In motion",
    description:
      "White fabric falls in generous folds, balancing sculptural volume with ease.",
  },
  {
    image: "look-04",
    name: "A different angle",
    description:
      "Sculptural black tailoring and flowing proportions create a confident, graphic line.",
  },
];
type Look = (typeof looks)[number];
const imageSizes: Record<string, string> = {
  designer: "(max-width: 700px) 44vw, (min-width: 1675px) 460px, 28vw",
  sketch: "(max-width: 700px) 29vw, (min-width: 1675px) 290px, 18vw",
  atelier: "(max-width: 700px) 46vw, (min-width: 1675px) 480px, 29vw",
  collection: "(max-width: 700px) 47vw, (min-width: 1675px) 535px, 32vw",
  service: "(max-width: 700px) 88vw, 62vw",
  craft: "(max-width: 700px) 39vw, (max-width: 1100px) 235px, 280px",
};
function EditorialImage({
  name,
  alt,
  sizes,
}: {
  name: string;
  alt: string;
  sizes?: string;
}) {
  const asset = imageManifest[name as keyof typeof imageManifest];
  const fallback =
    asset.variants.find((v) => v.width >= 768) || asset.variants.at(-1)!;
  return (
    <img
      src={fallback.src}
      srcSet={asset.variants.map((v) => `${v.src} ${v.width}w`).join(", ")}
      sizes={sizes || imageSizes[name] || "(max-width: 700px) 64vw, 27.5vw"}
      width={asset.width}
      height={asset.height}
      alt={alt}
      decoding="async"
    />
  );
}
function Picture({
  name,
  alt,
  className = "",
  parallax = true,
}: {
  name: string;
  alt: string;
  className?: string;
  parallax?: boolean;
}) {
  return (
    <div
      className={`picture ${className}`}
      data-parallax={parallax || undefined}
    >
      <EditorialImage
        name={name}
        alt={alt}
        sizes={
          className.includes("detail-photo")
            ? "(max-width: 700px) 78vw, 590px"
            : undefined
        }
      />
    </div>
  );
}
function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <a
      className="brand"
      href="#/philosophy"
      onClick={onNavigate}
      aria-label="Barbino Maison home"
    >
      <strong>BARBINO™</strong>
      <span>MAISON</span>
    </a>
  );
}
function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={direction === "left" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function trapDialogFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const dialog = event.currentTarget;
  const controls = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), summary, [tabindex="0"]',
    ),
  ).filter((el) => el.getClientRects().length > 0);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (!first) {
    event.preventDefault();
    return;
  }
  if (
    event.shiftKey &&
    (document.activeElement === first ||
      !dialog.contains(document.activeElement))
  ) {
    event.preventDefault();
    last.focus();
  } else if (
    !event.shiftKey &&
    (document.activeElement === last ||
      !dialog.contains(document.activeElement))
  ) {
    event.preventDefault();
    first.focus();
  }
}
function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: React.ReactNode;
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
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
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
      <div className="modal-inner">
        <button className="close" onClick={close} aria-label="Close dialog">
          ×
        </button>
        <h2>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
function Header({
  route,
  saved,
  openSaved,
}: {
  route: string;
  saved: number;
  openSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const close = () => {
    const finish = () => {
      setOpen(false);
      dialog.current?.close();
      toggle.current?.focus();
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else
      gsap.to(dialog.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: finish,
      });
  };
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const context = gsap.context(() => {
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(
          dialog.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25 },
        );
        gsap.from(".menu-link", {
          y: 24,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
        });
      }
    });
    return () => {
      context.revert();
      document.body.style.overflow = old;
    };
  }, [open]);
  return (
    <>
      <header className="header">
        <Brand />
        <nav className="header-actions" aria-label="Quick links">
          <a
            className="icon-button"
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
            className="icon-button"
            aria-label={`Saved looks (${saved})`}
            onClick={openSaved}
          >
            ♡{saved > 0 && <span className="saved-count">{saved}</span>}
          </button>
          <button
            className="menu-toggle"
            ref={toggle}
            aria-expanded={open}
            aria-controls="main-menu"
            onClick={() => setOpen(true)}
          >
            MENU <span>+</span>
          </button>
        </nav>
      </header>
      <dialog
        id="main-menu"
        aria-label="Main menu"
        onKeyDown={trapDialogFocus}
        className="menu"
        ref={dialog}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <div className="menu-top">
          <Brand onNavigate={close} />
          <button className="menu-toggle" onClick={close}>
            CLOSE <span>×</span>
          </button>
        </div>
        <nav aria-label="Main navigation">
          {[
            ["philosophy", "Our philosophy"],
            ["collection", "The collection"],
            ["service", "Customer service"],
          ].map(([path, name], i) => (
            <a
              className="menu-link"
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
        <p className="eyebrow">BARBINO MAISON · A STUDY IN CONTRAST</p>
      </dialog>
    </>
  );
}
function Gallery({ onLook }: { onLook: (look: Look) => void }) {
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
    <section className="lookbook" aria-label="Collection lookbook">
      <div
        className="lookbook-track"
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
            className="look"
            onClick={() => onLook(look)}
            aria-label={`View look ${i + 1}: ${look.name}`}
          >
            <Picture
              name={look.image}
              alt={look.description}
              parallax={false}
            />
            <span className="look-caption">
              <span>
                0{i + 1} / {look.name}
              </span>
              <span>↗</span>
            </span>
          </button>
        ))}
      </div>
      <div className="collection-notes wrap">
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
        <div className="gallery-side">
          <div className="gallery-controls">
            <button aria-label="Previous looks" onClick={() => move(-1)}>
              <Arrow direction="left" />
            </button>
            <button aria-label="Next looks" onClick={() => move(1)}>
              <Arrow />
            </button>
          </div>
          <div className="gallery-progress" aria-hidden="true">
            <span style={{ left: `${position * 0.65}%` }} />
          </div>
          <div className="season" aria-hidden="true">
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
function Maison({ collection = false }: { collection?: boolean }) {
  return (
    <section
      className={`maison ${collection ? "collection-maison" : ""}`}
      aria-labelledby="maison-title"
    >
      <div className="maison-curve" />
      <h2 id="maison-title" className="maison-word">
        MAISON
      </h2>
      <div className="maison-content wrap">
        <div
          className={`maison-copy ${collection ? "left-story" : ""}`}
          data-reveal
        >
          {collection ? (
            <>
              <p>
                There is no single way to be yourself. A wardrobe can hold every
                mood, every contrast, every possibility.
              </p>
              <p>
                Discover silhouettes that leave room for your own expression.
              </p>
              <span className="eyebrow atelier-credit">
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
              <a className="button" href="#/collection">
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
          className="oval maison-photo"
        />
        <div className="maison-copy right-story" data-reveal>
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
              <a className="button" href="#/collection/looks">
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
function Philosophy({ onLook }: { onLook: (look: Look) => void }) {
  return (
    <>
      <section className="philosophy wrap" aria-labelledby="philosophy-title">
        <h1 id="philosophy-title" data-reveal>
          <span>Philosophy</span>
          <span>of the brand</span>
        </h1>
        <p className="intro-note" data-reveal>
          Barbino Maison celebrates the woman at the centre of her own story —
          her confidence, her strength and her individuality.
        </p>
        <figure className="founder">
          <Picture
            name="designer"
            alt="Designer considering the shape of a garment in the atelier"
            className="oval"
          />
          <figcaption>
            <span className="eyebrow">
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
        <div className="philosophy-copy" data-reveal>
          <p>
            It begins with a line. A fabric’s weight, the way it falls, the
            space between a garment and the body. Our design philosophy brings
            these details into focus.
          </p>
          <p>
            Barbino Maison is a conversation between elegance and edge. Clothes
            to interpret in your own way, with a silhouette that feels
            unmistakably yours.
          </p>
        </div>
        <Picture
          name="sketch"
          alt="Hands drawing a fashion sketch"
          className="oval sketch"
        />
        <p className="closing-note" data-reveal>
          A considered cut follows the body without defining the person.
          Structure, movement and a sense of ease belong together.
        </p>
      </section>
      <div className="barbino-word" aria-hidden="true">
        BARBINO
      </div>
      <div className="dark">
        <Maison />
        <Gallery onLook={onLook} />
      </div>
    </>
  );
}
function Collection({ onLook }: { onLook: (look: Look) => void }) {
  return (
    <>
      <h1 className="sr-only">The Barbino Maison collection</h1>
      <div className="collection-page dark">
        <Maison collection />
        <div id="looks">
          <Gallery onLook={onLook} />
        </div>
      </div>
    </>
  );
}
function Service({ openCraft }: { openCraft: () => void }) {
  return (
    <>
      <section className="service-stage dark">
        <Picture
          name="service"
          alt="White textured fashion ensemble, styled with sculptural sunglasses"
          className="service-campaign oval"
          parallax={false}
        />
        <div className="service-nav wrap">
          <p>Customer service</p>
          <nav aria-label="Customer service topics">
            <a href="#/service/delivery">ORDER INFORMATION</a>
            <a href="#/service/care">GARMENT CARE</a>
            <a href="#/service/contact">GET IN TOUCH</a>
          </nav>
        </div>
        <h1 className="service-title">
          <span>CUSTOMER</span>
          <span>SERVICE</span>
        </h1>
        <div className="craft-film">
          <Picture
            name="craft"
            alt="Atelier hands cutting dark fabric"
            className="oval"
          />
          <button
            onClick={openCraft}
            aria-label="Read about the making of a garment"
          >
            ↗
          </button>
        </div>
        <div className="service-story wrap" id="craftsmanship">
          <figure className="atelier-card">
            <span className="eyebrow">
              A CLOSER LOOK
              <br />
              THE ATELIER
            </span>
            <Picture
              name="sketch"
              alt="Close-up of a fashion sketch in progress"
              className="oval"
            />
            <figcaption>
              From line to form
              <br />
              <a href="#/philosophy">OUR PHILOSOPHY ↗</a>
            </figcaption>
          </figure>
          <div className="service-copy" data-reveal>
            <h2>
              The thinking behind
              <br />
              every garment
            </h2>
            <p>
              A silhouette starts long before it is worn. A sketch explores its
              proportions; fabric gives it weight and movement. Every detail is
              part of the whole.
            </p>
            <p>
              Our approach to clothing is rooted in attention: the balance of a
              shoulder, the line of a seam, the way a piece feels in motion.
              Craftsmanship is as much about the quiet details as the first
              impression.
            </p>
            <p>
              That conversation continues with the wearer. Thoughtful care helps
              preserve the shape, texture and character that drew you to a piece
              in the first place.
            </p>
          </div>
        </div>
      </section>
      <section id="delivery" className="service-information wrap" data-reveal>
        <h2>Ordering & delivery</h2>
        <p>
          Before placing an order, review the product details and the delivery
          and payment information supplied by the seller. Availability, costs
          and timings should be confirmed for your order.
        </p>
        <p className="small-note">
          For an existing order, refer to your order confirmation for the
          relevant service contact.
        </p>
      </section>
      <section id="care" className="care-section wrap">
        <div data-reveal>
          <span className="eyebrow">KEEP THE CHARACTER</span>
          <h2>
            A little care.
            <br />A longer story.
          </h2>
          <p>
            Always follow the care label sewn into your garment. The fabric,
            construction and finishing determine how each piece should be cared
            for.
          </p>
        </div>
        <div className="care-accordions">
          {[
            [
              "Cleaning",
              "Check the garment’s care label before washing or dry cleaning. If a treatment is not listed or you are unsure, ask a professional cleaner to assess the piece before proceeding.",
            ],
            [
              "Storage",
              "Store garments clean and dry, away from direct sunlight. Choose storage that supports the garment’s shape; delicate knitwear is generally best folded rather than hung.",
            ],
            [
              "Repairs & alterations",
              "For a loose fastening, damaged seam or change in fit, consult a qualified tailor. Ask them to assess the fabric and construction before making an alteration.",
            ],
          ].map(([heading, body]) => (
            <details key={heading}>
              <summary>
                {heading}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{body}</p>
            </details>
          ))}
        </div>
      </section>
      <section id="contact" className="contact-section wrap">
        <span className="eyebrow">CUSTOMER SERVICE</span>
        <h2>Here for the details.</h2>
        <p>
          Questions about a piece or an existing order? Use the contact details
          supplied with your purchase. Include your order reference and the
          garment name so your enquiry has the right context.
        </p>
        <a href="#/collection" className="text-link">
          RETURN TO THE COLLECTION ↗
        </a>
      </section>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <Brand />
      <nav aria-label="Footer navigation">
        <a href="#/philosophy">Philosophy</a>
        <a href="#/collection">Collection</a>
        <a href="#/service">Customer service</a>
        <a href="#/service/care">Garment care</a>
      </nav>
      <div className="footer-meta">
        <span className="eyebrow">BARBINO MAISON</span>
        <p className="footer-credit">
          Built by <a href="https://astonesoft.com">Astonesoft</a>
        </p>
      </div>
    </footer>
  );
}
function App() {
  const [hash, setHash] = useState(location.hash || "#/philosophy");
  const route = ["collection", "service"].includes(hash.split("/")[1])
    ? hash.split("/")[1]
    : "philosophy";
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Look | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showCraft, setShowCraft] = useState(false);
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem("barbino-saved") || "[]",
      );
      return Array.isArray(value)
        ? value.filter(
            (x): x is string =>
              typeof x === "string" && looks.some((l) => l.name === x),
          )
        : [];
    } catch {
      return [];
    }
  });
  function toggleSaved(name: string) {
    setSaved((previous) => {
      const next = previous.includes(name)
        ? previous.filter((n) => n !== name)
        : [...previous, name];
      try {
        localStorage.setItem("barbino-saved", JSON.stringify(next));
      } catch {
        /* Saving remains available for this visit. */
      }
      return next;
    });
  }
  useEffect(() => {
    const change = () => {
      setHash(location.hash || "#/philosophy");
      setSelected(null);
      setShowSaved(false);
      setShowCraft(false);
    };
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, []);
  useLayoutEffect(() => {
    document.title = `Barbino Maison — ${route === "service" ? "Customer service" : route === "collection" ? "Collection" : "Philosophy"}`;
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]", root.current!)
          .forEach((el) =>
            gsap.from(el.children.length > 1 ? el.children : el, {
              y: 24,
              opacity: 0,
              stagger: 0.09,
              duration: 0.85,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 94%", once: true },
            }),
          );
        gsap.utils
          .toArray<HTMLElement>("[data-parallax]", root.current!)
          .forEach((el) => {
            gsap.fromTo(
              el.querySelector("img"),
              { yPercent: -2, scale: 1.055 },
              {
                yPercent: 2,
                scale: 1.055,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          });
        gsap.utils
          .toArray<HTMLElement>(".look", root.current!)
          .forEach((el, i) =>
            gsap.from(el, {
              y: 25,
              opacity: 0,
              delay: i * 0.07,
              duration: 0.8,
              scrollTrigger: { trigger: el, start: "top 98%", once: true },
            }),
          );
      },
      root,
    );
    return () => mm.revert();
  }, [route]);
  useEffect(() => {
    const id = hash.split("/")[2];
    const timer = setTimeout(() => {
      if (id)
        document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
      else window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }, 80);
    return () => clearTimeout(timer);
  }, [hash]);
  return (
    <div
      ref={root}
      className={`site ${route === "service" ? "service-page" : ""}`}
    >
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <Header
        route={route}
        saved={saved.length}
        openSaved={() => setShowSaved(true)}
      />
      <main id="main" tabIndex={-1}>
        {route === "philosophy" ? (
          <Philosophy onLook={setSelected} />
        ) : route === "collection" ? (
          <Collection onLook={setSelected} />
        ) : (
          <Service openCraft={() => setShowCraft(true)} />
        )}
      </main>
      <Footer />
      {selected && (
        <Modal title={selected.name} close={() => setSelected(null)}>
          <Picture
            name={selected.image}
            alt={selected.description}
            parallax={false}
            className="detail-photo"
          />
          <p>{selected.description}</p>
          <button
            className="button"
            onClick={() => toggleSaved(selected.name)}
            aria-pressed={saved.includes(selected.name)}
          >
            {saved.includes(selected.name)
              ? "REMOVE FROM SAVED LOOKS −"
              : "SAVE THIS LOOK ♡"}
          </button>
          <p className="small-note">
            An editorial lookbook. Product availability and purchasing details
            are not listed here.
          </p>
        </Modal>
      )}
      {showSaved && (
        <Modal title="Your saved looks" close={() => setShowSaved(false)}>
          {saved.length ? (
            <div className="saved-grid">
              {looks
                .filter((l) => saved.includes(l.name))
                .map((l) => (
                  <div key={l.name}>
                    <button
                      className="saved-look"
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
                      className="text-link"
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
                className="button"
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
            className="detail-photo"
            parallax={false}
          />
          <p>
            A garment is a sequence of decisions: proportion, fabric, cut and
            finish. Each contributes to the relationship between structure and
            movement.
          </p>
          <a
            className="text-link"
            href="#/service/care"
            onClick={() => setShowCraft(false)}
          >
            EXPLORE GARMENT CARE ↗
          </a>
        </Modal>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
