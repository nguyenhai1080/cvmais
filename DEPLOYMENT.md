# Vibehost deployment

## Active deployment: DGC

Latest release, 28 October 2026: **v39**, application source `9f62ad2`, twelve original sector CV compositions. Deployed through the visibly confirmed DGC browser nguyenhai1080@gmail.com; connector still GST and unused for mutations. V39 Online confirmed. Official catalogue has 26 distinct compositions; the homepage has twelve distinct curated designs including eight new sector layouts. All twelve served PNG previews match the reviewed local PDF thumbnails byte-for-byte. Public counts and SEO descriptions agree with the actual catalogue. Original account/CV persistence, app/backup health, enabled mail/worker heartbeat and SEO 15/15 pass. Browser verifies PT/EN gallery, telecom matching Circuito/Prumo and public Prisma preview. Screenshot: work/cvmais-sector-designs-v39.png. No database migration, environment/credential change, real CV edit or real email send. Target 120 is explicitly incomplete: 94 compositions outstanding in TEMPLATE-EXPANSION.md.

Latest release, 28 October 2026: **v38**, source `e6760fa`, mobile editor navigation. Deployed through the browser after visible DGC nguyenhai1080@gmail.com confirmation; connector still GST and unused for mutations. V38 Online confirmed in the deployment dialog and overview. Official editor contains the new section selector and mobile toolbar; at 390px fields are 16px, toolbar sticks at 0px during section navigation and content/scroll width is 375px without overflow. Screenshot: work/cvmais-mobile-editor-v38.png. Existing account/CV persistence, mail enabled/worker heartbeat, application/backup health and SEO 15/15 passed. No environment, account credential, database or real CV edits were required. Physical Android acceptance remains pending.

Current release, 28 October 2026: **v37**, application source `34802ec` (includes `2a87029`), official URL https://cvmais.co.mz. Browser profile visibly confirmed DGC `nguyenhai1080@gmail.com`; connector remains GST and was not used for mutations. Production acceptance: encrypted mail queue enabled, independent worker heartbeat ready, original account/CV persistence preserved, app/backup health 200, anonymous operations denied and SEO 15/15 passes. Live PT/EN navigation checked. Verified sender remains cvmais.win; email links use the official domain.

Release incident: v35 exposed mail disabled because a separate optional encryption-root variable took precedence over the valid existing backup root. Code-only rollback restored v34 as history version v36, with mail enabled confirmed; database/environment were retained. Source 34802ec derives the separate mail cipher key solely from the existing BACKUP_ENCRYPTION_KEY. V37 then passed live acceptance. No secrets were revealed or changed, and no real authentication email was requested during this release.

The entries below retain earlier deployment history; their version/domain details are historical.

The required owner is DGC, email `nguyenhai1080@gmail.com`. The exposed connector still identifies `nguyenhai1080+basic@gmail.com` / GST Vietnam and must not be used for DGC mutations. Deployment was completed through the user's browser after its visible profile confirmed the DGC email, display name `Công ty Cổ Phần Đầu Tư và Truyền Thông Số`, account ID `cmucbxmf00a5j0h5fjwzjwky7`, Pro plan.

- Primary live URL: https://cvmais.win
- Legacy URL: https://cvmais-dgc.n1.tinhgon.xyz
- Project ID: `cmvlbkah40mef0i5fzrjkbvcd`
- Management page: https://v2.tinhgon.xyz/projects/cmvlbkah40mef0i5fzrjkbvcd
- State: online, version 11, deployed and checked 24 October 2026.
- Application commit: `f8c29ab` (backup operations and persistent incident/recovery alerts).
- Source: `https://github.com/nguyenhai1080/cvmais.git`, default branch `main`, repository root.
- Runtime: 0.3 CPU, 512 MB RAM, application port 3000.
- Automatic GitHub deployment: off, as shown in the DGC project overview. Pushes do not deploy by themselves.
- Custom domain: cvmais.win primary, www.cvmais.win redirects to root with path and query preserved. Both have DNS and valid HTTPS. Cloudflare A @ and A www point to 103.138.88.28, DNS-only. cvmais.co.mz is not attached.
- SQLite database: `/data/cvmais.sqlite`, with `/data` declared as persistent storage. DATABASE_PATH and APP_ORIGIN are configured in the DGC project. Guest drafts and PDF generation remain in the browser.

Live HTTPS checks pass for the homepage and database-backed health endpoint. The gallery shows all six new templates and enlarged previews. Production API checks pass for credentials, sessions, CSRF protection, ownership, another-device session, revision conflicts, trash/restore, recovery and logout.

Version 4 also passes production portrait save/read and old-client photo preservation checks. The existing version-2 account/CV persistence probe still passes after this deployment. All six portrait previews load on DGC; enlarged preview works and mobile document width equals scroll width (375 px). `cvmais-portrait-templates-dgc.png` captures the actual live gallery.

A fictional account and CV were saved on version 2. After deploying version 3, a fresh login retrieved the same CV, revision and content successfully, verifying actual persistence through redeployment. Test credentials are kept only in ignored local work files and are not included in source archives. The old GST project remains untouched.

Account passwords use salted scrypt; session and recovery tokens are hashed. Permanent CV/account erasure is live. Encrypted daily B2 backups are live and a real remote restore has passed. The authentication-email release adds optional verification and email reset; code recovery remains available. See OPERATIONS-SETUP.md for activation and limits. The container includes `scripts/backup-db.mjs` for a consistent manual backup. Persistent storage does not replace backups.

For updates, use the DGC management page above while signed in as the confirmed owner. Use connector deployment tools only after `whoami.email` reports the DGC address. Do not reuse the GST project ID below.

## Historical GST deployment (wrong destination; do not redeploy)

- Live URL: https://cvmais.n1.tinhgon.xyz
- Project ID: `cmvlan14e0m1i0i5fy9egu3uu`
- Deployment ID: `cmvlan19z0m1m0i5ff1m8zyj9`
- Deployment job: `cmvlan1a90m1y0i5fpxbb52it` (succeeded)
- Application commit: `fe06a17aedd3d00b92bc01e885d3b0c8607451a1`
- Source: https://github.com/nguyenhai1080/cvmais.git
- Branch: `main`; build context: repository root; Dockerfile: `Dockerfile`.
- Runtime: 1 CPU, 512 MB RAM; application port 3000.
- Persistent data: none. Drafts remain in the visitor's browser session.
- Custom domain `cvmais.co.mz`: not connected; the platform reports no custom domains.

Validated over HTTPS: homepage, CV editor, health endpoint and both editorial image assets return HTTP 200. Online browser checks confirm gallery model selection, live preview, saving a session draft, PDF action disabled for an empty CV and enabled after entering a name and a content section. No horizontal overflow at 390 px for the editor and homepage. The PDF export still uses the browser print dialogue; printed page layout was not manually inspected.

Historical record only. Do not redeploy this GST project. Use the active DGC project and verified DGC browser profile above.

Version 9: production health and all authentication pages return HTTP 200. `/api/storage/email-status` confirms enabled=true. The original version-2 account/CV fixture still passes fresh-login persistence checks. Live account UI offers email reset and recovery-code fallback. Resend reports the owner test email Delivered; the unused original key was revoked before replacement. Daily encrypted B2 backups remain enabled.

Version 10: both custom domains pass HTTPS; www preserves path/query when redirecting to cvmais.win. APP_ORIGIN=https://cvmais.win, APP_ALLOWED_ORIGINS=https://cvmais-dgc.n1.tinhgon.xyz. Actual HTTP checks passed both-origin login, CV create/read/update across origins, original persistence fixture and safe removal of only the new fictional test CV. Canonical homepage, sitemap, robots and private-path noindex headers verified. Existing guest drafts stay on the old origin; no automatic redirect or upload moves them. The old origin displays migration guidance and guest JSON import supports review/undo. Mobile migration guide has no horizontal overflow at a 390px viewport (375px content width with scrollbar).

Version 11: /api/health/backup returns HTTP 200 with only {status:ok,service:cvmais-backup}; this confirms a valid recent backup receipt and a current worker heartbeat. The application DB health remains 200, anonymous /api/storage/operations returns 403, and /operacoes has noindex headers. The original persistence fixture still passes. Runtime logs confirm the independent backup alert monitor started. DGC OPERATIONS_EMAIL=nguyenhai1080@gmail.com and BACKUP_ALERTS_ENABLED=true; no real incident was induced and no new alert delivery is claimed. The configured owner must sign in/register normally and verify their email to view the private operations page. Whole-host/container outage monitoring still requires an external service.

24 October 2026 follow-up (application remains v11 / f8c29ab; documentation only): three external StatusCake monitors are active, every 300 seconds, with owner email routing. A separate clearly named simulation produced Down and Up email entries with Sent status and is now paused. Live cloud portrait/data regression passed. The owner confirmed registration, email verification, received password reset and subsequent sign-in, reporting no significant difficulty. Technical mobile/PDF regression passed; wider real-device/target-market pilot remains pending. See EXTERNAL-MONITORING.md and PILOT.md.

## DGC v12 — 25 October 2026

Source c436702. Browser profile confirmed nguyenhai1080@gmail.com; connector remained GST and was not used for deployment. Pushed main, manually redeployed the existing DGC project cmvlbkah40mef0i5fzrjkbvcd. Platform reports v12 online, 100%.

Live https://cvmais.win: original refreshed hero and editor sample selector with twelve industries confirmed visually. Four guide routes/canonical URLs, sitemap six entries, unknown-guide 404 and DB health pass. Original persistence fixture and cross-origin portrait/CV save/read tests pass; created test CV removed by the established test script. No environment, database schema or credentials changed.

## DGC v13 — 25 October 2026

Source 11a646b. Verified signed-in browser owner nguyenhai1080@gmail.com, existing DGC project cmvlbkah40mef0i5fzrjkbvcd; connector still GST, not used for mutations. Manual deployment completed at 100%, v13 online. No environment or SQL schema changes.

Live checks pass: Portuguese interface and CV defaults, explicit English interface/CV selectors, matching document language and no horizontal overflow. Restored both choices to Portuguese after UI inspection. Original account/CV fixture remains unchanged after deployment. Primary/legacy authenticated save/read preserves both portrait and English CV language. DB health and backup health return 200; public guides/canonical/sitemap checks pass. Screenshot: cvmais-language-editor-v13.png.

## DGC v14 — 25 October 2026

Source 04cee9b. Existing DGC project cmvlbkah40mef0i5fzrjkbvcd, browser owner nguyenhai1080@gmail.com confirmed; connector still GST and not used to mutate. Manual redeploy completed, 100%, v14 online. No schema, environment, credential or PDF-renderer changes.

Live Portuguese review dialog shows the selected Portuguese CV language and actionable fields; clicking the profile field link focuses cv-profile. No owner content was edited. Proof: cvmais-review-v14.png. DB and backup health HTTP 200; guide/canonical/sitemap checks, original persistence fixture and cross-origin portrait/English-language CV save/read tests all pass.

## DGC v15 — 25 October 2026

Source 94ed35f. Verified DGC browser account nguyenhai1080@gmail.com and existing project cmvlbkah40mef0i5fzrjkbvcd; connector remains GST and was not used for mutation. Manual deploy completed at 100%, v15 online.

Live gallery: New filter shows Código, Vital, Estrutura and Acolher; all four PNGs load and validate, and New + Engineering returns Estrutura. Total collection now ten models. Account/CV persistence and primary/legacy authenticated save/read retain the new servico model, English CV language and portrait; original fixture unchanged. DB/backup health HTTP 200; public guidance and canonical/sitemap checks pass. No schema, credential or environment changes. Proof: cvmais-industry-templates-v15.png.

## DGC v16 — 25 October 2026

Source 946b970. Fresh browser profile confirmed nguyenhai1080@gmail.com and existing DGC project cmvlbkah40mef0i5fzrjkbvcd. Manual deployment completed at 100%, v16 online. No environment, credential or database schema changes.

Live /modelos: all twelve industry filters return exactly six specialised editions. All 72 new PNGs pass HTTP and PNG-signature checks. The complete library retains ten general models (82 choices). Original persistence fixture survives redeployment; authenticated primary/legacy save/read round-trip preserves saude--formacao, portrait and English CV language. The newly created fictional cross-origin test CV was removed by the established regression script. Guide metadata, seven-entry sitemap, unknown-guide 404 and DB/backup health checks pass. Proof: cvmais-six-per-industry-v16.png.

## DGC v17 — 25 October 2026

Source 12510b5. Browser profile visibly confirmed nguyenhai1080@gmail.com before deployment of existing DGC project cmvlbkah40mef0i5fzrjkbvcd. Manual deployment completed at 100%, v17 online. No environment, schema, credential or PDF-renderer changes.

Live library: enfermagem and nurse with health return six models. The first-job style narrows the set to Cuidar · Formação. Enlarged preview links retain context; opening the editor and following its return link restores all three filters. New blank CV retains Portuguese default. DB and backup health, seven-entry sitemap/guides, original account/CV persistence and primary/legacy authenticated photo/English/model round-trip checks pass. Proof: cvmais-template-search-v17.png.

## DGC v18 — 25 October 2026

Source bb6bf7d. Fresh browser profile verified nguyenhai1080@gmail.com, existing DGC project cmvlbkah40mef0i5fzrjkbvcd. Manual deployment completed at 100%, v18 online. No schema, environment, credential or PDF-renderer changes.

Live browser: telecom returns 14 choices, communication remains 8, telecomunications shows the approximate-results notice. English topic chips display Telecommunications/Software development/Data and analytics on the first result; clicking Telecommunications returns the same 14. Portuguese preference restored. DB/backup health, sitemap/guides, original account/CV persistence and authenticated primary/legacy portrait/English/specialised-model round-trip checks pass. Proof: cvmais-telecom-tags-v18.png. Search vocabulary, references and maintenance documented in SEARCH.md.

## DGC v19 — 25 October 2026

Source b6127a6. Fresh browser profile confirmed DGC nguyenhai1080@gmail.com before manual deployment of existing project cmvlbkah40mef0i5fzrjkbvcd. Platform reports 100%, v19 online. No environment, credential, schema or PDF-renderer changes.

Live browser: tel offers Telecomunicações (14); keyboard selection opens the canonical tag query. Choosing Saúde then offers a 14-result recovery action; activating it clears area/style and retains Telecomunicações. Search telecom shows the inline counted suggestion and 14 actual results. Original account/CV persistence, primary/legacy photo/English/model round-trip, sitemap/guides and DB/backup health all pass. Proof: cvmais-search-suggestions-v19.png.

## DGC v20 — interview guidance

Source ff735d7. Browser profile confirmed DGC nguyenhai1080@gmail.com before manual deployment of existing project cmvlbkah40mef0i5fzrjkbvcd. Platform reports v20 online, 100%, deployment timestamp 2026-10-26 00:02. No schema, environment, credential or PDF-renderer changes.

Live checks confirm all five guide links on the homepage, five guide cards in /orientacoes, the new interview article, labelled fictional examples, temporary STAR practice fields/checklist and direct editor CTA. HTTP checks pass guide canonicals, unknown-guide 404 and eight-entry sitemap; DB/backup health and original account/CV persistence pass. Established primary/legacy authenticated photo/English/specialised-model round-trip passes. The local browser additionally confirmed copied notes, translation without rewriting notes, and clearing after reload and navigating away/back. Proof: cvmais-five-guides-v20.png.

## DGC v21 — 26 October 2026

Source 9a51ca6. Fresh browser profile confirmed DGC nguyenhai1080@gmail.com before manual deployment of existing project cmvlbkah40mef0i5fzrjkbvcd. Platform reports v21 online, 100%. No schema, environment or credential changes.

Live checks: homepage exactly twelve editorial cards and no load-more control, full library 118, engineering filter nine; all 36 new PNG assets pass HTTP/PNG checks, all twelve homepage images load. Authenticated primary/legacy save/read preserves new tecnologia--digital ID, portrait and English CV language; original account/CV fixture survives redeployment. Five guides, eight-entry sitemap, canonical/404, DB and backup health pass. Proof: cvmais-twelve-featured-v21.png. New catalogue search counts follow the expanded registry (telecom 20). The underlying renderer geometry remains the existing tested nine-family system.

## DGC v22 — 26 October 2026

Source 505209b. Connector still reported GST; no connector mutation performed. Fresh browser profile confirmed DGC nguyenhai1080@gmail.com before redeploying existing project cmvlbkah40mef0i5fzrjkbvcd. Platform confirmed v22 online at 100%. No database schema, environment, credentials or domain/DNS changed.

Live verification: /sobre, /termos, /privacidade show owner-confirmed Soltech LDA and admin@soltech.co.mz; homepage twelve curated editions, explicit shared-family explanation and no unexplained indices; sitemap eleven URLs; all four WOFF2 assets served. DB/backup health return 200 and the original fictional account/CV persistence fixture passes unchanged. Editor browser at 390px: industry chooser shows nine cards in two columns, document width 375px (no horizontal overflow), all selects named; Portuguese default. Only dialog/filter state changed on production, no guest CV edited. Proof: work/cvmais-template-picker-v22.png. Actual PDF download and PT/EN review behavior were verified with the local synthetic fixture.

## Official domain migration — 26 October 2026

Owner registered cvmais.co.mz. Registar apex A updated from 8.8.8.8 / TTL 14400 to DGC 103.138.88.28 / TTL 300; existing www CNAME to apex retained. NS, MX, mail and ftp records were not edited. Authoritative Registar, Cloudflare and Google DNS confirm the new A. DGC project bound apex and www, with valid TLS verified against the DGC address without disabling certificate validation.

Application changes prepared: official canonical/share/sitemap/robots origin cvmais.co.mz; exact old origins retained for account requests; public old URLs redirect preserving paths/query, while editor/auth/API and migration guide remain accessible at old origins so browser drafts and pending saves are not stranded. New www URLs redirect to apex. Migration guide covers both cvmais.win and original DGC origin and the current backup disclosure.

DGC APP_ORIGIN updated to https://cvmais.co.mz; APP_ALLOWED_ORIGINS retains https://cvmais.win and https://cvmais-dgc.n1.tinhgon.xyz. The already-verified cvmais.win mail sender and scoped Resend key are deliberately retained; new account email links use APP_ORIGIN after redeploy. No new mailbox, mail provider or credentials created. Domain-specific email sender migration is a separate follow-up.

## DGC v23 official domain acceptance — 26 October 2026

Source 73e9c74, DGC nguyenhai1080@gmail.com, same project. Vibehost confirmed v23 online at 100%. Existing schema, database, backup storage and credentials unchanged. Official apex is platform's default address; application enforces the official www-to-apex route. The platform's earlier www.cvmais.win-to-cvmais.win pair remains intentionally available, followed by application public redirects.

50 automated tests and production build pass. Live TLS-valid HTTPS probes to DGC verify apex/www, public old 308 redirects preserving query, retained old editor/auth/migration pages with noindex, new canonical/share/sitemap/robots, eleven sitemap URLs, DB/backup health and same pre-existing synthetic account/CV/revision on all three origins. Hostile origin rejected; email enabled. No real user content changed. Validation uses the independently DNS-confirmed server address with normal TLS SNI/hostname verification because the local network resolver still caches old 8.8.8.8 (original TTL 14400); browser opening from this network reports a certificate-name error and was not bypassed. Authoritative Registar, Google and Cloudflare DNS return 103.138.88.28 / TTL 300. Treat remaining local DNS cache expiry as a propagation limitation, not successful browser verification from that network.

Three existing StatusCake production URLs updated to the official domain, preserving five-minute cadence and owner email group. Sender still uses the already-verified cvmais.win domain, while new confirmation/reset links use APP_ORIGIN cvmais.co.mz. Screenshot: work/cvmais-official-domain-v23.png.

## Prepared successor to v23 — original compositions and industry letters

Prepared 27 October 2026; not deployed at this checkpoint. Four new compositions (Atlas/Aurora/Fólio/Vértice), fourteen public designs, twelve homepage selections, legacy model preservation, sixth guidance page with industry-specific letter examples. No DB/schema/environment/mail-sender/credential changes.

53 tests, typecheck, production build and local HTTP checks pass. 495 PDF fixtures including the four new portrait samples and their PT/EN/long cases pass. HTML preview structure and named letter filters verified by server rendering; full interactive browser and physical-device acceptance are pending.

Connector whoami still returns GST nguyenhai1080+basic@gmail.com after the owner reported reconnecting DGC. No connector mutation or deployment performed. Owner explicitly authorised using their signed-in browser, but the browser-control namespace is unavailable in this turn and the native Computer Use pipe failed after documented retries/reset. The existing DGC project remains cmvlbkah40mef0i5fzrjkbvcd. Once browser control is restored, verify visible profile nguyenhai1080@gmail.com, redeploy from main, then verify fourteen public designs, twelve home selections, six guides/new letter tool, twelve sitemap URLs and persistence/health. Never deploy the GST project.

## Live acceptance after owner SEO deployment — 27 October 2026

Owner confirmed SEO was deployed. Synced clean local main by fast-forward to origin/main c20a293, preserving five profession landing pages and existing SEO CI/weekly audit. No deployment mutation performed; the connector still identifies GST, so the owner's existing DGC deployment was verified directly instead.

Current official-site HTTP checks pass fourteen public designs, twelve homepage selections including Atlas/Aurora/Fólio/Vértice, six home guides, new industry-letter controls and illustrative text, all four new PNGs and seventeen sitemap URLs including five profession pages. Each of four live PNGs matches the already-validated local PDF thumbnail by SHA-256. scripts/check-seo-production.mjs reports 15/15 passed. Normal TLS access now succeeds from this network without pinned lookup, so the previous local DNS-cache issue is no longer observed.

Existing synthetic account/old CV revision persist across official and previous origins. A newly-created fictional CV was saved through all four new model IDs, read from the previous domain and retained English language, portrait, authored profile and education. Only that new synthetic document was cleaned up; original fixture was unchanged. DB and backup probes return 200; mail is enabled. No real user CV, schema, environment, credentials, DNS or SEO settings changed. Interactive browser/physical-device testing remains pending because no browser-control tool is exposed in this turn.


## DGC v32 — simplified account access (27 October 2026)

Deployed source ade2cc3 through the signed-in DGC browser, visibly confirmed nguyenhai1080@gmail.com and project cmvlbkah40mef0i5fzrjkbvcd. Connector still identifies GST and was not used for mutations. Vibehost initially applied its recent-deployment cooldown; waited, then v32 became Online. No resources, schema, secrets or existing recovery codes were migrated.

Official-site acceptance: new privacy/access policy present; established synthetic account signs in; authenticated security endpoint exposes only enabled/disabled status, never code/hash; Resend remains enabled; original CV revision/model/content preserved; application and backup health HTTP 200. No production code rotated, password changed or authentication email sent during acceptance. Public SEO audit 15/15 passes. Local suite 76/76, typecheck/build and HTTP storage regression pass. PT/EN account security inspected locally. Physical Android pilot still pending.


## DGC v33 — WhatsApp invitations and channel launch kit (27 October 2026)

Source a4bfccc deployed through the browser after visible DGC nguyenhai1080@gmail.com confirmation. V33 Online verified. Official homepage invitation and public-only wa.me URL checked; avatar and cover downloads match source SHA-256; application and backup health pass, public SEO 15/15. Browser preview works on official site. Local tests 78/78, typecheck/build pass and simulated 390px layout checked. No invitation sent, no contacts accessed, no WhatsApp channel created. Channel-follow CTA stays hidden until owner supplies its real official link. Launch kit ZIP includes the two original ImageGen images, launch guide and exact prompts.


## DGC v34 — homepage usability and Sharing navigation (27 October 2026)

Source 519d7ea includes aa999a4. Browser deployment used visibly confirmed DGC nguyenhai1080@gmail.com, project cmvlbkah40mef0i5fzrjkbvcd; v34 Online confirmed. Removed the pricing/payment band and replaced header/footer Gratuito with Sharing targeting /#sharing. Sharing is now its own area, with the existing explicit WhatsApp invitation and copy controls. No channel/follower claims or automated invitations.

Homepage changes: sticky homepage header and skip link, hero View templates action, how-to before the catalogue, four-column desktop/two-column phone featured gallery with twelve designs and shorter captions, compact illustration/guidance block, three PT/EN FAQ accordions. Six existing guides and profession SEO links retained. Library filtering and existing saved models retained.

Optimised source images: desktop hero 44,360 bytes (mobile 22,098), community image 92,320 bytes, replacing 3,874,825 bytes of PNG delivery for these two placements. About 96.5% reduction for these image resources; this is not a measured overall page-speed claim. Original images retained.

Validation: production build/typecheck and existing 78 tests passed. Local browser checked PT/EN FAQ, twelve-card preview, mobile menu closes after Sharing, target appears below sticky header, no horizontal overflow at simulated 390px, responsive mobile hero source chosen. Official HTTP verification checks Sharing, removed band, 12 designs, 6 guides, image sizes and app/backup health. Production SEO 15/15 passes. Physical Android pilot remains pending.
