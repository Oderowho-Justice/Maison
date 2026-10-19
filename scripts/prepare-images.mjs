import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

// Only original high-resolution generated masters. Never upscale reference crops.
const names = [
  "designer",
  "sketch",
  "atelier",
  "collection",
  "look-01",
  "look-02",
  "look-03",
  "look-04",
  "service",
  "craft",
];
await mkdir("public/images/editorial", { recursive: true });
const manifest = {};
for (const name of names) {
  const source = `assets/source/${name}.png`;
  const info = await sharp(source).metadata();
  if (info.width < 1000 || info.height < 1000)
    throw new Error(`${name}: source is below 1000px; refusing to enlarge it`);
  const widths = [...new Set([320, 480, 768, 1024, Math.min(info.width, 1600)])]
    .filter((w) => w <= info.width)
    .sort((a, b) => a - b);
  const variants = [];
  for (const width of widths) {
    const file = `${name}-${width}.webp`;
    const output = await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(`public/images/editorial/${file}`);
    variants.push({
      src: `/images/editorial/${file}`,
      width: output.width,
      height: output.height,
      bytes: output.size,
    });
  }
  manifest[name] = { width: info.width, height: info.height, variants };
}
await writeFile(
  "src/data/image-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Optimized ${names.length} original photographs into ${Object.values(manifest).reduce((n, a) => n + a.variants.length, 0)} responsive WebP assets without upscaling.`,
);
