# Barbino Maison

A responsive editorial fashion website built with React, TypeScript, Vite and GSAP ScrollTrigger. The initial workspace contained three PNG design exports and no existing application.

## Run

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. Routes: `#/philosophy`, `#/collection`, `#/service`. Hash routing supports direct links on static hosts without server rewrites.

```sh
npm run build
npm run preview
npm run check
```

`check` uses Playwright with locally installed Chrome and a running server at port 5173. Set `BASE_URL` to test another server and `BROWSER_CHANNEL` to use another installed browser, such as `msedge`. It checks all three pages at 1440, 768, 390 and 320 pixels, screenshots desktop/tablet/mobile, verifies English-only rendered copy, loaded images, document overflow, menu navigation, Escape and focus restoration, saved looks, garment-care disclosures and motion mode. Results are written to `artifacts/`.

## Design and content

The supplied Figma URL could not be inspected because the connected Figma account's MCP tool allowance was exhausted. Implementation and visual comparison used the three supplied exports. Bodoni Moda and Inter are locally hosted visual approximations; exact Figma font metadata was unavailable. Desktop composition follows the exports; mobile is a responsive adaptation because no mobile design was supplied.

All ten photographs are original generated images, saved locally and optimized as responsive WebP files. No Figma photo crops, enlarged previews, remote image URLs or complete design exports are rendered. Each image has 320, 480, 768 and 1024 pixel variants (plus a larger source-width variant where available), selected using `srcset` and layout-specific `sizes`. The original layout, image proportions and oval masks are preserved. Look 01 and its caption are fully visible at the carousel's initial position.

Original PNG masters are kept locally in `assets/source/` and excluded from Git. The production-ready responsive images and dimension manifest are committed, so a fresh clone builds without those masters. To regenerate optimized images when the masters are available, run `node scripts/prepare-images.mjs`. The script rejects low-resolution sources and never upscales.

All visible copy is English. Biographical material was replaced with design and atelier content. Unverified addresses, production claims, payment methods, shipping prices, delivery promises and repair policies were omitted. The collection is an editorial lookbook with locally saved favourites, not a transaction system. Service guidance refers visitors to their existing order details rather than inventing a contact address.

Animations use native scrolling and scoped GSAP matchMedia/ScrollTrigger lifecycles. Reduced motion disables entrances and parallax. Native modal dialogs provide keyboard focus containment; menu closing restores focus.

See `ASSETS.md` for asset provenance and generation prompts.
