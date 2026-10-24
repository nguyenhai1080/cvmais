# Services to configure before a public launch

Status: application account/CV erasure is implemented. Email delivery/verification and scheduled encrypted off-server backups are not active. The approved B2 bucket-scoped preset key and encryption key are saved in DGC; no Resend sending key is configured. Do not claim those integrations are ready merely because accounts or keys exist.

## Actual service setup, 24 October 2026

- Owner has registered and signed in to both services.
- Resend domain: `cvmais.win`, ID `cc34e471-6454-4adc-972d-324451aa2e46`. DNS verification is pending; receiving remains off. The unused `soltech.co.mz` entry was removed after explicit owner confirmation. The future `cvmais.co.mz` domain is not configured.
- Authoritative DNS for cvmais.win: `doug.ns.cloudflare.com`, `tegan.ns.cloudflare.com`, confirmed through both public resolvers 1.1.1.1 and 8.8.8.8. Cloudflare dashboard sign-in is still needed. The local resolver initially returned a stale NXDOMAIN result.
- B2 bucket: `cvmais-dgc-backups`, ID `30b5e9b191056cc3a8160910`, Private, SSE-B2 encryption enabled, endpoint `s3.eu-central-003.backblazeb2.com`, region `eu-central-003`. Lifecycle now applies to prefix `cvmais/`: hide after 29 days, delete one day after hiding (approximately 30 days total, subject to the provider processing schedule). A real upload/download/restore check remains pending activation.

Required Resend DNS records shown by the live console (public values, not secrets):

| Type | Host within cvmais.win | Value |
| --- | --- | --- |
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDPs573xPYLhSdFei6R/rSP7cyu3dkHMvdVb9/b5fczw5ZF6d1JTk3szpx7tqAtLDBu4nFIKmk93n5LaD7ZzXNtpWEu56llBovbe8r4lYnIcTAfkFB8Skfael6zU2aaOXNwAsDrButtmq0ldOpkJ6Yqb5+NU+PvPI9tmAV4rmrc5QIDAQAB` |
| CNAME | `rsend` | `rsend-apne1.forge.rmta.net` |
| CNAME | `send` | `send.forge.rmta.net` |

Use automatic/default TTL. Inspect any existing records before changing them. Do not overwrite an existing DMARC policy or the domain's mailbox MX records. The optional DMARC example from the Resend console is not a required change. Trigger verification only after the required records have been added.

## Prepared encrypted backup implementation

`scripts/backup-offsite.mjs` makes a consistent SQLite snapshot, checks integrity, encrypts with AES-256-GCM before uploading through the B2 Native API and verifies the upload receipt. Plain temporary snapshots and local upload artifacts are removed after each attempt. An application key restricted to this exact bucket is required; no master account key is accepted. Credentials and CV contents are never logged.

Docker starts the optional backup worker through `scripts/serve.mjs`. Only `BACKUP_ENABLED=true` plus all required values enables it. It starts after one minute, checks hourly, uploads once per UTC day, persists successful status in `/data/backups/offsite-status.json`, and retries failures hourly. Failure messages go to runtime logs; external alert delivery is not implemented. The owner-approved configuration is saved with BACKUP_ENABLED=true and takes effect on the next deployment. Do not claim live backup success until a remote file and isolated restore have been verified.

Required private server settings: `B2_KEY_ID`, `B2_APPLICATION_KEY`, `BACKUP_ENCRYPTION_KEY` (64 hex characters / 32 random bytes). Non-secret setting: `B2_BUCKET_ID=30b5e9b191056cc3a8160910`. Keep an owner-controlled copy of the encryption key separately before enabling backups. Use a bucket-scoped write-only key, optionally restricted to prefix `cvmais/`. Set a deliberate B2 lifecycle policy before enabling scheduling; the worker does not delete remote objects itself.

To validate restoration in an isolated environment, download a `.cvb` file privately and run `node scripts/restore-backup.mjs backup.cvb NEW-isolated.sqlite` with the encryption key in the environment. Existing files are never overwritten. Restore validation checks the authentication tag and SQLite integrity. This is a verification command, not an automatic production restore.

## Email: Resend

1. The DGC owner registers at https://resend.com/signup and confirms their email. Start with Free; no paid plan is required for initial setup.
2. For real recipients, add a domain controlled by DGC under Domains and add the exact DNS records Resend supplies. A dedicated subdomain of an existing DGC domain is possible; CVMais does not need its own purchased domain merely to develop the app. Never claim ownership of Vibehost's shared domain. The `resend.dev` sender is restricted to testing with the account's own email.
3. Wait for domain verification. After application integration is ready, create a sending-only API key restricted to that domain and enter it directly in the DGC project's server environment. Do not paste keys into chat or Git, or expose them through NEXT_PUBLIC variables.
4. Implement expiring hashed single-use verification/reset tokens, generic reset-request responses, rate limits, session revocation and pt-MZ emails. Disable open/click tracking for authentication mail. Test delivery to a mailbox controlled by the owner before claiming success. The current recovery-code flow must remain available until email recovery is verified.

Current official references (checked 24 October 2026): https://resend.com/pricing, https://resend.com/docs/dashboard/domains/introduction and https://resend.com/docs/knowledge-base/403-error-resend-dev-domain.

## Off-server backup: Backblaze B2

1. The DGC owner registers for B2 Cloud Storage at https://www.backblaze.com/sign-up/s3. B2 has an initial free storage allowance; check current pricing and account limits before adding a paid method.
2. Under B2 Cloud Storage > Buckets, create a bucket such as `cvmais-dgc-backups` (append a suffix if unavailable) and choose **Private**. These files contain private CVs and credential hashes. Do not use a public bucket or public file links.
3. Record the non-secret bucket name, S3 endpoint and region. After the uploader is ready, create a restricted application key for this bucket. Enter secret values directly in the confirmed DGC project configuration, not in chat. Do not use the master account key.
4. The prepared uploader/scheduler above covers snapshots, integrity, authenticated encryption, upload receipts and runtime failure logs. Complete restricted-key setup, owner key recovery storage, lifecycle retention, a real upload/download/restore test and alerting before declaring operational readiness.
5. Before a restore, reconcile account/CV erasures performed since the backup. Keep retention and the public privacy notice aligned. A copy on `/data` alone does not provide off-server protection.

Current manual command: `node scripts/backup-db.mjs` with DATABASE_PATH and optional BACKUP_DIR. The command checks snapshot integrity; it does not schedule, encrypt or upload anything.

Official references: https://www.backblaze.com/docs/cloud-storage-create-and-manage-buckets, https://www.backblaze.com/docs/cloud-storage-application-keys, https://www.backblaze.com/cloud-storage/pricing.

The B2 web-console preset called Write Only also includes deleteFiles and several bucket-write capabilities. This was disclosed to the owner, who explicitly approved using that preset within the single bucket and cvmais/ prefix. Do not describe this key as having only writeFiles. The uploader itself never deletes remote files or changes bucket settings. An owner recovery copy of the encryption key is kept only in ignored local work storage, never in Git or source archives.
