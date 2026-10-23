# Vibehost deployment

## Active deployment: DGC

The required owner is DGC, email `nguyenhai1080@gmail.com`. The exposed connector still identifies `nguyenhai1080+basic@gmail.com` / GST Vietnam and must not be used for DGC mutations. Deployment was completed through the user's browser after its visible profile confirmed the DGC email, display name `Công ty Cổ Phần Đầu Tư và Truyền Thông Số`, account ID `cmucbxmf00a5j0h5fjwzjwky7`, Pro plan.

- Live URL: https://cvmais-dgc.n1.tinhgon.xyz
- Project ID: `cmvlbkah40mef0i5fzrjkbvcd`
- Management page: https://v2.tinhgon.xyz/projects/cmvlbkah40mef0i5fzrjkbvcd
- State: online, version 1, deployed 24 October 2026.
- Application commit: `e6fb6a5` (structured editor and browser PDF download).
- Source: `https://github.com/nguyenhai1080/cvmais.git`, default branch `main`, repository root.
- Runtime: 0.3 CPU, 512 MB RAM, application port 3000.
- Automatic GitHub deployment: off, as shown in the DGC project overview. Pushes do not deploy by themselves.
- Custom domain: not connected. `cvmais.co.mz` still requires DNS/domain setup.
- No database or persistent server data. Drafts are saved in the visitor's browser; PDFs are generated there.

Live HTTPS checks passed for the homepage, editor, health endpoint and both local font files. The deployed editor was used to add a profile and a structured experience and download a real PDF. The downloaded file was opened and verified as A4 with correct Portuguese accents and content. The DGC projects list and project overview both showed CVMais online. The old GST project was not modified after the user's account correction.

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

For application updates, push the reviewed code to `main`, invoke Vibehost redeployment for the project ID above, wait for the deployment job, then check `/api/health` and the affected UI. Consult the platform diagnosis and build logs if a deployment fails. Do not assume a Git push itself starts a deployment.
