import { templates, templateAreas, templateMatchesArea, areasForTemplate, newTemplateIds } from './templates.ts';
import { industryVariant } from './industry-catalogue.ts';
import { uiEnglish } from './ui-en.ts';
import type { Model } from './cv.ts';

export const templateStyles = ['Todos', 'Novos', 'Profissional', 'Criativo', 'Primeiro emprego'] as const;
export type TemplateFilters = { area: string; style: string; query: string };
export const defaultTemplateFilters: TemplateFilters = { area: 'all', style: 'Todos', query: '' };
import { templateTags, templateTagById, tagLayoutBonus, type TemplateTag } from './template-taxonomy.ts';
function fold(text:string){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function tokens(text:string){return fold(text).match(/[a-z0-9]+/g)||[];}
const stopWords=new Set(['a','o','as','os','de','da','do','das','dos','e','em','para','com','and','the','of','for','an']);
function queryTokens(query:string){return [...new Set(tokens(query.slice(0,100)).filter(word=>!stopWords.has(word)))];}
const tagWords=new Map(templateTags.map(tag=>[tag.id,new Set(tokens([tag.pt,tag.en,...tag.aliases].join(' ')))]));
const searchIndex=templates.map(template=>{
 const variant=industryVariant(template.id);
 const areas=areasForTemplate(template.id);
 return {template,name:new Set(tokens(template.name)),words:new Set(tokens([template.name,template.description,template.detail,template.category,variant?.industry.role||'',variant?.layout.en||'',...areas.flatMap(area=>[area.label,uiEnglish[area.label]||'']),...[template.name,template.description,template.detail,template.category].map(value=>uiEnglish[value]||'')].join(' ')))};
});
/** A single edit or adjacent transposition; never fuzz short acronyms. */
function oneEdit(a:string,b:string){
 if(a.length<5||b.length<5||Math.abs(a.length-b.length)>1)return false;
 if(a.length===b.length){const different=[];for(let i=0;i<a.length;i++)if(a[i]!==b[i])different.push(i);return different.length===1||(different.length===2&&different[1]===different[0]+1&&a[different[0]]===b[different[1]]&&a[different[1]]===b[different[0]]);}
 const shorter=a.length<b.length?a:b,longer=a.length<b.length?b:a;let i=0,j=0,edits=0;
 while(i<shorter.length&&j<longer.length){if(shorter[i]===longer[j]){i++;j++;}else{if(++edits>1)return false;j++;}}
 return true;
}
function wordMatch(term:string,words:Set<string>,fuzzy=false){
 if(words.has(term))return 3;
 if(term.length>=4&&[...words].some(word=>word.startsWith(term)))return 2;
 if(fuzzy&&term.length>=5&&[...words].some(word=>oneEdit(term,word)))return 1;
 return 0;
}
function tagMatch(tagId:string,terms:string[],fuzzy=false){const words=tagWords.get(tagId)!;return terms.reduce((sum,term)=>sum+wordMatch(term,words,fuzzy),0);}
export function readTemplateFilters(params: URLSearchParams): TemplateFilters {
  const area = params.get('area') || 'all', style = params.get('estilo') || 'Todos';
  return {
    area: area === 'gerais' || templateAreas.some(a => a.id === area) ? area : 'all',
    style: templateStyles.some(s => s === style) ? style : 'Todos',
    query: (params.get('q') || '').slice(0, 100),
  };
}
export function templateLibraryHref(filters: TemplateFilters) {
  const params = new URLSearchParams();
  if (filters.area !== 'all') params.set('area', filters.area);
  if (filters.style !== 'Todos') params.set('estilo', filters.style);
  if (filters.query.trim()) params.set('q', filters.query.trim());
  return '/modelos' + (params.size ? '?' + params.toString() : '');
}
export function safeTemplateReturn(value: string | null) {
  if (!value || !value.startsWith('/modelos')) return '/modelos';
  const url = new URL(value, 'https://cvmais.win');
  if (url.origin !== 'https://cvmais.win' || url.pathname !== '/modelos') return '/modelos';
  return templateLibraryHref(readTemplateFilters(url.searchParams));
}
export function templateEditorHref(model: Model, filters: TemplateFilters) {
  const area = filters.area === 'all' || filters.area === 'gerais' ? areasForTemplate(model)[0].id : filters.area;
  const params = new URLSearchParams({ modelo: model, area, biblioteca: templateLibraryHref(filters) });
  return '/criar-cv?' + params.toString();
}
export function discoverTemplateResults(filters:TemplateFilters){
 const terms=queryTokens(filters.query);
 const candidates=searchIndex.filter(({template:t})=>templateMatchesArea(t.id,filters.area)&&(filters.style==='Todos'||(filters.style==='Novos'?newTemplateIds.includes(t.id):t.category===filters.style)));
 if(!filters.query.trim())return {items:candidates.map(c=>c.template),approximate:false};
 if(!terms.length)return {items:[],approximate:false};
 function rank(fuzzy:boolean){return candidates.map(({template,name,words},index)=>{
   let total=0;
   for(const term of terms){
     let score=Math.max(wordMatch(term,name,fuzzy)*30,wordMatch(term,words,fuzzy)*8);
     for(const id of template.tagIds){const tag=templateTagById.get(id)!;const match=wordMatch(term,tagWords.get(id)!,fuzzy);if(match)score=Math.max(score,match*16+tagLayoutBonus(template.id,tag));}
     if(!score)return {template,score:0,index};
     total+=score;
   }
   return {template,score:total,index};
 }).filter(result=>result.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).map(result=>result.template);}
 const exact=rank(false);
 return exact.length?{items:exact,approximate:false}:{items:rank(true),approximate:true};
}
export function discoverTemplates(filters:TemplateFilters){return discoverTemplateResults(filters).items;}
export function visibleTemplateTags(model:Model,query:string):TemplateTag[]{
 const template=templates.find(t=>t.id===model)!;const terms=queryTokens(query);
 return template.tagIds.map((id,index)=>({tag:templateTagById.get(id)!,score:tagMatch(id,terms,true),index})).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,3).map(item=>item.tag);
}
/** Inline suggestions use real result counts under the current explicit filters. */
export function templateTagSuggestions(filters:TemplateFilters,locale:'pt'|'en'){
 const terms=queryTokens(filters.query);
 const starters=['telecom','nursing','accounting','logistics','first-job'];
 if(filters.query.trim()&&(!terms.length||terms.some(term=>term.length<2)))return [];
 const candidates=templateTags.map((tag,index)=>{
   if([tag.pt,tag.en].some(label=>fold(label)===fold(filters.query.trim())))return {tag,index,score:0};
   if(!filters.query.trim())return {tag,index,score:starters.includes(tag.id)?100-starters.indexOf(tag.id):0};
   const words=tagWords.get(tag.id)!;
   let score=0;
   for(const term of terms){const match=words.has(term)?3:term.length>=3&&[...words].some(word=>word.startsWith(term))?2:wordMatch(term,words,true);if(!match)return {tag,index,score:0};score+=match;}
   return {tag,index,score};
 }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.index-b.index);
 return candidates.map(({tag})=>{const label=locale==='en'?tag.en:tag.pt;return {id:tag.id,label,count:discoverTemplates({...filters,query:label}).length};}).filter(item=>item.count>0).slice(0,5);
}
export function resultsOutsideTemplateFilters(filters:TemplateFilters){
 if(!filters.query.trim()||(filters.area==='all'&&filters.style==='Todos'))return 0;
 return discoverTemplates({...filters,area:'all',style:'Todos'}).length;
}
