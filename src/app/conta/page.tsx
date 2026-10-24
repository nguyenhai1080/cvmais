'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import { api, errorMessage } from '@/lib/client-api';

export default function AccountPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [recovery, setRecovery] = useState('');
  const [created, setCreated] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const fields = new FormData(event.currentTarget);
    try {
      const result = await api<{ recovery?: string }>(mode, 'POST', Object.fromEntries(fields));
      if (result.recovery) { setRecovery(result.recovery); setCreated(mode === 'register'); }
      else window.location.assign('/meus-cvs');
    } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  }
  return <><Header /><main className="account-shell container"><section className="account-story"><span className="eyebrow">O TEU PRÓXIMO PASSO</span><h1>O teu percurso.<br /><em>Sempre contigo.</em></h1><p>Guarda versões do teu CV e continua em qualquer dispositivo com a tua conta.</p><ul><li>CVs privados, associados à tua conta</li><li>Modelos profissionais e PDF gratuito</li><li>Continua como visitante quando preferires</li></ul><Link className="text-link" href="/criar-cv">Continuar sem conta →</Link></section>
    <section className="account-card">{recovery ? <><h2>Guarda o teu código de recuperação</h2><p>Este código permite repor a palavra-passe. Guarda-o num local privado e seguro: só é mostrado agora. Ainda não enviamos emails de recuperação.</p><code className="recovery-code">{recovery}</code><p>Se perderes a palavra-passe e este código, não será possível recuperar o acesso. Nunca o partilhes.</p><button className="button" onClick={() => { if (created) window.location.assign('/meus-cvs'); else { setRecovery(''); setMode('login'); } }}>Já guardei o código · Continuar</button></> : <><span className="eyebrow">CVMais</span><h2>{mode === 'login' ? 'Bom ter-te de volta.' : mode === 'register' ? 'Cria a tua conta grátis.' : 'Recupera o acesso.'}</h2><p>{mode === 'recover' ? 'Usa o código que guardaste ao criar a conta. A reposição termina todas as sessões.' : 'O email serve para entrar. O CV só é enviado quando escolheres guardá-lo na conta.'}</p>
      <form onSubmit={submit}><fieldset disabled={busy}><label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label><label>{mode === 'recover' ? 'Nova palavra-passe' : 'Palavra-passe'}<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={12} maxLength={128} /><small>Entre 12 e 128 caracteres.</small></label>{mode === 'recover' && <label>Código de recuperação<input name="recovery" required minLength={48} maxLength={48} autoComplete="off" spellCheck={false} /></label>}
      {error && <p className="save-error" role="alert">{error}</p>}<button className="button" type="submit">{busy ? 'A aguardar…' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Repor palavra-passe'}</button></fieldset></form><div className="account-links"><button onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}>{mode === 'register' ? 'Já tenho conta · Entrar' : 'Ainda sem conta? Regista-te'}</button><button onClick={() => { setMode(mode === 'recover' ? 'login' : 'recover'); setError(''); }}>{mode === 'recover' ? 'Voltar a entrar' : 'Esqueci-me da palavra-passe'}</button></div><p className="editor-help">Não uses a palavra-passe de outros serviços. O email ainda não é verificado; o acesso é protegido pela palavra-passe e pelo código de recuperação.</p></>}
    </section></main></>;
}
