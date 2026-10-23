'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Save, ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, ShieldCheck, Eye, PenLine } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/header';
import EditorPreview from '@/components/editor-preview';
import { DRAFT_KEY, MAX_ENTRIES, emptyCV, isModel, readDraft, normaliseCV, canExport, pdfFilename,
  models, modelLabels, type CVData, type Entry } from '@/lib/cv';

type EntryKind = 'experiences' | 'education';
const fields = [
  { key: 'name', label: 'Nome completo', placeholder: 'O teu nome', complete: 'name' },
  { key: 'role', label: 'Título profissional', placeholder: 'Ex.: Assistente administrativa', complete: 'organization-title' },
  { key: 'email', label: 'Email', placeholder: 'nome@exemplo.com', complete: 'email' },
  { key: 'phone', label: 'Telemóvel', placeholder: 'Ex.: +258 84 000 0000', complete: 'tel' },
  { key: 'city', label: 'Localidade', placeholder: 'Ex.: Maputo, Moçambique', complete: 'address-level2' },
  { key: 'website', label: 'LinkedIn ou portefólio (opcional)', placeholder: 'Ex.: linkedin.com/in/o-teu-nome', complete: 'url' },
] as const;

export default function Editor() {
  const [data, setData] = useState<CVData>(emptyCV);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [removed, setRemoved] = useState<{ kind: EntryKind; entry: Entry; index: number } | null>(null);
  const dirty = useRef(false);
  const latest = useRef(data);

  useEffect(() => {
    let restored = emptyCV();
    let saved: string | null = null;
    try { saved = localStorage.getItem(DRAFT_KEY); } catch { /* Editing and export remain available. */ }
    if (!saved) { try { saved = sessionStorage.getItem('cvmais-draft'); } catch { /* Old sessions are optional. */ } }
    if (saved) restored = readDraft(saved);
    const selected = new URLSearchParams(window.location.search).get('modelo');
    if (isModel(selected)) restored.model = selected;
    latest.current = restored;
    setData(restored);
    setReady(true);
    setStatus(saved ? 'Rascunho recuperado. As alterações são guardadas neste dispositivo.' : 'O teu rascunho será guardado neste dispositivo.');
  }, []);

  useEffect(() => {
    if (!ready || !dirty.current) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        dirty.current = false;
        setSaveError(false);
        setStatus('Rascunho guardado neste dispositivo.');
      } catch {
        setSaveError(true);
        setStatus('Não foi possível guardar neste navegador. Mantém esta página aberta ou descarrega o PDF.');
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [data, ready]);

  useEffect(() => {
    const flush = () => {
      if (!dirty.current) return;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(latest.current));
      dirty.current = false;
    };
    const warn = (event: BeforeUnloadEvent) => { try { flush(); } catch { event.preventDefault(); } };
    window.addEventListener('beforeunload', warn);
    return () => {
      window.removeEventListener('beforeunload', warn);
      try { flush(); } catch { /* Browser storage failure was already reported in the editor. */ }
    };
  }, []);

  function change(next: CVData) {
    latest.current = next;
    dirty.current = true;
    setData(next);
    setStatus('A guardar alterações…');
    setPdfError('');
  }
  function update(key: Exclude<keyof CVData, 'experiences' | 'education'>, value: string) {
    if (key === 'model') {
      if (isModel(value)) {
        const url = new URL(window.location.href);
        url.searchParams.set('modelo', value);
        window.history.replaceState(null, '', url);
        change({ ...data, model: value });
      }
    }
    else change({ ...data, [key]: value });
  }
  function save() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      dirty.current = false;
      setSaveError(false);
      setStatus('Rascunho guardado neste dispositivo.');
    } catch {
      setSaveError(true);
      setStatus('Não foi possível guardar neste navegador. Podes descarregar o PDF.');
    }
  }
  function addEntry(kind: EntryKind) {
    if (data[kind].length >= MAX_ENTRIES) return;
    const entry: Entry = { id: crypto.randomUUID(), title: '', organisation: '', period: '', description: '' };
    change({ ...data, [kind]: [...data[kind], entry] });
  }
  function editEntry(kind: EntryKind, id: string, field: keyof Entry, value: string) {
    change({ ...data, [kind]: data[kind].map(e => e.id === id ? { ...e, [field]: value } : e) });
  }
  function removeEntry(kind: EntryKind, index: number) {
    setRemoved({ kind, entry: data[kind][index], index });
    change({ ...data, [kind]: data[kind].filter((_, i) => i !== index) });
  }
  function moveEntry(kind: EntryKind, index: number, direction: number) {
    const entries = [...data[kind]];
    const target = index + direction;
    if (target < 0 || target >= entries.length) return;
    [entries[index], entries[target]] = [entries[target], entries[index]];
    change({ ...data, [kind]: entries });
  }
  async function exportPDF() {
    if (!canExport(data) || exporting) return;
    setExporting(true);
    setPdfError('');
    try {
      const { createPDFBlob } = await import('@/components/pdf-document');
      const blob = await createPDFBlob(normaliseCV(data));
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = pdfFilename(data.name);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setPdfError('Não foi possível criar o PDF. Verifica a ligação para carregar as fontes e tenta novamente. O teu conteúdo continua aqui.');
    } finally { setExporting(false); }
  }

  function entriesSection(kind: EntryKind) {
    const work = kind === 'experiences';
    const noun = work ? 'experiência' : 'formação';
    return <section className="editor-section" id={work ? 'experiencia' : 'formacao'}>
      <div className="editor-section-title"><span>{work ? '03' : '04'}</span><div><h2>{work ? 'Experiência profissional' : 'Formação académica'}</h2>
        <p>{work ? 'Inclui trabalho, estágios ou voluntariado relevantes.' : 'Adiciona os teus cursos e qualificações.'}</p></div></div>
      {data[kind].length === 0 && <div className="entry-empty">{work ? 'Ainda sem experiência? Podes começar pela formação e competências.' : 'Adiciona uma formação quando estiveres pronto.'}</div>}
      {data[kind].map((entry, index) => <div className="entry-card" key={entry.id}>
        <div className="entry-card-toolbar"><h3>{work ? 'Experiência' : 'Formação'} {index + 1}</h3><div>
          <button type="button" className="icon-button" onClick={() => moveEntry(kind, index, -1)} disabled={index === 0} aria-label={`Mover ${noun} ${index + 1} para cima`}><ArrowUp size={16} /></button>
          <button type="button" className="icon-button" onClick={() => moveEntry(kind, index, 1)} disabled={index === data[kind].length - 1} aria-label={`Mover ${noun} ${index + 1} para baixo`}><ArrowDown size={16} /></button>
          <button type="button" className="icon-button danger" onClick={() => removeEntry(kind, index)} aria-label={`Remover ${noun} ${index + 1}`}><Trash2 size={16} /></button>
        </div></div>
        <label>{work ? 'Cargo / função' : 'Curso / qualificação'}<input value={entry.title} maxLength={150} onChange={e => editEntry(kind, entry.id, 'title', e.target.value)} placeholder={work ? 'Ex.: Assistente administrativa' : 'Ex.: Licenciatura em Gestão'} /></label>
        <label>{work ? 'Organização' : 'Instituição'}<input value={entry.organisation} maxLength={150} onChange={e => editEntry(kind, entry.id, 'organisation', e.target.value)} placeholder={work ? 'Nome da organização' : 'Nome da instituição'} /></label>
        <label>Período<input value={entry.period} maxLength={100} onChange={e => editEntry(kind, entry.id, 'period', e.target.value)} placeholder="Ex.: 2022 - 2025 ou 2023 - actual" /></label>
        <label>{work ? 'Responsabilidades e resultados' : 'Informação adicional (opcional)'}<textarea value={entry.description} maxLength={4000} onChange={e => editEntry(kind, entry.id, 'description', e.target.value)} placeholder={work ? 'Descreve o que fizeste e os resultados que alcançaste.' : 'Área de especialização, projectos ou distinções relevantes.'} /></label>
      </div>)}
      <button className="add-entry" type="button" onClick={() => addEntry(kind)} disabled={data[kind].length >= MAX_ENTRIES}><Plus size={17} /> Adicionar {noun}</button>
      {data[kind].length >= MAX_ENTRIES && <p className="editor-help">Podes incluir até {MAX_ENTRIES} itens nesta secção.</p>}
    </section>;
  }

  return <div className="editor-page editor-v2"><Header />
    <main className="container">
      <div className="editor-top"><div><Link className="text-link" href="/#modelos"><ArrowLeft size={16} /> Voltar aos modelos</Link>
        <h1>O teu percurso, nas tuas palavras.</h1><p>Personaliza o teu CV e descarrega um PDF pronto para enviar.</p></div>
        <div className="editor-top-actions"><button className="button outline" disabled={!ready || exporting} onClick={save}><Save size={17} /> Guardar</button>
          <button className="button" disabled={!ready || !canExport(data) || exporting} onClick={exportPDF}><Download size={18} /> {exporting ? 'A preparar PDF…' : 'Descarregar PDF'}</button></div>
      </div>
      <div className="editor-feedback"><p className={saveError ? 'saved-status save-error' : 'saved-status'} role="status">{status}</p>
        <span><ShieldCheck size={14} /> Os teus dados ficam no teu dispositivo.</span></div>
      {pdfError && <p className="pdf-error" role="alert">{pdfError}</p>}
      {exporting && <p role="status" className="export-status">A preparar o teu PDF com texto seleccionável e fontes incluídas…</p>}
      {removed && <div className="undo-entry" role="status">Item removido. <button type="button" disabled={data[removed.kind].length >= MAX_ENTRIES} onClick={() => {
        const entries = [...data[removed.kind]];
        entries.splice(Math.min(removed.index, entries.length), 0, removed.entry);
        change({ ...data, [removed.kind]: entries }); setRemoved(null);
      }}>Anular</button></div>}
      <div className="editor-mobile-switch" aria-label="Vista do editor"><button aria-pressed={view === 'edit'} onClick={() => setView('edit')}><PenLine size={16} /> Editar</button>
        <button aria-pressed={view === 'preview'} onClick={() => setView('preview')}><Eye size={16} /> Pré-visualizar</button></div>
      <div className="editor-grid editor-workspace" data-view={view}>
        <form className="editor-form v2-form" onSubmit={e => { e.preventDefault(); save(); }}>
          <fieldset disabled={!ready || exporting}>
            <section className="editor-section" id="dados"><div className="editor-section-title"><span>01</span><div><h2>Os teus dados</h2><p>Como te apresentas e como podem contactar-te.</p></div></div>
              <div className="contact-fields">{fields.map(f => <label key={f.key} htmlFor={`cv-${f.key}`}>{f.label}<input id={`cv-${f.key}`}
                type={f.key === 'email' ? 'email' : f.key === 'phone' ? 'tel' : 'text'} autoComplete={f.complete}
                value={data[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder} maxLength={150} /></label>)}</div>
            </section>
            <section className="editor-section" id="perfil"><div className="editor-section-title"><span>02</span><div><h2>Perfil profissional</h2><p>Uma apresentação curta sobre o teu percurso e objectivo.</p></div></div>
              <label htmlFor="cv-profile">O teu perfil<textarea id="cv-profile" value={data.profile} maxLength={4000} onChange={e => update('profile', e.target.value)} placeholder="Resume a tua experiência, pontos fortes e o que procuras no próximo desafio." /></label>
            </section>
            {entriesSection('experiences')}{entriesSection('education')}
            <section className="editor-section" id="competencias"><div className="editor-section-title"><span>05</span><div><h2>Competências e línguas</h2><p>Destaca o que podes trazer para a oportunidade.</p></div></div>
              <label htmlFor="cv-skills">Competências<textarea id="cv-skills" value={data.skills} maxLength={4000} onChange={e => update('skills', e.target.value)} placeholder="Ex.: Organização de documentos, Microsoft Excel, atendimento ao cliente" /></label>
              <label htmlFor="cv-languages">Línguas<textarea id="cv-languages" value={data.languages} maxLength={4000} onChange={e => update('languages', e.target.value)} placeholder="Ex.: Português - fluente; Inglês - intermédio; Changana - língua materna" /></label>
            </section>
            <div className="editor-form-bottom"><button className="button" type="submit"><Save size={17} /> Guardar rascunho</button>
              <p>Guardado apenas neste navegador. O PDF também é criado no teu dispositivo. Limpar os dados do navegador pode apagar o rascunho.</p></div>
          </fieldset>
        </form>
        <div className="editor-preview"><div className="preview-controls"><div><span className="eyebrow">O TEU CV</span><h2>Escolhe o teu estilo.</h2></div>
          <label htmlFor="cv-model">Modelo<select id="cv-model" value={data.model} disabled={!ready || exporting} onChange={e => update('model', e.target.value)}>
            {models.map(model => <option key={model} value={model}>{modelLabels[model]}</option>)}
          </select></label></div>
          <EditorPreview data={data} />
          <p className="editor-notice">Pré-visualização do conteúdo. O PDF é paginado em A4; secções vazias ficam de fora. Revê o ficheiro antes de enviar.</p>
          {!canExport(data) && <p className="export-hint">Adiciona o teu nome e pelo menos uma secção para descarregar o PDF.</p>}
        </div>
      </div>
    </main>
  </div>;
}
