import imageManifest from "../data/image-manifest.json";
import { imageSizes } from "../data/images";
import type { ImageName } from "../types/content";
export function EditorialImage({
  name,
  alt,
  sizes,
}: {
  name: ImageName;
  alt: string;
  sizes?: string;
}) {
  const asset = imageManifest[name];
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
