'use client';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {useUILanguage} from '@/lib/ui-language';
import styles from './profession-pages.module.css';

export default function ApplicationNextSteps({slug}:{slug:string}){
 const {locale}=useUILanguage();
 if(!['primeiro-cv','adaptar-a-oportunidade','antes-de-enviar'].includes(slug))return null;
 const en=locale==='en';
 return <section className={styles.guideBridge} aria-labelledby="application-next-steps">
  <h2 id="application-next-steps">{en?'Your CV is one part of the application':'O CV é uma parte da candidatura'}</h2>
  <p>{en?'Prepare the message that accompanies your CV and examples you can discuss if invited to an interview.':'Prepara a mensagem que acompanha o CV e os exemplos que poderás explicar se fores convidado para uma entrevista.'}</p>
  <p><Link href="/orientacoes/email-de-candidatura">{en?'How to email your CV, with an example':'Como enviar o CV por email, com um exemplo'} <ArrowRight size={17}/></Link></p>
  <p><Link href="/orientacoes/preparar-entrevista">{en?'Prepare for a job interview':'Preparar uma entrevista de emprego'} <ArrowRight size={17}/></Link></p>
 </section>;
}
