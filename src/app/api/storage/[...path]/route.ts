import { NextRequest, after } from 'next/server';
import { allowedOrigin } from '@/lib/server/origins';
import { store, StoreError } from '@/lib/server/store';
import { normaliseCV } from '@/lib/cv';
import { mailEnabled, sendTokenEmail, type MailPurpose } from '@/lib/server/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const cookie = 'cvmais_session';
const headers = { 'Cache-Control': 'no-store, private', 'Vary': 'Cookie', 'X-Content-Type-Options': 'nosniff' };
async function body(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new StoreError('Pedido inválido.', 415);
  const reader = request.body?.getReader();
  if (!reader) throw new StoreError('Pedido vazio.');
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.length;
    if (size > 512_000) { await reader.cancel(); throw new StoreError('Conteúdo demasiado grande.', 413); }
    chunks.push(value);
  }
  try { const value = JSON.parse(Buffer.concat(chunks).toString('utf8')); if (!value || typeof value !== 'object' || Array.isArray(value)) throw 0; return value as Record<string, unknown>; }
  catch { throw new StoreError('Pedido inválido.'); }
}
function credential(value: unknown, kind: 'email' | 'password') {
  if (typeof value !== 'string') throw new StoreError('Preenche o email e a palavra-passe.');
  if (kind === 'email') {
    const email = value.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new StoreError('Indica um email válido.');
    return email;
  }
  if (value.length < 12 || value.length > 128) throw new StoreError('Usa uma palavra-passe entre 12 e 128 caracteres.');
  return value;
}
function title(value: unknown) { return typeof value === 'string' ? value.trim().slice(0, 100) || 'O meu CV' : 'O meu CV'; }
function sessionCookie(token: string, clear = false) {
  return `${cookie}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear ? 0 : 30 * 86400}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}
async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const path = (await context.params).path;
    const method = request.method;
    const db = store();
    const token = request.cookies.get(cookie)?.value || '';
    const user = db.user(token);
    if (method !== 'GET') {
      if (!allowedOrigin(request.headers.get('origin'), new URL(request.url).origin)) throw new StoreError('Origem do pedido inválida.', 403);
      if (request.headers.get('sec-fetch-site') === 'cross-site') throw new StoreError('Pedido inválido.', 403);
    }
    const reply = (value: unknown, status = 200, setCookie?: string) => Response.json(value, { status, headers: { ...headers, ...(setCookie ? { 'Set-Cookie': setCookie } : {}) } });
    const queueEmail = (email: string, purpose: MailPurpose, value: string) => after(async () => {
      try { db.emailToken(value, purpose); await sendTokenEmail(email, purpose, value); }
      catch { console.error('Authentication email was not delivered; request a new link. No email address, token or provider response logged.'); }
    });
    if (path.length === 1 && path[0] === 'email-status' && method === 'GET') return reply({ enabled: mailEnabled(), verified: user ? db.emailVerified(user.id) : false });
    if (path.length === 1 && ['request-reset','verify-email','reset-email'].includes(path[0]) && method === 'POST') {
      db.limit('email-global', 60, 900_000);
      const input = await body(request);
      if (path[0] === 'request-reset') {
        if (!mailEnabled()) throw new StoreError('A recuperação por email ainda não está disponível. Usa o teu código de recuperação.', 503);
        const email = credential(input.email, 'email');
        db.limit(`email-reset:${email}`, 3);
        const reset = db.requestEmailReset(email);
        if (reset) queueEmail(reset.email, 'reset', reset.token);
        // Queue delivery after the response; existence cannot be inferred from provider latency.
        return reply({ ok: true, message: 'Se existir uma conta com este email, receberás uma ligação. Verifica também o spam. Usa a mensagem mais recente.' });
      }
      if (typeof input.token !== 'string') throw new StoreError('A ligação é inválida ou expirou.');
      if (path[0] === 'verify-email') { db.verifyEmail(input.token); return reply({ ok: true }); }
      return reply({ recovery: await db.resetByEmail(input.token, credential(input.password, 'password')) }, 200, sessionCookie('', true));
    }
    if (path.length === 1 && path[0] === 'session' && method === 'GET') return reply({ user });
    if (path.length === 1 && path[0] === 'logout' && method === 'POST') { db.logout(token); return reply({ ok: true }, 200, sessionCookie('', true)); }
    if (path.length === 1 && ['register', 'login', 'recover'].includes(path[0]) && method === 'POST') {
      // Global and per-email limits are persisted, so restart cannot reset them.
      db.limit('auth-global', 120, 60_000);
      const input = await body(request);
      const email = credential(input.email, 'email');
      db.limit(`auth:${email}`, 10);
      const password = credential(input.password, 'password');
      if (path[0] === 'recover') {
        if (typeof input.recovery !== 'string' || !/^[a-f0-9]{48}$/.test(input.recovery)) throw new StoreError('Indica o código de recuperação completo.');
        return reply({ recovery: await db.recover(email, input.recovery, password) }, 200, sessionCookie('', true));
      }
      const result = path[0] === 'register' ? await db.register(email, password) : { user: await db.login(email, password) };
      if (path[0] === 'register' && mailEnabled()) queueEmail(email, 'verify', db.issueEmailToken(result.user.id, 'verify'));
      return reply(result, path[0] === 'register' ? 201 : 200, sessionCookie(db.session(result.user.id)));
    }
    if (!user) throw new StoreError('Entra na tua conta para continuar.', 401);
    if (path.length === 1 && path[0] === 'request-verification' && method === 'POST') {
      if (!mailEnabled()) throw new StoreError('A confirmação por email ainda não está disponível.', 503);
      db.limit(`email-verify:${user.id}`, 3);
      if (!db.emailVerified(user.id)) queueEmail(user.email, 'verify', db.issueEmailToken(user.id, 'verify'));
      return reply({ ok: true });
    }
    if (method === 'DELETE' && ((path.length === 1 && path[0] === 'account') || (path.length === 2 && path[0] === 'cvs' && /^[a-f0-9-]{36}$/.test(path[1])))) {
      db.limit('erase-global', 60, 60_000);
      db.limit(`erase:${user.id}`, 5);
      const input = await body(request);
      if (typeof input.confirmation !== 'string') throw new StoreError('Confirma a eliminação.');
      if (path[0] === 'account' && input.confirmation !== user.email) throw new StoreError('Escreve o email completo para confirmar.');
      await db.login(user.email, credential(input.password, 'password'));
      // Recovery, sign-out or deletion may revoke this session during password verification.
      if (db.user(token)?.id !== user.id) throw new StoreError('A sessão terminou. Entra novamente.', 401);
      if (path[0] === 'account') {
        db.eraseAccount(user.id);
        return reply({ ok: true }, 200, sessionCookie('', true));
      }
      if (!Number.isSafeInteger(input.revision) || Number(input.revision) < 1) throw new StoreError('Versão do CV inválida.');
      db.eraseCV(user.id, path[1], Number(input.revision), input.confirmation);
      return reply({ ok: true });
    }
    if (path[0] === 'cvs' && path.length === 1 && method === 'GET') return reply({ cvs: db.list(user.id) });
    if (path[0] === 'cvs' && path.length === 1 && method === 'POST') {
      db.limit(`write:${user.id}`, 120, 60_000);
      const input = await body(request);
      return reply(db.create(user.id, title(input.title), normaliseCV(input.data)), 201);
    }
    if (path[0] === 'cvs' && path.length === 2 && /^[a-f0-9-]{36}$/.test(path[1])) {
      if (method === 'GET') return reply(db.cv(user.id, path[1]));
      if (method === 'PUT') {
        db.limit(`write:${user.id}`, 120, 60_000);
        const input = await body(request);
        if (!Number.isSafeInteger(input.revision) || Number(input.revision) < 1) throw new StoreError('Versão do CV inválida.');
        if (typeof input.deleted !== 'boolean' || typeof input.data !== 'object' || !input.data || Array.isArray(input.data)) throw new StoreError('Conteúdo do CV inválido.');
        const current = db.cv(user.id, path[1]);
        // Older open editor tabs do not know the optional photo field. Preserve it
        // unless the client explicitly submits a replacement or an empty string.
        const value = input.data as Record<string, unknown>;
        const data = normaliseCV({ ...value, photo: Object.hasOwn(value, 'photo') ? value.photo : current.data.photo });
        return reply(db.update(user.id, path[1], Number(input.revision), title(input.title), data, input.deleted));
      }
    }
    throw new StoreError('Pedido não encontrado.', 404);
  } catch (error) {
    if (error instanceof StoreError) return Response.json({ error: error.message }, { status: error.status, headers });
    // Never log request bodies, cookies, passwords or CV contents.
    console.error('Storage request failed:', error instanceof Error ? error.name : 'UnknownError');
    return Response.json({ error: 'Não foi possível aceder aos dados. Tenta novamente; mantém uma cópia local do CV.' }, { status: 503, headers });
  }
}
export { handle as GET, handle as POST, handle as PUT, handle as DELETE };
