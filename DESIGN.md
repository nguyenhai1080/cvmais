# CVMais UI baseline

## Approved reference

The user supplied the original mockup, retained at `public/images/design-reference.png`. The final design follows its horizontal header, mint hero with a candidate and laptop, large CV overlay, four benefits, template gallery and photo-led community. Its unverified 10,000-user and 24-template claims are omitted. The current header provides a CV library and account sign-in.

## Tokens and conventions

- Navy: `#183B55`.
- Teal: `#079C91`; darker `#06786F` for small text on light surfaces.
- Ivory: `#FAF9F5`; pale mint surfaces; white document previews.
- Manrope headings and DM Sans body, with Arial fallback.
- Desktop content width: 1200 px. Responsive adaptations at 1100, 800 and 540 px.
- Reusable components: `Header`, `Logo`, `CVPreview`.
- Language: `pt-MZ`, direct and encouraging, using “tu”, “teu”, “candidatura”, “telemóvel”, “ficheiro”, “formação”.
- Editorial images are illustrative, not user portraits or endorsements.

## Hero image provenance

Assets: `public/images/candidate.png` (CV portrait), `public/images/hero-reference.png` (hero), `public/images/community.png` (community). All generated with the built-in Imagegen tool.
Created with the built-in Imagegen tool. No stock licence or real person identity is asserted.

Final prompt:

> Use case: photorealistic-natural. Asset type: CVMais landing page hero photograph, portrait 4:5 composition. A fictional young adult Black Mozambican woman job applicant in Maputo, warm confident authentic smile, natural short curly black hair, white blouse and navy blazer, holding a closed slim notebook at waist, waist-up portrait, softly lit modern office with a pale cream wall and leafy plant to the right. Premium editorial career photography, natural skin texture, warm daylight, relaxed professional pose. Palette navy #183B55, teal #079C91, warm ivory. Subject centered with room above head, no text, no logos, no watermark, no UI, no CV overlay. This is an illustrative fictional candidate, not a real customer.

The CV overlay is live HTML rather than baked into the image. Gallery previews come from the six actual PDF layouts and use fictional content.

Hero prompt: Create a production website photograph based on the attached CVMais UI mockup, using ONLY the hero photography as visual reference. Wide 16:9 photograph. Fictional young adult Black Mozambican woman with long braided hair, teal blazer over white top, seated behind a silver laptop, smiling thoughtfully upward to her left, chin resting on one hand holding a pen. Bright pale mint office, daylight, blurred plant on right. Woman centre-right with face near 60% width and negative space on left 40%. No text, UI, CV, buttons or marks.

Community prompt: Photorealistic editorial career website image, portrait 4:5. Fictional young adult Black Mozambican man, short natural afro hair, dark rectangular glasses, light blue denim overshirt over white T-shirt, seated smiling and working on silver laptop at a desk in bright contemporary Maputo office, soft daylight, blurred leafy green plant on left and pale mint wall. Framed chest-up with laptop entering bottom right. Natural skin texture, warm optimistic expression. Palette white, teal, pale mint. No text, logos, UI or watermark.
