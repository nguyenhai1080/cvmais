import type { Metadata } from 'next';
import Content from '@/components/home-content';
import { SITE_ORIGIN } from '@/lib/site';
const title = 'Criar CV Grátis Online em Moçambique | CVMais';
const description = 'Cria o teu CV profissional grátis em Moçambique. Escolhe entre 14 modelos, personaliza o teu percurso e descarrega o currículo em PDF sem marca de água.';
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: SITE_ORIGIN },
  openGraph: {
    title, description, url: SITE_ORIGIN, siteName: 'CVMais', locale: 'pt_MZ', type: 'website',
    images: [{url:'/images/hero-reference.png',alt:'CVMais · prepara o teu próximo passo'}],
  },
};
const schema = {
  '@context':'https://schema.org', '@type':'WebApplication', name:'CVMais', url:SITE_ORIGIN,
  description, inLanguage:'pt-MZ', applicationCategory:'BusinessApplication', operatingSystem:'Any',
  offers:{'@type':'Offer',price:'0',priceCurrency:'MZN'},
  publisher:{'@type':'Organization',name:'CVMais',url:SITE_ORIGIN},
};
export default function Page() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><Content/></>;
}
