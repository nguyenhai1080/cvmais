# CVMais Analytics Dashboard v2 (cookieless)

## Delivery
- Read-only Analytics section at /operacoes under the existing verified operations account.
- 7, 30, 90-day controls; daily event trend; daily accessible table; source breakdown; most-viewed page paths.
- Events: page_view, cv_builder_started, cv_template_selected, cv_pdf_exported (PDF download initiated, not verified save).
- Existing backup status/monitoring remains available on the same restricted page.
- Mozambique/Africa-Maputo calendar days are used; aggregates contain no CV content or user identifiers.
- All views are event counts, not unique visitors. The displayed PDF/builder ratio is an event ratio and not a person-level conversion rate.
- Referrer groups for page views are not attribution for CV creation or PDF events. Google Search Console provides search impressions and queries separately.
- Source category internal means a page view after navigating within the app; it is not a distinct acquisition source.
- 90-day retention remains unchanged; no database schema migration, auth change, third-party analytics, cookies or new tracking endpoints.
- Operational API returns 90 days of aggregates only to authorized and email-verified operations accounts. The client filters 7/30/90 days.

## Production verification
- After merging, redeploy on the DGC CVMais project, preserving /data/cvmais.sqlite, Resend credentials and private backups.
- Verify /operacoes after operator login and email verification. Check window changes, charts, sources and page ranking.
- Confirm /api/storage/operations rejects unauthenticated requests and daily counters remain unchanged on deploy.
- Existing SEO checks for 17 sitemap URLs and private noindex continue to run.

## v2.1 chart axis readability
- The 7-day chart labels every day. The 30-day chart labels every 5th day and the last day. The 90-day chart labels every 15th day and the last day.
- All daily bars remain present (no data resampling). Active days are highlighted with a subtle background and a dot, including zero-page-view days that have builder activity.
- Date and exact page-view/PDF/builder values remain available via native hover titles and the accessible Daily Table.
- Narrow screens scroll the chart horizontally; report windows and existing metrics remain unchanged.
