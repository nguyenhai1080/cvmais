# CVMais v28: production checks

- Audits currently live website using GET requests for public pages and scripts.
- Confirms the new cookieless analytics endpoint and event labels are bundled on the public website.
- Detects stale GA4 Measurement ID and consent pop-up code; old GA4 stream may still exist in Google account but is not loaded by the app.
- GET /api/analytics must return 405; cross-origin POST must return 403; a malformed same-origin POST must return 400. None are valid events, so **no production counters are incremented**.
- Operations dashboard metrics stay behind existing session access and must return 403 when unauthenticated.
- HTML must not eagerly load third-party analytics scripts. A passing static audit does not test all runtime browser network activity or the successful insertion of a real event.
- For full acceptance, open an incognito browser, confirm no consent popup, check DevTools Network for first-party POST /api/analytics 204, and inspect /operacoes with authorized operator account. Test using fictional CV content only.
- Keep /data SQLite volume, Resend and off-site backup configuration intact. No Vibehost deployment required for audit tooling.
