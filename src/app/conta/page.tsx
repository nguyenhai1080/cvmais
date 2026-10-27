'use client';
import { t as ui, useUILanguage } from '@/lib/ui-language';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import { api, errorMessage } from '@/lib/client-api';

export default function AccountPage() {const {translate:ui}=useUILanguage();
  const [mode, setMode] = useState<'login' | 'register' | 'recover' | 'email'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => { setError(''); }, [mode]);
  useEffect(() => { void api<{ enabled: boolean }>('email-status').then(value => setEmailEnabled(value.enabled)).catch(() => {}); }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const fields = new FormData(event.currentTarget);
    try {
      const result = await api<{ message?: string }>(mode === 'email' ? 'request-reset' : mode, 'POST', Object.fromEntries(fields));
      if (mode === 'email') { setNotice(result.message || 'Pedido recebido. Verifica o email e o spam.'); return; }
      if (mode === 'recover') { setMode('login'); setNotice('Palavra-passe actualizada. Entra com a nova palavra-passe.'); }
      else window.location.assign('/meus-cvs');
    } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  }
  return <><Header /><main className="account-shell container"><section className="account-story"><span className="eyebrow">{ui("O TEU PRÓXIMO PASSO")}</span><h1>{ui("O teu percurso.")}<br /><em>{ui("Sempre contigo.")}</em></h1><p>{ui("Guarda versões do teu CV e continua em qualquer dispositivo com a tua conta.")}</p><ul><li>{ui("CVs privados, associados à tua conta")}</li><li>{ui("Modelos profissionais e PDF gratuito")}</li><li>{ui("Continua como visitante quando preferires")}</li></ul><Link className="text-link" href="/criar-cv">{ui("Continuar sem conta →")}</Link></section>
    <section className="account-card"><><span className="eyebrow">CVMais</span><h2>{mode === 'login' ? ui("Bom ter-te de volta.") : mode === 'register' ? ui("Cria a tua conta grátis.") : mode === 'email' ? ui("Recebe uma ligação de recuperação.") : ui("Recupera o acesso.")}</h2><p>{mode === 'email' ? ui("Indica o email confirmado da tua conta. Se estiver confirmado, receberás uma ligação válida por 30 minutos.") : mode === 'recover' ? ui("Usa o código opcional que activaste na segurança da conta. A reposição termina todas as sessões.") : ui("O email serve para entrar. O CV só é enviado quando escolheres guardá-lo na conta.")}</p>
      {notice && <p role="status" className="export-status">{ui(notice)}</p>}<form onSubmit={submit}><fieldset disabled={busy}><label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>{mode !== 'email' && <label>{mode === 'recover' ? ui("Nova palavra-passe") : ui("Palavra-passe")}<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={12} maxLength={128} /><small>{ui("Entre 12 e 128 caracteres.")}</small></label>}{mode === 'recover' && <label>{ui("Código de recuperação")}<input name="recovery" required minLength={48} maxLength={48} autoComplete="off" spellCheck={false} /></label>}
      {error && <p className="save-error" role="alert">{ui(error)}</p>}<button className="button" type="submit">{busy ? ui("A aguardar…") : mode === 'login' ? ui("Entrar") : mode === 'register' ? ui("Criar conta") : mode === 'email' ? ui("Pedir ligação de recuperação") : ui("Repor palavra-passe")}</button></fieldset></form><div className="account-links"><button onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); setNotice(''); }}>{mode === 'register' ? ui("Já tenho conta · Entrar") : ui("Ainda sem conta? Regista-te")}</button><button onClick={() => { setMode(mode === 'recover' || mode === 'email' ? 'login' : 'email'); setError(''); setNotice(''); }}>{mode === 'recover' || mode === 'email' ? ui("Voltar a entrar") : ui("Esqueci-me da palavra-passe")}</button>{mode === 'email' && <button onClick={() => { setMode('recover'); setError(''); setNotice(''); }}>{ui("Usar o código de recuperação")}</button>}</div><p className="editor-help">{ui("Não uses a palavra-passe de outros serviços. ")}{emailEnabled ? ui("Podes gerir o email e o código opcional na segurança da conta.") : ui("A recuperação por email está temporariamente indisponível.")}</p></>
    </section></main></>;
}
