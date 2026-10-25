'use client';
import { t as ui, useUILanguage } from '@/lib/ui-language';

import { useEffect, useState } from 'react';
import { Download, Save, ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, ShieldCheck, Eye, PenLine } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/header';
import { useCVStorage } from '@/lib/use-cv-storage';
import EditorPreview from '@/components/editor-preview';
import GuestBackupImport from '@/components/guest-backup-import';
import PhotoPicker from '@/components/photo-picker';
import CVExportReview from '@/components/cv-export-review';
import ContentSamples from '@/components/content-samples';
import { templates, templateAreas, templateMatchesArea } from '@/lib/templates';
import { sectors } from '@/lib/content-samples';
import type { SampleFilters, SampleKind } from '@/lib/content-samples';
import { MAX_ENTRIES, isModel, normaliseCV, canExport, pdfFilename,
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

export default function Editor() {const {translate:ui}=useUILanguage();
  const { data, ready, status, saveError, cloud, pending, restorePending, change: storeChange, save } = useCVStorage();
  const [sampleFilters, setSampleFilters] = useState<SampleFilters>({sector:'administracao',level:'first',voice:'neutral'});
  useEffect(()=>{const area=new URLSearchParams(window.location.search).get('area');const sector=area==='engenharia'?'construcao':area;if(sectors.some(item=>item.id===sector))setSampleFilters(current=>({...current,sector:sector!}));},[]);
  const [pdfError, setPdfError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [removed, setRemoved] = useState<{ kind: EntryKind; entry: Entry; index: number } | null>(null);
  function change(next: CVData) { storeChange(next); setPdfError(''); }
  function update(key: Exclude<keyof CVData, 'experiences' | 'education'>, value: string) {
    if (key === 'cvLanguage') { change({...data,cvLanguage:value==='en'?'en':'pt'}); }
    else if (key === 'model') {
      if (isModel(value)) {
        const url = new URL(window.location.href);
        url.searchParams.set('modelo', value);
        window.history.replaceState(null, '', url);
        change({ ...data, model: value });
      }
    }
    else change({ ...data, [key]: value });
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

  function samples(kind: SampleKind, value: string, onApply: (value:string)=>void, key?: string) { return <ContentSamples key={key} kind={kind} value={value} onApply={onApply} cvLanguage={data.cvLanguage} filters={sampleFilters} onFilters={setSampleFilters}/>; }

  function entriesSection(kind: EntryKind) {
    const work = kind === 'experiences';
    const noun = work ? 'experiência' : 'formação';
    return <section className="editor-section" id={work ? 'experiencia' : 'formacao'}>
      <div className="editor-section-title"><span>{work ? '03' : '04'}</span><div><h2>{work ? ui("Experiência profissional") : ui("Formação académica")}</h2>
        <p>{work ? ui("Inclui trabalho, estágios ou voluntariado relevantes.") : ui("Adiciona os teus cursos e qualificações.")}</p></div></div>
      {data[kind].length === 0 && <div className="entry-empty">{work ? ui("Ainda sem experiência? Podes começar pela formação e competências.") : ui("Adiciona uma formação quando estiveres pronto.")}</div>}
      {data[kind].map((entry, index) => <div className="entry-card" key={entry.id}>
        <div className="entry-card-toolbar"><h3>{work ? ui("Experiência") : ui("Formação")} {index + 1}</h3><div>
          <button type="button" className="icon-button" onClick={() => moveEntry(kind, index, -1)} disabled={index === 0} aria-label={`${ui('Mover para cima')} · ${ui(noun)} ${index+1}`}><ArrowUp size={16} /></button>
          <button type="button" className="icon-button" onClick={() => moveEntry(kind, index, 1)} disabled={index === data[kind].length - 1} aria-label={`${ui('Mover para baixo')} · ${ui(noun)} ${index+1}`}><ArrowDown size={16} /></button>
          <button type="button" className="icon-button danger" onClick={() => removeEntry(kind, index)} aria-label={`${ui('Remover')} · ${ui(noun)} ${index+1}`}><Trash2 size={16} /></button>
        </div></div>
        <label>{work ? ui("Cargo / função") : ui("Curso / qualificação")}<input id={`${kind}-${entry.id}-title`} value={entry.title} maxLength={150} onChange={e => editEntry(kind, entry.id, 'title', e.target.value)} placeholder={work ? ui("Ex.: Assistente administrativa") : ui("Ex.: Licenciatura em Gestão")} /></label>
        <label>{work ? ui("Organização") : ui("Instituição")}<input id={`${kind}-${entry.id}-organisation`} value={entry.organisation} maxLength={150} onChange={e => editEntry(kind, entry.id, 'organisation', e.target.value)} placeholder={work ? ui("Nome da organização") : ui("Nome da instituição")} /></label>
        <label>{ui("Período")}<input id={`${kind}-${entry.id}-period`} value={entry.period} maxLength={100} onChange={e => editEntry(kind, entry.id, 'period', e.target.value)} placeholder={ui("Ex.: 2022 - 2025 ou 2023 - actual")} /></label>
        <label>{work ? ui("Responsabilidades e resultados") : ui("Informação adicional (opcional)")}<textarea id={`${kind}-${entry.id}-description`} value={entry.description} maxLength={4000} onChange={e => editEntry(kind, entry.id, 'description', e.target.value)} placeholder={work ? ui("Descreve o que fizeste e os resultados que alcançaste.") : ui("Área de especialização, projectos ou distinções relevantes.")} /></label>
        {samples(work ? 'experience' : 'education', entry.description, text => editEntry(kind, entry.id, 'description', text), entry.id)}
      </div>)}
      <button className="add-entry" type="button" onClick={() => addEntry(kind)} disabled={data[kind].length >= MAX_ENTRIES}><Plus size={17} />{ui(" Adicionar ")}{ui(noun)}</button>
      {data[kind].length >= MAX_ENTRIES && <p className="editor-help">{ui("Podes incluir até ")}{MAX_ENTRIES}{ui(" itens nesta secção.")}</p>}
    </section>;
  }

  return <div className="editor-page editor-v2"><Header />
    <main className="container">
      <div className="editor-top"><div><Link className="text-link" href="/modelos"><ArrowLeft size={16} />{ui(" Voltar aos modelos")}</Link>
        <h1>{ui("O teu percurso, nas tuas palavras.")}</h1><p>{ui("Personaliza o teu CV e descarrega um PDF pronto para enviar.")}</p></div>
        <div className="editor-top-actions"><button className="button outline" disabled={!ready || exporting} onClick={save}><Save size={17} />{ui(" Guardar")}</button>
          <CVExportReview data={data} ready={ready} exporting={exporting} onDownload={exportPDF} onEdit={id=>{setView('edit');requestAnimationFrame(()=>{const field=document.getElementById(id);field?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});field?.focus({preventScroll:true});});}}/></div>
      </div>
      <div className="editor-feedback"><p className={saveError ? 'saved-status save-error' : 'saved-status'} role="status">{ui(status)}</p>
        <span><ShieldCheck size={14} /> {cloud ? ui("CV privado na tua conta.") : ui("Os teus dados ficam no teu dispositivo.")}</span></div>
      {!ready && saveError && <p><a className="text-link" href="/conta">{ui("Entrar na conta")}</a> · <a className="text-link" href="/meus-cvs">{ui("Os meus CVs")}</a></p>}
      {pending && <div className="undo-entry"><p>{ui("Encontrámos alterações neste dispositivo que podem não ter sido sincronizadas. A versão da conta está aberta.")}</p><button onClick={restorePending}>{ui("Recuperar alterações deste dispositivo")}</button></div>}
      <div className="storage-actions"><a className="text-link" href="/meus-cvs">{cloud ? ui("← Os meus CVs") : ui("Guardar numa conta / Os meus CVs →")}</a><button type="button" className="text-link" disabled={!ready} onClick={() => {
        const url = URL.createObjectURL(new Blob([JSON.stringify({ format: 'cvmais-backup-v1', data }, null, 2)], { type: 'application/json' }));
        const a = document.createElement('a'); a.href = url; a.download = 'cvmais-copia-seguranca.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}>{ui("Descarregar cópia de segurança")}</button></div>
      {!cloud && <GuestBackupImport disabled={!ready || exporting} current={data} onImport={change} />}
      {pdfError && <p className="pdf-error" role="alert">{ui(pdfError)}</p>}
      {exporting && <p role="status" className="export-status">{ui("A preparar o teu PDF com texto seleccionável e fontes incluídas…")}</p>}
      {removed && <div className="undo-entry" role="status">{ui("Item removido. ")}<button type="button" disabled={data[removed.kind].length >= MAX_ENTRIES} onClick={() => {
        const entries = [...data[removed.kind]];
        entries.splice(Math.min(removed.index, entries.length), 0, removed.entry);
        change({ ...data, [removed.kind]: entries }); setRemoved(null);
      }}>{ui("Anular")}</button></div>}
      <div className="editor-mobile-switch" aria-label={ui("Vista do editor")}><button aria-pressed={view === 'edit'} onClick={() => setView('edit')}><PenLine size={16} />{ui(" Editar")}</button>
        <button aria-pressed={view === 'preview'} onClick={() => setView('preview')}><Eye size={16} />{ui(" Pré-visualizar")}</button></div>
      <div className="editor-grid editor-workspace" data-view={view}>
        <form className="editor-form v2-form" onSubmit={e => { e.preventDefault(); save(); }}>
          <fieldset disabled={!ready || exporting}>
            <section className="editor-section" id="dados"><div className="editor-section-title"><span>01</span><div><h2>{ui("Os teus dados")}</h2><p>{ui("Como te apresentas e como podem contactar-te.")}</p></div></div>
              <div className="cv-language-picker"><label htmlFor="cv-language">{ui('Idioma do CV')}<select id="cv-language" value={data.cvLanguage} onChange={e=>update('cvLanguage',e.target.value)}><option value="pt">Português (Moçambique)</option><option value="en">English</option></select></label><p>{ui('Altera os títulos do CV, o PDF e os exemplos sugeridos. O texto que escreveste não é traduzido automaticamente.')}</p></div><PhotoPicker photo={data.photo} onChange={photo => change({ ...data, photo })} /><div className="contact-fields">{fields.map(f => <label key={f.key} htmlFor={`cv-${f.key}`}>{ui(f.label)}<input id={`cv-${f.key}`}
                type={f.key === 'email' ? 'email' : f.key === 'phone' ? 'tel' : 'text'} autoComplete={f.complete}
                value={data[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={ui(f.placeholder)} maxLength={150} /></label>)}</div>
              {samples('role',data.role,text=>update('role',text))}
            </section>
            <section className="editor-section" id="perfil"><div className="editor-section-title"><span>02</span><div><h2>{ui("Perfil profissional")}</h2><p>{ui("Uma apresentação curta sobre o teu percurso e objectivo.")}</p></div></div>
              <label htmlFor="cv-profile">{ui("O teu perfil")}<textarea id="cv-profile" value={data.profile} maxLength={4000} onChange={e => update('profile', e.target.value)} placeholder={ui("Resume a tua experiência, pontos fortes e o que procuras no próximo desafio.")} /></label>
              {samples('profile',data.profile,text=>update('profile',text))}
            </section>
            {entriesSection('experiences')}{entriesSection('education')}
            <section className="editor-section" id="competencias"><div className="editor-section-title"><span>05</span><div><h2>{ui("Competências e línguas")}</h2><p>{ui("Destaca o que podes trazer para a oportunidade.")}</p></div></div>
              <label htmlFor="cv-skills">{ui("Competências")}<textarea id="cv-skills" value={data.skills} maxLength={4000} onChange={e => update('skills', e.target.value)} placeholder={ui("Ex.: Organização de documentos, Microsoft Excel, atendimento ao cliente")} /></label>
              {samples('skills',data.skills,text=>update('skills',text))}
              <label htmlFor="cv-languages">{ui("Línguas")}<textarea id="cv-languages" value={data.languages} maxLength={4000} onChange={e => update('languages', e.target.value)} placeholder={ui("Ex.: Português - fluente; Inglês - intermédio; Changana - língua materna")} /></label>
              {samples('languages',data.languages,text=>update('languages',text))}
            </section>
            <div className="editor-form-bottom"><button className="button" type="submit"><Save size={17} />{ui(" Guardar rascunho")}</button>
              <p>{cloud ? ui("As alterações são guardadas na tua conta. O PDF é criado no teu dispositivo.") : ui("Guardado apenas neste navegador. Limpar os dados do navegador pode apagar o rascunho. Cria uma conta para sincronizar.")}</p></div>
          </fieldset>
        </form>
        <div className="editor-preview"><div className="preview-controls"><div><span className="eyebrow">{ui("O TEU CV")}</span><h2>{ui("Escolhe o teu estilo.")}</h2></div>
          <label htmlFor="cv-model">{ui("Modelo")}<select id="cv-model" value={data.model} disabled={!ready || exporting} onChange={e => update('model', e.target.value)}>
            <optgroup label={ui('Modelos gerais')}>{templates.filter(t=>templateMatchesArea(t.id,'gerais')).map(t=><option key={t.id} value={t.id}>{ui(t.name)}</option>)}</optgroup>{templateAreas.map(area=><optgroup key={area.id} label={ui(area.label)}>{templates.filter(t=>templateMatchesArea(t.id,area.id)).map(t=><option key={t.id} value={t.id}>{ui(t.name)}</option>)}</optgroup>)}
          </select></label></div>
          <EditorPreview data={data} />
          <p className="editor-notice">{ui("Pré-visualização do conteúdo. O PDF é paginado em A4; secções vazias ficam de fora. Revê o ficheiro antes de enviar.")}</p>
          {!canExport(data) && <p className="export-hint">{ui("Adiciona o teu nome e pelo menos uma secção para descarregar o PDF.")}</p>}
        </div>
      </div>
    </main>
  </div>;
}
