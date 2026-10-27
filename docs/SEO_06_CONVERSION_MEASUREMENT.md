# CVMais SEO-06 — GA4 consent-based conversion funnel

## Events
- page_view: sanitized known public routes and generic editor path, no query strings
- cv_template_selected: selected model present once the editor loads, or an explicit model change inside the editor
- cv_builder_started: editor initial data loaded
- cv_pdf_exported: PDF blob created and programmatic download initiated (not confirmation of completed browser file save)

## Privacy controls
- No GA4 ID, no tracking and no consent banner by default.
- Load Google Analytics script only after explicit opt-in. Reject leaves analytics off. Preferences can be changed in /privacidade.
- No CV contents, filenames, email, phone, name, document IDs, query strings or personal text passed as event parameters. Third-party provider may process standard network/device data after opt-in.
- Withdraw (including from another tab) stops future tracking and attempts to remove first-party GA cookies. Previously collected analytics events cannot be retroactively retracted by the website.
- GA4 Enhanced Measurement/history navigation features must be reviewed to avoid unfiltered pageview URLs or duplicate tracking.

## Deployment steps
1. Create a GA4 property for CVMais, choose Mozambique (Africa/Maputo) and MZN.
2. Create Web stream for https://cvmais.co.mz. Obtain public Measurement ID G-...
3. Review GA4 Enhanced Measurement: disable automatic browser-history pageview measurement. Disable ad personalization until separate privacy review.
4. Add NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-... to the correct Vibehost DGC build environment.
5. Redeploy from main without changing persistent database volume /data, email credentials or backup.
6. In a new private browsing session, check that no Google Analytics script/request exists before consent. Reject, then verify there are no requests. On Privacy, choose Accept, verify only sanitized paths and event names.
7. With fictional CV data, open editor, choose a template and initiate a PDF. Confirm page_view, cv_template_selected, cv_builder_started, cv_pdf_exported in GA4 DebugView/Realtime.
8. Mark cv_pdf_exported as GA4 Key Event. Analyze organic search by country Mozambique; GSC organic clicks and GA4 consented sessions differ and should not be expected to match.

This PR does not create or configure a GA4 property and should not be merged until tests pass. It does not modify the CV database.
