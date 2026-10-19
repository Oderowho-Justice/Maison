import { useLayoutEffect, useRef } from "react";
import { gsap, revealText } from "../animations/gsap";
import { careGuidance } from "../data/care";
import styles from "./CustomerService.module.css";
export function CustomerService() {
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
    <div ref={root}>
      <section
        id="delivery"
        className={styles["service-information"] + " " + styles["wrap"]}
        data-reveal
      >
        <h2>Ordering & delivery</h2>
        <p>
          Before placing an order, review the product details and the delivery
          and payment information supplied by the seller. Availability, costs
          and timings should be confirmed for your order.
        </p>
        <p className={styles["small-note"]}>
          For an existing order, refer to your order confirmation for the
          relevant service contact.
        </p>
      </section>
      <section
        id="care"
        className={styles["care-section"] + " " + styles["wrap"]}
      >
        <div data-reveal>
          <span className={styles["eyebrow"]}>KEEP THE CHARACTER</span>
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
        <div className={styles["care-accordions"]}>
          {careGuidance.map(([heading, body]) => (
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
      <section
        id="contact"
        className={styles["contact-section"] + " " + styles["wrap"]}
      >
        <span className={styles["eyebrow"]}>CUSTOMER SERVICE</span>
        <h2>Here for the details.</h2>
        <p>
          Questions about a piece or an existing order? Use the contact details
          supplied with your purchase. Include your order reference and the
          garment name so your enquiry has the right context.
        </p>
        <a href="#/collection" className={styles["text-link"]}>
          RETURN TO THE COLLECTION ↗
        </a>
      </section>
    </div>
  );
}
