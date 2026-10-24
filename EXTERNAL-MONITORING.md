# External monitoring - StatusCake

Prepared/configured 24 October 2026 in the owner's StatusCake account, email nguyenhai1080@gmail.com, Free Plan. No paid trial or upgrade was selected by the agent. StatusCake runs outside DGC/Vibehost and does not need CVMais or the backup worker to be running in order to check availability and issue alerts.

## Production monitors

| Name | URL | Test ID | Interval |
| --- | --- | --- | --- |
| CVMais - Aplicação e base de dados | https://cvmais.win/api/health | 8040391 | 300 seconds |
| CVMais - Cópias de segurança | https://cvmais.win/api/health/backup | 8040392 | 300 seconds |
| CVMais - Página inicial | https://cvmais.win/ | 8040393 | 300 seconds |

Notification group: Default Contact Group, ID 381072. The group contains only nguyenhai1080@gmail.com, zero SMS recipients, and repeat alerts are disabled. The application monitor uses the default two confirmation servers. Public probes use no authentication, cookies, private headers, CV data or server secrets. No StatusCake API credential was created or copied.

Dashboard: https://app.statuscake.com/YourStatus2.php
Notification group: https://app.statuscake.com/alerting/notification-groups/381072/edit
Alert history: https://app.statuscake.com/alert_history.php?group=381072

## Limits of this setup

- Five-minute checks are periodic, not instant. Confirmation checks and provider delivery can add delay.
- The public backup probe returns HTTP 503 for stale/missing/failed backup state; the main DB health stays independent.
- The Free UI locks content matching, custom monitoring regions and the Validate SSL option. This setup checks HTTP availability; it must not be described as comprehensive response-content, certificate-validity or certificate-expiry monitoring.
- Native StatusCake notifications are separate from the in-container Resend backup alerts. A whole-host outage can be reported externally; an unavailable StatusCake/email provider can still delay alerts.
- Uptime percentages on a newly created test cover only the observed short window. They are not a historical reliability claim.

## Isolated alert simulation

A fourth test, ID 8040394, is named CVMais - TESTE SIMULADO de alerta - sem incidente real. It checks a deliberately missing path /cvmais-monitoring-simulation-404 to exercise the down notification without changing the real application or its health endpoints. After observing the alert, change only this test to the healthy /api/health URL, observe recovery, then pause it. Keep it paused as clearly labelled test history; the three production monitors remain active. Do not deliberately stop production or corrupt backups to test notifications.

Completed: StatusCake history shows Down email Sent at 2026-10-24 11:28 UTC and Up email Sent at 11:30 UTC, both to nguyenhai1080@gmail.com. The simulation now targets the healthy /api/health URL and is paused. The dashboard shows three active production monitors and one paused simulation; all three production monitors have successful measured responses. Sent is the provider status and is not an independent inbox-delivery receipt.

Official plan reference checked on setup date: https://www.statuscake.com/pricing/ (Free: small businesses allowed, 10 monitors, five-minute checks). This is the setup used; future plan changes should be checked in the provider account before enabling paid features.
