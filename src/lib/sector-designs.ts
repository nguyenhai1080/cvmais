import type { CVData } from './cv';
export type SectorBlock='profile'|'work'|'study'|'skills'|'languages'|'contact';
export type SectorNode=SectorBlock|{columns:readonly (readonly SectorNode[])[];widths:readonly number[];tone?:'panel'|'rule'};
// Deliberately authored page structures. Colour and sector names are not layout identifiers.
export const sectorDesigns=[
 {id:'balanco',name:'Balanço',area:'contabilidade',category:'Profissional',accent:'#30445B',pale:'#EEF2F6',ink:'#243447',portrait:'man',header:'ledger',entry:'ledger',label:'ledger',serif:false,
  description:'Documentação financeira, com uma leitura rigorosa.',detail:'Cabeçalho em duas metades · Datas em coluna · Formação em rodapé',enDescription:'Financial experience with a precise reading order.',enDetail:'Split masthead · Date column · Education at the foot',
  tags:['accounting','finance','data'],body:['profile',{columns:[['work'],['skills','languages']],widths:[68,32],tone:'rule'},'study']},
 {id:'circuito',name:'Circuito',area:'tecnologia',category:'Profissional',accent:'#167081',pale:'#EDF6F7',ink:'#203640',portrait:'man',header:'terminal',entry:'stack',label:'code',serif:false,
  description:'Uma base técnica visível antes do percurso.',detail:'Masthead técnico · Competências em faixa · Contactos à direita',enDescription:'Technical foundations before career history.',enDetail:'Technical masthead · Skills band · Right contact column',
  tags:['software','data','it-support','networks','telecom','cybersecurity'],body:['skills',{columns:[['profile','work'],['contact','study','languages']],widths:[69,31],tone:'panel'}]},
 {id:'cuidado',name:'Cuidado',area:'saude',category:'Profissional',accent:'#306B60',pale:'#EFF6F1',ink:'#29463F',portrait:'woman',header:'clinical',entry:'card',label:'soft',serif:false,
  description:'Qualificações e prática de cuidados em módulos claros.',detail:'Retrato lateral amplo · Formação primeiro · Competências em dois blocos',enDescription:'Qualifications and care experience in clear modules.',enDetail:'Wide side portrait · Education first · Two supporting blocks',
  tags:['healthcare','nursing'],body:['profile','study','work',{columns:[['skills'],['languages']],widths:[60,40],tone:'panel'}]},
 {id:'catedra',name:'Cátedra',area:'educacao',category:'Primeiro emprego',accent:'#62527D',pale:'#F3F0F7',ink:'#352E42',portrait:'woman',header:'academic',entry:'date-right',label:'academic',serif:true,
  description:'Formação e prática pedagógica com espaço para explicar.',detail:'Identidade centrada serifada · Contactos em margem · Formação dominante',enDescription:'Room to explain education and teaching practice.',enDetail:'Centred serif identity · Margin contacts · Education-led body',
  tags:['education','first-job','community'],body:[{columns:[['contact'],['profile']],widths:[29,71],tone:'rule'},'study','work',{columns:[['languages'],['skills']],widths:[35,65]}]},
 {id:'prumo',name:'Prumo',area:'engenharia',category:'Profissional',accent:'#35516E',pale:'#EDF1F4',ink:'#273747',portrait:'man',header:'blueprint',entry:'ledger',label:'margin',serif:false,
  description:'Informação técnica organizada por faixas de leitura.',detail:'Identidade com esquadria · Títulos na margem · Percurso linear',enDescription:'Technical information organised into reading bands.',enDetail:'Framed identity · Margin section labels · Linear career history',
  tags:['engineering','construction','electrical','maintenance','telecom','networks'],body:['contact','profile','skills','work','study','languages']},
 {id:'travessia',name:'Travessia',area:'logistica',category:'Profissional',accent:'#81612D',pale:'#F8F3E8',ink:'#3F392C',portrait:'man',header:'dispatch',entry:'timeline',label:'route',serif:false,
  description:'Operações e percurso ligados por uma linha contínua.',detail:'Barra de contactos · Resumo e competências lado a lado · Linha do tempo',enDescription:'Operations and career history connected by a continuous line.',enDetail:'Contact strip · Summary beside skills · Career timeline',
  tags:['logistics','warehouse','transport'],body:[{columns:[['profile'],['skills']],widths:[57,43],tone:'panel'},'work',{columns:[['study'],['languages']],widths:[72,28]}]},
 {id:'impulso',name:'Impulso',area:'vendas',category:'Profissional',accent:'#994D3A',pale:'#FAEFE9',ink:'#43352F',portrait:'woman',header:'spotlight',entry:'date-right',label:'pill',serif:false,
  description:'Apresentação comercial com o percurso em primeiro plano.',detail:'Cabeçalho de contraste · Perfil destacado · Coluna de apoio à direita',enDescription:'A commercial introduction with career history in focus.',enDetail:'Contrast masthead · Featured profile · Right support column',
  tags:['sales','customer-service','marketing'],body:['profile','skills',{columns:[['work'],['study','languages']],widths:[70,30],tone:'rule'}]},
 {id:'estancia',name:'Estância',area:'hotelaria',category:'Profissional',accent:'#7B5964',pale:'#F7F0F2',ink:'#42363C',portrait:'woman',header:'concierge',entry:'card',label:'hospitality',serif:true,
  description:'Acolhimento, línguas e experiência com um ritmo sereno.',detail:'Retrato vertical na margem · Línguas antes do percurso · Faixas editoriais',enDescription:'Hospitality, languages and experience with a calm rhythm.',enDetail:'Portrait in the margin · Languages before career · Editorial bands',
  tags:['hospitality','tourism','food-service','customer-service'],body:[{columns:[['languages','profile'],['work','study']],widths:[32,68],tone:'rule'},'skills']},
 {id:'prisma',name:'Prisma',area:'comunicacao',category:'Criativo',accent:'#B34F3D',pale:'#FBEFE7',ink:'#392E2B',portrait:'woman',header:'magazine',entry:'card',label:'editorial',serif:true,
  description:'Uma composição de revista para o teu percurso criativo.',detail:'Nome em grande escala · Perfil em margem · Experiência em cartões',enDescription:'A magazine composition for a creative career.',enDetail:'Large-scale identity · Margin profile · Experience cards',
  tags:['communications','marketing','design'],body:[{columns:[['profile'],['contact','skills']],widths:[61,39],tone:'panel'},'work',{columns:[['study'],['languages']],widths:[64,36]}]},
 {id:'campo',name:'Campo',area:'agricultura',category:'Profissional',accent:'#4C6C3B',pale:'#F0F4E8',ink:'#35412D',portrait:'man',header:'field',entry:'stack',label:'field',serif:false,
  description:'Prática de campo, formação e organização de actividades.',detail:'Identidade assimétrica · Formação junto do perfil · Competências em base',enDescription:'Field practice, training and activity coordination.',enDetail:'Asymmetric identity · Education beside profile · Skills at the base',
  tags:['agriculture','maintenance','logistics'],body:[{columns:[['profile'],['study']],widths:[53,47],tone:'panel'},'work',{columns:[['skills'],['languages']],widths:[68,32],tone:'rule'}]},
 {id:'elo',name:'Elo',area:'projectos',category:'Profissional',accent:'#2B6F76',pale:'#EAF5F4',ink:'#244145',portrait:'woman',header:'community',entry:'timeline',label:'project',serif:false,
  description:'Actividades comunitárias e colaboração com contexto.',detail:'Retrato e identidade em blocos · Percurso na coluna principal · Perfil lateral',enDescription:'Community activities and collaboration with context.',enDetail:'Block portrait masthead · Main career column · Side profile',
  tags:['community','project-management','administration'],body:[{columns:[['profile','languages'],['work','skills']],widths:[31,69],tone:'panel'},'study']},
 {id:'pauta',name:'Pauta',area:'administracao',category:'Profissional',accent:'#2C6075',pale:'#EFF5F7',ink:'#2A404B',portrait:'woman',header:'index',entry:'date-right',label:'index',serif:false,
  description:'Rotinas administrativas, com uma hierarquia fácil de seguir.',detail:'Cabeçalho em moldura · Perfil com apoio lateral · Formação e línguas em rodapé',enDescription:'Administrative experience with an easy-to-follow hierarchy.',enDetail:'Framed masthead · Summary with side support · Education and languages footer',
  tags:['administration','hr','customer-service'],body:[{columns:[['profile'],['skills']],widths:[66,34],tone:'rule'},'work',{columns:[['study'],['languages']],widths:[61,39],tone:'panel'}]},
] as const;
export type SectorModel=(typeof sectorDesigns)[number]['id'];
export const sectorModels=sectorDesigns.map(d=>d.id);
export function sectorDesign(id:string){return sectorDesigns.find(d=>d.id===id);}
export function sectorCompact(data:CVData){
 const values=[data.profile,data.skills,data.languages,...data.experiences.flatMap(e=>[e.title,e.organisation,e.description]),...data.education.flatMap(e=>[e.title,e.organisation,e.description])];
 return values.reduce((sum,v)=>sum+v.length,0)<2900&&data.skills.length+data.languages.length<620&&data.experiences.length<=3&&data.education.length<=2&&values.every(v=>v.length<1000);
}
export function sectorBlocks(nodes:readonly SectorNode[]):SectorBlock[]{return nodes.flatMap(node=>typeof node==='string'?[node]:node.columns.flatMap(column=>sectorBlocks(column)));}
