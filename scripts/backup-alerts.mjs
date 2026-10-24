import { createHash } from 'node:crypto';
import { readStatus, writeStatus } from './backup-health.mjs';
export async function sendBackupAlert(health, kind, incident) {
  const recipient = process.env.OPERATIONS_EMAIL;
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) || !process.env.RESEND_API_KEY || !process.env.MAIL_FROM) throw new Error('Alert delivery configuration incomplete');
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15_000), headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `cvmais-backup-${createHash('sha256').update(`${incident}:${kind}`).digest('hex')}` }, body: JSON.stringify({ from: process.env.MAIL_FROM, to: [recipient], subject: kind === 'recovered' ? 'CVMais · Cópias de segurança recuperadas' : 'CVMais · Verificar cópias de segurança', text: `Estado das cópias de segurança: ${health.state}.\nÚltima cópia concluída: ${health.lastSuccessAt || 'Sem registo válido'}.\nVerificação: ${health.checkedAt || 'Sem sinal recente do processo'}.\n\nConsulta o painel de operações do CVMais e os registos do servidor DGC. A cópia diária deve ter menos de 36 horas. Esta mensagem não inclui CVs, credenciais ou dados de utilizadores.\n\nCVMais` }) });
  if (!response.ok) throw new Error('Alert provider rejected delivery');
  const receipt = await response.json(); if (typeof receipt.id !== 'string') throw new Error('Alert receipt missing');
}
// One accepted failure notice per persisted incident; one recovery notice after it.
// A dead worker cannot send its own alert: use the separate HTTP probe externally.
export async function notifyBackupHealth(health, { directory, now = new Date(), enabled = process.env.BACKUP_ALERTS_ENABLED === 'true', send = sendBackupAlert } = {}) {
  if (!enabled) return;
  const file = 'alert-status.json';
  let incident = await readStatus(directory, file);
  if (health.healthy) {
    if (!incident?.id) return;
    if (incident.notified) await send(health, 'recovered', incident.id);
    await writeStatus(directory, file, {});
    return;
  }
  if (!incident?.id) { incident = { id: now.toISOString(), notified: false }; await writeStatus(directory, file, incident); }
  if (incident.notified) return;
  await send(health, 'failed', incident.id);
  await writeStatus(directory, file, { ...incident, notified: true });
}
