# CVMais v27 GA4 production verification

This audit is public-only and read-only: it fetches public pages and static JavaScript. It does not open a browser, submit consent, inspect private accounts, touch the CV database, or send analytics events.

- Confirms HTTP 200 for the homepage, privacy page and CV editor.
- Confirms the HTML does not eagerly load a third-party Google Analytics script before visitor consent.
- Checks bundled JavaScript on the live site for the expected public GA4 Measurement ID `G-JNHPNNCZRF`, consent labels, and three conversion event names.
- An absence of eager script in the HTML is **not** a full browser consent test; client-side network requests before and after consent must still be reviewed in Chrome DevTools and GA4 Realtime.
- If the ID is missing from the production JS, confirm Vibehost DGC `NEXT_PUBLIC_GA4_MEASUREMENT_ID` was set **before the build**, not only at container runtime.
- Script results are from the public deployed build only, not a separate test build.
- CVMais production remains on Vibehost; this pull request changes only GitHub test automation and needs no Vibehost redeploy.
