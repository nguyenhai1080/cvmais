'use client';
import IndustryLetterTool from '@/components/industry-letter-tool';
import { t as ui, useUILanguage } from '@/lib/ui-language';
import Link from 'next/link';
import Header from '@/components/header';
import { guides, type Guide } from '@/lib/guides';
import GuideTools from '@/components/guide-tools';
import InterviewPractice from '@/components/interview-practice';
import { ArrowRight } from 'lucide-react';
import styles from './profession-pages.module.css';
export default function GuideArticle({guide:g}:{guide:Guide}){const {translate:ui}=useUILanguage();const slug=g.slug;return <><Header/><main id="conteudo" className="guide-page container"><nav className="guide-breadcrumb" aria-label={ui("Localização")}><Link href="/">{ui("Início")}</Link><span>{ui("/")}</span><Link href="/orientacoes">{ui("Orientações")}</Link></nav><header className="guide-heading"><span className="eyebrow">{ui(g.category)}</span><h1>{ui(g.title)}</h1><p className="guide-lead">{ui(g.lead)}</p></header><div className="guide-layout"><article className="guide-prose">{g.sections.map((s,i)=><section key={ui(s.title)}><span className="guide-step">0{i+1}</span><h2>{ui(s.title)}</h2><p>{ui(s.text)}</p>{s.example&&<div className="guide-example"><strong>{ui(s.label||'')}</strong><p>{ui(s.example)}</p></div>}</section>)}<GuideTools kind={slug}/>{slug==='primeiro-cv'&&
  <section className={styles.guideBridge} aria-label={ui('Modelo de CV para estudante')}>
    <h2>{ui('À procura do primeiro emprego?')}</h2>
    <p>{ui('Se estás a estudar e ainda não tens experiência formal, vê um exemplo de CV para estudante com formação, projectos e competências reais.')}</p>
    <Link href="/modelos/para/estudante">{ui('Ver modelo de CV para estudante')} <ArrowRight size={17}/></Link>
  </section>}{slug==='preparar-entrevista'&&<InterviewPractice/>}{slug==='cartas-por-area'&&<IndustryLetterTool/>}<aside className="guide-source"><strong>{ui("Leitura complementar")}</strong><p><a href={g.source.url} target="_blank" rel="noopener noreferrer">{ui(g.source.title)}{ui(" ↗")}</a></p><small>{ui("Recurso internacional. Segue sempre as instruções da organização a que te candidatas.")}</small></aside></article><aside className="guide-side"><span className="eyebrow">{ui("PASSA À PRÁTICA")}</span><h2>{ui("O teu percurso merece uma boa apresentação.")}</h2><p>{ui("Abre o editor e aplica estas ideias ao teu CV. Revê os teus dados antes de enviar.")}</p><Link className="button" href={`/criar-cv?modelo=${g.model}`}>{ui("Abrir o editor ")}<ArrowRight size={17}/></Link><small>{ui("Se já tens um rascunho neste dispositivo, podes continuar a editá-lo.")}</small></aside></div><section className="guide-related"><span className="eyebrow">{ui("CONTINUA A PREPARAR-TE")}</span><h2>{ui("O próximo detalhe faz a diferença.")}</h2><div>{guides.filter(x=>x.slug!==slug).map(x=><Link href={`/orientacoes/${x.slug}`} key={x.slug}><h3>{ui(x.title)}</h3><p>{ui(x.description)}</p><ArrowRight size={20}/></Link>)}</div></section><Link className="text-link" href="/orientacoes">{ui("Ver todas as orientações")}</Link></main></>}
