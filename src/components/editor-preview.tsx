import CompositionPreview from './composition-preview';
import {compositionDesign} from '../lib/milestone-designs';
import SectorPreview from './sector-preview';
import {sectorDesign} from '../lib/sector-designs';
import SignaturePreview from './signature-preview';
import { signatureDesign } from '../lib/signature-designs';
import { designModel } from '../lib/industry-catalogue';
import { labelsForCV } from '../lib/cv-language';
import type { CSSProperties, ReactNode } from 'react';
import { hasEntryContent, usesSidebar, type CVData, type Entry } from '@/lib/cv';
import { themes, contacts, chips, iconPaths, type IconKind } from '@/lib/resume-design';
function Icon({kind}:{kind:IconKind}) { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[kind]}/></svg>; }
function Section({title,kind,children}:{title:string;kind:IconKind;children:ReactNode}) { return <section className="cv3-section"><h3><Icon kind={kind}/>{title}</h3>{children}</section>; }
function Description({text}:{text:string}) { const lines=text.trim().split('\n').filter(line=>line.trim()); return lines.length>1&&lines.length<=12&&lines.every(line=>line.length<400)?<ul className="cv3-bullets">{lines.map((line,i)=><li key={i}>{line.replace(/^[•\-]\s*/,'')}</li>)}</ul>:<p className="cv3-description">{text.trim()}</p>; }
function Entries({entries}:{entries:Entry[]}) { return <>{entries.filter(hasEntryContent).map(e=><div className="cv3-entry" key={e.id}>{e.title.trim()&&<h4>{e.title.trim()}</h4>}{e.organisation.trim()&&<p className="cv3-org">{e.organisation.trim()}</p>}{e.period.trim()&&<p className="cv3-period">{e.period.trim()}</p>}{e.description.trim()&&<Description text={e.description}/>}</div>)}</>; }
export default function EditorPreview({data}:{data:CVData}) {
  if(compositionDesign(data.model))return <CompositionPreview data={data}/>;
  if(sectorDesign(data.model))return <SectorPreview data={data}/>;
  if(signatureDesign(data.model))return <SignaturePreview data={data}/>;
  const family=designModel(data.model);
  const labels=labelsForCV(data);
  const t=themes[data.model], split=usesSidebar(data), studySide=split&&['moderno','executivo'].includes(family), inlineProfile=family==='classico'&&data.profile.trim().length>0&&data.profile.trim().length<520;
  const work=data.experiences.some(hasEntryContent)&&<Section title={labels.work} kind="work"><Entries entries={data.experiences}/></Section>;
  const study=data.education.some(hasEntryContent)&&<Section title={labels.study} kind="study"><Entries entries={data.education}/></Section>;
  const skills=chips(data.skills);
  const support=<>{data.skills.trim()&&<Section title={labels.skills} kind="skills">{skills?<div className="cv3-chips">{skills.map((item,i)=><span key={i}>{item}</span>)}</div>:<p>{data.skills.trim()}</p>}</Section>}{studySide&&study}{data.languages.trim()&&<Section title={labels.languages} kind="languages"><p className="cv3-languages">{family==='minimalista'?data.languages.trim().replaceAll('\n',' · '):data.languages.trim()}</p></Section>}</>;
  return <article lang={data.cvLanguage==='en'?'en':'pt-MZ'} className={`resume-v3 cv3-${family}`} style={{'--cv-accent':t.accent,'--cv-pale':t.pale,'--cv-ink':t.ink} as CSSProperties} aria-label="Pré-visualização do CV"><header className={`cv3-header ${data.photo?'cv3-has-photo':''}`}>
    {data.photo&&<img className="cv3-portrait" src={data.photo} alt="Fotografia do candidato"/>}<div className="cv3-identity"><h2>{data.name.trim()||labels.name}</h2>{data.role.trim()&&<p className="cv3-role">{data.role.trim()}</p>}{inlineProfile&&<p className="cv3-intro">{data.profile.trim()}</p>}</div></header>
    {contacts(data).length>0&&<div className="cv3-contacts">{contacts(data).map(item=><span key={item.key}><Icon kind={item.kind}/><span>{item.text}</span></span>)}</div>}
    {!inlineProfile&&data.profile.trim()&&<Section title={labels.profile} kind="profile"><p>{data.profile.trim()}</p></Section>}
    <div className={split?'cv3-columns':'cv3-single'}><div>{['primeiro','saude'].includes(family)?<>{study}{work}</>:<>{work}{!studySide&&study}</>}{!split&&support}</div>{split&&<aside className="cv3-support">{support}</aside>}</div>
    {!data.profile.trim()&&!work&&!study&&!data.skills.trim()&&!data.languages.trim()&&<p className="preview-empty">{labels.empty}</p>}
  </article>;
}
