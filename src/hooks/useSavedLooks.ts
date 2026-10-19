import { useState } from "react";
import { looks } from "../data/looks";
export function useSavedLooks() {
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
  return { saved, toggleSaved };
}
