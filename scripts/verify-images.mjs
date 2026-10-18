import assert from "node:assert/strict";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
const manifest = JSON.parse(await readFile("src/image-manifest.json", "utf8"));
assert.equal(Object.keys(manifest).length, 10);
let files = 0,
  bytes = 0;
for (const [name, asset] of Object.entries(manifest)) {
  assert.ok(
    asset.width >= 1000 && asset.height >= 1000,
    `${name}: high-resolution original`,
  );
  assert.ok(asset.variants.length >= 4, `${name}: responsive sizes`);
  for (const variant of asset.variants) {
    const file = await readFile(`public${variant.src}`);
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, variant.width);
    assert.equal(metadata.height, variant.height);
    assert.ok(
      metadata.width <= asset.width && metadata.height <= asset.height,
      `${name}: no upscaling`,
    );
    assert.ok(
      Math.abs(metadata.width / metadata.height - asset.width / asset.height) <
        0.003,
      `${name}: original proportions`,
    );
    assert.ok(
      file.length > 1000 && file.length < 600000,
      `${name}: valid optimized size`,
    );
    files++;
    bytes += file.length;
  }
}
console.log(
  `PASS: ${Object.keys(manifest).length} high-resolution originals, ${files} proportional WebP variants, ${(bytes / 1024 / 1024).toFixed(2)} MB total, no upscaling.`,
);
