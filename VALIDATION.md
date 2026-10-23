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
