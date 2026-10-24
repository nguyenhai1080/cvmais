# CVMais pilot and launch acceptance

Updated 24 October 2026. Production application: DGC v11, source f8c29ab. Distinguish technical QA from real-user acceptance; no testers or feedback are invented.

## Technical regression completed

| Scenario | Evidence | Result |
| --- | --- | --- |
| Six CV designs, short and long content | Fresh qa:pdf generation and PDF content/font/page-bound checks using bundled Python | Passed |
| Visual pagination | Rendered and inspected all pages of long modern and minimalist examples | Passed |
| Mobile editor simulation | Separate local origin localhost:3003, 390px viewport; equal client/scroll width 375px | Passed |
| Candidate photo | Browser chooser, crop zoom/position, apply photo, preview, reload | Passed |
| Long guest draft | Name/profile/experience entered through UI, saved and restored after reload | Passed |
| Model switch | Switched the same guest content to modern design | Passed |
| Real browser PDF download | Photo, Portuguese accents, end marker and complete long text preserved in a two-page PDF | Passed |
| Account data regression | Isolated local HTTP suite: authentication, ownership, second-device sessions, revisions, trash, recovery, erase guards | Passed |
| Automated suite | 24 tests including backups, monitor state, notifications, allowed origins and portable CV content | Passed |

The viewport test emulates a mobile browser size; it does not substitute for an actual Android/iPhone test. Synthetic CVs and local accounts were used. No production user CV was overwritten. PDF files and test credentials remain in ignored work storage.

## Owner-controlled email pilot - first owner pass completed

Use the owner-controlled address nguyenhai1080@gmail.com. The owner enters passwords and completes password changes themselves; passwords must not be sent in chat or recorded in this report.

1. Open https://cvmais.win/conta and register or sign in. Preserve the recovery code privately.
2. Open the verification email, check the hostname is cvmais.win, and select Confirmar email. In Os meus CVs, confirm Email confirmado.
3. Reopen the same verification link; it must be rejected as already used. Request another link only when necessary.
4. Sign out, select Esqueci-me da palavra-passe, and request recovery. Open the newest email and personally enter/submit a new password.
5. Confirm the old sessions no longer access the account. Sign in with the new password; confirm previous CVs remain.
6. Check the old reset link cannot be reused. Store the new recovery code privately.
7. Open /operacoes with the verified owner account; verify it shows current backup status. A normal account must not see these details.

Record only pass/fail and observations, never email-link tokens, passwords, recovery codes or CV contents. Sender transport was previously tested with a real Delivered receipt; the owner has now exercised registration, verification, received password reset and subsequent sign-in.

## Real-device and usability pilot - not yet completed

The owner can invite a small group of consenting Mozambican Portuguese speakers, ideally covering first job and experienced candidates. No invitations have been sent by this agent.

Ask each person to use invented details or their own chosen non-sensitive CV data. Avoid identity-document numbers and unnecessary private details. Participation and photos are optional.

- On an actual Android or iPhone: open the homepage, choose a model, edit, add an optional photo and download/open the PDF.
- Continue a guest draft after closing/reopening the browser; export/import a JSON copy.
- On two devices signed into the same account: edit and confirm changes appear on the other device; report any confusing conflict/pending-save message.
- Confirm email and recover access from the newest received email.
- Review Portuguese wording and record unclear labels, missing local fields, crop/download difficulties or layout problems.

## Feedback log

| Test ID | Device/browser | Task | Pass/fail | Observation | Severity | Retest |
| --- | --- | --- | --- | --- | --- | --- |
| Awaiting first consenting tester | | | | | | |

## Launch gate

Do not mark the real-user pilot complete solely from automated tests. Resolve any data loss, wrong-account access, broken recovery or unreadable PDF before wider release. External monitoring needs active successful checks and verified alert routing; simulations must be clearly named and paused afterward.

### Observed email evidence

Owner reported registration and email verification complete. Resend UI confirms Delivered for verification receipt 01a16da8-d66b-78da-9917-ed56ff47e834 and password-reset receipt 01a16daa-c9e5-783e-9613-5fb025a8e471. The owner performs the password change and subsequent sign-in; this must not be inferred solely from a delivery receipt. No tokens or credentials are recorded here.

### Owner outcome and scope

The owner reported on 24 October 2026: registration and email verification completed; reset email received, password changed personally and sign-in succeeded. Their feedback was «Không gặp vướng mắc đáng kể» (no significant difficulty). This is one owner-controlled functional pilot, not a representative Mozambican usability study. The agent did not receive or enter the owner's password, recovery code or email token. The owner's authenticated session was not available in the agent's IAB tabs, so the production private operations screen and the owner's real CV content were not personally inspected. Access restrictions and that UI were validated separately with isolated synthetic accounts. Real-link replay and old-session revocation were covered by local API/unit regression; no claim is made that the owner manually exercised every adversarial test step above.

Live production regression also passed: portrait and CV text survive read/update across two independent sessions and the old/new origins; original persisted CV fixture stays unchanged. The newly created fictional CV was erased after the check.
