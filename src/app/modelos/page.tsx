import {catalogueTemplates} from '@/lib/templates';
import type { Metadata } from 'next';
import Header from '@/components/header';
import TemplateGallery from '@/components/template-gallery';
import ProfessionLinks from '@/components/profession-links';
import { SITE_ORIGIN } from '@/lib/site';
const title = 'Modelos de CV Grátis para Moçambique | CVMais';
const description = `Explora ${catalogueTemplates.length} modelos profissionais de CV para diferentes áreas. Escolhe um estilo, cria o teu currículo online e descarrega o PDF grátis.`;
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: `${SITE_ORIGIN}/modelos` },
  openGraph: {title,description,url:`${SITE_ORIGIN}/modelos`,siteName:'CVMais',locale:'pt_MZ',type:'website'},
};
const breadcrumb = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
  {'@type':'ListItem',position:1,name:'Início',item:SITE_ORIGIN},
  {'@type':'ListItem',position:2,name:'Modelos de CV',item:`${SITE_ORIGIN}/modelos`},
]};
export default function Models() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb).replace(/</g,'\\u003c')}}/><Header/><main id="conteudo" className="model-library"><TemplateGallery standalone/><ProfessionLinks/></main></>;
}
