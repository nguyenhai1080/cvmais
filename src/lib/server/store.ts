import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomBytes, randomUUID, createHash, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
export class StoreError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
export const digest = (value: string) => createHash('sha256').update(value).digest('hex');
export class Store {
  db: DatabaseSync;
  constructor(path: string) {
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(path);
    if (process.platform !== 'win32') chmodSync(path, 0o600);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, recovery TEXT NOT NULL, created INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS cvs (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, title TEXT NOT NULL, data TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, updated INTEGER NOT NULL, deleted INTEGER);
      CREATE INDEX IF NOT EXISTS cvs_owner ON cvs(user_id);
      CREATE TABLE IF NOT EXISTS attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS anonymous_metrics (
        day TEXT NOT NULL, event TEXT NOT NULL, page TEXT NOT NULL,
        source TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(day,event,page,source)
      );
      CREATE TABLE IF NOT EXISTS verified_emails (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, verified INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS email_tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, purpose TEXT NOT NULL CHECK(purpose IN ('verify','reset')), expires INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS email_token_owner ON email_tokens(user_id,purpose);
      PRAGMA user_version=1;`);
  }
  recordAnonymousMetric(payload: {event:string;page:string;source:string}) {
    const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Maputo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    this.db.prepare('DELETE FROM anonymous_metrics WHERE day < ?').run(
      new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Maputo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(Date.now()-90*86400_000)));
    this.db.prepare(`INSERT INTO anonymous_metrics(day,event,page,source,count) VALUES (?,?,?,?,1)
      ON CONFLICT(day,event,page,source) DO UPDATE SET count=count+1`).run(day,payload.event,payload.page,payload.source);
  }
  anonymousMetricSummary(days=90) {
    const start=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Maputo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(Date.now()-(days-1)*86400_000));
    return this.db.prepare('SELECT day,event,page,source,count FROM anonymous_metrics WHERE day>=? ORDER BY day DESC,event,page,source LIMIT 50000').all(start);
  }
  limit(key: string, max = 10, window = 900_000) {
    const now = Date.now();
    this.db.prepare('DELETE FROM attempts WHERE expires < ?').run(now);
    const result = this.db.prepare(`INSERT INTO attempts VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count`).get(digest(key), now + window) as { count: number };
    if (result.count > max) throw new StoreError('Demasiadas tentativas. Tenta novamente mais tarde.', 429);
  }
  async password(value: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = await scrypt(value, salt, 64) as Buffer;
    return `${salt}:${hash.toString('hex')}`;
  }
  async verify(value: string, stored: string) {
    const [salt, hash] = stored.split(':');
    const actual = await scrypt(value, salt, 64) as Buffer;
    return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
  }
  async register(email: string, password: string) {
    const encoded = await this.password(password);
    const recovery = randomBytes(24).toString('hex');
    const id = randomUUID();
    try { this.db.prepare('INSERT INTO users VALUES (?,?,?,?,?)').run(id, email, encoded, digest(recovery), Date.now()); }
    catch (error) {
      if ((error as Error).message.includes('UNIQUE')) throw new StoreError('Não foi possível criar a conta com este email. Tenta entrar ou recuperar o acesso.', 409);
      throw error;
    }
    return { user: { id, email }, recovery };
  }
  async login(email: string, password: string) {
    const row = this.db.prepare('SELECT id,email,password FROM users WHERE email=?').get(email) as { id: string; email: string; password: string } | undefined;
    // Run the same expensive operation for unknown emails to reduce timing disclosure.
    const valid = await this.verify(password, row?.password || `${'0'.repeat(32)}:${'0'.repeat(128)}`);
    if (!row || !valid) throw new StoreError('Email ou palavra-passe incorrectos.', 401);
    const current = this.db.prepare('SELECT password FROM users WHERE id=?').get(row.id) as { password: string } | undefined;
    if (current?.password !== row.password) throw new StoreError('A conta ou a palavra-passe foi alterada. Tenta entrar novamente.', 401);
    return { id: row.id, email: row.email };
  }
  session(userId: string) {
    this.db.prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());
    const token = randomBytes(32).toString('hex');
    this.db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(digest(token), userId, Date.now() + 30 * 86400_000);
    return token;
  }
  user(token: string) {
    if (!/^[a-f0-9]{64}$/.test(token)) return null;
    return this.db.prepare('SELECT users.id,users.email FROM sessions JOIN users ON users.id=sessions.user_id WHERE token=? AND expires>?').get(digest(token), Date.now()) as { id: string; email: string } | undefined || null;
  }
  logout(token: string) { this.db.prepare('DELETE FROM sessions WHERE token=?').run(digest(token)); }
  async recover(email: string, recovery: string, password: string) {
    const user = this.db.prepare('SELECT id,recovery FROM users WHERE email=?').get(email) as { id: string; recovery: string } | undefined;
    if (!user || !timingSafeEqual(Buffer.from(digest(recovery)), Buffer.from(user.recovery))) throw new StoreError('Email ou código de recuperação incorrectos.', 401);
    const encoded = await this.password(password);
    const next = randomBytes(24).toString('hex');
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const updated = this.db.prepare('UPDATE users SET password=?,recovery=? WHERE id=? AND recovery=?').run(encoded, digest(next), user.id, user.recovery);
      if (!updated.changes) throw new StoreError('O código já foi utilizado. Usa o código de recuperação mais recente.', 401);
      this.db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
      this.db.prepare('DELETE FROM email_tokens WHERE user_id=?').run(user.id);
      this.db.exec('COMMIT');
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
    return next;
  }
  list(user: string) {
    return this.db.prepare('SELECT id,title,revision,updated,deleted FROM cvs WHERE user_id=? ORDER BY updated DESC LIMIT 100').all(user);
  }
  cv(user: string, id: string) {
    const row = this.db.prepare('SELECT id,title,data,revision,updated,deleted FROM cvs WHERE id=? AND user_id=?').get(id, user) as { id: string; title: string; data: string; revision: number; updated: number; deleted: number | null } | undefined;
    if (!row) throw new StoreError('CV não encontrado.', 404);
    return { ...row, data: JSON.parse(row.data) };
  }
  create(user: string, title: string, data: unknown) {
    const count = this.db.prepare('SELECT COUNT(*) AS n FROM cvs WHERE user_id=?').get(user) as { n: number };
    if (count.n >= 100) throw new StoreError('Limite de 100 CVs por conta atingido.', 409);
    const id = randomUUID();
    this.db.prepare('INSERT INTO cvs (id,user_id,title,data,updated) VALUES (?,?,?,?,?)').run(id, user, title, JSON.stringify(data), Date.now());
    return this.cv(user, id);
  }
  update(user: string, id: string, revision: number, title: string, data: unknown, deleted: boolean) {
    const result = this.db.prepare('UPDATE cvs SET title=?,data=?,deleted=?,revision=revision+1,updated=? WHERE id=? AND user_id=? AND revision=?').run(title, JSON.stringify(data), deleted ? Date.now() : null, Date.now(), id, user, revision);
    if (!result.changes) {
      this.cv(user, id);
      throw new StoreError('Este CV foi alterado noutro separador ou dispositivo. Guarda uma cópia local e volta a abrir o CV para carregar a versão mais recente.', 409);
    }
    return this.cv(user, id);
  }
  eraseCV(user: string, id: string, revision: number, confirmation: string) {
    const cv = this.cv(user, id);
    if (!cv.deleted) throw new StoreError('Move primeiro este CV para o lixo.', 409);
    if (cv.revision !== revision) throw new StoreError('Este CV foi alterado. Actualiza a lista antes de eliminar.', 409);
    if (confirmation !== cv.title) throw new StoreError('Escreve o nome completo do CV para confirmar.');
    const result = this.db.prepare('DELETE FROM cvs WHERE id=? AND user_id=? AND revision=? AND deleted IS NOT NULL').run(id, user, revision);
    if (!result.changes) throw new StoreError('Este CV foi alterado. Actualiza a lista antes de eliminar.', 409);
  }
  eraseAccount(user: string) {
    // Foreign keys remove private CVs and every session atomically with the user.
    const result = this.db.prepare('DELETE FROM users WHERE id=?').run(user);
    if (!result.changes) throw new StoreError('Conta não encontrada.', 404);
  }
  emailVerified(user: string) { return Boolean(this.db.prepare('SELECT 1 FROM verified_emails WHERE user_id=?').get(user)); }
  issueEmailToken(user: string, purpose: 'verify' | 'reset') {
    const token = randomBytes(32).toString('hex');
    this.db.exec('BEGIN IMMEDIATE');
    try {
      this.db.prepare('DELETE FROM email_tokens WHERE expires<? OR (user_id=? AND purpose=?)').run(Date.now(), user, purpose);
      this.db.prepare('INSERT INTO email_tokens VALUES (?,?,?,?)').run(digest(token), user, purpose, Date.now() + (purpose === 'reset' ? 30 : 1440) * 60_000);
      this.db.exec('COMMIT');
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
    return token;
  }
  emailToken(token: string, purpose: 'verify' | 'reset') {
    if (!/^[a-f0-9]{64}$/.test(token)) throw new StoreError('A ligação é inválida ou expirou. Pede uma nova ligação.');
    const row = this.db.prepare('SELECT users.id,users.email FROM email_tokens JOIN users ON users.id=email_tokens.user_id WHERE token=? AND purpose=? AND expires>?').get(digest(token), purpose, Date.now()) as { id: string; email: string } | undefined;
    if (!row) throw new StoreError('A ligação é inválida ou expirou. Pede uma nova ligação.');
    return row;
  }
  requestEmailReset(email: string) {
    const user = this.db.prepare('SELECT id,email FROM users WHERE email=?').get(email) as { id: string; email: string } | undefined;
    return user ? { ...user, token: this.issueEmailToken(user.id, 'reset') } : null;
  }
  verifyEmail(token: string) {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const user = this.emailToken(token, 'verify');
      this.db.prepare('INSERT OR REPLACE INTO verified_emails VALUES (?,?)').run(user.id, Date.now());
      this.db.prepare('DELETE FROM email_tokens WHERE token=?').run(digest(token));
      this.db.exec('COMMIT');
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  async resetByEmail(token: string, password: string) {
    this.emailToken(token, 'reset');
    const encoded = await this.password(password);
    const recovery = randomBytes(24).toString('hex');
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const user = this.emailToken(token, 'reset');
      this.db.prepare('UPDATE users SET password=?,recovery=? WHERE id=?').run(encoded, digest(recovery), user.id);
      this.db.prepare('INSERT OR REPLACE INTO verified_emails VALUES (?,?)').run(user.id, Date.now());
      this.db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
      this.db.prepare('DELETE FROM email_tokens WHERE user_id=?').run(user.id);
      this.db.exec('COMMIT');
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
    return recovery;
  }
}
let singleton: Store | undefined;
export function store() {
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_PATH) throw new Error('DATABASE_PATH must point to persistent storage');
  return singleton ??= new Store(process.env.DATABASE_PATH || './data/cvmais.sqlite');
}
