# Vibehost deployment

## Active deployment: DGC

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
