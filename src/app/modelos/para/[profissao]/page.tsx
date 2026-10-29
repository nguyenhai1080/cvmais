import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import GuideEditorLink from '@/components/guide-editor-link';
import Header from '@/components/header';
import {professions,professionBySlug,professionUrl} from '@/lib/profession-seo';
import {SITE_ORIGIN} from '@/lib/site';
import styles from '@/components/profession-pages.module.css';

type Props={params:Promise<{profissao:string}>};
export function generateStaticParams(){return professions.map(p=>({profissao:p.slug}));}
export const dynamicParams=false;
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {profissao}=await params, p=professionBySlug(profissao);
  if(!p)return {robots:{index:false,follow:false}};
  const url=SITE_ORIGIN+professionUrl(p.slug);
  return {title:p.title,description:p.description,alternates:{canonical:url},
    openGraph:{title:p.title,description:p.description,url,siteName:'CVMais',locale:'pt_MZ',type:'article'}};
}
export default async function ProfessionLandingPage({params}:Props){
  const {profissao}=await params, p=professionBySlug(profissao);
  if(!p)notFound();
  const url=SITE_ORIGIN+professionUrl(p.slug);
  const editor='/criar-cv?'+new URLSearchParams({modelo:p.model,area:p.area}).toString();
  const share='https://wa.me/?text='+encodeURIComponent('Estás a preparar uma candidatura? Vê este guia de CV para '+p.name.toLowerCase()+', com exemplos fictícios para adaptar e um editor gratuito: '+url);
  const library='/modelos?'+new URLSearchParams({area:p.area}).toString();
  const breadcrumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'Início',item:SITE_ORIGIN},
    {'@type':'ListItem',position:2,name:'Modelos de CV',item:SITE_ORIGIN+'/modelos'},
    {'@type':'ListItem',position:3,name:p.h1,item:url}]};
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbs).replace(/</g,'\\u003c')}}/>
    <Header/>
    <main id="conteudo" className={styles.page+' container'}>
      <nav className={styles.breadcrumbs} aria-label="Localização">
        <Link href="/">Início</Link><span aria-hidden="true">/</span>
        <Link href="/modelos">Modelos de CV</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{p.name}</span>
      </nav>
      <header className={styles.intro}>
        <span className={styles.badge}>MODELO DE CV GRATUITO · MOÇAMBIQUE</span>
        <h1>{p.h1}</h1><p>{p.intro}</p>
        <div className={styles.actions}>
          <GuideEditorLink className="button" href={editor}>Criar o meu CV grátis</GuideEditorLink>
          <Link className={styles.secondaryAction} href={library}>Ver modelos da área</Link>
        </div>
      </header>
      <div className={styles.grid}>
        <article className={styles.content}>
          <h2>Como preparar o teu CV</h2>
          {p.advice.map(s=><section key={s.title}><h3>{s.title}</h3><p>{s.body}</p></section>)}
          <section>
            <h2>Exemplos para adaptar ao teu percurso</h2>
            <p>Os textos abaixo são fictícios e servem como orientação. Substitui-os por informações verdadeiras antes de enviares o currículo.</p>
            <h3>Exemplo de perfil profissional</h3>
            <div className={styles.example}><p>{p.profile}</p><small>Exemplo fictício: adapta à tua experiência.</small></div>
            <h3>Exemplo de actividade ou experiência</h3>
            <div className={styles.example}><p>{p.activity}</p><small>Organização e actividades fictícias, não são empregadores reais.</small></div>
            <h3>Competências que podes mencionar, se as tiveres</h3>
            <ul>{p.skills.map(s=><li key={s}>{s}</li>)}</ul>
          </section>
          <section className={styles.faq}><h2>Perguntas frequentes</h2>
            {p.questions.map(q=><details key={q.q}><summary>{q.q}</summary><p>{q.a}</p></details>)}
          </section>
          <p>Antes de enviar a candidatura, confirma o anúncio, revê as datas e abre o PDF final. O CVMais ajuda a organizar o documento, mas não envia candidaturas nem garante emprego.</p>
          <section className={styles.nextStep} aria-labelledby={'proximo-'+p.slug}>
            <span className="eyebrow">DO EXEMPLO AO TEU CURRÍCULO</span>
            <h2 id={'proximo-'+p.slug}>Agora prepara o teu CV de {p.name.toLowerCase()}</h2>
            <p>Abre o modelo gratuito, substitui os exemplos fictícios pelos teus dados verdadeiros e revê o PDF antes de o enviares. Não é necessário pagar para começar.</p>
            <div className={styles.actions}>
              <GuideEditorLink className="button" href={editor}>Criar o meu CV grátis</GuideEditorLink>
              <Link className={styles.secondaryAction} href="/orientacoes/antes-de-enviar">Ver o guia de revisão do PDF</Link>
            </div>
          </section>
          <p><a className={styles.secondaryAction} href={share} target="_blank" rel="noopener noreferrer">Partilhar este guia no WhatsApp</a></p>
          <section className={styles.related}><h2>Outros modelos e orientações</h2>
            <div className={styles.relatedList}>
              {professions.filter(other=>other.slug!==p.slug).map(other=>
                <Link href={professionUrl(other.slug)} key={other.slug}>CV para {other.name}</Link>)}
              <Link href="/orientacoes/primeiro-cv">Guia do primeiro CV</Link>
            </div>
          </section>
        </article>
        <aside className={styles.side}>
          <span className="eyebrow">PASSA À PRÁTICA</span>
          <h2>Começa com {p.modelName}</h2>
          <p>Este desenho é uma sugestão para {p.audience.toLowerCase()}. Podes escolher outro modelo e editar todas as secções.</p>
          <GuideEditorLink className="button" href={editor}>Usar este modelo grátis</GuideEditorLink>
          <p>Descarrega um PDF sem marca de água. Inclui apenas qualificações e experiências que possas confirmar.</p>
          <Link className={styles.secondaryAction} href="/modelos">Explorar a biblioteca</Link>
        </aside>
      </div>
    </main>
  </>;
}
