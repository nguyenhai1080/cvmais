import Link from 'next/link';
import {professions,professionUrl} from '@/lib/profession-seo';
import styles from './profession-pages.module.css';

export default function ProfessionLinks(){
  return <section className={styles.hub+' container'} aria-labelledby="modelos-por-profissao">
    <span className="eyebrow">GUIAS POR PROFISSÃO</span>
    <h2 id="modelos-por-profissao">Encontra orientações para a tua área</h2>
    <p>Escolhe uma profissão para ver exemplos de perfil, experiência e competências. Os modelos são gratuitos e podes adaptá-los no editor CVMais.</p>
    <div className={styles.hubGrid}>{professions.map(p=>
      <Link className={styles.hubLink} href={professionUrl(p.slug)} key={p.slug}>
        <strong>CV para {p.name}</strong><span>{p.audience}</span>
      </Link>)}</div>
  </section>;
}
