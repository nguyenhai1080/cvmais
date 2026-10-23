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
- `/criar-cv`: working local CV editor, template selection, live preview, session-only draft saving and browser print / PDF output.
- `/api/health`: JSON health endpoint.
- No invented user counts, endorsements, testimonials or customer claims. The candidate is an AI-generated illustration. Example CV content is labelled fictional.

## Prepare for Vibehost

The app is prepared for container deployment using Next.js standalone output. The Docker image runs as an unprivileged user on `0.0.0.0:3000` and includes `/api/health` monitoring.

```sh
docker build -t cvmais .
docker run --rm -p 3000:3000 cvmais
```

Repository: `https://github.com/nguyenhai1080/cvmais.git`, branch `main`, repository root. The Dockerfile is the production entry point for Vibehost. No application secrets or persistent volumes are required for this UI version. The intended custom domain is `cvmais.co.mz`; the Vibehost deployment URL is separate until domain ownership and DNS are configured.

## Scope and integration points

- Community is explicitly shown as being in preparation; there is no fabricated external group or registration.
- The editor does not include authentication, server-side storage, payment, a job board or a direct PDF generation service. PDF saving uses the browser print dialogue.
- Session drafts may be cleared when the tab/session closes. Changes must be saved manually. There is no cross-device persistence.
- Long CVs can span multiple printed pages; review page breaks in the print dialogue.
- Empty sections and editor hints are omitted when printing. Add a name and at least one content section to enable the PDF action.
- Draft restoration validates supported fields and lengths; a damaged draft does not prevent selecting a gallery model.
- Google Fonts is a cosmetic external dependency with system font fallbacks. The candidate image is served locally.
- `metadataBase` is the intended domain, not a claim that the domain is deployed.

## Design handoff

See `DESIGN.md` for tokens, image provenance and reference limitations.
