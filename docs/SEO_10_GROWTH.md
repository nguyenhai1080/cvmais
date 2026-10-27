# CVMais SEO-10 — Internal links and CV Builder progression

## Search Console baseline
As of 27 October 2026, the verified property sc-domain:cvmais.co.mz returned 17 submitted URLs, no sitemap errors or warnings and no query/page/country performance rows. One daily response for 27 Oct shows 0 clicks and 0 impressions; this is early/possibly incomplete data, not evidence of zero eventual search interest or that 17 URLs are indexed.

## Scope
- Add a contextual discovery section for the existing five profession guides directly to the homepage, after the template gallery.
- Preserve the profession hub in /modelos.
- Link the existing first-CV guide to the existing /modelos/para/estudante page.
- Add a clear end-of-article CV builder action on every existing profession guide, with a link to the PDF review guide.
- Improve English labels in the profession hub and related first-CV guide text.
- No new URLs, keyword claims, job demand rankings, fabricated credentials, cookie tracking, analytics changes, database changes or PDF changes.

## Verification
- Run npm test, typecheck, production build, route smoke tests in GitHub Actions.
- After Vibehost DGC redeploy, verify homepage links to all 5 professions and each editor action opens the intended template. Verify the existing /data volume, Resend, backups and operator dashboard are unaffected.
- Review Search Console weekly using the existing Windsor.ai connection; avoid choosing growth priorities from empty query data.
- Treat total page views, editor starts and PDF initiations as event counts, not unique-user conversion; no attribution of downloads to Google.
