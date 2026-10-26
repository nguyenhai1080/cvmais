# Validation — 24 October 2026

Canonical source: `D:\Projects\CVMais`. All CVs used in checks are fictional.

- Ten unit/storage tests pass: migration, validation, bounds, PDF readiness, safe filenames, long-sidebar fallback, safe photo round-trip and persisted account lifecycle.
- Storage tests verify password derivation, hashed recovery/session tokens, ownership, stale revision rejection, trash/restore, database reopen persistence, reset revocation, single-use recovery, logout and persisted rate limits.
- Local HTTP checks passed: same-origin protection, private/no-store responses, session cookies, rejection of unauthorised/other-account access, second-session save/read, conflicts, trash/restore, recovery and logout.
- Production compilation and TypeScript pass.
- Six actual PDF previews generated and visually reviewed. Short samples fit one A4 page; long samples preserve end markers across 2–3 pages in every style. Long skills flow over two pages. Bounds, Portuguese accents and embedded fonts pass automated checks.
- Browser: sign-in, account CV creation, save, reload restoration, rename, trash/restore and logout passed. A real Horizonte PDF download was opened and its Portuguese content verified.
- Gallery: all six previews load; creative filter narrows correctly; enlarged Coral preview shows the expected image and Use CTA. Phone viewport shows no horizontal overflow.
- Docker Desktop is unavailable. This revision uses local production and Vibehost builds rather than claiming a new local Docker build.

The connector still identifies GST. Hosting mutations use the browser profile independently verified as DGC (`nguyenhai1080@gmail.com`). Persistent `/data`, DATABASE_PATH and APP_ORIGIN are configured on DGC project `cmvlbkah40mef0i5fzrjkbvcd`. Deployment and production persistence checks are recorded in DEPLOYMENT.md after completion.

Practical limits: no email verification/delivery, permanent account erasure or scheduled off-server backups. Recovery codes and reversible trash are described accurately in the UI. SQLite is intended for one container; horizontal scaling needs shared storage architecture.

The permanent-erasure limit above describes v4 and is superseded by the revision below.

## Production completion

DGC version 3 runs application commit `c088f60`. HTTPS checks and the API ownership/session suite pass. A fictional account and CV saved on version 2 were retrieved with a fresh login after deploying version 3, preserving the revision and full content. Database health reports ready. The public gallery and enlarged template preview were checked on DGC and captured as screenshots. No changes were made to GST.

## Portrait and richer layout revision

Ten unit/storage tests pass, including real prepared JPEG round-tripping and rejection of SVG, external/file URLs, malformed and oversized image values. Local API checks include portrait save/read from a second session and preservation when an older client omits the photo field. Browser checks cover crop/zoom, prepared-image backup, draft reload and actual PDF download with an embedded portrait. Six fictional portrait examples remain one-page A4 documents; all long-CV and long-support fixtures preserve content and pass bounds/font checks.

DGC version 4 runs application commit `b62e5d1`. The production API suite including photo round-trip and legacy-client preservation passes. The pre-existing persistence probe survives another redeployment. Health reports ready. All six new gallery images and the enlarged Coral preview load on the live site; the mobile gallery has no horizontal overflow. Production build succeeds with two workers, avoiding excessive local build concurrency.

## Data control revision

Twelve unit tests pass. New checks cover exact-title/revision/trash guards, permanent CV removal, account removal cascading to active/trashed CVs and sessions, failed login/recovery after erasure, persistence after reopening SQLite, and isolation of another account. Local-copy tests preserve guest drafts and other accounts while notifying current tabs. Local HTTP integration checks pass for password reauthentication, unauthorised/cross-origin/other-owner rejection, stale revision rejection, refusal to restore erased CVs, session revocation and exact-email confirmation. A manual snapshot of the fictional local QA database passes SQLite integrity validation. External email and backup services remain unconfigured.

The backup preparation revision brings the suite to fifteen tests. A synthetic SQLite WAL snapshot encrypts and restores correctly; wrong keys and corrupted ciphertext fail without leaving an unauthenticated target, and existing output files are preserved. Mock B2 transport validates streamed bytes and receipts and refuses unrestricted keys or untrusted endpoints. Daily-status tests prevent duplicate same-day uploads across restarts and allow retry after failure. These are offline checks, not evidence of real B2 delivery. Bucket creation/privacy/encryption and the pending Resend domain were observed in the owner's signed-in consoles. Backup scheduling remains disabled until credentials, key recovery and retention are configured.

## Email and encrypted backup release, 24 October 2026

- 17 automated tests pass; type checking and production build pass.
- Local HTTP checks pass for disabled mail configuration, same-origin enforcement, successful verification, purpose/single-use rejection, password reset and session revocation. Existing storage/erasure HTTP regression passes.
- Real B2 encrypted snapshot downloaded and restored into a new isolated database; integrity and original production persistence fixture verified.
- cvmais.win verified in Resend; owner-approved delivery test reported Delivered. Replaced the first unused sending key after revoking it. No key values are included in source.

- DGC v9 / source 56a5284: live health and auth pages HTTP 200; email enabled confirmed; original account/CV survived redeployment. Local browser confirmation succeeded and persisted to SQLite.

## Public-domain release

19 automated tests pass, including exact origin allowlist/lookalike rejection and portable backup malformed/oversize checks. Local storage/erasure and email HTTP regression pass. Browser guest import review, confirmation and undo pass with a fictional portrait CV; previous local draft restored after undo. Production build passes. Both new domains resolve to 103.138.88.28 and pass real HTTPS checks; www redirects to the root.

DGC v10 / source 482826c: live checks pass HTTPS on primary/legacy, www path/query redirect, primary canonical, sitemap/robots, private-path noindex, both-origin login and shared CV create/read/update. The original persistence fixture remains unchanged. The additional fictional test CV was removed and both test sessions signed out. Mobile migration guide has equal client/scroll width (375px at 390px viewport).

## Backup operations release

24 tests pass, including stale/future/missing status, retained successful receipt after failure, persisted incident deduplication, failed alert/recovery retry, independent detection of a stopped worker and secret-free alert content. Production build passes. Local HTTP tests verify anonymous/unverified operator/verified normal account denied, verified configured operator allowed, status details contain no upload IDs, public probe is coarse and backup failure leaves normal DB health HTTP 200. Mobile operations page has equal client and scroll width at 375px content width.

DGC v11 / source f8c29ab: live backup probe HTTP 200 (coarse response only), DB health HTTP 200, anonymous operations detail request HTTP 403 without detail fields, private page noindex, original account/CV persistence passed. Runtime log confirms the independent five-minute alert monitor enabled. No actual outage was induced; incident/recovery delivery transitions were exercised with a mocked provider. Previous authorized real Resend sender test remains the actual transport-delivery evidence.

## Steps 7-8 follow-up, 24 October 2026

- StatusCake production monitors 8040391/8040392/8040393: successful external responses, interval 300 seconds, Default Contact Group 381072 sends only to nguyenhai1080@gmail.com; repeat alerts disabled.
- Separate simulation 8040394 returned intentional HTTP 404, then healthy HTTP 200; provider history records Down and Up email messages Sent at 11:28 and 11:30 UTC. Simulation paused after recovery. Real endpoints stayed HTTP 200 throughout.
- Fresh six-style short/long PDF generation passed accents/content/fonts/page bounds; long modern/minimalist PNG pages visually inspected.
- Isolated emulated-mobile browser: photo chooser/crop/zoom, long experience, reload persistence, model change and two-page portrait PDF download passed; end marker/accents/photo verified from downloaded PDF. Equal document client/scroll width at 375px.
- Local account/storage/erasure HTTP suite and all 24 automated tests pass; live primary/legacy two-session save/read/update preserves portrait/content and original persistence fixture; fictional test CV removed.
- Owner reported real registration, email verification, password reset and sign-in successful, with no significant difficulty. Real verification/reset Resend Delivered receipts recorded in PILOT.md. No owner credentials/tokens collected.
- Actual Android/iPhone and wider Mozambican usability acceptance remain pending; viewport emulation is not a real-device result.

## Guidance, content samples and hero refresh, 25 October 2026

- Production build, TypeScript and 27 automated tests pass. Sample tests cover every sector/stage/grammatical form, field size limits, first-job project framing and equivalent skills/tasks across grammatical gender.
- Local browser: profile append, guarded replacement/cancel, exact undo, experience-description insertion and draft persistence after reload passed; pre-existing synthetic draft content restored. Editor samples fit 390px without horizontal overflow.
- Hub/article/home inspected at mobile/desktop/tablet widths. Homepage/header fit 900px. Refreshed hero document fully contains its footer (desktop client/scroll height both 510px; mobile both 225px).
- Checklist increments and resets accurately. Email copy reports success in the page; browser tool clipboard is separate, so its returned clipboard content is not treated as verification.
- HTTP checks: hub and four articles 200, correct canonical URLs, public indexing allowed, unknown slug 404, sitemap has six URLs including homepage, new hero and DB health pass.
- No changes to PDF rendering, auth, storage schema, backup or email transport. Real-device acceptance remains pending.

DGC v12 live: all content HTTP checks and original account/CV persistence pass. Primary/legacy authenticated save/read and portrait round-trip pass. Live selector confirms twelve industries and stage-specific preview; no owner CV was edited during UI validation. Proof: cvmais-hero-v12.png and cvmais-samples-v12.png in delivery outputs.

## Independent interface/CV languages, 25 October 2026

31 automated tests pass, including Portuguese defaults and invalid/legacy migration, unchanged personal text, English sample coverage, field limits and navigation translation meanings. TypeScript and production build pass. Local storage/auth HTTP suite also verifies English CV language across sessions and preserves it when an older client omits it on update.

Six short English PDF styles plus a two-page English document and all existing Portuguese short/long fixtures pass text/font/character-bound checks. English PDFs declare /Lang en, preserve accented names and contain the correct headings. Modern English and second long English pages rendered to PNG and visually inspected. Actual browser-downloaded PDF has English headings and metadata while retaining the original Portuguese user text, as intended.

Local browser: UI English with CV Portuguese, then CV English with UI Portuguese; entered profile unchanged; CV choice and interface preference survive reload independently. English template category filtering works. Desktop 1440px, tablet 820px and mobile 390px inspected without horizontal overflow. Photo, account, guidance and privacy controls localised. Email example content is English in English UI; no actual email was sent. No console errors observed.

DGC v13 verified live: initial UI pt and CV pt; selecting English produces html lang=en and CV article lang=en, without horizontal overflow. Both choices restored to pt/pt-MZ and retained after reload. Cross-origin authenticated fixture confirms cvLanguage=en round-trip; original persistence fixture unchanged. DB/backup health HTTP 200. Proof saved as cvmais-language-editor-v13.png.

## Pre-download review, 25 October 2026

34 automated tests pass. New review tests cover multilingual example markers, exact repeated-entry input targets, immutable content, optional contacts and no photo/degree/employment requirement. Production build and TypeScript pass.

Isolated local UI at port 3004: empty CV review gives actionable name/content/contact reminders with export still disabled; inserting a profile marker opens review before download; explicit download-anyway creates the PDF without changing the original text. Reviewing an experience marker focuses its specific description. With these points resolved, direct download works without a dialog. At 390px, English review fits without horizontal overflow, correctly labels one item and the Portuguese CV language, switches from preview to editing when selecting a field and closes with Escape. Downloaded QA files contain only fictional data. No production user data was modified during these tests. PDF rendering itself is unchanged.

DGC v14 live: Portuguese review dialog and exact profile-field focus confirmed without changing the guest content. Portuguese defaults remain. Account/CV persistence, cross-origin portrait and English CV language, DB health and backup health all pass. Screenshot saved as cvmais-review-v14.png. Real-device acceptance remains pending.

## Industry templates, 25 October 2026

Ten fictional portrait gallery PDFs fit one page. Four new designs have Portuguese/English short fixtures, long fixtures and long portrait fixtures. PDF checks cover accents, end markers, embedded fonts, selectable text and page bounds; no-photo fixtures are also covered. New portrait layouts and a long service-page render visually inspected.

Local browser: New filter returns four distinct models; New + Engineering returns Estrutura; incompatible creative/engineering filters show a reset action returning all ten. Technology selection opens Código with the technology example picker, without replacing existing draft text. Switching all four new models preserves the authored profile. Physical-device acceptance remains pending.

Final checks: 47 PDFs across portrait gallery samples and Portuguese/English short/long fixtures passed content, accent, font and bounds checks. All ten gallery samples are one page. Mobile gallery has no horizontal overflow; enlarged Vital preview opens/closes, hospitality selection opens Acolher with hotelaria example context, and an empty supporting column collapses. Actual browser export of Acolher in English succeeds. Primary industry ordering is tested so service defaults to hospitality instead of generic administration.

The final automated suite passes 38 tests; TypeScript and production build pass. No changes to authentication, credentials or database schema.

DGC v15 live verification: four new complete gallery previews and industry filtering confirmed visually; HTTP PNG signatures valid. New servico style round-trips across authenticated sessions/origins with English language and photo. Original persisted account/CV fixture unchanged. DB and backup probes healthy. All 47 PDF fixtures were regenerated with the final renderer and passed. Proof saved in cvmais-industry-templates-v15.png.

## 72 industry editions — 25 October 2026

- 40 automated tests passed, including twelve industries with exactly six distinct layout families each, unique persistent IDs and preservation of authored content/CV language for all 72.
- Typecheck and production build passed. Standalone /modelos adds the seventh public sitemap URL.
- 335 generated PDF checks passed: all 82 gallery examples, all 82 Portuguese short, all 82 English short, all 82 Portuguese long and additional long/photo fixtures. Checked selectable text, fonts, accents, page bounds and end markers. English document language retained.
- Generated 72 new PNG thumbnails from the real renderer. Browser filter sweep confirmed six results for every industry; loading more expands 12 to 24 cards.
- Local browser switched through all six health editions without changing profile text or independent English CV language. Reload retained the selected model; direct PDF download succeeded.
- This is six structural families adapted to twelve professions, with distinct sample content and palettes. Physical-device acceptance remains pending.
- Storage API regression passed locally (isolated DB, email and backups disabled), covering ownership, cross-device saves, conflicts, recovery and erasure guards. Library and editor have no horizontal overflow at a 390px emulated viewport; editor contains all 82 options. English interface translates specialised edition labels; authored text remains unchanged.
- DGC v16 live validation: twelve industry filters each show six editions; all 72 PNG assets validate. Cross-origin account save/read preserves specialised saude--formacao ID, photo and English CV language. Existing account/CV fixture survives deployment. DB and backup health return HTTP 200. Screenshot: cvmais-six-per-industry-v16.png. The directly downloaded browser PDF also passes selectable-name, English-heading and document-language checks.

## Template discovery — 25 October 2026

42 tests, typecheck and production build passed. Search tests cover Portuguese/English profession keywords, missing accents, combined filters, zero results, model/context handoff and restricted return URLs. Local browser verified nurse + health + first job yields one result, opening the model preserves the existing authored draft, returning/reloading restores all three filters. Empty-state reset returns the full collection. English developer + technology yields six models; at an emulated 390px viewport content width is 375px, without horizontal overflow. Portuguese restored after inspection. PDF renderer, schema, environment and credentials were not changed; the v16 PDF fixtures remain applicable.

Live DGC v17 verified: profession search in both languages, combined style/industry filters, modal use-model context and actual editor return restoration. Existing account/CV fixture survived redeployment; cross-origin photo, English CV language and specialised model save/read still pass. DB/backup health HTTP 200. Screenshot: cvmais-template-search-v17.png. Physical Android/iPhone and target-market pilot remain pending.

## Controlled template tags — 25 October 2026

45 automated tests, typecheck and production build passed. Added registry/assignment coverage for every tag and model, 12 industry keyword probes, telecom PT/EN/abbreviation/skill equivalence, top-layout ranking, marketing exclusion, multi-word query, exact short acronyms, bounded typo fallback and unknown-term empty results. Local UI confirms telecom 14 results (12 initially, 14 after loading more), typo notice, clicking tag starts a canonical-label search, translated English chips and no horizontal overflow at emulated 390px (375px content). Portuguese restored. No renderer, credential, schema or environment changes.

Live DGC v18 confirmed: telecom 14 results; communication 8; bounded typo notice; English chips and clickable canonical topic return 14. Portuguese restored. Account/CV persistence and both-origin photo/English/model regression pass; DB and backup health HTTP 200. Screenshot: cvmais-telecom-tags-v18.png.

## Inline search assistance — 25 October 2026

47 tests and production build passed. New tests cover prefix/alias/typo suggestions, PT/EN labels, counts matching actual search, exact acronym safety, selected-filter exclusions and global recovery counts. Local browser: tel suggests Telecomunicações (14); selecting the suggestion then Saúde produces a clear filter-conflict explanation; View templates without filters restores 14 results and retains Telecomunicações. No schema, environment, credentials, template artwork or PDF-renderer changes.

Live v19: counted prefix suggestion, keyboard activation and explicit filter recovery all passed; query retained with 14 results after removing conflicting health filter. Existing CV data survives deployment; DB/backup health HTTP 200. Screenshot: cvmais-search-suggestions-v19.png.

## Interview preparation — 25 October 2026

47 existing automated regression tests, typecheck and production build passed. Local HTTP validation checks all five guide routes/canonicals, unknown-guide 404, eight sitemap entries, DB health and all five homepage guidance links. Browser checks: original labelled STAR examples and editor CTA; temporary notes and checklist selection survive PT-to-EN UI change; explicit copying reports success; reload clears notes/checks. At an emulated 390px width, document content is 375px with no horizontal overflow. Portuguese restored after inspection. No PDF-renderer/schema/environment/credential changes. Wider physical-device/native-speaker pilot remains outstanding.

Live DGC v20: all five guide cards and homepage links present, new interview article and editor CTA verified; eight-entry sitemap/canonicals/404, account/CV continuity, cross-origin portrait/English/model round-trip and DB/backup health pass. Local navigation away/back also clears temporary practice notes. Proof: cvmais-five-guides-v20.png. Physical-device/Mozambican native-speaker acceptance remains pending.

## 118 templates and twelve-design homepage — 26 October 2026

48 automated tests, typecheck and production build passed. Coverage verifies 118 persistent model IDs, nine distinct families per industry, twelve unique homepage selections covering all industries and all nine families, stable legacy portrait choices, multilingual search/tag counts and preservation of authored CV content.

479 PDF-file checks passed, including 36 new gallery demos and Portuguese short, English short and long fixtures for every added model. Checked selectable text, accents, fonts, page boundaries and end markers. 36 new PNGs generated from actual PDFs. Local visual review covered creative, executive and technical additions. Actual browser download of tecnologia--digital retained selectable name/profile and English document language.

Local browser: homepage exactly 12 cards, no load-more control, English showcase heading; library total 118, technology 9, responsive 390px content 375px without horizontal overflow. Choosing the new Digital edition retained the existing fictional profile and English CV language. Portuguese UI restored. No schema, credentials, environment or renderer geometry changed.

Live v21 validation: homepage twelve cards without pagination; complete library shows 118, engineering nine; all 36 added PNGs validate and all twelve featured images load. Cross-origin account persistence retains tecnologia--digital, portrait and English CV language; original fixture unchanged. Guides/sitemap/canonicals/404 and DB/backup health pass. Proof: cvmais-twelve-featured-v21.png.
## Review remediation validation — 26 October 2026

49 automated tests pass, including absent/blank education rows and named school/course cases; typecheck and production build pass. Local browser: missing education reminder targets and focuses #formacao, PT/EN text, visual industry chooser has nine thumbnails, model switch to tecnologia--digital preserves authored profile and CV language. At 390px, two-column dialog is usable without horizontal overflow; viewport emulation is not physical-device acceptance. All editor selects have an associated label or explicit accessible name. Actual browser PDF still exports selectable text and English headings, one page in this fixture. /sobre, /termos and /privacidade expose the confirmed Soltech LDA contact. Web font sources are WOFF2 only; full PDF TTF assets are unchanged.

DGC v22 live verification: all four WOFF2 assets, new operator/contact pages, twelve homepage cards with shared-family disclosure, eleven-entry sitemap, DB and backup health, unchanged persistence fixture pass. Production visual chooser at 390px shows nine cards and zero unlabelled selects, no horizontal overflow. No physical-device or slow-network speed claims made. Screenshot: work/cvmais-template-picker-v22.png.

## Official domain / DGC v23 — 26 October 2026

50 automated tests and build pass. Live official-domain TLS validation, canonical/sitemap/robots, old/public and new/www redirects, old editor/auth access, exact origin rejection, same saved synthetic CV/revision across new+two previous domains, DB and backup health pass. No real account data modified. TLS probes use DNS-confirmed DGC IP with certificate validation intact to avoid the current local resolver's stale 8.8.8.8 cache. Browser at this network cannot yet verify the new domain because of that cache; no certificate barrier bypassed. StatusCake production URLs updated with original IDs/alert routing; old history includes both domains. Source 73e9c74.
