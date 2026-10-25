import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { CVDocument, prepareFonts } from '../src/components/pdf-document';
import { emptyCV, models, type CVData } from '../src/lib/cv';

async function main() {
  const selectedModels=models.filter(model=>!process.env.QA_MODELS||process.env.QA_MODELS.split(',').includes(model));
  const directory = path.resolve('work/pdf-qa');
  await mkdir(directory, { recursive: true });
  prepareFonts(path.resolve('public/fonts').replaceAll('\\', '/'));
  const sample: CVData = {
    ...emptyCV(), name: 'João José Mucavele', role: 'Assistente de operações',
    email: 'candidato@exemplo.com', phone: '+258 84 000 0000', city: 'Maputo, Moçambique', website: 'linkedin.com/in/exemplo',
    profile: 'Profissional organizado, com experiência em operações e atendimento. Procuro contribuir para uma equipa que valorize a comunicação, a colaboração e a melhoria contínua.',
    experiences: [{ id: 'work-1', title: 'Assistente de operações', organisation: 'Organização de demonstração', period: '2022 - actual',
      description: 'Organização de documentos e apoio às actividades da equipa.\nCoordenação de pedidos e acompanhamento de fornecedores.\nPreparação de relatórios e melhoria dos processos de arquivo.' }],
    education: [{ id: 'study-1', title: 'Licenciatura em Gestão', organisation: 'Instituição de demonstração', period: '2018 - 2022', description: 'Projecto final sobre gestão de pequenas empresas.' }],
    skills: 'Microsoft Excel · Comunicação · Trabalho em equipa\nOrganização de documentos · Atendimento ao cliente',
    languages: 'Português - fluente\nInglês - intermédio\nChangana - língua materna',
  };
  for (const model of selectedModels) {
    const buffer = await renderToBuffer(<CVDocument data={{ ...sample, model }} />);
    await writeFile(path.join(directory, `${model}.pdf`), buffer);
    process.stdout.write(`${model}: ${buffer.length} bytes\n`);
  }
  const english: CVData = {...sample,cvLanguage:'en',role:'Operations assistant',profile:'I support administrative operations, organise documents and follow up requests. I value clear communication and collaboration.',experiences:[{...sample.experiences[0],title:'Operations assistant',organisation:'Example organisation',period:'2022 - present',description:'Organised documents and supported daily activities.\nFollowed up supplier requests and prepared reports.'}],education:[{...sample.education[0],title:'Degree in Management',organisation:'Example institution',description:'Final project on small business management.'}],skills:'Microsoft Excel, Document organisation, Teamwork',languages:'Portuguese - fluent\nEnglish - intermediate'};
  for(const model of selectedModels)await writeFile(path.join(directory, `en-${model}.pdf`),await renderToBuffer(<CVDocument data={{...english,model}}/>));
  await writeFile(path.join(directory,'en-long.pdf'),await renderToBuffer(<CVDocument data={{...english,experiences:[{...english.experiences[0],description:('Organised documents, followed up requests and coordinated administrative activities with the team. ').repeat(45)+' FINAL ENGLISH CONTENT.'}]}}/>));
  const paragraph = 'Organização e coordenação de processos administrativos, comunicação com fornecedores e preparação de relatórios de gestão. Atenção ao detalhe, planeamento e acompanhamento das actividades da equipa. ';
  const long = { ...sample, model: 'classico' as const, experiences: [
    { ...sample.experiences[0], description: paragraph.repeat(17) + ' FIM DA PRIMEIRA EXPERIÊNCIA.' },
    { ...sample.experiences[0], id: 'work-2', title: 'Estágio profissional', period: '2020 - 2022', description: paragraph.repeat(17) + ' FIM DA SEGUNDA EXPERIÊNCIA.' },
  ] };
  await writeFile(path.join(directory, 'long-cv.pdf'), await renderToBuffer(<CVDocument data={long} />));
  for (const model of selectedModels) {
    await writeFile(path.join(directory, `long-${model}.pdf`), await renderToBuffer(<CVDocument data={{ ...long, model }} />));
  }
  const portrait='data:image/jpeg;base64,'+(await readFile('public/images/demo-portrait-woman.jpg')).toString('base64');
  for(const model of (['tecnico','saude','engenharia','servico'] as const).filter(model=>selectedModels.includes(model)))await writeFile(path.join(directory,`long-photo-${model}.pdf`),await renderToBuffer(<CVDocument data={{...long,model,photo:portrait}}/>));
  await writeFile(path.join(directory, 'long-support.pdf'), await renderToBuffer(<CVDocument data={{ ...sample, skills: Array.from({ length: 60 }, (_, i) => `Competência ${i + 1} com descrição de demonstração.`).join('\n') + '\nFIM DAS COMPETÊNCIAS.' }} />));
  await writeFile(path.join(directory, 'sample.json'), JSON.stringify(sample, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
