'use client';
import Link from 'next/link';
import {professions,professionUrl} from '@/lib/profession-seo';
import {useUILanguage} from '@/lib/ui-language';
import styles from './profession-pages.module.css';

const englishLabels:Record<string,string>={
 motorista:'CV for driver',vendedor:'CV for sales assistant',
 estudante:'CV for student',administrativo:'CV for administrative assistant',
 enfermeiro:'CV for nurse',"contabilista":"CV for accountant","programador":"CV for developer","engenheiro":"CV for engineer","fiel-de-armazem":"CV for warehouse assistant","recepcionista":"CV for receptionist","tecnico-agricola":"CV for agricultural technician","assistente-de-projectos":"CV for project assistant"
};
const englishAudiences:Record<string,string>={
 motorista:'Driving, deliveries and transport',
 vendedor:'Shops, customer service and sales',
 estudante:'First jobs, internships and recent graduates',
 administrativo:'Office support, reception and administration',
 enfermeiro:'Nursing and supervised clinical placements',"contabilista":"Accounting and finance","programador":"Software and IT support","engenheiro":"Engineering and construction","fiel-de-armazem":"Warehouse and stock operations","recepcionista":"Reception and hospitality","tecnico-agricola":"Agriculture and field work","assistente-de-projectos":"NGOs and community projects"
};

export default function ProfessionLinks(){
 const {locale}=useUILanguage();
 const en=locale==='en';
 return <section className={styles.hub+' container'} aria-labelledby="modelos-por-profissao">
  <span className="eyebrow">{en?'PROFESSION-SPECIFIC CV GUIDES':'GUIAS POR PROFISSÃO'}</span>
  <h2 id="modelos-por-profissao">{en?'Find CV guidance for your field':'Encontra orientações para a tua área'}</h2>
  <p>{en?'Choose a field to see useful examples of profiles, experience and skills. Each guide links to a free CV template. The examples are fictional and written for Mozambique.':'Escolhe uma profissão para ver exemplos de perfil, experiência e competências. Cada guia leva a um modelo gratuito que podes personalizar. Os exemplos são fictícios e pensados para Moçambique.'}</p>
  <div className={styles.hubGrid}>{professions.map(p=>
   <Link className={styles.hubLink} href={professionUrl(p.slug)} key={p.slug}>
    <strong>{en?englishLabels[p.slug]:'CV para '+p.name}</strong>
    <span>{en?englishAudiences[p.slug]:p.audience}</span>
    <span className={styles.hubAction}>{en?'See examples and create CV →':'Ver exemplos e criar CV →'}</span>
   </Link>)}</div>
 </section>;
}
