'use client';
import {useEffect,useRef,useState} from 'react';
import type {CSSProperties,ReactNode} from 'react';
import {hasEntryContent,type CVData,type Entry} from '@/lib/cv';
import {signatureDesign,compactSignature} from '@/lib/signature-designs';
import {labelsForCV} from '@/lib/cv-language';
import {contacts} from '@/lib/resume-design';
function Section({title,number,children}:{title:string;number?:string;children:ReactNode}){return <section className="signature-section"><h3>{number&&<span>{number} / </span>}{title}</h3>{children}</section>;}
function Body({text}:{text:string}){const lines=text.trim().split('\n').filter(Boolean);return lines.length>1&&lines.length<13?<ul>{lines.map((line,i)=><li key={i}>{line.replace(/^[•\-]\s*/,'')}</li>)}</ul>:<p>{text.trim()}</p>;}
function Entries({entries}:{entries:Entry[]}){return <>{entries.filter(hasEntryContent).map(entry=><div className="signature-entry" key={entry.id}>{entry.period.trim()&&<p className="signature-date">{entry.period.trim()}</p>}<div>{entry.title.trim()&&<h4>{entry.title.trim()}</h4>}{entry.organisation.trim()&&<p className="signature-org">{entry.organisation.trim()}</p>}{entry.description.trim()&&<Body text={entry.description}/>}</div></div>)}</>;}
export default function SignaturePreview({data}:{data:CVData}){
 const shell=useRef<HTMLDivElement>(null);const paper=useRef<HTMLElement>(null);const [size,setSize]=useState({width:595,height:842});
 useEffect(()=>{const update=()=>{if(shell.current&&paper.current)setSize({width:Math.min(595,shell.current.clientWidth),height:paper.current.offsetHeight});};const observer=new ResizeObserver(update);if(shell.current)observer.observe(shell.current);if(paper.current)observer.observe(paper.current);update();return()=>observer.disconnect();},[]);
 const scale=size.width/595;
 const d=signatureDesign(data.model)!;const l=labelsForCV(data);const compact=compactSignature(data);
 const side=d.id==='atlas'&&compact&&[data.skills,data.languages,...contacts(data).map(c=>c.text)].join('\n').split('\n').reduce((n,line)=>n+Math.max(1,Math.ceil(line.length/23)),0)<29;
 const portrait=data.photo&&<img className="signature-portrait" src={data.photo} alt={data.cvLanguage==='en'?'Candidate portrait':'Fotografia do candidato'}/>;
 const identity=<div className="signature-identity"><h2>{data.name.trim()||l.name}</h2>{data.role.trim()&&<p>{data.role.trim()}</p>}</div>;
 const contact=<div className="signature-contacts">{side&&<h3>{data.cvLanguage==='en'?'Contact':'Contacto'}</h3>}{contacts(data).map(item=><p key={item.key}>{item.text}</p>)}{d.id==='vertice'&&data.languages.trim().length<=180&&data.languages.trim()&&<p className="signature-inline-languages">{l.languages}: {data.languages.trim().replaceAll('\n',' · ')}</p>}</div>;
 const support=<>{data.skills.trim()&&<Section title={l.skills}><Body text={data.skills}/></Section>}{data.languages.trim()&&<Section title={l.languages}><Body text={data.languages}/></Section>}</>;
 const work=data.experiences.some(hasEntryContent)&&<Section number={d.id==='atlas'?'02':d.id==='aurora'?'02':'01'} title={l.work}><Entries entries={data.experiences}/></Section>;
 const study=data.education.some(hasEntryContent)&&<Section number={d.id==='atlas'?'03':d.id==='aurora'?'01':'02'} title={l.study}><Entries entries={data.education}/></Section>;
 return <div ref={shell} className="signature-preview-shell" style={{height:Math.ceil(size.height*scale)}}><article ref={paper} className={`signature-preview signature-${d.id}${side?' signature-with-rail':''}${compact?' signature-compact':''}`} style={{'--signature-accent':d.accent,'--signature-pale':d.pale,'--signature-ink':d.ink,transform:`scale(${scale})`} as CSSProperties} lang={data.cvLanguage==='en'?'en':'pt-MZ'} aria-label={data.cvLanguage==='en'?'CV preview':'Pré-visualização do CV'}>
 {side&&<aside className="signature-rail">{portrait}{contact}{support}</aside>}
 <div className="signature-main"><header className="signature-header">{d.id==='aurora'&&portrait}{identity}{d.id!=='aurora'&&!side&&portrait}</header>{!side&&contact}
 {d.id==='vertice'&&data.skills.trim()&&<div className="signature-skill-band"><Section title={l.skills}><Body text={data.skills}/></Section></div>}
 {data.profile.trim()&&<Section title={l.profile} number={d.id==='atlas'?'01':undefined}><Body text={data.profile}/></Section>}
 <div className={d.id==='aurora'&&compact?'signature-balanced':'signature-career'}>{d.id==='aurora'?<>{study}{work}</>:<>{work}{study}</>}</div>
 {!side&&(d.id==='vertice'?data.languages.trim().length>180&&<Section title={l.languages}><Body text={data.languages}/></Section>:<div className="signature-support">{support}</div>)}
 {!data.profile.trim()&&!work&&!study&&!data.skills.trim()&&!data.languages.trim()&&<p className="preview-empty">{l.empty}</p>}
 </div></article></div>;
}
