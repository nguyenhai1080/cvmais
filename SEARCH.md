# Template search and tagging

Updated 25 October 2026. CVMais has 118 template editions, 33 controlled topic tags and 477 template/tag associations. Tags indicate editorial layout suitability; they do not claim that the illustrative candidate has those qualifications.

## Research and approach

- [ESCO occupation concepts](https://esco.ec.europa.eu/en/classification/occupation_main): preferred names, alternative/hidden names and associated skills inform the structure of a controlled multilingual vocabulary. This is an original small CVMais catalogue, not a full ESCO import or official classification.
- [Algolia synonym guidance](https://www.algolia.com/doc/guides/managing-results/optimize-search-results/adding-synonyms): distinguish equivalent expressions from directional expansion and rank relevance carefully. No Algolia service, account or external query API is used.

Each template stores tag IDs. Each tag defines Portuguese and English labels, aliases, common abbreviations, related role/skill expressions and optional preferred layout families. Industry editions inherit curated sector tags; the ten general templates use explicit assignments. Education-first industry editions add first-job suitability; strong-masthead editions add leadership suitability. No user CV content is indexed or rewritten.

Telecommunications is separate from communications/marketing. Telecom, telecoms, telecommunications, telecomunicações, fibra óptica, RF, RAN, NOC/networks and 5G are covered by appropriate technical topics. They are not globally treated as synonyms for marketing. Related concepts such as networks and telecom remain separate tags that may be assigned to the same design.

## Matching and ranking

1. Apply explicit industry/style filters. Never silently clear them to inflate results.
2. Normalise case, accents and punctuation, remove a small PT/EN stop-word list, and require all meaningful query terms.
3. Match template names, bilingual metadata and assigned tag vocabulary. Names rank highest; exact words rank ahead of prefixes; curated layout preferences break relevance ties. Empty search retains catalogue order.
4. Short acronyms match whole words. Prefix matches require at least four characters, preventing IT from matching an arbitrary substring.
5. Only if there are no strict results, allow one edit or adjacent letter transposition on words of at least five characters. Show an approximate-results notice when that fallback returns results. Never silently replace the typed query.
6. Show up to three topic chips, prioritising matched topics. Clicking a chip searches its current-language label and retains explicit filters. The complete assigned tag list remains searchable.

| Query (all areas/styles) | Expected behaviour |
| --- | --- |
| telecom / telecommunications / telecomunicações | 20 technical/IT choices, preferred technical layouts first |
| telecom engineer / engenheiro de telecomunicações | Same curated telecom designs |
| 5G / fibra óptica | Same telecom topic coverage |
| communication | 11 communications-related choices; no wholesale telecom expansion |
| IT / HR | Whole-word acronym matches to suitable assigned topics |
| telecomunications | One-edit fallback, explicitly marked approximate |
| unknown unrelated word | Honest empty state with reset controls |

## Maintenance

Edit src/lib/template-taxonomy.ts to add a concept, its aliases and curated assignments. Avoid making every concept interchangeable or tagging every template with every profession. Give each new concept a PT and EN label, test its intended matches and excluded neighbours, and inspect the top results and mobile chips. A new role does not require duplicating a layout. The current dictionary is intentionally finite; future new terms need editorial review.

The implementation is local and deterministic. It adds no DB tables, search telemetry, tracking, credentials, paid services or changes to PDF output. Existing URLs, combined filters and editor-return context remain supported. Actual target-market and physical-device pilot feedback is still pending.

## Inline suggestions and filter recovery — 25 October 2026

Search now offers up to five inline topic buttons with actual result counts under the current filters, including three-character prefixes, aliases and bounded typo handling. Portuguese and English labels match the interface. Empty search offers clearly labelled editorial starting topics, without popularity claims. Buttons remain standard keyboard-accessible controls rather than an ARIA combobox.

If the current search has zero results but the same text finds models outside the selected area/style, the empty state explains the conflict and offers View templates without filters with its true total. Only explicit user action clears area/style; the query is retained. Unknown terms with no global matches show a wording hint and the existing full reset. No new storage, tracking or external search service.


The homepage is an explicit twelve-design editorial showcase; its topic chips link to full-library searches. All 118 records are searchable in /modelos. Counts and suggestions automatically follow the expanded catalogue; telecom now covers 20 suitable designs. The New filter identifies the 36 additions in this release.
