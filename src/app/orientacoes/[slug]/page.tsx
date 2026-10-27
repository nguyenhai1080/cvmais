import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guides } from '@/lib/guides';
import GuideArticle from '@/components/guide-article';
import { SITE_ORIGIN } from '@/lib/site';
type Props = { params: Promise<{ slug: string }> };
const seo: Record<string,{title:string;description:string}> = {
  'primeiro-cv': {
    title:'Como Fazer um CV para Primeiro Emprego | CVMais',
    description:'Aprende a criar o primeiro CV sem experiência profissional. Exemplos para estudantes e candidatos em Moçambique.',
  },
  'adaptar-a-oportunidade': {
    title:'Como Adaptar o CV a uma Oferta de Emprego | CVMais',
    description:'Aprende a adaptar o currículo à vaga, destacar experiências reais e preparar uma candidatura em Moçambique.',
  },
  'email-de-candidatura': {
    title:'Como Enviar um CV por Email: Exemplo | CVMais',
    description:'Vê como escrever um email de candidatura, escolher o assunto e enviar o teu CV em PDF com uma mensagem profissional.',
  },
};
export function generateStaticParams(){return guides.map(({slug})=>({slug}));}
export const dynamicParams=false;
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  const g=guides.find(g=>g.slug===slug);
  if(!g)return {};
  const title=seo[slug]?.title??`${g.title} | CVMais`;
  const description=seo[slug]?.description??g.description;
  const url=`${SITE_ORIGIN}/orientacoes/${slug}`;
  return {title,description,alternates:{canonical:url},openGraph:{title,description,url,siteName:'CVMais',locale:'pt_MZ',type:'article'}};
}
export default async function GuidePage({params}:Props){
  const {slug}=await params;
  const g=guides.find(g=>g.slug===slug);
  if(!g)notFound();
  const url=`${SITE_ORIGIN}/orientacoes/${slug}`;
  const schema={'@context':'https://schema.org','@type':'Article',headline:g.title,
    description:seo[slug]?.description??g.description,inLanguage:'pt-MZ',mainEntityOfPage:url,
    author:{'@type':'Organization',name:'CVMais',url:SITE_ORIGIN},
    publisher:{'@type':'Organization',name:'CVMais',url:SITE_ORIGIN}};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><GuideArticle guide={g}/></>;
}
