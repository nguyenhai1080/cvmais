'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {hasEntryContent,type CVData} from '../lib/cv';
import {sectorDesign,sectorCompact,type SectorNode,type SectorBlock} from '../lib/sector-designs';
import {labelsForCV} from '../lib/cv-language';
import {contacts} from '../lib/resume-design';

export default function SectorPreview({data}:{data:CVData}){
 const d=sectorDesign(data.model)!;const l=labelsForCV(data);const compact=sectorCompact(data);
 const shell=useRef<HTMLDivElement>(null),paper=useRef<HTMLElement>(null);const [size,setSize]=useState({width:595,height:842});
 useEffect(()=>{const update=()=>{if(shell.current&&paper.current)setSize({width:Math.min(595,shell.current.clientWidth),height:paper.current.offsetHeight});};const observer=new ResizeObserver(update);if(shell.current)observer.observe(shell.current);if(paper.current)observer.observe(paper.current);update();return()=>observer.disconnect();},[]);
 const scale=size.width/595;
 const identity=<div className="sector-identity"><h2>{data.name.trim()||l.name}</h2>{data.role.trim()&&<p>{data.role.trim()}</p>}</div>;
 const portrait=data.photo&&<img className="sector-photo" src={data.photo} alt={data.cvLanguage==='en'?'Candidate portrait':'Fotografia do candidato'}/>;
 const contact=<div className="sector-contact">{contacts(data).map(item=><p key={item.key}>{item.text}</p>)}</div>;
 let header;
 switch(d.header){
  case 'ledger':header=<><div className="sector-heading-row">{identity}{portrait}</div>{contact}</>;break;
  case 'terminal':header=<><span className="sector-kicker">CURRICULUM VITAE</span><div className="sector-heading-row">{identity}{portrait}</div></>;break;
  case 'clinical':header=<>{portrait}<div>{identity}{contact}</div></>;break;
  case 'academic':header=<>{portrait}{identity}</>;break;
  case 'blueprint':header=<div className="sector-heading-row">{identity}{portrait}</div>;break;
  case 'dispatch':header=<><div className="sector-heading-row">{portrait}{identity}</div>{contact}</>;break;
  case 'spotlight':header=<><div className="sector-heading-row">{identity}{portrait}</div>{contact}</>;break;
  case 'concierge':header=<>{portrait}<div>{identity}{contact}</div></>;break;
  case 'magazine':header=<><span className="sector-kicker">CURRICULUM VITAE</span><div className="sector-heading-row">{identity}{portrait}</div></>;break;
  case 'field':header=<>{portrait}<div className="sector-field-intro">{identity}{contact}</div></>;break;
  case 'community':header=<><div className="sector-heading-row">{portrait}{identity}</div>{contact}</>;break;
  case 'index':header=<><div className="sector-heading-row">{identity}{portrait}</div>{contact}</>;break;
 }
 const labels:Record<SectorBlock,string>={profile:l.profile,work:l.work,study:l.study,skills:l.skills,languages:l.languages,contact:data.cvLanguage==='en'?'Contact':'Contacto'};
 function block(kind:SectorBlock){
  const entries=kind==='work'?data.experiences:kind==='study'?data.education:null;
  const value=kind==='contact'?contacts(data).map(item=>item.text).join('\n'):kind==='profile'?data.profile:kind==='skills'?data.skills:kind==='languages'?data.languages:'';
  if(entries?!entries.some(hasEntryContent):!value.trim())return null;
  return <section className={`sector-section sector-label-${d.label} sector-block-${kind}`} key={kind}><h3>{labels[kind]}</h3><div className="sector-section-content">{entries?entries.filter(hasEntryContent).map(entry=><div className={`sector-entry sector-entry-${d.entry}`} key={entry.id}>{d.entry==='ledger'||d.entry==='timeline'?<div className="sector-entry-date">{entry.period.trim()}</div>:null}<div className="sector-entry-content"><div className="sector-entry-top">{entry.title.trim()&&<h4>{entry.title.trim()}</h4>}{d.entry==='date-right'&&entry.period.trim()&&<span className="sector-date-right">{entry.period.trim()}</span>}</div>{entry.organisation.trim()&&<p className="sector-org">{entry.organisation.trim()}</p>}{d.entry!=='ledger'&&d.entry!=='timeline'&&d.entry!=='date-right'&&entry.period.trim()&&<p className="sector-entry-date">{entry.period.trim()}</p>}{entry.description.trim()&&<p className="sector-text">{entry.description.trim()}</p>}</div></div>):<p className="sector-text">{value.trim()}</p>}</div></section>;
 }
 function nodes(items:readonly SectorNode[],prefix='body'):React.ReactNode{return items.map((node,i)=>{
  if(typeof node==='string')return block(node);
  // Remove empty columns, and stack all columns for long CVs.
  const columns=node.columns.map((column,index)=>({column,index,content:nodes(column,`${prefix}-${i}-${index}`)})).filter(({column})=>column.some(item=>typeof item!=='string'||(item==='work'?data.experiences.some(hasEntryContent):item==='study'?data.education.some(hasEntryContent):item==='contact'?contacts(data).length>0:!!data[item].trim())));
  return <div key={`${prefix}-${i}`} className={`sector-grid sector-grid-${node.tone||'plain'}${compact&&columns.length>1?'':' sector-stacked'}`} style={{gridTemplateColumns:columns.map(({index})=>`${node.widths[index]}fr`).join(' ')}}>{columns.map(({content,index})=><div className="sector-column" key={index}>{content}</div>)}</div>;
 });}
 return <div ref={shell} className="sector-preview-shell" style={{height:Math.ceil(size.height*scale)}}><article ref={paper} className={`sector-preview sector-${d.id}${d.serif?' sector-serif':''}${compact?'':' sector-long'}`} lang={data.cvLanguage==='en'?'en':'pt-MZ'} aria-label={data.cvLanguage==='en'?'CV preview':'Pré-visualização do CV'} style={{'--sector-accent':d.accent,'--sector-pale':d.pale,'--sector-ink':d.ink,transform:`scale(${scale})`} as CSSProperties}><header className={`sector-header sector-header-${d.header}`}>{header}</header>{nodes(d.body)}{!data.profile.trim()&&!data.skills.trim()&&!data.languages.trim()&&!data.experiences.some(hasEntryContent)&&!data.education.some(hasEntryContent)&&<p className="preview-empty">{l.empty}</p>}</article></div>;
}
