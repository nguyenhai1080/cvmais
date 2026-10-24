import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guides } from '@/lib/guides';
import { SITE_ORIGIN } from '@/lib/site';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams(){ return guides.map(({slug})=>({slug})); }
export const dynamicParams = false;
export async function generateMetadata({params}: Props): Promise<Metadata>{ const {slug}=await params; const g=guides.find(g=>g.slug===slug); if(!g)return {}; return {title: `${g.title} | CVMais`, description:g.description, alternates:{canonical:`${SITE_ORIGIN}/orientacoes/${slug}`},openGraph:{title:g.title,description:g.description,url:`${SITE_ORIGIN}/orientacoes/${slug}`,locale:'pt_MZ',type:'article'}}; }
import GuideArticle from '@/components/guide-article';
export default async function GuidePage({params}: Props){const {slug}=await params;const g=guides.find(g=>g.slug===slug);if(!g)notFound();return <GuideArticle guide={g}/>;}
