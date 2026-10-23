# CVMais

Responsive Next.js App Router UI for `cvmais.co.mz`, written in Portuguese for Mozambique (`pt-MZ`).

## Run locally

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Visit http://localhost:3000. Checks: `npm test`, `npm run typecheck` and `npm run build`.

## Included

- Homepage: candidate image, HTML CV preview, responsive menu, CTAs, four benefits, five templates, community placeholder, practical guidance and footer, following the user-supplied mockup.
- `/criar-cv`: structured local CV editor with contact details, repeatable experience/education entries, ordering, undo removal, five styles, live preview and direct PDF download.
- Drafts are saved automatically to this browser's local storage; the original session-only draft is migrated when available.
- PDF generation is loaded on demand and runs in the visitor's browser. Noto Sans regular/bold fonts are served locally and embedded in the PDF; Portuguese accents and selectable text are preserved.
- `/api/health`: JSON health endpoint.
- No invented user counts, endorsements, testimonials or customer claims. The candidate is an AI-generated illustration. Example CV content is labelled fictional.

## Prepare for Vibehost

The app is prepared for container deployment using Next.js standalone output. The Docker image runs as an unprivileged user on `0.0.0.0:3000` and includes `/api/health` monitoring.

```sh
docker build -t cvmais .
docker run --rm -p 3000:3000 cvmais
```

Repository: `https://github.com/nguyenhai1080/cvmais.git`, branch `main`, repository root. The Dockerfile is the production entry point for Vibehost. The required hosting account is DGC (`nguyenhai1080@gmail.com`); verify the connected account before deployment. The earlier GST deployment is not the intended destination. No application secrets or persistent volumes are required for this version. The intended custom domain is `cvmais.co.mz`.

## Scope and integration points

- Community is explicitly shown as being in preparation; there is no fabricated external group or registration.
- The editor does not include authentication, server-side CV storage, payment or a job board. PDF rendering is entirely local; CV data is not sent to a PDF API.
- Drafts remain on the current device/browser until its data is cleared. There is no cross-device persistence. The editor reports browser storage failures and can still export a PDF.
- Long CVs wrap across A4 pages automatically. Review the downloaded file before sending it.
- Empty sections are omitted from the PDF. Add a name and at least one content section to enable download. Each experience/education section supports up to eight entries.
- Draft restoration validates supported fields and lengths; a damaged draft does not prevent selecting a gallery model.
- Google Fonts is a cosmetic external dependency with system font fallbacks. The candidate image is served locally.
- `metadataBase` is the intended domain, not a claim that the domain is deployed.

## PDF QA

Run `npm run qa:pdf` to render five fictional one-page samples and a three-page long-content fixture under ignored `work/pdf-qa/`. Verify extracted text, embedded fonts and page bounds, then render pages with Poppler for visual review. These fixtures are developer checks and are not displayed as customer CVs.

Noto Sans font files and their OFL licence are in `public/fonts/`.

## Design handoff

See `DESIGN.md` for tokens, image provenance and reference limitations.
