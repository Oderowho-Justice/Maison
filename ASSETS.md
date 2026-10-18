# Asset provenance

## Original editorial photography

All photographs used by the site were created with the built-in image-generation tool. The supplied Figma exports informed subject, pose, lighting and composition; their blurry photographic crops are no longer served. These are original editorial interpretations, not exact reproductions or verified photographs of the brand's products, staff or facilities.

Production paths: `public/images/editorial/{name}-{width}.webp`, with widths recorded in `src/image-manifest.json`. Original masters: `assets/source/{name}.png` (local, excluded from Git). All sources are at least 1000 pixels on each side. The optimizer resizes downward only, preserves proportions and encodes WebP at quality 86. No watermarks or baked-in interface text are intentionally included.

Names: `designer`, `sketch`, `atelier`, `collection`, `look-01`, `look-02`, `look-03`, `look-04`, `service`, `craft`.

The fourth look interprets the reference's black tailoring as a sculptural waistcoat and wide-leg trousers. Original model identities and exact garment construction are not replicated. Full generation prompts for the new set are recorded in `assets/prompts.json`.

## Generated editorial replacements

Created with the built-in image-generation tool, then copied into this workspace. These are illustrative fashion/atelier images, not representations of verified brand inventory or facilities.

- `public/images/editorial/service-*.webp`: replaces the text-obscured service hero. Reference: the supplied customer-service design export.
- `public/images/editorial/craft-*.webp`: replaces the low-resolution atelier inset.

### Service hero prompt

Use case: ads-marketing. Create a standalone fashion campaign photograph for a website, using the large top photograph in the supplied webpage as composition and styling reference ONLY. Output ONLY a clean photograph, no website, no lettering, no oval masking, no logo, no other inset pictures. A female adult fashion model with short dark bob and black angular sunglasses poses with both hands near her sunglasses, elbows raised wide, wearing a white textured sleeveless cropped top and matching architectural white high-waisted skirt. Waist-up to upper thighs visible, body at a slight diagonal. Neutral medium grey seamless studio backdrop, soft professional fashion studio light, realistic editorial photography, refined neutral color palette. Square framing with the head near top center, elbows within image, outfit clearly visible. This is an illustrative editorial replacement, not a claim of actual brand inventory.

### Atelier prompt

Use case: photorealistic-natural. Asset type: narrow vertical atelier photograph for fashion editorial website. Close-up of an adult tailor's hands using large tailoring scissors to cut matte black wool fabric on a dark worktable, subtle chalk pattern line, hands near the upper third, black fabric occupying the lower half. Realistic craft detail and skin texture, softly lit, charcoal and black tones, warm natural skin. High fashion atelier documentary photography. Portrait 2:3 composition suitable for an oval crop. No face, no text, no logos, no overlay, no buttons.

## Fonts

Inter (300 and 400) and Bodoni Moda (400), downloaded from Google Fonts and served locally. Both families use the SIL Open Font License. License files are included in `public/fonts/`.
