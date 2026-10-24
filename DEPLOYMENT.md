# Vibehost deployment

## Active deployment: DGC

The required owner is DGC, email `nguyenhai1080@gmail.com`. The exposed connector still identifies `nguyenhai1080+basic@gmail.com` / GST Vietnam and must not be used for DGC mutations. Deployment was completed through the user's browser after its visible profile confirmed the DGC email, display name `Công ty Cổ Phần Đầu Tư và Truyền Thông Số`, account ID `cmucbxmf00a5j0h5fjwzjwky7`, Pro plan.

- Live URL: https://cvmais-dgc.n1.tinhgon.xyz
- Project ID: `cmvlbkah40mef0i5fzrjkbvcd`
- Management page: https://v2.tinhgon.xyz/projects/cmvlbkah40mef0i5fzrjkbvcd
- State: online, version 9, deployed and checked 24 October 2026.
- Application commit: `56a5284` (verified-domain authentication email and single-use account recovery).
- Source: `https://github.com/nguyenhai1080/cvmais.git`, default branch `main`, repository root.
- Runtime: 0.3 CPU, 512 MB RAM, application port 3000.
- Automatic GitHub deployment: off, as shown in the DGC project overview. Pushes do not deploy by themselves.
- Custom domain: not connected. cvmais.win is configured for email sending only; website DNS and cvmais.co.mz are not attached.
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
