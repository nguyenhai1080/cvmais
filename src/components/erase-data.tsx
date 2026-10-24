'use client';
import { t as ui, useUILanguage } from '@/lib/ui-language';
import { useRef, useState } from 'react';
import { api, errorMessage, type Account } from '@/lib/client-api';
import { clearPrivateCopies } from '@/lib/local-erasure';

type Target = { id: string; title: string; revision: number };
export default function EraseData({ user, cv, onErased }: { user: Account; cv?: Target; onErased?: () => Promise<void> }) {const {translate:ui}=useUILanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const expected = cv?.title || user.email;
  async function erase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const fields = new FormData(event.currentTarget);
    if (fields.get('confirmation') !== expected) { setError(cv ? 'Escreve o nome completo do CV.' : 'Escreve o email completo da conta.'); return; }
    setBusy(true); setError('');
    try {
      await api(cv ? `cvs/${cv.id}` : 'account', 'DELETE', { password: fields.get('password'), confirmation: fields.get('confirmation'), ...(cv ? { revision: cv.revision } : {}) });
      clearPrivateCopies(user.id, cv?.id);
      form.current?.reset(); dialog.current?.close();
      if (cv) await onErased?.(); else window.location.assign('/meus-cvs?conta-eliminada=1');
    } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  }
  return <><button type="button" className="erase-trigger" onClick={() => { setError(''); form.current?.reset(); dialog.current?.showModal(); }}>{cv ? ui("Eliminar definitivamente") : ui("Eliminar a minha conta")}</button><dialog className="erase-dialog" ref={dialog} aria-labelledby={cv ? `erase-${cv.id}` : 'erase-account'} onCancel={e => { if (busy) e.preventDefault(); }}><form ref={form} onSubmit={erase}><span className="eyebrow">{ui("CONTROLO DOS TEUS DADOS")}</span><h2 id={cv ? `erase-${cv.id}` : 'erase-account'}>{cv ? ui("Eliminar este CV?") : ui("Eliminar a tua conta?")}</h2><p>{cv ? <>{ui("O CV ")}<strong>{cv.title}</strong>{ui(", incluindo a fotografia, será eliminado da base de dados activa. Não poderás restaurá-lo.")}</> : ui("O teu email, os dados de acesso e todos os CVs, incluindo os que estão no lixo e as fotografias, serão eliminados da base de dados activa. Todas as sessões serão terminadas. Não poderás recuperar a conta.")}</p><p>{ui("Antes de continuar, guarda os PDFs e as cópias de segurança de que precisas. Ficheiros descarregados, rascunhos de visitante e cópias noutros dispositivos não são apagados. Cópias de segurança anteriores do servidor podem conservar dados até serem eliminadas.")}</p><fieldset disabled={busy}><label>{cv ? ui("Escreve o nome completo do CV") : ui("Escreve o email completo da conta")}<input name="confirmation" required maxLength={254} autoComplete="off" spellCheck={false} /><small>{expected}</small></label><label>{ui("Confirma a tua palavra-passe")}<input name="password" type="password" autoComplete="current-password" required minLength={12} maxLength={128} /></label>{error && <p role="alert" className="save-error">{ui(error)}</p>}<div className="erase-actions"><button autoFocus type="button" className="button outline" onClick={() => dialog.current?.close()}>{ui("Cancelar")}</button><button className="button danger-button" type="submit">{busy ? ui("A eliminar…") : cv ? ui("Eliminar CV definitivamente") : ui("Eliminar conta e todos os CVs")}</button></div></fieldset></form></dialog></>;
}
