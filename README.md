# CVMais

Next.js application in Portuguese for Mozambique. Canonical source: `D:\Projects\CVMais`.
Live DGC site: https://cvmais-dgc.n1.tinhgon.xyz. Source: https://github.com/nguyenhai1080/cvmais.git.

## Development

Node.js 22.16 or later. Run `npm ci`, then `npm run dev`.
Development uses ignored `data/cvmais.sqlite`. Production requires DATABASE_PATH and APP_ORIGIN; see `.env.example`.
Checks: `npm test`, `npm run typecheck`, `npm run build`.

## Features

- Responsive landing page based on the approved mockup, illustrative candidate photography, benefits, community placeholder and practical guidance.
- Six original templates: Maputo, Índico, Essencial, Coral, Prestígio and Horizonte. Gallery previews come from actual PDFs. Filters and enlarged previews help selection.
- Structured editor: optional portrait upload with crop/zoom, contacts, profile, repeatable experience/education, reorder, undo, skills, languages, live preview, JSON backup and direct browser PDF download. Images are prepared as 256px JPEGs in the browser; raw files are not sent to an image service.
- Guests keep one localStorage draft in the current browser. No automatic upload occurs on sign-in. Earlier local/session drafts migrate when available.
- `/conta`: register, sign in and reset access with a one-time recovery code. Email verification/delivery is not configured. Users must save the displayed recovery code themselves.
- `/meus-cvs`: private account documents, create, explicitly copy a guest draft, JSON import, duplicate, rename, trash and restore. Limit: 100 documents including trash.
- Account CVs autosave to the server database and can be opened on another signed-in device. Revision checks prevent silent overwrites. Pending changes attempt a local backup scoped to the user and document, recoverable explicitly.
- `/privacidade`: actual storage, pending local copies, recovery and retention. Permanent document/account erasure is not implemented; trash is reversible.
- `/api/health` checks database availability without exposing records.
- All sample CVs are fictional. No invented customers, counts or testimonials.

## Production storage and access

Set DATABASE_PATH to `/data/cvmais.sqlite`, declare `/data` as persistent storage in Vibehost, and set APP_ORIGIN to the exact HTTPS application origin. Update APP_ORIGIN when connecting a custom domain. Never put the database in public files or Git.

SQLite uses WAL and foreign keys on the DGC server. Passwords use salted scrypt. Session/recovery tokens are stored hashed. Session cookies are HttpOnly, SameSite=Lax, Secure in production and expire in 30 days. Writes require the configured Origin. Queries enforce ownership; persisted limits protect authentication and saves.

CV text is not end-to-end encrypted. Administrators with server access can access it for maintenance. Unsynced local copies can remain after sign-out; shared-device users should use separate browser profiles. PDFs and downloaded JSON files stay on users' devices.

This deployment uses one application container. Do not scale to independent SQLite replicas; adopt a suitable shared database service before horizontal scaling.

Docker builds Next.js standalone output, runs as UID 1001 and serves port 3000. Mount a named volume at `/data` and supply APP_ORIGIN. Production cookies require HTTPS.

Run `node scripts/backup-db.mjs` in the container to make a consistent SQLite backup under `/data/backups` (or BACKUP_DIR). Backups contain private CVs and credential hashes: control access and keep an encrypted off-server copy. Scheduled off-server backups are not configured. Persistent storage protects redeploys; it does not replace backups.

## PDF and API validation

- `npm run qa:pdf`: six short A4 samples, long CVs for all layouts and a long-skills fixture under ignored `work/pdf-qa/`.
- `npx tsx scripts/render-template-previews.tsx`: six fictional PDFs under ignored `work/template-pdfs/`.
- `scripts/check-pdfs.py`: Python with pypdf/pdfplumber verifies accents, content, embedded fonts and page bounds. Render with Poppler for visual review.
- Rasterise the template PDFs with Poppler into `public/template-previews/{model}.png` after changing the PDF designs.
- `node scripts/check-storage-api.mjs`: HTTP integration tests against TEST_ORIGIN (default localhost:3001). Creates isolated synthetic accounts; use a test database. Covers CSRF, sessions, ownership, conflicts, second-device sessions, trash, recovery and logout.

Noto Sans and Source Serif fonts and open font licences are under `public/fonts/`. Research sources and rationale are in TEMPLATE-RESEARCH.md. Deployment details are in DEPLOYMENT.md.

The photo revision adds full-width identity blocks, contact icons, experience timelines, textual skill chips and richer two-column layouts. Gallery portraits are fictional illustrations prepared from the existing AI assets using the same photo picker as users. CVs without portraits remain supported. Older open editor clients preserve an existing account portrait when they omit the new photo field.
