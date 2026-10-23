'use client';

import { useEffect, useState } from 'react';
import { Download, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/header';
import { blank, isModel, readDraft, type CVData } from '@/lib/cv';

const contactFields = [
  { key: 'name', label: 'Nome completo', placeholder: 'O teu nome' },
  { key: 'role', label: 'Título profissional', placeholder: 'Ex.: Assistente administrativa' },
  { key: 'email', label: 'Email', placeholder: 'nome@exemplo.com' },
  { key: 'city', label: 'Localidade', placeholder: 'Ex.: Maputo, Moçambique' },
] as const;
const sections = [
  { key: 'profile', label: 'Perfil profissional', placeholder: 'Apresenta brevemente a tua experiência e os teus objectivos.' },
  { key: 'experience', label: 'Experiência', placeholder: 'Função, organização, período e principais responsabilidades.' },
  { key: 'education', label: 'Formação', placeholder: 'Curso, instituição e ano de conclusão.' },
  { key: 'skills', label: 'Competências e línguas', placeholder: 'Destaca as competências relevantes para a candidatura.' },
] as const;

export default function Editor() {
  const [data, setData] = useState<CVData>({ ...blank });
  const [status, setStatus] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let restored = { ...blank };
    try {
      restored = readDraft(sessionStorage.getItem('cvmais-draft'));
    } catch {
      setStatus('O navegador não permitiu recuperar o rascunho. Podes continuar a editar.');
    }
    // A selected gallery model still works when browser storage is unavailable.
    const selected = new URLSearchParams(window.location.search).get('modelo');
    if (isModel(selected)) restored.model = selected;
    setData(restored);
    setReady(true);
  }, []);

  function update(key: keyof CVData, value: string) {
    if (key === 'model') {
      if (isModel(value)) setData(d => ({ ...d, model: value }));
    } else {
      setData(d => ({ ...d, [key]: value }));
    }
    setStatus('Alterações por guardar.');
  }

  function save() {
    try {
      sessionStorage.setItem('cvmais-draft', JSON.stringify(data));
      setStatus('Rascunho guardado nesta sessão do navegador.');
    } catch {
      setStatus('O navegador não permitiu guardar. Podes usar Imprimir / PDF.');
    }
  }

  const contact = [data.city.trim(), data.email.trim()].filter(Boolean).join(' · ');
  const hasContent = Boolean(data.name.trim() && sections.some(s => data[s.key].trim()));

  return <div className="editor-page">
    <Header />
    <main className="container">
      <div className="editor-top">
        <div>
          <Link className="text-link" href="/#modelos"><ArrowLeft size={16} /> Voltar aos modelos</Link>
          <h1>O teu percurso, nas tuas palavras.</h1>
          <p>Preenche os campos e acompanha a pré-visualização.</p>
        </div>
        <button className="button" disabled={!ready || !hasContent} onClick={() => window.print()}>
          <Download size={18} /> Imprimir / PDF
        </button>
      </div>
      <div className="editor-grid">
        <form className="editor-form" onSubmit={e => { e.preventDefault(); save(); }}>
          <label htmlFor="cv-model">Modelo</label>
          <select id="cv-model" value={data.model} onChange={e => update('model', e.target.value)} disabled={!ready}>
            <option value="classico">Clássico</option>
            <option value="moderno">Moderno</option>
            <option value="minimalista">Minimalista</option>
            <option value="criativo">Criativo</option>
            <option value="executivo">Executivo</option>
          </select>
          {contactFields.map(f => <label key={f.key} htmlFor={`cv-${f.key}`}>{f.label}
            <input id={`cv-${f.key}`} type={f.key === 'email' ? 'email' : 'text'}
              autoComplete={f.key === 'name' ? 'name' : f.key === 'email' ? 'email' : 'off'}
              value={data[f.key]} onChange={e => update(f.key, e.target.value)}
              placeholder={f.placeholder} maxLength={150} disabled={!ready} />
          </label>)}
          {sections.map(f => <label key={f.key} htmlFor={`cv-${f.key}`}>{f.label}
            <textarea id={`cv-${f.key}`} value={data[f.key]} onChange={e => update(f.key, e.target.value)}
              placeholder={f.placeholder} maxLength={4000} disabled={!ready} />
          </label>)}
          <button className="button" type="submit" disabled={!ready}><Save size={17} /> Guardar rascunho</button>
          <p className="saved-status" role="status">{status}</p>
          <p className="editor-help">O rascunho fica apenas nesta sessão do navegador. Não é enviado para um servidor.
            Para preparar o PDF, adiciona o teu nome e pelo menos uma secção. Ao imprimir, selecciona
            «Guardar como PDF» e desactiva os cabeçalhos e rodapés do navegador.</p>
        </form>
        <div className="editor-preview">
          <article className={`document-preview ${data.model}`} aria-label="Pré-visualização do CV">
            <h2 className={data.name.trim() ? undefined : 'print-placeholder'}>{data.name.trim() || 'O teu nome'}</h2>
            <p className={`document-role${data.role.trim() ? '' : ' print-placeholder'}`}>{data.role.trim() || 'O teu título profissional'}</p>
            <p className={`document-contact${contact ? '' : ' print-placeholder'}`}>{contact || 'Localidade · Email'}</p>
            {sections.map(s => <section key={s.key} className={data[s.key].trim() ? undefined : 'print-placeholder'}>
              <h3>{s.label}</h3>
              <p>{data[s.key].trim() || 'Adiciona a tua informação no formulário.'}</p>
            </section>)}
          </article>
          <p className="editor-notice">Pré-visualização. As secções vazias não aparecem no PDF. Revê o conteúdo e a paginação antes de enviar a candidatura.</p>
        </div>
      </div>
    </main>
  </div>;
}
