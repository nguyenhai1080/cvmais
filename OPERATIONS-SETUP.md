# CVMais operational services

Updated 24 October 2026. DGC owner: nguyenhai1080@gmail.com. Main host remains https://cvmais-dgc.n1.tinhgon.xyz; no website custom domain is attached.

## Email

Resend domain `cvmais.win` (cc34e471-6454-4adc-972d-324451aa2e46) is Verified, Tokyo region. The unused soltech.co.mz entry was removed with owner confirmation. cvmais.co.mz is not configured. Cloudflare nameservers: doug.ns.cloudflare.com and tegan.ns.cloudflare.com.

The first unused sending key was revoked and replaced with `cvmais-auth-mail-v2`, Sending access restricted to cvmais.win. Its value is saved only in DGC environment configuration. Never put secrets in chat, source or NEXT_PUBLIC variables. Sender: `CVMais <nao-responder@cvmais.win>`. One owner-approved test to nguyenhai1080@gmail.com was reported Delivered, receipt 01a16d7a-0e0d-7d04-b153-6a7000a14caf.

MAIL_ENABLED=true is active on DGC v9; MAIL_FROM, RESEND_API_KEY and APP_ORIGIN are server-only settings. Application verification/reset links are hashed in SQLite, expire in 24 hours/30 minutes, are purpose-bound and single-use. Requests are rate-limited; reset responses do not reveal whether an account exists. Reset revokes sessions and rotates recovery codes. Delivery runs after the HTTP response, without a durable retry queue. Failed delivery requires requesting a new link. Plain-text messages contain no tracking pixels. Recovery codes remain a fallback.

Required Resend DNS records shown by the live console (public values, not secrets):

| Type | Host within cvmais.win | Value |
| --- | --- | --- |
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDPs573xPYLhSdFei6R/rSP7cyu3dkHMvdVb9/b5fczw5ZF6d1JTk3szpx7tqAtLDBu4nFIKmk93n5LaD7ZzXNtpWEu56llBovbe8r4lYnIcTAfkFB8Skfael6zU2aaOXNwAsDrButtmq0ldOpkJ6Yqb5+NU+PvPI9tmAV4rmrc5QIDAQAB` |
| CNAME | `rsend` | `rsend-apne1.forge.rmta.net` |
| CNAME | `send` | `send.forge.rmta.net` |

These records are installed in Cloudflare with Auto TTL; CNAME proxy is off. All three are verified by Resend. Receiving is off; mailbox MX records were not changed.

## Encrypted B2 backups

Active since DGC v8. Private bucket `cvmais-dgc-backups`, ID `30b5e9b191056cc3a8160910`, region eu-central-003, SSE-B2 enabled. Lifecycle prefix cvmais/: hide after 29 days, delete one day later, about 30 days total subject to provider processing.

The owner-approved Write Only console preset is scoped to this bucket and cvmais/ prefix. This preset also grants deleteFiles and some bucket-write capabilities; it must not be described as only writeFiles. The uploader itself never deletes remote files or changes bucket settings.

Private server settings: B2_KEY_ID, B2_APPLICATION_KEY, BACKUP_ENCRYPTION_KEY (64 hex characters). BACKUP_ENABLED=true and the bucket ID enable the worker. SQLite snapshots pass quick_check, are AES-256-GCM encrypted before upload, and have their upload receipt checked. Temporary plaintext snapshots are removed. Daily status persists at /data/backups/offsite-status.json; first check after one minute, then hourly, at most one successful upload per UTC day. Failed attempts retry hourly. External failure alerts remain unimplemented; inspect runtime logs.

Verified remote file: cvmais/2026-10-24/d6f77d53-5dcf-46da-a116-5a29245accb8.cvb. Downloaded to ignored work storage, authenticated/decrypted to a new isolated database, SQLite integrity OK, original persistence fixture verified. The production database was not overwritten.

Owner key copy: ignored `work/backup-encryption-key.txt`; keep a separate private owner-controlled copy. Restore with `node scripts/restore-backup.mjs backup.cvb NEW-isolated.sqlite`, providing the encryption key privately. Existing files cannot be overwritten. Reconcile deletions since the backup before restoring production. Manual `scripts/backup-db.mjs` creates a local snapshot only.
