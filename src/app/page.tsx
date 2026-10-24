import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/site';
export const metadata: Metadata = { alternates: { canonical: SITE_ORIGIN }, openGraph: { title: 'CVMais — O teu próximo passo começa aqui', description: 'Cria o teu CV em português, escolhe o teu modelo e descarrega em PDF.', url: SITE_ORIGIN, siteName: 'CVMais', locale: 'pt_MZ', type: 'website', images: [{ url: '/images/hero-reference.png', alt: 'CVMais · prepara o teu próximo passo' }] } };
import Content from '@/components/home-content';
export default function Page(){return <Content/>;}
