# CVMais

Next.js application in Portuguese for Mozambique. Canonical source: `D:\Projects\CVMais`.
Primary site: https://cvmais.win. Legacy DGC address: https://cvmais-dgc.n1.tinhgon.xyz. Source: https://github.com/nguyenhai1080/cvmais.git.

## Development

Node.js 22.16 or later. Run `npm ci`, then `npm run dev`.
Development uses ignored `data/cvmais.sqlite`. Production requires DATABASE_PATH and APP_ORIGIN; see `.env.example`.
Checks: `npm test`, `npm run typecheck`, `npm run build`.

## Features

- Responsive landing page based on the approved mockup, illustrative candidate photography, benefits, community placeholder and practical guidance.
- 82 selectable editions: 72 industry editions (12 industries × six layout families), plus the ten general templates Maputo, Índico, Essencial, Coral, Prestígio, Horizonte, Código, Vital, Estrutura and Acolher. Dedicated /modelos library, industry/style filters, pagination and grouped editor selection. Gallery previews come from actual PDFs. Filters and enlarged previews help selection.
- Structured editor: optional portrait upload with crop/zoom, contacts, profile, repeatable experience/education, reorder, undo, skills, languages, live preview, JSON backup and direct browser PDF download. Images are prepared as 256px JPEGs in the browser; raw files are not sent to an image service.
- Guests keep one localStorage draft in the current browser. Guest JSON import shows a review, explicit replacement confirmation and undo. No automatic upload occurs on sign-in. Earlier local/session drafts migrate when available.
- `/conta`: register, sign in and reset access with a one-time recovery code. Optional email confirmation and email password reset use expiring, hashed, single-use links. The recovery-code fallback remains available. Resend sends from cvmais.win.
- `/meus-cvs`: private account documents, create, explicitly copy a guest draft, JSON import, duplicate, rename, trash and restore. Trashed CVs can be permanently erased after exact-title confirmation and password reauthentication. Account erasure requires the exact email and password, removes all its CVs and revokes all sessions. Limit: 100 documents including trash.
- Account CVs autosave to the server database and can be opened on another signed-in device. Revision checks prevent silent overwrites. Pending changes attempt a local backup scoped to the user and document, recoverable explicitly.
- `/privacidade`: actual storage, pending local copies, recovery, erasure and backup limits. Erasure clears matching pending copies in the current browser when possible and notifies current editor tabs. Guest drafts, downloads and other devices require separate cleanup.
- `/api/health` checks database availability without exposing records.
- All sample CVs are fictional. No invented customers, counts or testimonials.

## Production storage and access

Set DATABASE_PATH to `/data/cvmais.sqlite`, declare `/data` as persistent storage in Vibehost, and set APP_ORIGIN to the exact HTTPS application origin. Update APP_ORIGIN when connecting a custom domain. Never put the database in public files or Git.

SQLite uses WAL and foreign keys on the DGC server. Passwords use salted scrypt. Session/recovery tokens are stored hashed. Session cookies are HttpOnly, SameSite=Lax, Secure in production and expire in 30 days. Writes require an exact configured origin (APP_ORIGIN plus explicit APP_ALLOWED_ORIGINS during migration; no wildcards). Queries enforce ownership; persisted limits protect authentication and saves.

CV text is not end-to-end encrypted. Administrators with server access can access it for maintenance. Unsynced local copies can remain after sign-out; shared-device users should use separate browser profiles. PDFs and downloaded JSON files stay on users' devices.

This deployment uses one application container. Do not scale to independent SQLite replicas; adopt a suitable shared database service before horizontal scaling.

Docker builds Next.js standalone output, runs as UID 1001 and serves port 3000. Mount a named volume at `/data` and supply APP_ORIGIN. Production cookies require HTTPS.

Daily encrypted off-server backups are active on DGC. AES-256-GCM snapshots upload to the private B2 bucket `cvmais-dgc-backups`, prefix `cvmais/`, with approximately 30-day lifecycle expiry. The first real remote backup was downloaded, decrypted and checked for SQLite integrity and the existing persistence fixture. The worker checks hourly, retries failures hourly and persists daily completion across restarts. An independent in-container monitor checks every five minutes and sends owner-approved incident/recovery emails through Resend. Failure state and notification deduplication persist across restarts. StatusCake now checks homepage, application/DB health and backup health externally every five minutes.

The ignored owner recovery key is in `work/backup-encryption-key.txt`. Keep a separate private owner-controlled copy: losing it makes encrypted backups unusable. Never commit it or include it in source archives. Restore into a new isolated database with `scripts/restore-backup.mjs`; reconcile erasures before any production restoration.

Authentication mail requires MAIL_ENABLED=true, MAIL_FROM, RESEND_API_KEY and the exact HTTPS APP_ORIGIN. Delivery runs after the response; there is no durable mail queue. If delivery fails, the user must request a new link. Resend receives only the recipient and authentication message, not CV contents. Verification links expire in 24 hours; reset links in 30 minutes. Reset revokes all sessions and rotates the recovery code. A new request invalidates the previous link of that purpose. The sender domain cvmais.win is verified; a test to the owner was reported Delivered. See OPERATIONS-SETUP.md for current configuration.

## PDF and API validation

- `npm run qa:pdf`: ten short A4 samples in Portuguese and English, long CVs for all layouts and a long-skills fixture under ignored `work/pdf-qa/`.
- `npx tsx scripts/render-template-previews.tsx`: ten fictional PDFs under ignored `work/template-pdfs/`.
- `scripts/check-pdfs.py`: Python with pypdf/pdfplumber verifies accents, content, embedded fonts and page bounds. Render with Poppler for visual review.
- Rasterise the template PDFs with Poppler into `public/template-previews/{model}.png` after changing the PDF designs.
- `node scripts/check-storage-api.mjs`: HTTP integration tests against TEST_ORIGIN (default localhost:3001). Creates isolated synthetic accounts; use a test database. Covers CSRF, sessions, ownership, conflicts, second-device sessions, trash, recovery and logout.

Noto Sans and Source Serif fonts and open font licences are under `public/fonts/`. Research sources and rationale are in TEMPLATE-RESEARCH.md. Deployment details are in DEPLOYMENT.md.

The photo revision adds full-width identity blocks, contact icons, experience timelines, textual skill chips and richer two-column layouts. Gallery portraits are fictional illustrations prepared from the existing AI assets using the same photo picker as users. CVs without portraits remain supported. Older open editor clients preserve an existing account portrait when they omit the new photo field.

## Custom domain and migration

cvmais.win is the primary public address; www redirects to the root with its path. Both A records point to 103.138.88.28, DNS-only in Cloudflare, with Vibehost HTTPS. APP_ORIGIN must be https://cvmais.win so new authentication emails use the new address. APP_ALLOWED_ORIGINS keeps the legacy DGC address working during transition. Account data stays in the same SQLite database; cookies and guest localStorage are isolated by origin. The legacy address shows a migration notice and /mudar-endereco explains JSON export/import. No automatic redirect moves or uploads guest drafts. Homepage canonical/Open Graph and sitemap use cvmais.win; private/editor/auth paths carry X-Robots-Tag noindex, nofollow and are excluded from robots. See ROADMAP.md for remaining launch work.

## Backup operations

`/operacoes` shows last successful upload, worker heartbeat, attempts and failure start. Details require an authenticated, email-verified account matching OPERATIONS_EMAIL. The operator signs up/signs in normally and confirms their email; no admin password is created or shared by deployment. Verified regular users have no operations access.

`/api/health/backup` is a separate, no-store public probe: 200 when backup/worker status is current, 503 when it needs attention. It exposes only a coarse status and service name, with no timestamps, upload paths/IDs or credentials. `/api/health` remains database availability so backup incidents do not trigger container restart loops.

The daily worker records heartbeat/attempt/result separately from the last successful receipt. A backup older than 36 hours, heartbeat older than 150 minutes, missing receipt, disabled/incomplete setup or a failed attempt needs attention. The alert monitor starts after 90 seconds and checks every five minutes independently of the backup worker. BACKUP_ALERTS_ENABLED=true opts into the owner-authorized destination OPERATIONS_EMAIL. One accepted failure message is recorded per incident, followed by one recovery message. Failed sends retry at the next check; provider acceptance is not proof of inbox delivery. Disk/state corruption or unavailable provider can affect delivery; no exactly-once delivery guarantee. If the entire host/container stops, both in-container processes stop; the separate StatusCake monitors continue checking the public URLs.

External setup, isolated Down/Up notification test and free-plan limits are recorded in EXTERNAL-MONITORING.md. The first owner account pilot and technical checks passed; real Android/iPhone and wider Mozambican usability feedback remain in PILOT.md.

Career guidance and in-editor examples: see CONTENT.md. Public hub: /orientacoes. Samples are original pt-MZ text; preview, append or confirm replacement, then adapt to real experience.

Languages: Portuguese is the default. Header switches the interface; editor independently selects Portuguese or English CV headings/PDF/examples. User-written content is preserved. See LANGUAGES.md.
