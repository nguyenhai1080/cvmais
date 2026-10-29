'use client';
import { useEffect, useRef, useState } from 'react';
import {createPortal} from 'react-dom';
import { X } from 'lucide-react';
import { useUILanguage } from '@/lib/ui-language';
import { templates, templateAreas, areasForTemplate } from '@/lib/templates';
import { industryVariant } from '@/lib/industry-catalogue';
import {discoverTemplates,defaultTemplateFilters} from '@/lib/template-discovery';
import type { Model } from '@/lib/cv';

export default function EditorTemplatePicker({model,disabled,onChange}:{model:Model;disabled:boolean;onChange:(id:Model)=>void}) {
 const {translate:ui}=useUILanguage();
 const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 const dialog=useRef<HTMLDialogElement>(null);
 const [area,setArea]=useState('all');
 const [query,setQuery]=useState('');
 const matches=discoverTemplates({...defaultTemplateFilters,area,query});
 const current=templates.find(template=>template.id===model)!;
 function open(){setArea(industryVariant(model)?.industry.id||areasForTemplate(model)[0]?.id||'all');setQuery('');dialog.current?.showModal();}
 return <><button id="cv-model" className="button outline template-picker-trigger" type="button" disabled={disabled} aria-haspopup="dialog" onClick={open}><span>{ui(current.name)}</span><span>{ui('Mudar modelo')}</span></button>
 {mounted&&createPortal(<dialog ref={dialog} className="editor-template-dialog" aria-labelledby="editor-template-title"><div className="template-picker-heading"><h2 id="editor-template-title">{ui('Escolher modelo')}</h2><button className="icon-button" type="button" aria-label={ui('Fechar pré-visualização')} onClick={()=>dialog.current?.close()}><X size={22}/></button></div>
 <p>{ui('Muda o estilo sem substituir o texto, a fotografia ou o idioma do teu CV.')}</p>
 <label htmlFor="editor-template-area">{ui('Área profissional')}</label><select id="editor-template-area" value={area} onChange={event=>setArea(event.target.value)}><option value="all">{ui('Todas as áreas')}</option>{templateAreas.map(item=><option key={item.id} value={item.id}>{ui(item.label)}</option>)}</select>
 <label htmlFor="editor-template-search">{ui('Procurar modelos')}</label><input id="editor-template-search" type="search" value={query} maxLength={100} onChange={event=>setQuery(event.target.value)} placeholder={ui('Ex.: enfermagem, programador, hotelaria…')}/>
 <p role="status">{matches.length} {ui('modelos disponíveis')}</p>
 {!matches.length&&<div><p>{ui('Nenhum modelo corresponde a esta pesquisa nesta área.')}</p><button className="button outline" type="button" onClick={()=>{setArea('all');setQuery('');}}>{ui('Ver todos os modelos')}</button></div>}
 {industryVariant(model)&&<p className="editor-legacy-model" role="status">{ui("O teu modelo anterior foi mantido. Podes continuar a usá-lo ou escolher uma nova composição sem perder conteúdo.")}</p>}<div className="editor-template-options">{matches.map(template=><button type="button" key={template.id} disabled={disabled} aria-pressed={model===template.id} onClick={()=>{onChange(template.id);dialog.current?.close();}}><img src={`/template-previews/${template.id}.png?v=compositions-v7`} alt="" width={595} height={842} loading="lazy"/><strong>{ui(template.name)}</strong><span>{ui(template.detail)}</span><span>{ui(model===template.id?'Modelo actual':'Usar este modelo')}</span></button>)}</div>
 </dialog>,document.body)}</>;
}
