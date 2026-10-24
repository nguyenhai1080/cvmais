import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/site';
export const metadata: Metadata = { title: 'Orientações de candidatura | CVMais', description: 'Guias práticos para preparar o CV e a candidatura em português de Moçambique.', alternates: { canonical: `${SITE_ORIGIN}/orientacoes` } };
import Content from '@/components/guides-content';
export default function Page(){return <Content/>;}
