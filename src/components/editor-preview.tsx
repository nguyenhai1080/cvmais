import { contactLine, hasEntryContent, usesSidebar, type CVData, type Entry } from '@/lib/cv';
function Entries({ entries }: { entries: Entry[] }) {
  return <>{entries.filter(hasEntryContent).map(entry => <div className="resume-entry" key={entry.id}>
    {entry.title.trim() && <h4>{entry.title.trim()}</h4>}
    {(entry.organisation.trim() || entry.period.trim()) && <p className="resume-meta">{[entry.organisation.trim(), entry.period.trim()].filter(Boolean).join(' · ')}</p>}
    {entry.description.trim() && <p>{entry.description.trim()}</p>}
  </div>)}</>;
}
export default function EditorPreview({ data }: { data: CVData }) {
  const split = usesSidebar(data);
  const support = <>{data.skills.trim() && <section><h3>Competências</h3><p>{data.skills.trim()}</p></section>}{data.languages.trim() && <section><h3>Línguas</h3><p>{data.languages.trim()}</p></section>}</>;
  const work = data.experiences.some(hasEntryContent) && <section><h3>Experiência profissional</h3><Entries entries={data.experiences} /></section>;
  const study = data.education.some(hasEntryContent) && <section><h3>Formação académica</h3><Entries entries={data.education} /></section>;
  return <article className={`resume resume-${data.model} ${split ? 'resume-split' : 'resume-single'}`} aria-label="Pré-visualização do CV">
    {split && <aside className="resume-sidebar">{data.model === 'classico' && <div className="resume-initials">{(data.name || 'CV').split(' ').filter(Boolean).map(n => n[0]).slice(0,2).join('')}</div>}{contactLine(data) && <section><h3>Contacto</h3><p>{[data.city,data.phone,data.email,data.website].filter(Boolean).join('\n')}</p></section>}{support}</aside>}
    <div className="resume-main"><header className="resume-heading"><h2>{data.name.trim() || 'O teu nome'}</h2>{data.role.trim() && <p className="resume-role">{data.role.trim()}</p>}{!split && contactLine(data) && <p className="resume-contact">{contactLine(data)}</p>}</header>
    {data.profile.trim() && <section><h3>Perfil profissional</h3><p>{data.profile.trim()}</p></section>}
    {data.model === 'primeiro' ? <>{study}{work}</> : <>{work}{study}</>}
    {!split && support}
    {!data.profile.trim() && !work && !study && !data.skills.trim() && !data.languages.trim() && <p className="preview-empty">O teu percurso vai aparecer aqui. Começa pelo perfil, experiência ou formação.</p>}
    </div>
  </article>;
}
