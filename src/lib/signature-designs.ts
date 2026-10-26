/** Each entry owns a composition, not an industry recolouring of another design. */
export const signatureDesigns=[
 {id:'atlas',name:'Atlas',category:'Profissional',description:'Uma identidade forte, com espaço para o teu percurso.',detail:'Faixa lateral escura · Retrato editorial · Secções numeradas',accent:'#1B5153',pale:'#EDF3EF',ink:'#203C3C',areas:['administracao','contabilidade','logistica','projectos','agricultura'],tags:['administration','hr','accounting','logistics','community','agriculture','leadership'],sample:'executivo',portrait:'man'},
 {id:'aurora',name:'Aurora',category:'Primeiro emprego',description:'Formação e experiência, lado a lado.',detail:'Duas colunas equilibradas · Cabeçalho aberto · Competências no rodapé',accent:'#466954',pale:'#EAF0E6',ink:'#233D30',areas:['saude','educacao','hotelaria','vendas','projectos'],tags:['first-job','education','healthcare','nursing','hospitality','sales','community'],sample:'saude',portrait:'woman'},
 {id:'folio',name:'Fólio',category:'Criativo',description:'Uma apresentação editorial que deixa o conteúdo respirar.',detail:'Nome em grande escala · Retrato rectangular · Secções com margem editorial',accent:'#B94F36',pale:'#F8ECE4',ink:'#352D28',areas:['comunicacao','vendas','hotelaria','educacao'],tags:['design','communications','marketing','sales','hospitality','education'],sample:'criativo',portrait:'woman'},
 {id:'vertice',name:'Vértice',category:'Profissional',description:'Competências à vista. Experiência com estrutura.',detail:'Cabeçalho grafite · Competências primeiro · Datas numa coluna própria',accent:'#20636D',pale:'#E7F1F0',ink:'#24373E',areas:['tecnologia','engenharia','logistica','agricultura','contabilidade'],tags:['software','data','it-support','networks','telecom','cybersecurity','engineering','construction','electrical','maintenance','warehouse','transport','finance','project-management','agriculture'],sample:'tecnico',portrait:'man'},
] as const;
export type SignatureModel=(typeof signatureDesigns)[number]['id'];
export const signatureModels=signatureDesigns.map(design=>design.id);
export function signatureDesign(id:string){return signatureDesigns.find(design=>design.id===id);}
/** Long supporting text reflows rather than being trapped in a narrow column. */
export function compactSignature(data:{profile:string;skills:string;languages:string;education:{description:string}[];experiences:{description:string}[]}) {
 return data.profile.length<650&&data.skills.length+data.languages.length<600&&data.education.every(e=>e.description.length<650)&&data.experiences.every(e=>e.description.length<1400)&&data.education.length<=3&&data.experiences.length<=3;
}
