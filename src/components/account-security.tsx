'use client';
import { useEffect, useState } from 'react';
import { useUILanguage } from '@/lib/ui-language';
import { api, errorMessage } from '@/lib/client-api';
import EmailVerification from './email-verification';

export default function AccountSecurity() {
  const { translate: ui } = useUILanguage();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { let stopped = false; void api<{recoveryEnabled:boolean}>('security').then(value => { if (!stopped) setEnabled(value.recoveryEnabled); }).catch(error => { if (!stopped) setMessage(errorMessage(error)); }); return () => { stopped = true; }; }, []);
  async function configure(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true); setMessage(''); setCode('');
    try {
      const result = await api<{recovery:string;recoveryEnabled:boolean}>('recovery-code', 'POST', {password:fields.get('password'),enabled:fields.get('action') === 'enable'});
      setCode(result.recovery); setEnabled(result.recoveryEnabled); form.reset();
      setMessage(result.recoveryEnabled ? 'Código criado. Só é mostrado agora; guarda-o num local privado. O código anterior deixou de funcionar.' : 'Código de recuperação desactivado.');
    } catch (error) { setMessage(errorMessage(error)); } finally { setBusy(false); }
  }
  return <details className="account-security" onToggle={event => { if (!event.currentTarget.open) { setCode(''); setMessage(''); event.currentTarget.querySelector('form')?.reset(); } }}><summary>{ui('Segurança da conta')}</summary><EmailVerification /><h3>{ui('Código de recuperação opcional')}</h3><p>{ui('Podes criar um código como alternativa ao email confirmado. Não é necessário para usar o CVMais. Criar outro código invalida o anterior; a reposição da palavra-passe desactiva o código.')}</p>{enabled !== null && <><p>{ui(enabled ? 'Código activo' : 'Código não activado')}</p><form onSubmit={configure}><fieldset disabled={busy}><label>{ui('Palavra-passe actual')}<input name="password" type="password" autoComplete="current-password" required minLength={12} maxLength={128} /></label><label>{ui('Acção')}<select name="action" aria-label={ui('Acção')}><option value="enable">{ui(enabled ? 'Substituir código' : 'Criar código')}</option>{enabled && <option value="disable">{ui('Desactivar código')}</option>}</select></label><button className="button outline small" type="submit">{ui(busy ? 'A aguardar…' : 'Actualizar código')}</button></fieldset></form></>}{message && <p role="status">{ui(message)}</p>}{code && <><code className="recovery-code">{code}</code><button className="text-link" type="button" onClick={() => setCode('')}>{ui('Ocultar código')}</button></>}</details>;
}
