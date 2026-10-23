import { contactLine, hasEntryContent, type CVData, type Entry } from '@/lib/cv';

function Entries({ entries }: { entries: Entry[] }) {
  return <>{entries.filter(hasEntryContent).map(entry => <div className="editor-cv-entry" key={entry.id}>
    {entry.title.trim() && <h4>{entry.title.trim()}</h4>}
    {(entry.organisation.trim() || entry.period.trim()) && <p className="entry-meta">{[entry.organisation.trim(), entry.period.trim()].filter(Boolean).join(' · ')}</p>}
    {entry.description.trim() && <p>{entry.description.trim()}</p>}
  </div>)}</>;
}
export default function EditorPreview({ data }: { data: CVData }) {
  const contact = contactLine(data);
  return <article className={`document-preview enhanced-preview ${data.model}`} aria-label="Pré-visualização do CV">
    <div className="editor-cv-heading">
      <h2>{data.name.trim() || 'O teu nome'}</h2>
      {data.role.trim() && <p className="document-role">{data.role.trim()}</p>}
      {contact && <p className="document-contact">{contact}</p>}
    </div>
    {!data.profile.trim() && !data.experiences.some(hasEntryContent) && !data.education.some(hasEntryContent) && !data.skills.trim() && !data.languages.trim() &&
      <p className="preview-empty">O teu percurso vai aparecer aqui. Começa pelo perfil, experiência ou formação.</p>}
    {data.profile.trim() && <section><h3>Perfil profissional</h3><p>{data.profile.trim()}</p></section>}
    {data.experiences.some(hasEntryContent) && <section><h3>Experiência profissional</h3><Entries entries={data.experiences} /></section>}
    {data.education.some(hasEntryContent) && <section><h3>Formação académica</h3><Entries entries={data.education} /></section>}
    {data.skills.trim() && <section><h3>Competências</h3><p>{data.skills.trim()}</p></section>}
    {data.languages.trim() && <section><h3>Línguas</h3><p>{data.languages.trim()}</p></section>}
  </article>;
}
