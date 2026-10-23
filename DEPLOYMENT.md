# Vibehost deployment

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
