# CVMais delivery roadmap

## Milestone 120 — live DGC v43, 29 October 2026

The final22 compositions bring the catalogue to **120 distinct compositions**: **ten per primary field**. This completes the numerical roadmap milestone. It does not establish actual Android/native-speaker acceptance or guarantee recruiter/ATS outcomes. Changing colours, photos or field tags does not increase the count. The homepage retains twelve curated designs across twelve fields; the Novos filter identifies this final22.

New roster: administration Direcção; accounting Capital; technology Infraestrutura/Engenho digital; health Assistência/Vigilância; education Pedagogia/Conhecimento; engineering Obra/Mecânica; logistics Terminal/Abastecimento; sales Cliente/Expansão; hospitality Acolhimento/Hospitalidade; communication Criação/Voz; agriculture Rural/Produção; community projects Inclusão/Impacto. Each has an authored region arrangement, optional portrait, PT/EN headings, tags and actual PDF preview. Atlas and Aurora primary suitability order now matches the roadmap assignments (community projects and education); their secondary suggestions remain available. A test verifies all twelve primary counts equal ten.

Further work should prioritise real-device and native-speaker feedback, content quality and usability rather than another numerical template quota. Historical milestone records follow.


## Milestone 98 — DGC v42, 29 October 2026

Implemented 24 further authored compositions after milestone 74: **98/120**, with **22 remaining**. Primary allocation is nine administration, nine accounting and eight in each other field. New roster: Gestão/Gabinete, Património/Planeamento, Plataforma/Produto, Reabilitação/Bem-estar, Aprendizagem/Academia, Energia/Inspecção, Operação/Frota, Mercado/Parcerias, Recepção/Serviços, Estúdio/Publicação, Sustentável/Cultivo, Avaliação/Desenvolvimento. They have separately authored region arrangements, optional portraits, PT/EN headings and actual PDF thumbnails. Old saved designs remain readable; twelve homepage selections remain unchanged. To reach 120: one more administration, one accounting and two in each of the other ten fields. Historical milestone records follow.


## Milestone 74 — 28 October 2026

Adds two authored compositions per primary field (24 total), taking the public catalogue to **74/120**. **46 remain**, next milestone98. Administration/accounting now have seven each; the other ten fields have six each. Colours and field labels are not counted as new layouts. Homepage keeps twelve curated selections spanning twelve fields.

New roster: administration Conselho/Processos; accounting Fiscal/Controlo; technology Arquitectura/Dados; healthcare Triagem/Prevenção; education Investigação/Mentoria; engineering Projectista/Segurança; logistics Rotas/Cadeia; sales Negócio/Relação; hospitality Destino/Eventos; communications Marca/Campanha; agriculture Irrigação/Colheita; community programmes Programa/Terreno. Each has a distinct region arrangement with optional portrait, PT/EN labels, search aliases and matching editor/PDF structure. Samples remain fictional.


Updated 28 October 2026. Current status verified against the official site; dated sections below also retain historical delivery records.

## Milestone 50 — 28 October 2026

Implemented 24 additional authored CV compositions across twelve primary fields: **50/120**, with **70 remaining**. Administration/accounting now have five each; the other ten fields have four each. Each model has its own arrangement and matching HTML/PDF renderer; colours, portraits and industry aliases do not increase the count. Twelve homepage selections now cover all twelve fields. Historical saved model IDs remain supported.

Validation: 95 tests and production build pass. 216 PDF fixture cases checked (144 new-design cases plus 72 earlier-sector regressions), covering PT/EN, photo/no-photo, sparse and long content. Short samples fit one A4 page; stress cases preserve all end markers over two or three pages. The 24 new short previews and all new stress contact sheets were visually reviewed. Isolated browser import, Sistemas-to-Narrativa switch, content/photo preservation, English CV in Portuguese UI and actual one-page PDF download pass. Simulated 390px preview has no horizontal overflow. Physical Android/native-speaker acceptance remains pending. Deployment and public acceptance are recorded in DEPLOYMENT.md and VALIDATION.md.

Next design milestones: **74 → 98 → 120**, with independent content arrangement and PDF review for every composition. No automatic completion date is promised.

## Distinct template expansion — DGC v39, 28 October 2026

The target remains **120 distinct, reviewed CV compositions** and is not complete. This batch adds twelve independently arranged sector designs to the existing fourteen, making **26**, with **94 still outstanding** after release. No recolours, industry tags or portrait changes are counted as new layouts. Detailed primary-sector allocation, acceptance criteria and milestones 50/74/98/120 are in TEMPLATE-EXPANSION.md.

Implemented: Balanço, Circuito, Cuidado, Cátedra, Prumo, Travessia, Impulso, Estância, Prisma, Campo, Elo and Pauta. Each has matching editor/PDF structure, optional portrait, PT/EN titles, curated search tags and long-content stacking. Twelve actual PDF previews; homepage retains twelve distinct editorial selections, now including eight new sector layouts. Public counts and SEO descriptions derive from the catalogue.

Validation: 92 tests and build pass; 72 PDF fixtures pass content/language, A4 bounds, glyph-overlap and embedded-font checks. All twelve short samples fit one page; work/support stress cases preserve final markers on two pages. All short/stress pages visually reviewed. Local browser import, Prisma-to-Cuidado switch, authored-text/portrait preservation, independent English CV and actual PDF download pass. Simulated 390px preview has no horizontal overflow. DGC v39 Online: official count 26, twelve exact reviewed PNGs, twelve homepage selections, original CV persistence, mail worker, app/backup health and SEO 15/15 pass. Live PT/EN gallery, telecom results including Circuito/Prumo and Prisma preview verified. Physical Android and native-speaker acceptance remain separate.

## Mobile editor usability — DGC v38, 28 October 2026

Live: sticky mobile Edit/Preview/PDF toolbar, labelled section jump, 16px mobile input text and 44px primary touch controls. Uses the existing CV review/download flow; desktop actions remain unchanged. Simulated 320px/390px local checks cover retained draft, model switch, review-to-education focus and actual PT/EN PDF downloads. Official 390px editor confirms 16px fields, sticky toolbar at top, section focus and no horizontal overflow. Build and 89 tests pass; old account/CV persistence, mail worker, app/backup health and SEO 15/15 pass after deployment. Physical Android keyboard/file-manager acceptance remains pending; see PILOT.md.

## Reliability release — DGC v37, 28 October 2026

Implemented the next independent roadmap step: encrypted durable authentication-email outbox, bounded retry/backoff, stable provider idempotency, token cancellation and a supervised background worker. The verified-operator panel shows non-sensitive queue counts and worker status. No additional message recipients, SMS service or marketing sends were added. Portuguese sharing navigation is now Partilhar; English remains Sharing.

Final 89/89 tests, compiled build, local mocked HTTP restart/reset pilot and storage HTTP regression passed. DGC v37 is online: mail enabled and independent worker heartbeat confirmed, old account/CV persistence preserved, application/backup health pass and SEO 15/15 passes. Live browser confirms Partilhar in PT and Sharing in EN. No production authentication email requested during this release. Physical Android and Mozambican native-speaker acceptance are still pending. WhatsApp channel activation still requires the owner's actual channel link.

## Account access update — 27 October 2026

Owner chose email-only recovery (no SMS provider required). Registration starts a session immediately without generating or acknowledging a recovery code. Verification and optional code controls are inside a collapsed Account security section in My CVs; no persistent verification banner. Password reset links are issued only for verified account emails. Optional codes can be created/replaced/disabled after current-password reauthentication. Existing codes remain valid; any password reset revokes sessions/tokens and disables the code without a forced replacement screen. No CV/schema migration.

Validation: 76 automated tests after merging the latest SEO changes, typecheck, production build and isolated HTTP storage checks passed. PT/EN security UI inspected in browser; physical Android pilot still pending. Deployed in DGC v32: official policy/security API, existing CV persistence, email enabled and application/backup health verified; SEO 15/15 passes.

## Homepage refinement — DGC v34, 27 October 2026

Live: Sharing replaces Gratuito in navigation; redundant payment band removed. Homepage has clearer create/view-template actions, earlier three-step explanation, twelve shorter design cards, compact guidance illustration, FAQ and dedicated Sharing area. Two main images total about 137 KB on desktop instead of 3.9 MB. PT/EN browser, simulated 390px navigation/overflow, 78 tests and production SEO 15/15 checked. Real-device Android feedback still pending.

## Community launch preparation — 27 October 2026

Deployed in DGC v33; official invitation/assets/health and SEO 15/15 verified. WhatsApp friend invitations added to the homepage: PT/EN message preview, explicit recipient selection/send in WhatsApp, copy fallback, no contacts or CV data. Original channel avatar and promotional cover prepared with launch copy and a two-week editorial plan. Owner has not created the channel yet; no follow CTA is shown until an official owner-provided channel link is configured. No channel created and no invitations sent by the agent. Group discussion and moderation remain a later decision.

Validation: 78/78 automated tests; typecheck/build pass; browser PT/EN invitation and clipboard success checked, 390px responsive layout has no horizontal overflow. A pre-existing test was corrected to select its own hashed session rather than an arbitrary session row.

## Delivered

1. Responsive pt-MZ homepage, approved imagery, 120 public compositions, twelve homepage selections covering twelve primary fields; earlier industry IDs retained for existing CVs without advertising recolourings as independent designs. The 120-composition milestone is implemented.
2. Editor, crop/zoom photo, browser-generated A4 PDF, guest local draft and JSON export; private account library, SQLite autosave, revisions and recovery codes.
3. Permanent account/CV erasure with password confirmation, session revocation and matching local-copy cleanup.
4. Resend cvmais.win verified sender, optional email confirmation and expiring single-use password reset; approved owner delivery test reported Delivered. Encrypted daily B2 backup plus real download/restore verification.

## Current acceptance — 27 October 2026

- The owner confirmed deploying the SEO work. Production also contains the original compositions and industry-letter release that was previously awaiting deployment. No duplicate redeployment was performed.
- Official domain https://cvmais.co.mz and www redirect work with normal TLS validation. Library fourteen designs, homepage twelve, six guidance topics, industry letters for twelve fields in PT/EN, five additional profession pages, sitemap seventeen URLs.
- Public SEO audit 15/15 passes; current main automated suite 66/66 passes (including the owner’s subsequently merged analytics work). Four gallery assets match the validated local PDF previews byte-for-byte. A synthetic saved CV changed through all four new models and retained photo, English language, authored profile and education when read from the previous origin. Original persistence fixture unchanged; DB and backup health pass.
- Interactive browser, physical-phone/slow-network and Mozambican native-speaker acceptance remain pending. HTTP/API checks do not replace these.

### Next priorities

User's active design priority: grow the 26 distinct compositions to 120 through reviewed milestones 50/74/98/120; prioritise logistics, sales and agriculture, then diversify by career stage and specialist needs. TEMPLATE-EXPANSION.md tracks the 94 remaining primary-field slots. This goal is not marked complete and does not count legacy recolourings.

1. Actual Android/iPhone pilot: guest editing/reload, choosing a new design, photo, PDF PT/EN and industry-letter editing/copying.
2. Fix issues from that pilot and obtain feedback from consenting Mozambican users, including first-job and experienced applicants.
3. Observe the new email queue during the next owner-requested real verification/reset; simulated-provider retry acceptance is separate from inbox-delivery acceptance.
4. Extend original designs/content only where user feedback shows a gap; community workflow and revenue model need an owner decision.

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

## Application guidance — delivered, including interview preparation

All five topics are available on the homepage and /orientacoes, each linking directly to the CV editor:

1. First CV: use real education, projects and volunteering.
2. Tailoring the CV to a vacancy: match real evidence to requirements.
3. Application email: illustrative message with local copy controls.
4. Pre-send checklist: temporary interactive review.
5. Interview preparation: before/during/after, original labelled STAR examples, first-job introduction, difficult questions, online connection backup plan, employer questions and follow-up. Includes temporary STAR practice notes, local copying and a preparation checklist.

Portuguese for Mozambique is the default; English is available. Examples are explicitly illustrative. No guarantee of employment, invented achievements, recording or external analysis. Practice notes are memory-only and disappear on navigation/reload; users can explicitly copy them to keep them.

## Next launch priorities

1. Wider real-device pilot: actual Android/iPhone devices and consenting Mozambican Portuguese speakers. Gather device-specific and wording feedback. The initial owner pilot and emulated viewport tests do not replace this.
2. WhatsApp: friend invitations are live; channel-follow activation waits for the owner-created channel link and moderation/administration decisions.
3. Official domain cvmais.co.mz is already attached and verified; maintain exact-origin and old-draft migration protections.

## Current limits

- Single application container with persistent SQLite. Do not horizontally scale independent SQLite replicas.
- Authentication-email outbox is active in DGC v37; retry transport tests used a simulated provider. Observe delivery during the next owner-requested real verification/reset. Permanent failures/exhausted retries still require a fresh user request after repair. Backup incident/recovery email alerts and independent StatusCake monitoring are active. External checks run every five minutes; provider confirmation/delivery can add delay.
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

## Search suggestions and filter recovery — 25 October 2026

- Inline bilingual topic suggestions include truthful filtered result counts and support partial tag names.
- Zero-result filter conflicts offer an explicit way to remove industry/style filters while keeping the typed query.


## Expanded library and homepage selection — 26 October 2026

- 118 models total: 108 industry editions (twelve industries × nine structural families) and ten general templates. Added Expressivo, Direcção and Digital editions, based on the existing creative, executive and technical layout systems.
- Homepage now shows exactly twelve editorial selections, one per industry and covering all nine structural families. A clear link opens the complete library; search, filters and loading more are reserved for /modelos. Homepage topic links open the library rather than changing the curated twelve.
- 36 new PDF-generated previews; existing model IDs and portrait choices retained. Optional photos, independent PT/EN CV language and authored content remain intact.
## Review remediation — 26 October 2026

Implemented locally for release: image-based editor template chooser (industry first, nine cards per industry or ten general options); non-blocking education reminder with a direct section focus; backup tools in a secondary disclosure; explicit accessible names for sample selects; clearer free-feature navigation and removal of the unfinished community menu entry. Homepage card indices removed; catalogue explains 10 general templates plus 108 industry editions sharing nine layout families, rather than claiming 118 independent layouts.

Owner confirmed operator Soltech LDA and public contact admin@soltech.co.mz. Added bilingual /sobre and /termos and operator/contact in /privacidade. No address, registration number, partnership or user counts invented. Current features remain free; no billing or new paid promise introduced.

Web preview fonts now use locally subsetted Latin/extended-Latin WOFF2 (169,760 bytes versus 1,678,384 bytes full TTF; approximately 90% smaller for these four faces). Modified faces renamed CVMaisSans/CVMaisSerif; original OFL notices retained. Full TTFs remain unchanged for PDF export, loaded only when exporting. This is not a claim of a 90% reduction in total page traffic; interface Google fonts and other resources remain.

Next: physical-device/slow-network pilot and native PT-MZ review, then durable email delivery retries. Domain purchase/migration, revenue model, authentic social proof and community operations remain owner/business decisions; no changes to domain/DNS or made-up endorsements.

## Official domain — 26 October 2026

Migration to cvmais.co.mz: official metadata and public redirects, explicit preservation of old guest drafts/auth/API, transfer guide for both earlier origins. Existing accounts/database unchanged. Keep cvmais.win active for old guest copies; no whole-site forced redirect that prevents export. Current mail sender remains verified on cvmais.win while links point to the new APP_ORIGIN. Acceptance requires TLS, public/WWW redirect, canonical/sitemap, origin-scoped account round-trip, DB/backup health and external monitor destination checks.

## Original compositions and industry letters — 27 October 2026

Prepared for release: public catalogue now fourteen designs, homepage twelve distinct compositions including four new lead designs. Atlas has a full dark left contact/skills rail; Aurora balances education and experience across equal columns with a shared support footer; Fólio uses an oversized serif masthead, rectangular portrait and date gutter; Vértice introduces a skills matrix above career chronology and compact languages in the contact strip. New layouts have matching HTML preview and actual PDF renderers; long/narrow supporting content returns to a full-width flow. Existing 118 IDs remain valid; 108 industry variants are excluded from new public discovery instead of being counted as independent designs.

Added sixth guide /orientacoes/cartas-por-area: twelve industries × first-job/experienced examples, Portuguese default and optional English, three field-specific tips per industry in PT/EN, explicit adaptation placeholders, editor links and temporary editing/copying. Filter/language changes do not replace authored draft text; loading a different sample requires confirmation if a draft exists. No external analysis, email sending, personal-data collection, new schema or credentials.

Next release action: verify DGC access, deploy and complete live browser checks. At preparation, connector still identifies GST despite owner reconnect attempt; native Computer Use helper is unavailable. Do not mark as live until an actual DGC deployment succeeds.
