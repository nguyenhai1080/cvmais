import React from 'react';
import {renderToBuffer} from '@react-pdf/renderer';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {CVDocument,prepareFonts} from '../src/components/pdf-document';
import {milestoneDesigns} from '../src/lib/milestone-designs';
import {sectorDesigns} from '../src/lib/sector-designs';
import {templateSample} from '../src/lib/templates';
const directory=path.resolve('work/sector-qa');await mkdir(directory,{recursive:true});
prepareFonts(path.resolve('public/fonts').replaceAll('\\','/'));
const selected=[...sectorDesigns,...milestoneDesigns].filter(d=>!process.env.QA_MODELS||process.env.QA_MODELS.split(',').includes(d.id));
await writeFile(path.join(directory,'manifest.json'),JSON.stringify(selected.map(d=>d.id)));
for(const d of selected){
 const photo='data:image/jpeg;base64,'+(await readFile(`public/images/demo-portrait-${d.portrait}.jpg`)).toString('base64');
 const sample={...templateSample(d.id),photo};
 const paragraph='Planeamento de actividades, organização de informação e acompanhamento de tarefas com a equipa. Documentação clara e comunicação com participantes. ';
 const fixtures={
  short:sample,
  'no-photo':{...sample,photo:''},
  en:{...sample,cvLanguage:'en' as const},
  long:{...sample,experiences:[...sample.experiences,{id:'long',title:'Experiência adicional',organisation:'Organização de exemplo',period:'2015 - 2019',description:paragraph.repeat(26)+' END-CAREER-'+d.id}],education:[...sample.education,{id:'last-study',title:'Formação complementar',organisation:'Instituição de exemplo',period:'2014',description:'END-STUDY-'+d.id}]},
  support:{...sample,skills:Array.from({length:48},(_,i)=>`Competência ${i+1}: documentação e acompanhamento das actividades.`).join('\n')+'\nEND-SKILLS-'+d.id,languages:'Português - fluente\nInglês - intermédio\nEND-LANGUAGES-'+d.id},
  sparse:{...sample,photo:'',role:'',phone:'',website:'',profile:'',experiences:[],skills:'',languages:''},
 };
 for(const [kind,data] of Object.entries(fixtures)){if(process.env.QA_CASE&&process.env.QA_CASE!==kind)continue;const bytes=await renderToBuffer(<CVDocument data={data}/>);await writeFile(path.join(directory,`${d.id}-${kind}.pdf`),bytes);}
 await writeFile(path.join(directory,`${d.id}.json`),JSON.stringify(sample));console.log(`${d.id}: 6 PDF fixtures generated`);
}
