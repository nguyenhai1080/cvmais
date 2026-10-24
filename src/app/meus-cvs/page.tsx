'use client';
import { t as ui, useUILanguage } from '@/lib/ui-language';
import { parseCVBackup } from '@/lib/cv-backup';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/header';
import EraseData from '@/components/erase-data';
import EmailVerification from '@/components/email-verification';
import { api, errorMessage, type Account, type CloudCV } from '@/lib/client-api';
import { DRAFT_KEY, emptyCV, readDraft, normaliseCV } from '@/lib/cv';
type Item = Omit<CloudCV, 'data'>;

export default function MyCVs() {const {translate:ui}=useUILanguage();
  const [user, setUser] = useState<Account | null>(null);
  const [operations, setOperations] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [trash, setTrash] = useState(false);
  const [guest, setGuest] = useState(false);
  const [erased, setErased] = useState(false);
  const [rename, setRename] = useState('');
  const [title, setTitle] = useState('');
  const file = useRef<HTMLInputElement>(null);
  async function refresh() { const value = await api<{ cvs: Item[] }>('cvs'); setItems(value.cvs); }
  useEffect(() => {
    let stopped = false;
    async function load() {
      setErased(new URLSearchParams(window.location.search).get('conta-eliminada') === '1');
      try {
        const session = await api<{ user: Account | null; operations?: boolean }>('session');
        if (stopped) return;
        setUser(session.user); setOperations(Boolean(session.operations));
        if (session.user) await refresh();
        try { setGuest(Boolean(localStorage.getItem(DRAFT_KEY) || sessionStorage.getItem('cvmais-draft'))); } catch { /* Optional guest draft. */ }
      } catch (e) { if (!stopped) setError(errorMessage(e)); }
      finally { if (!stopped) setReady(true); }
    }
    void load(); return () => { stopped = true; };
  }, []);
  async function action(work: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setError('');
    try { await work(); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  }
  async function create(data = emptyCV(), name = 'O meu CV') {
    const result = await api<CloudCV>('cvs', 'POST', { data, title: name });
    window.location.assign(`/criar-cv?id=${result.id}`);
  }
  async function modify(item: Item, operation: 'trash' | 'restore' | 'copy' | 'rename') {
    const cv = await api<CloudCV>(`cvs/${item.id}`);
    if (operation === 'copy') { await create(cv.data, `${cv.title} · cópia`); return; }
    await api(`cvs/${item.id}`, 'PUT', { ...cv, revision: item.revision, title: operation === 'rename' ? title : cv.title,
      deleted: operation === 'trash' ? true : operation === 'restore' ? false : Boolean(cv.deleted) });
    setRename(''); await refresh();
  }
  return <><Header /><main className="container library-page"><div className="library-heading"><div><span className="eyebrow">{ui("O TEU PERCURSO, ORGANIZADO")}</span><h1>{ui("Os meus CVs")}</h1><p>{user ? `Ligado como ${user.email}` : ui("Começa no teu dispositivo. Cria uma conta para levar os teus CVs contigo.")}</p></div>{user && <button className="button outline" disabled={busy} onClick={() => void action(async () => { await api('logout', 'POST'); window.location.assign('/meus-cvs'); })}>{ui("Sair da conta")}</button>}</div>
    {erased && <p className="export-status" role="status">{ui("A tua conta e os CVs foram eliminados da base de dados activa. O rascunho de visitante e os ficheiros descarregados continuam nos teus dispositivos.")}</p>}{error && <p className="pdf-error" role="alert">{ui(error)}</p>}{!ready ? <p role="status">{ui("A carregar…")}</p> : !user ? <section className="guest-card"><h2>{ui("O teu CV começa aqui.")}</h2><p>{ui("Como visitante, o rascunho é guardado apenas neste navegador. Limpar os dados do navegador pode apagá-lo. Descarrega uma cópia de segurança no editor.")}</p><div className="library-actions"><a className="button" href="/criar-cv">{guest ? ui("Continuar rascunho neste dispositivo") : ui("Criar CV neste dispositivo")}</a><a className="button outline" href="/conta">{ui("Entrar / Criar conta grátis")}</a></div></section> : <>
      <div className="library-actions"><button className="button" disabled={busy} onClick={() => void action(() => create())}>{ui("+ Criar novo CV")}</button><button className="button outline" disabled={busy} onClick={() => file.current?.click()}>{ui("Importar cópia de segurança")}</button><button className="text-link" disabled={busy} onClick={() => setTrash(!trash)}>{trash ? ui("Ver CVs activos") : ui("Ver lixo")}</button></div>
      <input ref={file} type="file" accept="application/json,.json" className="visually-hidden" aria-label={ui("Ficheiro de cópia de segurança")} onChange={e => {
        const selected = e.target.files?.[0]; e.target.value = ''; if (!selected) return;
        void action(async () => {
          if (selected.size > 512_000) throw new Error('O ficheiro é demasiado grande.');
          await create(normaliseCV(parseCVBackup(await selected.text())), 'CV importado');
        });
      }} />
      {guest && !trash && <section className="local-import"><div><h2>{ui("Tens um rascunho neste dispositivo")}</h2><p>{ui("Podes copiá-lo para a tua conta. O original continua guardado neste navegador.")}</p></div><button className="button outline" disabled={busy} onClick={() => void action(async () => {
        const raw = localStorage.getItem(DRAFT_KEY) || sessionStorage.getItem('cvmais-draft');
        if (!raw) throw new Error('O rascunho local já não está disponível.');
        await create(readDraft(raw), 'CV deste dispositivo');
      })}>{ui("Copiar rascunho para a conta")}</button></section>}
      <div className="library-section-heading"><h2>{trash ? 'Lixo' : ui("Guardados na tua conta")}</h2><button className="text-link" disabled={busy} onClick={() => void action(refresh)}>{ui("Actualizar lista")}</button></div>
      {trash && <p>{ui("Os CVs no lixo podem ser restaurados ou eliminados definitivamente. A eliminação definitiva exige a tua palavra-passe e não pode ser desfeita.")}</p>}
      <div className="cv-library">{items.filter(i => Boolean(i.deleted) === trash).map(item => <article className="cv-library-card" key={item.id}><div className="cv-card-paper" aria-hidden="true"><span>CV</span><i /><i /><i /><i /></div><div className="cv-card-content">{rename === item.id ? <form onSubmit={e => { e.preventDefault(); void action(() => modify(item, 'rename')); }}><label>{ui("Nome do CV")}<input value={title} onChange={e => setTitle(e.target.value)} required maxLength={100} autoFocus /></label><button className="text-link" disabled={busy}>{ui("Guardar nome")}</button><button className="text-link" type="button" onClick={() => setRename('')}>{ui("Cancelar")}</button></form> : <h3>{item.title}</h3>}<p>{ui("Actualizado em ")}{new Date(item.updated).toLocaleString('pt-MZ')}</p><div className="cv-card-actions">{trash ? <><button className="button outline small" disabled={busy} onClick={() => void action(() => modify(item, 'restore'))}>{ui("Restaurar CV")}</button><EraseData user={user} cv={item} onErased={async () => { setItems(current => current.filter(cv => cv.id !== item.id)); await action(refresh); }} /></> : <><a className="button small" href={`/criar-cv?id=${item.id}`}>{ui("Abrir CV →")}</a><button disabled={busy} onClick={() => { setRename(item.id); setTitle(item.title); }}>{ui("Mudar nome")}</button><button disabled={busy} onClick={() => void action(() => modify(item, 'copy'))}>{ui("Duplicar")}</button><button disabled={busy} onClick={() => void action(() => modify(item, 'trash'))}>{ui("Mover para o lixo")}</button></>}</div></div></article>)}</div>
      {!items.some(i => Boolean(i.deleted) === trash) && <div className="library-empty"><h3>{trash ? ui("O lixo está vazio.") : ui("Um novo capítulo começa com o teu CV.")}</h3><p>{trash ? ui("Os CVs que moveres para aqui poderão ser restaurados.") : ui("Cria um CV ou copia o rascunho deste dispositivo para começar.")}</p></div>}
      <section className="account-data"><h2>{ui("Conta e dados")}</h2><EmailVerification />{operations && <p><a className="text-link" href="/operacoes">{ui("Estado das cópias de segurança →")}</a></p>}<p>{ui("Controla os dados que guardaste no CVMais. Podes eliminar a conta e todos os seus CVs. Guarda primeiro as cópias de que precisas no editor de cada CV.")}</p><EraseData user={user} /></section>
    </>}<p className="library-privacy"><a className="text-link" href="/privacidade">{ui("Onde são guardados os meus dados?")}</a>{ui(" · O PDF é sempre criado no teu dispositivo.")}</p></main></>;
}
