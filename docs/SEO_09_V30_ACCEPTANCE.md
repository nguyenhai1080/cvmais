# CVMais v30 production acceptance

Read-only acceptance probes for https://cvmais.co.mz. The audit checks public
HTTP responses, sitemap size, restricted unauthenticated endpoints, third-party
analytics absence, all CSS and JavaScript assets linked from the public pages,
and newly compiled CSS from the chart readability fix (bar height 175px,
chart height 217px, compact labels and responsive bar groups).

Unlike the obsolete v29 test, this test does **not** assume all dynamically
loaded client component source strings appear in the initial HTML scripts.
It detects the deployed v30 CSS. Only a screenshot or authenticated browser
test can confirm visual spacing of the three date ranges and Daily Table.
Neither login nor fake events are sent from GitHub Actions.

This test changes no application code, database, CV records or production
configuration. It does not require redeploying Vibehost.
