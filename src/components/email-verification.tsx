'use client';
import { t as ui, useUILanguage } from '@/lib/ui-language';
import { useEffect, useState } from 'react';
import { api, errorMessage } from '@/lib/client-api';
export default function EmailVerification() {const {translate:ui}=useUILanguage();
  const [status, setStatus] = useState<{ enabled: boolean; verified: boolean } | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { let cancelled = false; void api<{ enabled: boolean; verified: boolean }>('email-status').then(value => { if (!cancelled) setStatus(value); }).catch(() => {}); return () => { cancelled = true; }; }, []);
  if (!status) return null;
  return <div className="email-verification"><h3>{status.verified ? ui("Email confirmado") : ui("Email de recuperação")}</h3><p>{status.verified ? ui("Este endereço foi confirmado. Podes usá-lo para recuperar o acesso.") : status.enabled ? ui("Abre a ligação enviada para o email da tua conta. Podes pedir uma nova mensagem se necessário.") : ui("A recuperação por email está temporariamente indisponível.")}</p>{status.enabled && !status.verified && <button className="button outline small" disabled={busy} onClick={async () => { setBusy(true); setMessage(''); try { await api('request-verification', 'POST'); setMessage('Pedido recebido. Verifica o teu email e o spam; usa a mensagem mais recente.'); } catch (e) { setMessage(errorMessage(e)); } finally { setBusy(false); } }}>{busy ? ui("A aguardar…") : ui("Pedir email de confirmação")}</button>}{message && <p role="status">{ui(message)}</p>}</div>;
}
