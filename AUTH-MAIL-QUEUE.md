# Authentication email queue

Account verification and password reset now persist a delivery job atomically with the corresponding single-use token. Registration remains usable immediately. No marketing or invitation emails are added by this feature.

## Storage and encryption

`auth_mail_outbox` references `email_tokens` with `ON DELETE CASCADE`. Each job stores a snapshot of the exact Resend body encrypted with AES-256-GCM, bound to its token digest as associated data. The raw token, recipient and message are not stored in plaintext in the queue. Users' existing account email remains in the existing users table. Logs and operator summaries omit recipients, tokens, ciphertext and provider responses.

The encryption root is `AUTH_MAIL_ENCRYPTION_KEY` when provided, otherwise the existing `BACKUP_ENCRYPTION_KEY`. Both must be private 32-byte hexadecimal values. HKDF with a dedicated `auth-mail-outbox-v1` context derives a distinct encryption key; the backup cipher key itself is not reused as the mail cipher key. DGC's existing backup root requires no new account or environment change. Preserve the root outside the database. Rotating or losing it makes older pending jobs unreadable; they fail closed and their payload is cleared. Users can request a fresh link after configuration is repaired.

Backups contain encrypted queue payloads. Before restoring a database, reconcile subsequent account erasures and token revocations as already required for CVMais restores; keep mail sending disabled during reconciliation. Restored expired tokens are purged. Do not replay jobs from a backup into a separate environment with real mail enabled.

## Processing and retries

- The request's `after()` hook attempts immediate delivery after responding. This is an optimisation, not the durability mechanism.
- `scripts/serve.mjs` starts a separate worker which scans every two seconds after a ten-second startup grace. The supervisor restarts an unexpectedly exited worker after five seconds. Normal application shutdown stops it.
- SQLite transactions claim one job with a random lease and a 60-second lease expiry. A persisted global send gate spaces attempts by at least 600 ms across request hooks and workers. The HTTP transport has a 15-second timeout.
- Each message has at most eight claimed attempts. Normal retry delays are 30, 60, 120, 240, 300, 300 and 300 seconds. `Retry-After` can extend a delay, capped at ten minutes. Network/ambiguous receipt errors, HTTP 408, 409, 429 and 5xx retry; other HTTP failures stop immediately.
- Retries use the same stored body and token-derived idempotency key across application restarts. Provider deduplication reduces repeated deliveries after an ambiguous receipt or crash; it is not an end-to-end exactly-once guarantee.
- Verification tokens keep their existing 24-hour expiry and reset tokens their 30-minute expiry, measured from the request. No delivery starts with less than 30 seconds left. Retries do not extend expiry or issue a replacement token.
- New links of the same purpose invalidate the old link and cascade-delete its job. Consuming a verification link removes that job. Password resets and code recovery remove all account tokens/jobs. Erasing the account removes its jobs. An already in-flight email cannot be recalled, but its revoked link no longer works.
- Successful provider acceptance removes the queued payload. Permanent/exhausted failures clear the encrypted payload and retain only failed-job metadata until token expiry or invalidation. Expired tokens/jobs are purged even when sending is disabled.

## Visibility

`/api/storage/email-status` retains its existing enablement/verification fields and adds only `workerReady`, a generic two-minute heartbeat indicator. It does not expose queue contents or counts publicly.

The existing verified-operator-only `/operacoes` panel receives pending/retrying/failed counts, worker readiness and last provider acceptance. Retrying is a subset of pending. A provider's accepted receipt is not proof of inbox delivery. No new operational-alert recipients or automatic alert emails were configured.

If failed jobs appear, check the configured sender, Resend access and quota, encryption root and persistent database. Fix configuration first, then ask the affected user to request a fresh link; failed or expired jobs are not silently revived. If the worker is stale, check the application logs and restart the application if its supervisor cannot recover it. When the whole host is down, neither request hooks nor the worker can send; the queue resumes after recovery subject to expiry.

## Validation and sources

Unit tests use a controlled clock, isolated SQLite databases and mock mail transports. They cover encrypted atomic registration, restart/replay, backoff, leases, expiry, supersession, erasure, permanent failures, key changes and non-sensitive summaries. After `npm run build`, use `npm run qa:mail` for the isolated compiled HTTP pilot. It intercepts all Resend requests; it never sends external email or uses production credentials.

- [Resend idempotency keys](https://resend.com/changelog/idempotency-keys): keys are retained for 24 hours.
- [Resend engineering notes](https://resend.com/blog/engineering-idempotency-keys): retry with the same body and key.
- [Node crypto](https://nodejs.org/api/crypto.html): HKDF and authenticated AES-GCM primitives.

This does not replace the physical Android pilot or Mozambican Portuguese user feedback. Channel following remains pending an owner-provided WhatsApp channel URL.
