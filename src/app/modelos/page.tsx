import type {Metadata} from 'next';

import Header from '@/components/header';
import TemplateGallery from '@/components/template-gallery';
import {SITE_ORIGIN} from '@/lib/site';
export const metadata:Metadata={title:'Modelos de CV | CVMais',description:'Explora 14 composições de CV, com quatro novos desenhos e sugestões por área profissional.',alternates:{canonical:`${SITE_ORIGIN}/modelos`}};
export default function Models(){return <><Header/><main id="conteudo" className="model-library"><TemplateGallery standalone/></main></>;}
