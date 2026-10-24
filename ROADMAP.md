# CVMais delivery roadmap

Updated 24 October 2026. This records delivered work and the next launch priorities; unimplemented items must not be presented as live features.

## Delivered

1. Responsive pt-MZ homepage, approved imagery, six distinct portrait-capable CV templates, honest illustrative gallery.
2. Editor, crop/zoom photo, browser-generated A4 PDF, guest local draft and JSON export; private account library, SQLite autosave, revisions and recovery codes.
3. Permanent account/CV erasure with password confirmation, session revocation and matching local-copy cleanup.
4. Resend cvmais.win verified sender, optional email confirmation and expiring single-use password reset; approved owner delivery test reported Delivered. Encrypted daily B2 backup plus real download/restore verification.

## Current release: public domain and continuity

- Attach cvmais.win and www in DGC, DNS and HTTPS; www canonical redirect.
- New email links use cvmais.win. Both exact application origins accepted during transition.
- Keep guest drafts on their original origin; provide export/import, explicit review/undo and migration guidance. Same account database across both origins.
- Homepage canonical/share metadata, sitemap/robots and noindex headers on private/editor/auth routes.
- Verify HTTPS, account/CV persistence, both-origin login and saves, guest import and mobile layout before declaring complete.

## Next launch priorities

1. Operational visibility: make last successful backup and stale/failure conditions inspectable without exposing credentials or CVs. Add external failure notification only after the owner chooses the recipient/channel and authorizes routine sends. Current failures appear in logs.
2. Real user pilot: owner-controlled accounts test verification/reset from received links, mobile editing, portrait import and long PDF. Gather real feedback; do not invent testimonials or user counts.
3. Content: expand pt-MZ career guidance with original useful examples; community remains clearly in preparation until a real workflow and moderation rules exist.
4. Later domain cvmais.co.mz: attach only after acquisition/DNS access; repeat origin/cookie/local-draft migration checks.

## Current limits

- Single application container with persistent SQLite. Do not horizontally scale independent SQLite replicas.
- No durable email outbox; failed delivery requires a new user request. No external backup failure alerts yet.
- Backups expire after about 30 days; restoration must reconcile subsequent erasure requests.
