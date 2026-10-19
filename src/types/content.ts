import type imageManifest from "../data/image-manifest.json";
export type ImageName = keyof typeof imageManifest;
export interface Look {
  image: ImageName;
  name: string;
  description: string;
}
export type PageRoute = "philosophy" | "collection" | "service";
