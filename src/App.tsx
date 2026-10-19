import { useEffect, useState } from "react";
import { ScrollTrigger } from "./animations/gsap";
import type { Look, PageRoute } from "./types/content";
import { useSavedLooks } from "./hooks/useSavedLooks";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { EditorialDialogs } from "./components/EditorialDialogs";
import { PhilosophyPage } from "./pages/PhilosophyPage";
import { CollectionPage } from "./pages/CollectionPage";
import { CustomerServicePage } from "./pages/CustomerServicePage";
import styles from "./App.module.css";
export function App() {
  const [hash, setHash] = useState(location.hash || "#/philosophy");
  const path = hash.split("/")[1];
  const route: PageRoute =
    path === "collection" || path === "service" ? path : "philosophy";
  const [selected, setSelected] = useState<Look | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showCraft, setShowCraft] = useState(false);
  const { saved, toggleSaved } = useSavedLooks();
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
  useEffect(() => {
    document.title = `Bellaro Milano — ${route === "service" ? "Customer service" : route === "collection" ? "Collection" : "Philosophy"}`;
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
    <div>
      <a
        href="#main"
        className={styles["skip-link"]}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <Navbar
        route={route}
        saved={saved.length}
        openSaved={() => setShowSaved(true)}
      />
      <main id="main" tabIndex={-1}>
        {route === "philosophy" ? (
          <PhilosophyPage onLook={setSelected} />
        ) : route === "collection" ? (
          <CollectionPage onLook={setSelected} />
        ) : (
          <CustomerServicePage openCraft={() => setShowCraft(true)} />
        )}
      </main>
      <Footer />
      <EditorialDialogs
        selected={selected}
        showSaved={showSaved}
        showCraft={showCraft}
        saved={saved}
        setSelected={setSelected}
        setShowSaved={setShowSaved}
        setShowCraft={setShowCraft}
        toggleSaved={toggleSaved}
      />
    </div>
  );
}
