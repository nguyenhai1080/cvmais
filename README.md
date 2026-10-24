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
- `/conta`: register, sign in and reset access with a one-time recovery code. Optional email confirmation and email password reset use expiring, hashed, single-use links. The recovery-code fallback remains available. Resend sends from cvmais.win.
- `/meus-cvs`: private account documents, create, explicitly copy a guest draft, JSON import, duplicate, rename, trash and restore. Trashed CVs can be permanently erased after exact-title confirmation and password reauthentication. Account erasure requires the exact email and password, removes all its CVs and revokes all sessions. Limit: 100 documents including trash.
- Account CVs autosave to the server database and can be opened on another signed-in device. Revision checks prevent silent overwrites. Pending changes attempt a local backup scoped to the user and document, recoverable explicitly.
- `/privacidade`: actual storage, pending local copies, recovery, erasure and backup limits. Erasure clears matching pending copies in the current browser when possible and notifies current editor tabs. Guest drafts, downloads and other devices require separate cleanup.
- `/api/health` checks database availability without exposing records.
- All sample CVs are fictional. No invented customers, counts or testimonials.

## Production storage and access

Set DATABASE_PATH to `/data/cvmais.sqlite`, declare `/data` as persistent storage in Vibehost, and set APP_ORIGIN to the exact HTTPS application origin. Update APP_ORIGIN when connecting a custom domain. Never put the database in public files or Git.

SQLite uses WAL and foreign keys on the DGC server. Passwords use salted scrypt. Session/recovery tokens are stored hashed. Session cookies are HttpOnly, SameSite=Lax, Secure in production and expire in 30 days. Writes require the configured Origin. Queries enforce ownership; persisted limits protect authentication and saves.

CV text is not end-to-end encrypted. Administrators with server access can access it for maintenance. Unsynced local copies can remain after sign-out; shared-device users should use separate browser profiles. PDFs and downloaded JSON files stay on users' devices.

This deployment uses one application container. Do not scale to independent SQLite replicas; adopt a suitable shared database service before horizontal scaling.

Docker builds Next.js standalone output, runs as UID 1001 and serves port 3000. Mount a named volume at `/data` and supply APP_ORIGIN. Production cookies require HTTPS.

Daily encrypted off-server backups are active on DGC. AES-256-GCM snapshots upload to the private B2 bucket `cvmais-dgc-backups`, prefix `cvmais/`, with approximately 30-day lifecycle expiry. The first real remote backup was downloaded, decrypted and checked for SQLite integrity and the existing persistence fixture. The worker checks hourly, retries failures hourly and persists daily completion across restarts. Failures currently appear in runtime logs; external alerts are not implemented.

The ignored owner recovery key is in `work/backup-encryption-key.txt`. Keep a separate private owner-controlled copy: losing it makes encrypted backups unusable. Never commit it or include it in source archives. Restore into a new isolated database with `scripts/restore-backup.mjs`; reconcile erasures before any production restoration.

Authentication mail requires MAIL_ENABLED=true, MAIL_FROM, RESEND_API_KEY and the exact HTTPS APP_ORIGIN. Delivery runs after the response; there is no durable mail queue. If delivery fails, the user must request a new link. Resend receives only the recipient and authentication message, not CV contents. Verification links expire in 24 hours; reset links in 30 minutes. Reset revokes all sessions and rotates the recovery code. A new request invalidates the previous link of that purpose. The sender domain cvmais.win is verified; a test to the owner was reported Delivered. See OPERATIONS-SETUP.md for current configuration.

## PDF and API validation

- `npm run qa:pdf`: six short A4 samples, long CVs for all layouts and a long-skills fixture under ignored `work/pdf-qa/`.
- `npx tsx scripts/render-template-previews.tsx`: six fictional PDFs under ignored `work/template-pdfs/`.
- `scripts/check-pdfs.py`: Python with pypdf/pdfplumber verifies accents, content, embedded fonts and page bounds. Render with Poppler for visual review.
- Rasterise the template PDFs with Poppler into `public/template-previews/{model}.png` after changing the PDF designs.
- `node scripts/check-storage-api.mjs`: HTTP integration tests against TEST_ORIGIN (default localhost:3001). Creates isolated synthetic accounts; use a test database. Covers CSRF, sessions, ownership, conflicts, second-device sessions, trash, recovery and logout.

Noto Sans and Source Serif fonts and open font licences are under `public/fonts/`. Research sources and rationale are in TEMPLATE-RESEARCH.md. Deployment details are in DEPLOYMENT.md.

The photo revision adds full-width identity blocks, contact icons, experience timelines, textual skill chips and richer two-column layouts. Gallery portraits are fictional illustrations prepared from the existing AI assets using the same photo picker as users. CVs without portraits remain supported. Older open editor clients preserve an existing account portrait when they omit the new photo field.
