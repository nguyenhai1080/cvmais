import { signatureDesign } from './signature-designs.ts';
import { designModel, industryVariant } from './industry-catalogue.ts';

export type TemplateTag = { id: string; pt: string; en: string; aliases: string[]; preferred?: string[] };
// Editorial suitability tags, not claims about the demonstration candidate's qualifications.
// Keep telecommunications separate from communications/marketing; short acronyms match whole words.
export const templateTags: TemplateTag[] = [
 {id:'administration',pt:'Administração',en:'Administration',aliases:['administrativo','administrativa','administracao','administration','office assistant','assistente administrativo','secretaria','secretariado','escritorio','office management']},
 {id:'hr',pt:'Recursos humanos',en:'Human resources',aliases:['recursos humanos','human resources','HR','RH','recrutamento','recruitment','recruiter','talent acquisition']},
 {id:'accounting',pt:'Contabilidade',en:'Accounting',aliases:['contabilidade','contabilista','contabilistico','contabilistica','accounting','accountant','bookkeeping','auditoria','auditor','audit','tax','fiscalidade']},
 {id:'finance',pt:'Finanças',en:'Finance',aliases:['financas','finance','financial analyst','financeiro','financeira','banking','banca','tesouraria','treasury','budget','orcamento']},
 {id:'software',pt:'Desenvolvimento de software',en:'Software development',aliases:['software','developer','programador','programadora','programacao','desenvolvimento web','web development','software engineer','frontend','front end','backend','back end','full stack','JavaScript','Python','React'],preferred:['tecnico','minimalista']},
 {id:'data',pt:'Dados e análise',en:'Data and analytics',aliases:['dados','data analyst','data science','data engineer','analista de dados','analytics','analise de dados','SQL','Power BI','business intelligence','machine learning'],preferred:['tecnico','minimalista']},
 {id:'it-support',pt:'Suporte informático',en:'IT support',aliases:['IT','ICT','TI','TIC','informatica','information technology','tecnologias de informacao','IT support','helpdesk','help desk','service desk','suporte informatico','technical support','systems administrator','administrador de sistemas']},
 {id:'networks',pt:'Redes e infraestrutura',en:'Networks and infrastructure',aliases:['redes','network','networks','networking','network engineer','engenheiro de redes','infraestrutura','infrastructure','routing','switching','Cisco','TCP IP','LAN','WAN','NOC'],preferred:['tecnico','engenharia']},
 {id:'telecom',pt:'Telecomunicações',en:'Telecommunications',aliases:['telecom','telecoms','telecommunication','telecommunications','telecomunicacao','telecomunicacoes','telecomunicacion','engenheiro de telecomunicacoes','telecommunications engineer','telecom engineer','tecnico de telecomunicacoes','fibra optica','fiber optic','fibre optic','FTTH','FTTx','radiofrequencia','radio frequency','RF','RAN','4G','5G','GSM','LTE','transmissao','telecom transmission'],preferred:['tecnico','engenharia','moderno']},
 {id:'cybersecurity',pt:'Cibersegurança',en:'Cybersecurity',aliases:['cybersecurity','cyber security','ciberseguranca','seguranca informatica','information security','SOC analyst','analista SOC','penetration testing','pentest'],preferred:['tecnico','minimalista']},
 {id:'healthcare',pt:'Saúde e cuidados',en:'Healthcare',aliases:['saude','health','healthcare','health care','care','cuidados','medico','medica','doctor','medical','clinica','clinic','pharmacy','farmacia','farmaceutico']},
 {id:'nursing',pt:'Enfermagem',en:'Nursing',aliases:['enfermagem','enfermeiro','enfermeira','nurse','nursing','patient care','cuidados de enfermagem']},
 {id:'education',pt:'Ensino e formação',en:'Teaching and training',aliases:['educacao','education','professor','professora','docente','teacher','teaching','ensino','formador','formadora','trainer','training','pedagogia','tutor']},
 {id:'engineering',pt:'Engenharia',en:'Engineering',aliases:['engenharia','engineering','engenheiro','engenheira','engineer','tecnico','technician'],preferred:['engenharia','tecnico']},
 {id:'construction',pt:'Construção e obras',en:'Construction',aliases:['construcao','construction','civil engineering','engenharia civil','obras','site engineer','quantity surveyor','AutoCAD','BIM','topografia','surveying'],preferred:['engenharia']},
 {id:'electrical',pt:'Electricidade e electrónica',en:'Electrical and electronics',aliases:['electricidade','eletricidade','electrical','electrician','electricista','eletricista','electronics','electronica','eletronica','electrical engineer','engenheiro electrotecnico'],preferred:['engenharia','tecnico']},
 {id:'maintenance',pt:'Manutenção técnica',en:'Technical maintenance',aliases:['manutencao','maintenance','mecanica','mechanical','mechanic','mecanico','industrial','equipment','equipamentos','repair','reparacao'],preferred:['engenharia']},
 {id:'logistics',pt:'Logística',en:'Logistics',aliases:['logistica','logistics','supply chain','cadeia de abastecimento','procurement','compras','aprovisionamento','distribuicao','distribution']},
 {id:'warehouse',pt:'Armazém e inventário',en:'Warehouse and inventory',aliases:['armazem','warehouse','inventory','inventario','stock','stock control','gestao de stocks','picking','storekeeper','fiel de armazem']},
 {id:'transport',pt:'Transportes',en:'Transport',aliases:['transportes','transport','transportation','motorista','driver','fleet','frota','delivery','entregas','shipping','freight']},
 {id:'sales',pt:'Vendas e comercial',en:'Sales',aliases:['vendas','sales','vendedor','vendedora','comercial','sales representative','retail','retalho','business development','account manager']},
 {id:'customer-service',pt:'Atendimento ao cliente',en:'Customer service',aliases:['atendimento','customer service','customer support','apoio ao cliente','call center','call centre','contact center','contact centre','customer success','CRM']},
 {id:'hospitality',pt:'Hotelaria e recepção',en:'Hospitality and reception',aliases:['hotelaria','hospitality','hotel','recepcionista','rececionista','receptionist','front desk','recepcao','rececao','reservas','reservations','guest relations']},
 {id:'tourism',pt:'Turismo',en:'Tourism',aliases:['turismo','tourism','travel','viagens','tour guide','guia turistico','agencia de viagens','travel agent']},
 {id:'food-service',pt:'Restauração e cozinha',en:'Food service',aliases:['restauracao','restaurant','restaurante','chef','cozinheiro','cozinheira','cozinha','cooking','waiter','waitress','empregado de mesa','catering']},
 {id:'marketing',pt:'Marketing digital',en:'Digital marketing',aliases:['marketing','digital marketing','marketing digital','SEO','SEM','social media','redes sociais','content marketing','growth marketing','campanhas','campaigns']},
 {id:'communications',pt:'Comunicação e relações públicas',en:'Communications and PR',aliases:['comunicacao','comunicacoes','communication','communications','comms','relacoes publicas','public relations','PR','jornalismo','journalism','journalist','jornalista','copywriter','redaccao','redacao','conteudos','content writer','publicidade','advertising']},
 {id:'design',pt:'Design e criatividade',en:'Design and creativity',aliases:['design','designer','UX','UI','UX UI','graphic design','design grafico','visual designer','creative','criativo','criativa','portfolio','portefolio','Figma']},
 {id:'agriculture',pt:'Agricultura e agronomia',en:'Agriculture and agronomy',aliases:['agricultura','agriculture','agricola','agronomia','agronomy','agronomo','agronoma','farming','farmer','producao agricola','irrigacao','irrigation','agropecuaria','livestock']},
 {id:'community',pt:'ONG e desenvolvimento comunitário',en:'NGO and community work',aliases:['ONG','NGO','nonprofit','non profit','community','comunitario','comunitaria','desenvolvimento comunitario','voluntariado','volunteer','humanitarian','humanitario','social worker','assistente social']},
 {id:'project-management',pt:'Gestão de projectos',en:'Project management',aliases:['gestao de projectos','gestao de projetos','project management','project manager','gestor de projectos','gestor de projetos','project coordinator','coordenador de projectos','M&E','monitoring and evaluation','monitoria e avaliacao','PMP','Agile','Scrum']},
 {id:'leadership',pt:'Gestão e liderança',en:'Management and leadership',aliases:['gestao','management','lideranca','leadership','manager','gestor','gestora','supervisor','director','diretor','executive','executivo','executiva','senior']},
 {id:'first-job',pt:'Primeiro emprego e estágio',en:'First job and internship',aliases:['primeiro emprego','first job','entry level','junior','graduate','recem formado','recem formada','estagio','internship','intern','trainee','sem experiencia','no experience'],preferred:['primeiro','saude']},
];
const sectorTags: Record<string,string[]> = {
 administracao:['administration','hr','customer-service'],contabilidade:['accounting','finance','data'],
 tecnologia:['software','it-support','networks','telecom','cybersecurity','data','project-management'],
 saude:['healthcare','nursing'],educacao:['education','community'],
 engenharia:['engineering','construction','electrical','maintenance','telecom','networks','project-management'],
 logistica:['logistics','warehouse','transport','maintenance'],vendas:['sales','customer-service','marketing'],
 hotelaria:['hospitality','tourism','food-service','customer-service'],comunicacao:['communications','marketing','design'],
 agricultura:['agriculture','maintenance','logistics'],projectos:['community','project-management','administration'],
};
const generalTags: Record<string,string[]> = {
 classico:['administration','hr','customer-service','logistics'],moderno:['it-support','software','project-management','administration'],
 minimalista:['accounting','finance','engineering','education'],criativo:['communications','marketing','design'],
 executivo:['leadership','finance','administration','project-management'],primeiro:['first-job','education','software','sales'],
 tecnico:['software','data','it-support','networks','telecom','cybersecurity'],saude:['healthcare','nursing','education','community'],
 engenharia:['engineering','construction','electrical','maintenance','logistics','telecom','networks'],servico:['hospitality','tourism','food-service','customer-service','sales'],
};
export function tagIdsForTemplate(model:string):string[] {
 const signature=signatureDesign(model);if(signature)return [...signature.tags];
 const variant=industryVariant(model);
 const ids=variant?[...(sectorTags[variant.industry.id]||[])]:[...(generalTags[model]||[])];
 if(variant?.layout.id==='formacao')ids.push('first-job');
 if(['presenca','direccao'].includes(variant?.layout.id||''))ids.push('leadership');
 return [...new Set(ids)];
}
export const templateTagById=new Map(templateTags.map(tag=>[tag.id,tag]));
export function tagLayoutBonus(model:string,tag:TemplateTag){return tag.preferred?.includes(designModel(model))?12:0;}
