# CVMais SEO-05 — Weekly technical monitoring and GSC baseline

## Technical audit on GitHub
- Read-only GitHub Actions check runs every Monday at 09:00 **Africa/Maputo** (07:00 UTC), plus manual runs.
- The existing production audit inspects 17 sitemap URLs, five occupation pages, canonical, BreadcrumbList, internal links, robots.txt and `noindex` on private pages.
- Scheduled/manual runs fail if checks fail, making failures visible in GitHub Actions (notification depends on account settings).
- Push-triggered runs remain informational because production deploys are manual and may lag GitHub.
- The audit does **not** measure Google indexing, search ranking, impressions, clicks, or CV downloads.
- No credentials, user CV data, analytics cookies, production deployment, or hosting changes.

## Google Search Console — index and performance tracking
1. Open the verified Domain property `cvmais.co.mz`.
2. Confirm `https://cvmais.co.mz/sitemap.xml` is `Success` with 17 discovered URLs.
3. For each of the following, use **URL Inspection → Google Index**, not just Live Test:
   - `https://cvmais.co.mz/`
   - `https://cvmais.co.mz/modelos`
   - `https://cvmais.co.mz/orientacoes`
   - `https://cvmais.co.mz/modelos/para/motorista`
   - `https://cvmais.co.mz/modelos/para/vendedor`
   - `https://cvmais.co.mz/modelos/para/estudante`
   - `https://cvmais.co.mz/modelos/para/administrativo`
   - `https://cvmais.co.mz/modelos/para/enfermeiro`
4. Record each URL's `Indexed` / `Not indexed` status, **Google-selected canonical**, and last crawl date. If not indexed, inspect the reason before requesting indexing.
5. In **Performance → Search results**, filter **Country: Mozambique**, optionally Search type `Web`, and record 7-day and 28-day **clicks, impressions, CTR, average position**, plus queries and landing pages.
6. On a newly verified property, indexing and Performance aggregate reports can lag. Never equate `Discovered pages` with `Indexed pages`. A `site:` search is not a reliable index inventory.
7. Once there are meaningful impressions, prioritize improvements by query/page intent and CTR rather than creating similar pages for more occupations.

## Privacy and measurement
Do not send CV names, emails, phone numbers, profile text, user identifiers, or document content to analytics. A future CV activation funnel needs a separately reviewed, consent-aware implementation and privacy notice. No analytics tags are added by SEO-05.
