import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/header';
import { guides } from '@/lib/guides';
import { SITE_ORIGIN } from '@/lib/site';
import { ArrowRight } from 'lucide-react';
export const metadata: Metadata = { title: 'Orientações de candidatura | CVMais', description: 'Guias práticos para preparar o CV e a candidatura em português de Moçambique.', alternates: { canonical: `${SITE_ORIGIN}/orientacoes` } };
export default function Guides(){return <><Header/><main id="conteudo" className="guide-hub container"><span className="eyebrow">O TEU PRÓXIMO PASSO</span><h1>Prepara a candidatura.<br/><em>Mostra o teu percurso.</em></h1><p className="guide-lead">Do primeiro CV ao email de candidatura: orientações práticas para avançares com clareza, ao teu ritmo.</p><div className="guide-grid">{guides.map((g,i)=><Link className={`guide-card guide-tone-${i}`} href={`/orientacoes/${g.slug}`} key={g.slug}><div className="guide-art" aria-hidden="true"><span>0{i+1}</span><div className="guide-paper"><b/><i/><i/><i/><strong/><i/><i/></div></div><div className="guide-card-copy"><span className="eyebrow">{g.category}</span><h2>{g.title}</h2><p>{g.description}</p><span className="text-link">Ler orientação <ArrowRight size={18}/></span></div></Link>)}</div><div className="guide-bottom"><p>Já sabes por onde começar? Escolhe um modelo e conta a tua história.</p><Link className="button" href="/criar-cv">Criar o meu CV <ArrowRight size={18}/></Link></div><Link className="text-link" href="/">Voltar ao início</Link></main></>}
