# O Bom Amigo Analytics Center — CVMais / Umami Cloud

The existing first-party, aggregate CVMais counters at `/operacoes` remain unchanged.
Umami Cloud adds session, acquisition and funnel reporting; these numbers must not
be assumed to equal the first-party counters (different collection and filtering).

## Activation

1. In Umami Cloud, create a website named `CVMais` for `cvmais.co.mz`.
2. Copy the Website ID (public tracking identifier, **not** a Cloud API key).
3. Public Website ID `e4cf3c29-d0ae-47c7-85a3-c729cd959546` is configured in `src/lib/umami-config.ts`. An optional `NEXT_PUBLIC_UMAMI_WEBSITE_ID` can override it for other installations.
4. Redeploy the production build. Next.js inlines `NEXT_PUBLIC_*` variables at build time.
5. Open `https://cvmais.co.mz` and verify `cloud.umami.is/script.js` plus Umami traffic in the
   browser Network tab; check Realtime, Pages and Events inside Umami.
6. Check the publicly visible Portuguese and English privacy notice before activating.

The public ID is bundled at build time. The tracker sends data only on `cvmais.co.mz`; it does not send traffic from localhost or preview domains.
The code only sends events while running at hostname `cvmais.co.mz`.
No private API key is required in browser or repository.

## Data boundaries

The standard Umami tracker uses automatic page tracking, but this integration
disables it to avoid capturing CV IDs, private paths, search queries or reset tokens.
Every tracked page is mapped through CVMais's existing `metricPage` allowlist.
Only `utm_source`, `utm_medium`, and `utm_campaign` values matching a limited
alphanumeric/hyphen/underscore pattern may be included. Referrers are reduced
to origin. No `umami.identify`, session replay or CV document data is sent.

## Event definitions

- `page_view`: sanitized route views (manually recorded as Umami pageviews).
- `cv_builder_started`: user opens the CV builder.
- `cv_template_selected`: user chooses a template.
- `cv_pdf_exported`: PDF export initiation, **not necessarily completed**.
- `guide_editor_clicked`: guide-to-editor clicks.

Existing first-party events remain the authoritative source for the
`/operacoes` dashboard; Umami receives matching conversion events where loaded.
Client ad-blockers and networking can result in different totals.

## Testing checklist

- [ ] Production has a Website ID; staging/preview do not emit Umami events.
- [ ] Pageview appears after page load and when navigating to another page.
- [ ] Same route re-render does not add a duplicate pageview.
- [ ] `/criar-cv` is tracked as an approved category without identifiers.
- [ ] CV conversion actions show as events.
- [ ] UTM attribution works for `utm_source=facebook&utm_medium=social&utm_campaign=obomamigo_nov2026`.
- [ ] No email, document text, user ID or arbitrary query strings appear in Umami.
- [ ] Existing `/operacoes` counters continue to work.
- [ ] Correct privacy notice is visible.
- [ ] Hostname guard prevents nonproduction tracking.

Reference: https://docs.umami.is/docs/collect-data
