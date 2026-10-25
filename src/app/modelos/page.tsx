import type {Metadata} from 'next';

import Header from '@/components/header';
import TemplateGallery from '@/components/template-gallery';
import {SITE_ORIGIN} from '@/lib/site';
export const metadata:Metadata={title:'Modelos de CV | CVMais',description:'Explora seis edições de CV em cada uma de doze áreas profissionais, além dos modelos gerais.',alternates:{canonical:`${SITE_ORIGIN}/modelos`}};
export default function Models(){return <><Header/><main id="conteudo" className="model-library"><TemplateGallery standalone/></main></>;}
