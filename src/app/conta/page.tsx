'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import { api, errorMessage } from '@/lib/client-api';

export default function AccountPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'recover' | 'email'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [recovery, setRecovery] = useState('');
  const [created, setCreated] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => { setNotice(''); setError(''); }, [mode]);
  useEffect(() => { void api<{ enabled: boolean }>('email-status').then(value => setEmailEnabled(value.enabled)).catch(() => {}); }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const fields = new FormData(event.currentTarget);
    try {
      const result = await api<{ recovery?: string; message?: string }>(mode === 'email' ? 'request-reset' : mode, 'POST', Object.fromEntries(fields));
      if (mode === 'email') { setNotice(result.message || 'Pedido recebido. Verifica o email e o spam.'); return; }
      if (result.recovery) { setRecovery(result.recovery); setCreated(mode === 'register'); }
      else window.location.assign('/meus-cvs');
    } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  }
  return <><Header /><main className="account-shell container"><section className="account-story"><span className="eyebrow">O TEU PRÓXIMO PASSO</span><h1>O teu percurso.<br /><em>Sempre contigo.</em></h1><p>Guarda versões do teu CV e continua em qualquer dispositivo com a tua conta.</p><ul><li>CVs privados, associados à tua conta</li><li>Modelos profissionais e PDF gratuito</li><li>Continua como visitante quando preferires</li></ul><Link className="text-link" href="/criar-cv">Continuar sem conta →</Link></section>
    <section className="account-card">{recovery ? <><h2>Guarda o teu código de recuperação</h2><p>Este código permite repor a palavra-passe. Guarda-o num local privado e seguro: só é mostrado agora. Podes também usar a recuperação por email quando estiver disponível.</p><code className="recovery-code">{recovery}</code><p>Se perderes a palavra-passe e este código, precisarás de acesso ao email e da recuperação por email activa. Nunca partilhes o código.</p><button className="button" onClick={() => { if (created) window.location.assign('/meus-cvs'); else { setRecovery(''); setMode('login'); } }}>Já guardei o código · Continuar</button></> : <><span className="eyebrow">CVMais</span><h2>{mode === 'login' ? 'Bom ter-te de volta.' : mode === 'register' ? 'Cria a tua conta grátis.' : mode === 'email' ? 'Recebe uma ligação de recuperação.' : 'Recupera o acesso.'}</h2><p>{mode === 'email' ? 'Indica o email da tua conta. Se existir, receberás uma ligação válida por 30 minutos.' : mode === 'recover' ? 'Usa o código que guardaste ao criar a conta. A reposição termina todas as sessões.' : 'O email serve para entrar. O CV só é enviado quando escolheres guardá-lo na conta.'}</p>
      {notice && <p role="status" className="export-status">{notice}</p>}<form onSubmit={submit}><fieldset disabled={busy}><label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>{mode !== 'email' && <label>{mode === 'recover' ? 'Nova palavra-passe' : 'Palavra-passe'}<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={12} maxLength={128} /><small>Entre 12 e 128 caracteres.</small></label>}{mode === 'recover' && <label>Código de recuperação<input name="recovery" required minLength={48} maxLength={48} autoComplete="off" spellCheck={false} /></label>}
      {error && <p className="save-error" role="alert">{error}</p>}<button className="button" type="submit">{busy ? 'A aguardar…' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : mode === 'email' ? 'Pedir ligação de recuperação' : 'Repor palavra-passe'}</button></fieldset></form><div className="account-links"><button onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}>{mode === 'register' ? 'Já tenho conta · Entrar' : 'Ainda sem conta? Regista-te'}</button><button onClick={() => { setMode(mode === 'recover' || mode === 'email' ? 'login' : emailEnabled ? 'email' : 'recover'); setError(''); setNotice(''); }}>{mode === 'recover' || mode === 'email' ? 'Voltar a entrar' : 'Esqueci-me da palavra-passe'}</button>{emailEnabled && mode === 'email' && <button onClick={() => { setMode('recover'); setError(''); setNotice(''); }}>Usar o código de recuperação</button>}</div><p className="editor-help">Não uses a palavra-passe de outros serviços. {emailEnabled ? 'Podes confirmar o email em Os meus CVs. Guarda também o teu código de recuperação.' : 'O email ainda não é verificado; o acesso é protegido pela palavra-passe e pelo código de recuperação.'}</p></>}
    </section></main></>;
}
