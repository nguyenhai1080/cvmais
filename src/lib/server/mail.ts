import { createHash } from 'node:crypto';
export type MailPurpose = 'verify' | 'reset';
export function mailEnabled() {
  return process.env.MAIL_ENABLED === 'true' && Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM && process.env.APP_ORIGIN?.startsWith('https://'));
}
export function tokenMessage(purpose: MailPurpose, token: string, origin: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) throw new Error('Invalid email token');
  const url = new URL(purpose === 'verify' ? '/confirmar-email' : '/repor-acesso', origin);
  if (url.protocol !== 'https:') throw new Error('Email links require HTTPS');
  url.hash = `token=${token}`;
  return purpose === 'verify' ? {
    subject: 'Confirma o teu email · CVMais',
    text: `Confirma o teu endereço de email no CVMais.\n\nAbre a ligação e selecciona «Confirmar email»:\n${url.href}\n\nA ligação é válida por 24 horas e só pode ser usada uma vez. Se não criaste uma conta nem pediste esta confirmação, ignora esta mensagem. Não partilhes esta ligação.\n\nCVMais`,
  } : {
    subject: 'Recupera o acesso à tua conta · CVMais',
    text: `Recebemos um pedido para repor a tua palavra-passe no CVMais.\n\nAbre a ligação para escolher uma nova palavra-passe:\n${url.href}\n\nA ligação é válida por 30 minutos e só pode ser usada uma vez. Se não fizeste este pedido, ignora a mensagem; a tua palavra-passe continua igual. Nunca partilhes esta ligação.\n\nCVMais`,
  };
}
async function deliver(email: string, message: { subject: string; text: string }, idempotency: string) {
  if (!mailEnabled()) throw new Error('Email delivery is not configured');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15_000),
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotency },
    body: JSON.stringify({ from: process.env.MAIL_FROM, to: [email], ...message }),
  });
  if (!response.ok) throw new Error(`Email delivery failed (HTTP ${response.status})`);
  const receipt = await response.json();
  if (typeof receipt.id !== 'string') throw new Error('Email receipt missing');
  return receipt.id;
}

export async function sendTokenEmail(email: string, purpose: MailPurpose, token: string) {
  return deliver(email, tokenMessage(purpose, token, process.env.APP_ORIGIN!), `cvmais-${purpose}-${createHash('sha256').update(token).digest('hex')}`);
}
export async function sendDeliveryTest(email: string) {
  return deliver(email, { subject: 'CVMais · Teste de envio de email', text: 'Este é o teste técnico de envio de email do CVMais, solicitado pelo administrador DGC. O domínio cvmais.win está configurado para as mensagens de confirmação e recuperação de acesso. Não precisas de responder nem de realizar qualquer acção.\n\nCVMais' }, 'cvmais-delivery-test-20261024');
}
