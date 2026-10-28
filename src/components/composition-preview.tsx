'use client';
import {useEffect,useRef,useState,type CSSProperties,type ReactNode} from 'react';
import {hasEntryContent,type CVData} from '../lib/cv';
import {compositionBlocks,compositionDesign,compositionCompact,compositionPresent,type CompositionNode,type CompositionBlock} from '../lib/milestone-designs';
import {labelsForCV} from '../lib/cv-language';
import {contacts} from '../lib/resume-design';
export default function CompositionPreview({data}:{data:CVData}){
 const d=compositionDesign(data.model)!;const l=labelsForCV(data);const compact=compositionCompact(data);
 const shell=useRef<HTMLDivElement>(null),paper=useRef<HTMLElement>(null);const [size,setSize]=useState({width:595,height:842});
 useEffect(()=>{const update=()=>{if(shell.current&&paper.current)setSize({width:Math.min(595,shell.current.clientWidth),height:paper.current.offsetHeight});};const observer=new ResizeObserver(update);if(shell.current)observer.observe(shell.current);if(paper.current)observer.observe(paper.current);update();return()=>observer.disconnect();},[]);
 const labels={profile:l.profile,work:l.work,study:l.study,skills:l.skills,languages:l.languages,contact:data.cvLanguage==='en'?'Contact':'Contacto'};
 function block(kind:CompositionBlock,width:number):ReactNode{
  if(!compositionPresent(kind,data))return null;
  if(kind==='identity')return <div key={kind} className={`composition-identity composition-name-${d.nameStyle}`} style={{fontSize:!compact?28:width<200?24:d.nameStyle==='display'?39:d.nameStyle==='serif'?33:30}}><h2>{data.name.trim()||l.name}</h2>{data.role.trim()&&<p>{data.role.trim()}</p>}</div>;
  if(kind==='portrait')return <div key={kind} className={`composition-portrait composition-photo-${d.photoShape}`}><img src={data.photo} alt={data.cvLanguage==='en'?'Candidate portrait':'Fotografia do candidato'}/></div>;
  const entries=kind==='work'?data.experiences:kind==='study'?data.education:null;
  const value=kind==='contact'?contacts(data).map(c=>c.text).join('\n'):kind==='profile'?data.profile:kind==='skills'?data.skills:kind==='languages'?data.languages:'';
  const side=compact&&['ledger','timeline'].includes(d.entry)&&width>=240;
  return <section key={kind} className={`composition-block composition-heading-${d.heading}${compact&&d.heading==='margin'&&width>=330?' composition-margin':''}`}><h3>{labels[kind]}</h3><div className="composition-content">{entries?entries.filter(hasEntryContent).map(e=><div key={e.id} className={`composition-entry composition-entry-${compact?d.entry:'stack'}${side?' composition-entry-side':''}`}>{side&&e.period.trim()&&<div className="composition-date-column">{e.period.trim()}</div>}<div className="composition-entry-body"><div className="composition-entry-heading">{e.title.trim()&&<h4>{e.title.trim()}</h4>}{e.organisation.trim()&&<p className="composition-org">{e.organisation.trim()}</p>}{!side&&e.period.trim()&&<p className="composition-date">{e.period.trim()}</p>}</div>{e.description.trim()&&<p className="composition-text">{e.description.trim()}</p>}</div></div>):<p className="composition-text">{value.trim()}</p>}</div></section>;
 }
 function present(node:CompositionNode):boolean{return typeof node==='string'?compositionPresent(node,data):node.columns.some(c=>c.some(present));}
 function nodes(items:readonly CompositionNode[],width=523,prefix='page'):ReactNode{return items.map((node,i)=>{
  if(typeof node==='string')return block(node,width);
  const columns=node.columns.map((column,index)=>({column,index})).filter(({column})=>column.some(present));if(!columns.length)return null;
  if(!compact)return <div key={`${prefix}-${i}`} className="composition-stacked">{columns.map(({column,index})=><div key={index}>{nodes(column,width,`${prefix}-${i}-${index}`)}</div>)}</div>;
  const tone=node.tone||'plain',total=columns.reduce((n,c)=>n+node.widths[c.index],0),available=width-18*(columns.length-1);
  return <div key={`${prefix}-${i}`} className={`composition-grid composition-tone-${tone}`} style={{gridTemplateColumns:columns.map(c=>`minmax(0,${node.widths[c.index]}fr)`).join(' ')}}>{columns.map(({column,index},order)=>{const padded=['band','accent'].includes(tone)||(tone==='rail'&&order===0)||(tone==='panel'&&order===columns.length-1)||tone==='outline';const rule=tone==='rule'&&order>0;const childWidth=available*node.widths[index]/total-(padded?24:rule?12:0);const dark=tone==='accent'||tone==='rail'&&order===0;return <div key={index} className={`composition-column${dark?' composition-dark':''}`}>{nodes(column,childWidth,`${prefix}-${i}-${index}`)}</div>;})}</div>;
 });}
 const scale=size.width/595;
 return <div className="composition-shell" ref={shell} style={{height:Math.ceil(size.height*scale)}}><article ref={paper} lang={data.cvLanguage==='en'?'en':'pt-MZ'} aria-label={data.cvLanguage==='en'?'CV preview':'Pré-visualização do CV'} className={`composition-paper composition-${d.id}${compact?'':' composition-long'}`} style={{'--composition-accent':d.accent,'--composition-pale':d.pale,'--composition-ink':d.ink,transform:`scale(${scale})`} as CSSProperties}>{nodes(compact?d.layout:compositionBlocks(d.layout))}</article></div>;
}
