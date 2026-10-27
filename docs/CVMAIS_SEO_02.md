# CVMais SEO-02

Portuguese (pt-MZ) technical SEO. Canonical domain: https://cvmais.co.mz

Changes:
- Search-oriented titles and descriptions for the homepage, model library and guides.
- Honest structured data for the web application, model breadcrumbs and guide articles.
- Google Search Console verification using optional GOOGLE_SITE_VERIFICATION env variable.
- Noindex response headers for account, editor, saved CV, recovery and operations routes.
- Keep these noindex pages crawlable (except the restricted /operacoes endpoint) so search engines can read the directive.
- Preserve the existing sitemap and application functionality.

Before merge/deployment:
1. Run npm ci, npm test, npm run typecheck, npm run build.
2. Inspect /robots.txt, /sitemap.xml, public canonical and JSON-LD.
3. Inspect X-Robots-Tag on /conta, /criar-cv, /meus-cvs.
4. Review the redirects from previous domains and check authentication on private routes.
5. After deployment verify Search Console and submit /sitemap.xml.

No credentials or user CV data are changed. This is source-only until merged and deployed.
