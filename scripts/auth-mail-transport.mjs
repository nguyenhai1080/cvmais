import { createHash } from 'node:crypto';

export function mailEnabled() {
  return process.env.MAIL_ENABLED === 'true' && Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM && process.env.APP_ORIGIN?.startsWith('https:'));
}
export function tokenMessage(purpose, token, origin) {
  if (!['verify','reset'].includes(purpose) || !/^[a-f0-9]{64}$/.test(token)) throw new Error('Invalid email token');
  const url = new URL(purpose === 'verify' ? '/confirmar-email' : '/repor-acesso', origin);
  if (url.protocol !== 'https:') throw new Error('Email links require HTTPS');
  url.hash = `token=${token}`;
  return purpose === 'verify' ? {
    subject: 'Confirma o teu email · CVMais',
    text: `Confirma o teu endereço de email no CVMais.\n\nAbre a ligação e selecciona «Confirmar email»:\n${url.href}\n\nA ligação é válida por 24 horas a partir do pedido e só pode ser usada uma vez. Se não criaste uma conta nem pediste esta confirmação, ignora esta mensagem. Não partilhes esta ligação.\n\nCVMais`,
  } : {
    subject: 'Recupera o acesso à tua conta · CVMais',
    text: `Recebemos um pedido para repor a tua palavra-passe no CVMais.\n\nAbre a ligação para escolher uma nova palavra-passe:\n${url.href}\n\nA ligação é válida por 30 minutos a partir do pedido e só pode ser usada uma vez. Se não fizeste este pedido, ignora a mensagem; a tua palavra-passe continua igual. Nunca partilhes esta ligação.\n\nCVMais`,
  };
}
export class MailDeliveryError extends Error {
  constructor(retryable, retryAfterMs = 0) { super('Authentication email transport failed'); this.retryable = retryable; this.retryAfterMs = retryAfterMs; }
}
export function tokenIdempotency(purpose, token) {
  return `cvmais-${purpose}-${createHash('sha256').update(token).digest('hex')}`;
}
export async function deliverBody(body, idempotency, fetchImpl = fetch) {
  if (!mailEnabled()) throw new MailDeliveryError(true);
  const response = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15_000),
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotency },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const retry = response.status === 408 || response.status === 409 || response.status === 429 || response.status >= 500;
    const header = response.headers.get('retry-after');
    const delay = header && /^\d+$/.test(header) ? Number(header)*1000 : header ? Date.parse(header)-Date.now() : 0;
    throw new MailDeliveryError(retry, Number.isFinite(delay) ? Math.min(Math.max(delay,0),600_000) : 0);
  }
  const receipt = await response.json();
  if (typeof receipt.id !== 'string' || !receipt.id) throw new MailDeliveryError(true);
  return receipt.id;
}
export function sendTokenEmail(email, purpose, token) {
  return deliverBody({from:process.env.MAIL_FROM,to:[email],...tokenMessage(purpose,token,process.env.APP_ORIGIN)},tokenIdempotency(purpose,token));
}
