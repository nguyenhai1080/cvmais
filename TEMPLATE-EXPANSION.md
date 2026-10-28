# Distinct CV compositions: target 120

28 October 2026. The target is **120 independently reviewed compositions**. It has not been completed. Before this release the public catalogue contained 14; DGC v39 adds 12, for **26 live compositions**. Another **94** remain. The 108 old industry recolourings remain readable in saved CVs but are excluded from discovery and these counts.

## Acceptance rule

A design needs its own content arrangement: masthead hierarchy, region placement, reading order, entry/date structure and section hierarchy must be reviewed together. A new colour, name, portrait, industry label or a permutation generated to fill a quota is insufficient. Structural fingerprints catch accidental duplicates but do not establish visual quality by themselves. HTML preview and A4 PDF must preserve the same user content. PT/EN titles, optional photo, long text, long supporting sections and empty sections are checked before public release. No invented skill ratings, achievements or ATS guarantees.

## First expansion batch

| Primary field | New composition | Structural purpose |
| --- | --- | --- |
| Administration | Pauta | Framed masthead; profile beside skills; full-width work; education/language footer |
| Accounting | Balanço | Ledger-style dates, right support column, education after the ledger |
| Technology | Circuito | Technical masthead, full-width skills first, right contacts/education column |
| Healthcare | Cuidado | Clinical portrait module, education before practice, separate skills/language panels |
| Education | Cátedra | Centred academic identity, margin contacts, full-width education before work |
| Engineering | Prumo | Blueprint identity, labels in a dedicated margin, date ledger inside linear sections |
| Logistics | Travessia | Dispatch contact strip, profile/skills introduction, career timeline, training footer |
| Sales | Impulso | Contrast identity, prominent profile/skills, career beside education and languages |
| Hospitality | Estância | Vertical portrait, serif identity, languages/profile beside service history |
| Communications | Prisma | Magazine masthead, margin introduction, experience cards, split lower sections |
| Agriculture | Campo | Asymmetric portrait, profile beside training, full-width field practice, skills base |
| Community projects | Elo | Block identity, side profile/languages, primary project timeline, training below |

Samples are fictional and use Mozambique Portuguese; portraits are existing illustrative assets. Layout changes never replace a user's prose with the sample. Each design has curated profession aliases and one primary field. Secondary recommendations do not increase the unique count.

## Remaining work to reach 120

Assign each composition to one primary field for accounting purposes; the gallery may recommend it in several fields. Target ten per primary field, not the same ten structures recoloured across all fields.

| Primary field | Existing 14 | Added now | Total after batch | Remaining to ten |
| --- | ---: | ---: | ---: | ---: |
| Administration | 2 | 1 | 3 | 7 |
| Accounting | 2 | 1 | 3 | 7 |
| Technology | 2 | 1 | 3 | 7 |
| Healthcare | 1 | 1 | 2 | 8 |
| Education | 2 | 1 | 3 | 7 |
| Engineering | 1 | 1 | 2 | 8 |
| Logistics | 0 | 1 | 1 | 9 |
| Sales | 0 | 1 | 1 | 9 |
| Hospitality | 1 | 1 | 2 | 8 |
| Communications | 2 | 1 | 3 | 7 |
| Agriculture | 0 | 1 | 1 | 9 |
| Community projects | 1 | 1 | 2 | 8 |
| **Total** | **14** | **12** | **26** | **94** |

Existing primary assignments: administration Maputo/Índico; accounting Essencial/Prestígio; technology Código/Vértice; healthcare Vital; education Horizonte/Aurora; engineering Estrutura; hospitality Acolher; communications Coral/Fólio; community projects Atlas. These assignments count each design once and do not restrict user choice.

Next milestones: 50, 74, 98, 120. Prioritise the thinner logistics/sales/agriculture ranges; then add first-job, technical-specialist, field-work, research/teaching, leadership and career-change structures where the content needs differ. Each milestone requires a fresh monochrome/thumbnail comparison and the PDF acceptance above. No scheduled background design task or completion date has been promised.

## Research and original design

Reviewed 28 October 2026: [Novorésumé](https://novoresume.com/resume-templates) distinguishes functional, hybrid, chronological and field-focused formats; [FlowCV](https://flowcv.com/resume-templates) distinguishes simple, modern, creative, photo, compact and first-job selections. We use these broad content/hierarchy principles, not their artwork, source or exact templates. Their commercial claims and ATS promises are not carried into CVMais.

## Reproducible validation

`npx tsx scripts/render-sector-fixtures.tsx` produces six fictional PDF cases per new model in ignored work/sector-qa. `scripts/check-sector-pdfs.py` checks content retention, PT/EN headings, A4 bounds and embedded fonts, and renders actual PDF thumbnails with Poppler. Short samples must fit one page; long work and supporting sections must retain final markers. PNG contact sheets and all stress-test pages are visually inspected. Automated catalogue tests check registration, search aliases, distinct structure metadata and old-model compatibility.
