import type { PageRoute } from "../types/content";
export const navigation: {
  route: PageRoute;
  label: string;
  footerLabel: string;
}[] = [
  { route: "philosophy", label: "Our philosophy", footerLabel: "Philosophy" },
  { route: "collection", label: "The collection", footerLabel: "Collection" },
  {
    route: "service",
    label: "Customer service",
    footerLabel: "Customer service",
  },
];
