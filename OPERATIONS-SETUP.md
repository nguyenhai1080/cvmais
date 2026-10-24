# Services to configure before a public launch

Status: application account/CV erasure is implemented. Email delivery/verification and scheduled encrypted off-server backups are not active. No Resend or Backblaze credentials have been supplied. Do not claim those integrations are ready merely because accounts or keys exist.

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
4. Implement a scheduled consistent SQLite snapshot, integrity validation, encryption before upload, bounded retention, failure reporting and a restore test in an isolated environment. Store the recovery/encryption key separately from the backup and keep an owner-controlled recovery copy.
5. Before a restore, reconcile account/CV erasures performed since the backup. Keep retention and the public privacy notice aligned. A copy on `/data` alone does not provide off-server protection.

Current manual command: `node scripts/backup-db.mjs` with DATABASE_PATH and optional BACKUP_DIR. The command checks snapshot integrity; it does not schedule, encrypt or upload anything.

Official references: https://www.backblaze.com/docs/cloud-storage-create-and-manage-buckets, https://www.backblaze.com/docs/cloud-storage-application-keys, https://www.backblaze.com/cloud-storage/pricing.
