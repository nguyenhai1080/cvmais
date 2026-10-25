# CVMais delivery roadmap

Updated 25 October 2026. This records delivered work and the next launch priorities; unimplemented items must not be presented as live features.

## Delivered

1. Responsive pt-MZ homepage, approved imagery, six distinct portrait-capable CV templates, honest illustrative gallery.
2. Editor, crop/zoom photo, browser-generated A4 PDF, guest local draft and JSON export; private account library, SQLite autosave, revisions and recovery codes.
3. Permanent account/CV erasure with password confirmation, session revocation and matching local-copy cleanup.
4. Resend cvmais.win verified sender, optional email confirmation and expiring single-use password reset; approved owner delivery test reported Delivered. Encrypted daily B2 backup plus real download/restore verification.

## Delivered in DGC v10: public domain and continuity

- Attach cvmais.win and www in DGC, DNS and HTTPS; www canonical redirect.
- New email links use cvmais.win. Both exact application origins accepted during transition.
- Keep guest drafts on their original origin; provide export/import, explicit review/undo and migration guidance. Same account database across both origins.
- Homepage canonical/share metadata, sitemap/robots and noindex headers on private/editor/auth routes.
- Verified HTTPS, original account/CV persistence, both-origin login and saves, guest import/undo and mobile migration guide.

## Delivered: steps 7 and initial 8, 24 October 2026

- External StatusCake monitoring is active on the homepage, application/DB health and backup health, every five minutes, with alerts to the owner's email. Isolated Down/Up simulation messages were recorded Sent; simulation is paused. No production outage was induced. See EXTERNAL-MONITORING.md for test IDs, notification routing and free-plan limits.
- First owner-controlled account pilot completed: owner registered, confirmed email, received recovery mail, personally changed password and signed in. Feedback: no significant difficulty. Verification and reset messages have real Resend Delivered receipts.
- Technical pilot passed: six PDF styles with short/long data, rendered pagination review, emulated mobile photo/crop/edit/reload/model switch, actual browser portrait PDF export, cloud portrait/content round-trip and 24 automated tests. See PILOT.md for evidence and remaining acceptance work.

## Next launch priorities

1. Wider real-device pilot: actual Android/iPhone devices and consenting Mozambican Portuguese speakers. Gather device-specific and wording feedback. The initial owner pilot and emulated viewport tests do not replace this.
2. Community: remains clearly in preparation until a real workflow and moderation rules exist. Continue improving guidance and examples from actual user feedback.
3. Later domain cvmais.co.mz: attach only after acquisition/DNS access; repeat origin/cookie/local-draft migration checks.

## Current limits

- Single application container with persistent SQLite. Do not horizontally scale independent SQLite replicas.
- No durable authentication-email outbox; failed delivery requires a new user request. Backup incident/recovery email alerts and independent StatusCake monitoring are active. External checks run every five minutes; provider confirmation/delivery can add delay.
- Backups expire after about 30 days; restoration must reconcile subsequent erasure requests.

## Delivered in DGC v11: backup operations

Implemented: last successful upload and worker heartbeat, stale/failure classification, verified-operator detail page, public 200/503 probe, independent five-minute alert process, persistent incident deduplication and recovery notification. User approved messages to nguyenhai1080@gmail.com. Production active: healthy public probe, restricted detail endpoint, monitor startup log and original CV persistence verified. Whole-host monitoring is now supplied separately by StatusCake; see EXTERNAL-MONITORING.md.

## Step 9 and requested visual/editor improvements, 25 October 2026

- Four original pt-MZ application guides, local email-copy tools and temporary six-point checklist; homepage/header links and sitemap.
- In-editor sample library for twelve industry groups and three experience levels; optional grammatical form, preview, append, confirmed field replacement and guarded undo. No new personal-data fields or external content API.
- Original homepage CV preview with close-up illustrative portrait and more complete two-column content.
- See CONTENT.md and VALIDATION.md. Real-device pilot remains outstanding.

## Portuguese and English, 25 October 2026

- Portuguese default; optional English interface with browser preference and responsive header selector.
- Independent per-CV Portuguese/English choice, language-specific headings in preview/PDF and suggested examples.
- Choice persists in local drafts, JSON copies and account sync; legacy CVs default to Portuguese and old clients preserve existing choices.
- User-written content is retained verbatim. See LANGUAGES.md for scope and delivery validation.

## Pre-download review, 25 October 2026

- Local review for possible sample placeholders across fields/entries, incomplete email formatting and absent email/mobile contact.
- Explicit field links focus the exact input, including from mobile preview; shows the selected CV language.
- Users can continue downloading after reading optional reminders. Name/content prerequisites remain the existing export requirements. No grading, automatic rewriting, external analysis or new stored data.
- Portuguese and English controls; wider actual Android/iPhone pilot still pending.

## Industry template collection, 25 October 2026

- Four original designs added: Código (technology), Vital (health/education), Estrutura (engineering/operations), Acolher (hospitality/service). Ten designs total.
- Twelve professional-area suggestions, combined style/area filters, New collection, empty-state reset and contextual example-area handoff. Suggestions do not restrict which model a user can choose.
- Actual PDF-generated illustrative previews; all designs retain optional photos, Portuguese default and independent English CV headings. See TEMPLATE-RESEARCH.md.

## Expanded industry library — 25 October 2026

- Completed 12 industry collections × six layout families = 72 specialised editions, with ten general designs retained (82 choices).
- Original industry sample content, palettes, actual PDF thumbnails, grouped editor selection and standalone /modelos library with shareable industry filters and pagination.
- All model IDs round-trip through normalisation without rewriting authored content or CV language. Photos remain optional.
- Real-device and target-market pilot feedback remains pending; no popularity or hiring-performance claims are made.

## Template discovery and return navigation — 25 October 2026

- Local profession/name/industry search across all 82 choices, with common Portuguese/English keywords and accent-insensitive matching; combines with industry and style filters.
- Library links preserve search, industry and style across reload and editor return. Return destinations are restricted to the local /modelos route.
- Empty results offer a complete filter reset. Search and clearing controls are translated and work on a narrow viewport. Portuguese remains the default.

## Controlled search tags — 25 October 2026

- 33 bilingual topic tags, 333 curated assignments across 82 template editions, aliases and role/skill abbreviations; see SEARCH.md.
- Weighted name/tag matching, whole-word short acronyms, bounded one-edit fallback only after no strict results, explicit approximate notice, visible clickable topic chips.
- Telecom is covered by technical/IT tags and remains distinct from communication/marketing. Filters and editor return context remain intact.
