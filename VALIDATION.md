# Validation — 24 October 2026

Canonical source: `D:\Projects\CVMais`. All CVs used in checks are fictional.

- Nine unit/storage tests pass: migration, validation, bounds, PDF readiness, safe filenames, long-sidebar fallback and persisted account lifecycle.
- Storage tests verify password derivation, hashed recovery/session tokens, ownership, stale revision rejection, trash/restore, database reopen persistence, reset revocation, single-use recovery, logout and persisted rate limits.
- Local HTTP checks passed: same-origin protection, private/no-store responses, session cookies, rejection of unauthorised/other-account access, second-session save/read, conflicts, trash/restore, recovery and logout.
- Production compilation and TypeScript pass.
- Six actual PDF previews generated and visually reviewed. Short samples fit one A4 page; long samples preserve end markers across 2–3 pages in every style. Long skills flow over two pages. Bounds, Portuguese accents and embedded fonts pass automated checks.
- Browser: sign-in, account CV creation, save, reload restoration, rename, trash/restore and logout passed. A real Horizonte PDF download was opened and its Portuguese content verified.
- Gallery: all six previews load; creative filter narrows correctly; enlarged Coral preview shows the expected image and Use CTA. Phone viewport shows no horizontal overflow.
- Docker Desktop is unavailable. This revision uses local production and Vibehost builds rather than claiming a new local Docker build.

The connector still identifies GST. Hosting mutations use the browser profile independently verified as DGC (`nguyenhai1080@gmail.com`). Persistent `/data`, DATABASE_PATH and APP_ORIGIN are configured on DGC project `cmvlbkah40mef0i5fzrjkbvcd`. Deployment and production persistence checks are recorded in DEPLOYMENT.md after completion.

Practical limits: no email verification/delivery, permanent account erasure or scheduled off-server backups. Recovery codes and reversible trash are described accurately in the UI. SQLite is intended for one container; horizontal scaling needs shared storage architecture.

## Production completion

DGC version 3 runs application commit `c088f60`. HTTPS checks and the API ownership/session suite pass. A fictional account and CV saved on version 2 were retrieved with a fresh login after deploying version 3, preserving the revision and full content. Database health reports ready. The public gallery and enlarged template preview were checked on DGC and captured as screenshots. No changes were made to GST.

## Portrait and richer layout revision

Ten unit/storage tests pass, including real prepared JPEG round-tripping and rejection of SVG, external/file URLs, malformed and oversized image values. Local API checks include portrait save/read from a second session and preservation when an older client omits the photo field. Browser checks cover crop/zoom, prepared-image backup, draft reload and actual PDF download with an embedded portrait. Six fictional portrait examples remain one-page A4 documents; all long-CV and long-support fixtures preserve content and pass bounds/font checks.
