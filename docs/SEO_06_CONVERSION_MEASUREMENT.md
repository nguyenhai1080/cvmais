# CVMais: First-party aggregate analytics without cookies

- The website uses no Google Analytics, advertising tracking, third-party analytics scripts, persistent visitor IDs, or consent pop-up.
- A small first-party POST to /api/analytics increments an aggregate daily counter with allowlisted event, sanitized page, and broad referrer category for page views. No event history or user-level records are saved.
- Counters represent event totals, **not unique visitors**, completed file saves, or a joined user conversion funnel.
- Because conversions have source=none, source category cannot be reliably joined to PDF downloads. Google Search Console remains the authoritative tool for search queries, country and clicks.
- Event categories: page_view, cv_builder_started, cv_template_selected, cv_pdf_exported (PDF download initiated).
- Source categories: direct, internal, google, bing, duckduckgo, social, other. No referrer URL/path or query terms stored.
- The API rejects cross-origin requests, extra fields and unknown URL routes, and never uses cookies or session identifiers in event payloads.
- Aggregates are held in the CVMais persistent SQLite file at /data/cvmais.sqlite. Lazy expiry deletes day partitions after ~90 days. Existing database and backup paths are unchanged.
- Read-only summaries for the last 30 days are available only through the existing verified operations account endpoint at /api/storage/operations.
- Data is sent over HTTPS; hosting/CDN/proxy may still generate access logs containing IP addresses. Review and minimize those separate logs before claiming compliance. Cookie-free by itself does not exempt tracking from all Mozambique data protection law.
- If a value for NEXT_PUBLIC_GA4_MEASUREMENT_ID remains in the Vibehost config, it is ignored by this build. Remove it to prevent confusion. Delete the old GA4 stream if no longer needed; historical GA4 data is not modified here.

**Deployment:** Redeploy CVMais from main using correct DGC Vibehost account. Preserve volume /data, auth, Resend, backup and all secrets. There is no data migration that drops existing tables.
