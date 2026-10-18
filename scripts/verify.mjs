import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  channel: process.env.BROWSER_CHANNEL || "chrome",
});
const errors = [];
const results = [];
const base = process.env.BASE_URL || "http://127.0.0.1:5173";
try {
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of ["philosophy", "collection", "service"]) {
      await page.goto(`${base}/#/${route}`);
      await page.waitForTimeout(250);
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() =>
        Promise.all([...document.images].map((i) => i.decode())),
      );
      assert.equal(await page.locator("h1").count(), 1, `${route}: one h1`);
      const metrics = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        russian: /[\u0400-\u04ff]/.test(document.body.innerText),
        broken: [...document.images].filter((i) => !i.naturalWidth).length,
        movingImages: [
          ...document.querySelectorAll("[data-parallax] img"),
        ].filter((i) => getComputedStyle(i).transform !== "none").length,
      }));
      assert.ok(
        metrics.scroll <= width,
        `${route} at ${width}: horizontal overflow ${metrics.scroll}`,
      );
      assert.equal(metrics.russian, false, `${route}: Cyrillic text found`);
      assert.equal(metrics.broken, 0, `${route}: broken images`);
      assert.equal(
        await page.locator("img:not([srcset]), img:not([sizes])").count(),
        0,
        `${route}: all photographs have responsive sources`,
      );
      if (route !== "service") {
        const first = await page.locator(".look").first().boundingBox();
        assert.ok(
          first.x >= 0 && first.x + first.width <= width,
          `${route} at ${width}: look 01 is completely visible`,
        );
        const label = await page.locator(".look-caption").first().boundingBox();
        assert.ok(
          label.x >= 0 && label.x + label.width <= width,
          `${route}: look 01 caption is completely visible`,
        );
      }
      assert.equal(
        metrics.movingImages,
        0,
        `${route}: reduced motion disables parallax`,
      );
      if (width !== 320)
        await page.screenshot({
          path: `artifacts/${route}-${width}.png`,
          fullPage: true,
        });
      results.push({ route, width, ...metrics });
    }
    await page.getByRole("button", { name: "MENU +", exact: true }).click();
    await page.getByRole("dialog").waitFor({ state: "visible" });
    for (let tab = 0; tab < 8; tab++) {
      await page.keyboard.press("Tab");
      assert.equal(
        await page
          .locator("dialog[open]")
          .evaluate((el) => el.contains(document.activeElement)),
        true,
        "Menu contains keyboard focus",
      );
    }
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(
      await page
        .getByRole("button", { name: "MENU +", exact: true })
        .evaluate((e) => e === document.activeElement),
      true,
      "Menu restores focus",
    );
    await page.getByRole("button", { name: "MENU +", exact: true }).click();
    await page.getByRole("link", { name: "02 The collection" }).click();
    await page.waitForURL("**/#/collection");
    await page.getByRole("button", { name: "Next looks" }).click();
    assert.ok(
      (await page.locator(".lookbook-track").evaluate((el) => el.scrollLeft)) >
        0,
      "Lookbook advances",
    );
    await page.getByRole("button", { name: "Previous looks" }).click();
    const firstAfterPrevious = await page
      .locator(".look")
      .first()
      .boundingBox();
    assert.ok(
      firstAfterPrevious.x >= -1,
      "Previous control restores the whole first card",
    );
    await page
      .getByRole("button", { name: "View look 1: Soft structure" })
      .click();
    await page.getByRole("button", { name: "SAVE THIS LOOK ♡" }).click();
    await page.keyboard.press("Escape");
    await page.reload();
    await page.getByRole("button", { name: "Saved looks (1)" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Remove Soft structure" })
      .click();
    await page.keyboard.press("Escape");
    await page.goto(`${base}/#/service/care`);
    await page.locator("summary").filter({ hasText: "Cleaning" }).click();
    assert.equal(
      await page.locator("details").first().getAttribute("open"),
      "",
    );
    await page.close();
  }
  const retina = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  for (const route of ["philosophy", "collection", "service"]) {
    await retina.goto(`${base}/#/${route}`);
    await retina.waitForTimeout(250);
    await retina.evaluate(() =>
      Promise.all([...document.images].map((i) => i.decode())),
    );
    const sources = await retina.locator("main img").evaluateAll((images) =>
      images.map((img) => ({
        selected: Number(img.currentSrc.match(/-(\d+)\.webp$/)?.[1]),
        needed: Math.min(
          Number(img.getAttribute("width")),
          img.getBoundingClientRect().width * devicePixelRatio,
        ),
      })),
    );
    for (const source of sources)
      assert.ok(
        source.selected >= source.needed * 0.98,
        `${route}: enough source pixels for retina display`,
      );
  }
  await retina.close();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "no-preference",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/#/philosophy`);
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "MENU +", exact: true }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: "artifacts/mobile-menu.png" });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  assert.equal(await page.locator("dialog[open]").count(), 0);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
  });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: "artifacts/philosophy-motion-390.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/checks.json",
    JSON.stringify({ results, errors, passed: true }, null, 2),
  );
  console.log(
    `PASS: ${results.length} responsive page checks; menu, Escape, focus restoration, saved looks, care, motion, images and English-only content.`,
  );
} finally {
  await browser.close();
}
