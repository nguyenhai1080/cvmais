'use client';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/header';
import { api, errorMessage } from '@/lib/client-api';
export default function EmailAction({ purpose }: { purpose: 'verify' | 'reset' }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  const [recovery, setRecovery] = useState('');
  const read = useRef(false);
  useEffect(() => {
    if (read.current) return;
    read.current = true;
    const value = new URLSearchParams(window.location.hash.slice(1)).get('token') || '';
    setToken(value);
    // Token fragments are not sent to the server or included in referrers.
    window.history.replaceState(null, '', window.location.pathname);
    if (!/^[a-f0-9]{64}$/.test(value)) setError('A ligação está incompleta. Pede uma nova ligação na tua conta.');
  }, []);
  return <><Header /><main className="container email-action-page"><section className="account-card"><span className="eyebrow">CVMais · O TEU ACESSO</span><h1>{complete ? purpose === 'verify' ? 'Email confirmado.' : 'Acesso actualizado.' : purpose === 'verify' ? 'Confirma o teu email.' : 'Escolhe uma nova palavra-passe.'}</h1>{complete ? <><p>{purpose === 'verify' ? 'O teu email foi confirmado. Podes voltar aos teus CVs.' : 'Todas as sessões anteriores foram terminadas. Guarda este novo código de recuperação num local privado; o código anterior deixou de funcionar.'}</p>{recovery && <code className="recovery-code">{recovery}</code>}<a className="button" href={purpose === 'verify' ? '/meus-cvs' : '/conta'}>{purpose === 'verify' ? 'Voltar aos meus CVs' : 'Guardei o código · Entrar'}</a></> : <><p>{purpose === 'verify' ? 'Selecciona o botão para confirmar o endereço associado à ligação. A ligação só pode ser usada uma vez.' : 'A ligação é válida por 30 minutos. Ao repor a palavra-passe, todas as sessões anteriores serão terminadas.'}</p><form onSubmit={async event => { event.preventDefault(); if (busy) return; const fields = new FormData(event.currentTarget); if (purpose === 'reset' && fields.get('password') !== fields.get('confirm')) { setError('As palavras-passe não coincidem.'); return; } setBusy(true); setError(''); try { const value = await api<{ recovery?: string }>(purpose === 'verify' ? 'verify-email' : 'reset-email', 'POST', { token, ...(purpose === 'reset' ? { password: fields.get('password') } : {}) }); setRecovery(value.recovery || ''); setToken(''); setComplete(true); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }}><fieldset disabled={busy || !/^[a-f0-9]{64}$/.test(token)}>{purpose === 'reset' && <><label>Nova palavra-passe<input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /><small>Entre 12 e 128 caracteres.</small></label><label>Repete a nova palavra-passe<input name="confirm" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></label></>}<button className="button" type="submit">{busy ? 'A aguardar…' : purpose === 'verify' ? 'Confirmar email' : 'Repor palavra-passe'}</button></fieldset></form>{error && <p className="save-error" role="alert">{error}</p>}<p><a className="text-link" href="/conta">Voltar a entrar / Pedir outra ligação</a></p></>}</section></main></>;
}
