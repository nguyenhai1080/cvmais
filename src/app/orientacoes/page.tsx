import type { Metadata } from 'next';
import Content from '@/components/guides-content';
import { SITE_ORIGIN } from '@/lib/site';
const title = 'Como Fazer um CV e Preparar a Candidatura | CVMais';
const description = 'Aprende a fazer um CV, preparar a candidatura e enviar o currículo em Moçambique. Guias práticos gratuitos com exemplos.';
export const metadata: Metadata = {
  title, description, alternates: {canonical:`${SITE_ORIGIN}/orientacoes`},
  openGraph: {title,description,url:`${SITE_ORIGIN}/orientacoes`,siteName:'CVMais',locale:'pt_MZ',type:'website'},
};
export default function Page(){return <Content/>;}
