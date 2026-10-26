import { hasEntryContent, type CVData } from './cv.ts';
export type ReviewIssue = { kind:'placeholder'|'email'|'contact'|'name'|'content'|'education'; target:string; label:string; entry?:number; detail?:string };
// Possible template markers only. This is not a claim about accuracy or hiring outcomes.
export function hasSampleMarker(text:string):boolean{return /\[[^\]\n]{1,100}\]/u.test(text);}
export function reviewCV(data:CVData):ReviewIssue[]{
 const issues:ReviewIssue[]=[];
 const fields=[['name','Nome completo'],['role','Título profissional'],['email','Email'],['phone','Telemóvel'],['city','Localidade'],['website','LinkedIn ou portefólio (opcional)'],['profile','Perfil profissional'],['skills','Competências'],['languages','Línguas']] as const;
 for(const [key,label]of fields)if(hasSampleMarker(data[key]))issues.push({kind:'placeholder',target:`cv-${key}`,label});
 for(const kind of ['experiences','education'] as const)data[kind].forEach((entry,i)=>{for(const [field,detail]of [['title',kind==='experiences'?'Cargo / função':'Curso / qualificação'],['organisation',kind==='experiences'?'Organização':'Instituição'],['period','Período'],['description',kind==='experiences'?'Responsabilidades e resultados':'Informação adicional (opcional)']] as const)if(hasSampleMarker(entry[field]))issues.push({kind:'placeholder',target:`${kind}-${entry.id}-${field}`,label:kind==='experiences'?'Experiência':'Formação',entry:i+1,detail});});
 if(!data.name.trim())issues.push({kind:'name',target:'cv-name',label:'Nome completo'});
 if(!data.profile.trim()&&!data.skills.trim()&&!data.languages.trim()&&!data.experiences.some(hasEntryContent)&&!data.education.some(hasEntryContent))issues.push({kind:'content',target:'cv-profile',label:'Perfil profissional'});
 if(data.email.trim()&&!hasSampleMarker(data.email)&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))issues.push({kind:'email',target:'cv-email',label:'Email'});
 if(!data.email.trim()&&!data.phone.trim())issues.push({kind:'contact',target:'cv-email',label:'Email / Telemóvel'});
 if(!data.education.some(entry=>entry.title.trim()||entry.organisation.trim()))issues.push({kind:'education',target:'formacao',label:'Formação académica'});
 return issues;
}
