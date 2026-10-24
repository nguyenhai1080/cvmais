# Validation — 24 October 2026

Canonical source: `D:\Projects\CVMais`. All CVs used in checks are fictional.

- Ten unit/storage tests pass: migration, validation, bounds, PDF readiness, safe filenames, long-sidebar fallback, safe photo round-trip and persisted account lifecycle.
- Storage tests verify password derivation, hashed recovery/session tokens, ownership, stale revision rejection, trash/restore, database reopen persistence, reset revocation, single-use recovery, logout and persisted rate limits.
- Local HTTP checks passed: same-origin protection, private/no-store responses, session cookies, rejection of unauthorised/other-account access, second-session save/read, conflicts, trash/restore, recovery and logout.
- Production compilation and TypeScript pass.
- Six actual PDF previews generated and visually reviewed. Short samples fit one A4 page; long samples preserve end markers across 2–3 pages in every style. Long skills flow over two pages. Bounds, Portuguese accents and embedded fonts pass automated checks.
- Browser: sign-in, account CV creation, save, reload restoration, rename, trash/restore and logout passed. A real Horizonte PDF download was opened and its Portuguese content verified.
- Gallery: all six previews load; creative filter narrows correctly; enlarged Coral preview shows the expected image and Use CTA. Phone viewport shows no horizontal overflow.
- Docker Desktop is unavailable. This revision uses local production and Vibehost builds rather than claiming a new local Docker build.

The connector still identifies GST. Hosting mutations use the browser profile independently verified as DGC (`nguyenhai1080@gmail.com`). Persistent `/data`, DATABASE_PATH and APP_ORIGIN are configured on DGC project `cmvlbkah40mef0i5fzrjkbvcd`. Deployment and production persistence checks are recorded in DEPLOYMENT.md after completion.

Practical limits: no email verification/delivery, permanent account erasure or scheduled off-server backups. Recovery codes and reversible trash are described accurately in the UI. SQLite is intended for one container; horizontal scaling needs shared storage architecture.

The permanent-erasure limit above describes v4 and is superseded by the revision below.

## Production completion

DGC version 3 runs application commit `c088f60`. HTTPS checks and the API ownership/session suite pass. A fictional account and CV saved on version 2 were retrieved with a fresh login after deploying version 3, preserving the revision and full content. Database health reports ready. The public gallery and enlarged template preview were checked on DGC and captured as screenshots. No changes were made to GST.

## Portrait and richer layout revision

Ten unit/storage tests pass, including real prepared JPEG round-tripping and rejection of SVG, external/file URLs, malformed and oversized image values. Local API checks include portrait save/read from a second session and preservation when an older client omits the photo field. Browser checks cover crop/zoom, prepared-image backup, draft reload and actual PDF download with an embedded portrait. Six fictional portrait examples remain one-page A4 documents; all long-CV and long-support fixtures preserve content and pass bounds/font checks.

DGC version 4 runs application commit `b62e5d1`. The production API suite including photo round-trip and legacy-client preservation passes. The pre-existing persistence probe survives another redeployment. Health reports ready. All six new gallery images and the enlarged Coral preview load on the live site; the mobile gallery has no horizontal overflow. Production build succeeds with two workers, avoiding excessive local build concurrency.

## Data control revision

Twelve unit tests pass. New checks cover exact-title/revision/trash guards, permanent CV removal, account removal cascading to active/trashed CVs and sessions, failed login/recovery after erasure, persistence after reopening SQLite, and isolation of another account. Local-copy tests preserve guest drafts and other accounts while notifying current tabs. Local HTTP integration checks pass for password reauthentication, unauthorised/cross-origin/other-owner rejection, stale revision rejection, refusal to restore erased CVs, session revocation and exact-email confirmation. A manual snapshot of the fictional local QA database passes SQLite integrity validation. External email and backup services remain unconfigured.

The backup preparation revision brings the suite to fifteen tests. A synthetic SQLite WAL snapshot encrypts and restores correctly; wrong keys and corrupted ciphertext fail without leaving an unauthenticated target, and existing output files are preserved. Mock B2 transport validates streamed bytes and receipts and refuses unrestricted keys or untrusted endpoints. Daily-status tests prevent duplicate same-day uploads across restarts and allow retry after failure. These are offline checks, not evidence of real B2 delivery. Bucket creation/privacy/encryption and the pending Resend domain were observed in the owner's signed-in consoles. Backup scheduling remains disabled until credentials, key recovery and retention are configured.

## Email and encrypted backup release, 24 October 2026

- 17 automated tests pass; type checking and production build pass.
- Local HTTP checks pass for disabled mail configuration, same-origin enforcement, successful verification, purpose/single-use rejection, password reset and session revocation. Existing storage/erasure HTTP regression passes.
- Real B2 encrypted snapshot downloaded and restored into a new isolated database; integrity and original production persistence fixture verified.
- cvmais.win verified in Resend; owner-approved delivery test reported Delivered. Replaced the first unused sending key after revoking it. No key values are included in source.

- DGC v9 / source 56a5284: live health and auth pages HTTP 200; email enabled confirmed; original account/CV survived redeployment. Local browser confirmation succeeded and persisted to SQLite.

## Public-domain release

19 automated tests pass, including exact origin allowlist/lookalike rejection and portable backup malformed/oversize checks. Local storage/erasure and email HTTP regression pass. Browser guest import review, confirmation and undo pass with a fictional portrait CV; previous local draft restored after undo. Production build passes. Both new domains resolve to 103.138.88.28 and pass real HTTPS checks; www redirects to the root.

DGC v10 / source 482826c: live checks pass HTTPS on primary/legacy, www path/query redirect, primary canonical, sitemap/robots, private-path noindex, both-origin login and shared CV create/read/update. The original persistence fixture remains unchanged. The additional fictional test CV was removed and both test sessions signed out. Mobile migration guide has equal client/scroll width (375px at 390px viewport).

## Backup operations release

24 tests pass, including stale/future/missing status, retained successful receipt after failure, persisted incident deduplication, failed alert/recovery retry, independent detection of a stopped worker and secret-free alert content. Production build passes. Local HTTP tests verify anonymous/unverified operator/verified normal account denied, verified configured operator allowed, status details contain no upload IDs, public probe is coarse and backup failure leaves normal DB health HTTP 200. Mobile operations page has equal client and scroll width at 375px content width.
