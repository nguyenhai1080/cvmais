# Validation

Validated on 24 October 2026, Asia/Saigon.

- Canonical project directory: `D:\Projects\CVMais`.
- `npm ci`: passed.
- `npm run typecheck`: passed in the canonical directory.
- Docker image `cvmais-ui:local`: built successfully from the canonical directory, including production Next.js compilation, TypeScript and static generation.
- Container smoke checks: HTTP 200 for `/`, `/criar-cv?modelo=minimalista`, `/api/health`, hero image and community image.
- Runtime user: UID 1001, unprivileged.
- Browser checks at desktop, 768 px tablet and 390 px phone widths: homepage renders; no horizontal page overflow at checked widths; all three displayed image assets load.
- Mobile menu opens and closes. CTA opens the editor. Name and role update the preview. Template selection changes. Saving reports success and restores the draft after reload. Selecting Minimalista from the gallery opens that model in the editor.
- Browser print / PDF action is implemented; actual exported PDF pagination has not been manually verified.
- Deployment source supplied by the user: `https://github.com/nguyenhai1080/cvmais.git`. The repository was initially empty; the project uses branch `main`.

## Follow-up checks

- Four automated draft-restoration tests pass, including malformed JSON, non-object payloads, invalid types, unsupported model names and overlong fields.
- TypeScript passes after editor changes.
- Empty print sections and editor placeholder hints are hidden in print styles. The printable content now uses the full page width, with page breaks allowed inside long sections.
- The PDF action requires a name and at least one completed content section.
- Docker Desktop was unavailable during the follow-up. The earlier Docker validation above applies to the preceding UI revision; the updated revision is checked with the local production build and Vibehost deployment.
- Updated local production build passed. Vibehost built and deployed application commit `fe06a17aedd3d00b92bc01e885d3b0c8607451a1` successfully; the project reports `online`.
- Live HTTPS smoke checks passed for the homepage, editor, health endpoint and hero/community images. Online browser checks passed for template selection, data entry, draft saving, PDF-action enablement and 390 px layout width. See `DEPLOYMENT.md` for deployment identifiers and domain status.

The design follows the user-supplied mockup. Photography is recreated illustration; it is not a pixel-identical extraction of the original mockup.

## Structured editor and direct PDF revision (local)

- Seven data tests pass, including legacy draft migration, malformed data, entry limits, independent state and safe PDF filenames.
- Five PDF styles render as single-page A4 samples with embedded regular/bold Noto Sans and correct Portuguese text extraction.
- A long CV renders as three A4 pages, preserving both experience end markers and all remaining sections. PDF text stays inside the checked page bounds.
- All fixture pages were rendered for visual review. A real browser download from the editor was also opened and checked for accents, structured content and page bounds.
- Browser checks cover contact fields, adding experience/education, removal/undo, template changes, local draft restoration and direct download.
- The connector identifies GST Vietnam and was not used for the corrected DGC deployment. The user's signed-in browser independently confirmed DGC ownership, email `nguyenhai1080@gmail.com`.
- The final revision passes the production build and a real PDF download from the local standalone production server. Add/remove/undo/reorder, persistent restoration and the mobile edit/preview switch were checked in the browser.
- The browser profile independently confirms DGC (`nguyenhai1080@gmail.com`, Pro plan). The connector remains GST and must not be used for the DGC deployment.
- The structured editor revision is now online in DGC at `https://cvmais-dgc.n1.tinhgon.xyz`, project `cmvlbkah40mef0i5fzrjkbvcd`, application commit `e6fb6a5`. The DGC project overview shows online/version 1.
- Live DGC smoke checks passed for homepage, editor, health and fonts. A real PDF download from the DGC site was verified for A4, Portuguese accents and entered experience content. No changes were made to the historical GST project after the correction.
