# Interface and CV languages

Portuguese (Mozambique) is always the default. The browser language is not used to switch automatically.

- Header: Portuguese / English interface selector, including the mobile menu. The non-sensitive preference is stored as `cvmais-ui-language` on this browser/origin. It is independent of an account and of every CV. It synchronises to other tabs of the same origin where browser storage is available. Without storage it works for the current tab.
- Editor: separate CV language field in Your details / Os teus dados. New CVs and historical CVs without a recognised language use Portuguese. Selecting English changes the actual preview section headings, PDF section headings/document language and the suggested content library. It never machine-translates names, roles, experience, skills or any user-authored text.
- `cvLanguage: pt | en` travels with each CV in guest drafts, JSON backups, account saves, duplicated/imported CVs and pending local copies. No SQL migration is needed because CV contents are stored as JSON. The server preserves the current choice on updates from older clients that omit the field.
- Suggested examples cover the same twelve professional areas and three career stages in both languages. Grammatical gender options apply only to Portuguese example wording; English examples use gender-neutral wording. Changing either language never inserts a sample automatically or replaces user content.
- Public guidance, account screens, photo/import/deletion controls, navigation and editor UI have English text. Portuguese remains the server-rendered/search-indexed default at the existing URLs; these are not separate English SEO routes. Verification/recovery emails and operational alerts retain their existing Portuguese text; this change does not alter mail transport or authentication.

Implementation: `ui-en.ts` contains original English UI text; `ui-translate.ts` performs explicit text lookup. Components subscribe to `ui-language.ts`; server metadata remains in route modules, while language-aware content lives in client components. CV/PDF headings come from `cv-language.ts`, not the interface preference. User-entered values bypass UI translation lookups. Dates, organisations, qualifications and factual skill levels remain user-authored.

Pre-download review also follows the interface language while explicitly showing the independently selected CV language. It does not translate the CV text.
