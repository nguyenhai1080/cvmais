'use client';
import {useMemo,useState} from 'react';
import {analyticsSummary,type MetricRow,type MetricWindow} from '@/lib/analytics-report';
import styles from './analytics-dashboard.module.css';

const labels:Record<string,{pt:string;en:string}>={
 page_view:{pt:'Visualizações',en:'Page views'},
 cv_builder_started:{pt:'Aberturas do editor',en:'Builder starts'},
 cv_template_selected:{pt:'Selecções de modelos',en:'Template selections'},
 cv_pdf_exported:{pt:'Transferências PDF iniciadas',en:'PDF downloads initiated'},
 direct:{pt:'Directo / sem referência',en:'Direct / no referrer'},
 internal:{pt:'Navegação interna',en:'Internal navigation'},
 google:{pt:'Google (referrer)',en:'Google (referrer)'},
 bing:{pt:'Bing',en:'Bing'},
 duckduckgo:{pt:'DuckDuckGo',en:'DuckDuckGo'},
 social:{pt:'Redes sociais',en:'Social media'},
 other:{pt:'Outros',en:'Other'},
};
function makeLabel(name:string,en:boolean){return labels[name]?.[en?'en':'pt']||name;}
export default function AnalyticsDashboard({rows,locale}:{rows:MetricRow[];locale:'en'|'pt'}){
 const [days,setDays]=useState<MetricWindow>(30);
 const en=locale==='en';
 const data=useMemo(()=>analyticsSummary(rows,days),[rows,days]);
 const max=Math.max(1,...data.daily.map(x=>Math.max(x.views,x.pdf)));
 const totalSources=data.sources.reduce((n,x)=>n+x.count,0);
 const ratio=data.totals.cv_builder_started ? (data.totals.cv_pdf_exported/data.totals.cv_builder_started*100).toFixed(1)+'%' : '—';
 return <section className={styles.dashboard} aria-labelledby="aggregate-dashboard">
   <div className={styles.head}><div><span className="eyebrow">{en?'PRIVATE REPORT · COOKILESS':'RELATÓRIO PRIVADO · SEM COOKIES'}</span>
    <h2 id="aggregate-dashboard">{en?'Anonymous usage statistics':'Estatísticas anónimas de utilização'}</h2>
    <p>{en?'Event counts, not unique users. No CV data or visitor identifiers stored.':'Contagem de eventos, não de pessoas únicas. Não são guardados dados de CVs nem identificadores de visitantes.'}</p>
   </div><div className={styles.filters} role="group" aria-label={en?'Reporting window':'Período do relatório'}>{([7,30,90] as const).map(period=><button key={period} type="button" aria-pressed={days===period} onClick={()=>setDays(period)}>{period} {en?'days':'dias'}</button>)}</div></div>
   <div className={styles.kpis}>{(Object.keys(data.totals) as (keyof typeof data.totals)[]).map(event=><div className={styles.kpi} key={event}><span>{makeLabel(event,en)}</span><strong>{data.totals[event].toLocaleString(en?'en-GB':'pt-MZ')}</strong></div>)}</div>
   <p className={styles.note}>{en?'Indicative event ratio (PDF initiations / builder opens):':'Rácio indicativo entre eventos (inícios de PDF / aberturas do editor):'} <strong>{ratio}</strong>. {en?'Not a user conversion rate and may exceed 100%.':'Não é uma taxa de conversão de utilizadores e pode ultrapassar 100%.'}</p>
   <div className={styles.columns}>
    <section className={styles.panel} aria-label={en?'Daily event trend':'Tendência diária de eventos'}>
      <h3>{en?'Events over time':'Evolução dos eventos'}</h3>
      <div className={styles.legend}><span><i className={styles.views}/> {en?'Page views':'Visualizações'}</span><span><i className={styles.pdf}/> {en?'PDF initiations':'Inícios de PDF'}</span></div>
      <div className={styles.scroll}><div className={styles.chart} role="img" aria-label={en?'Daily page views and PDF initiation counts':'Visualizações e inícios de transferência de PDF por dia'}>
        {data.daily.map(d=><div key={d.day} className={styles.barGroup} title={d.day+': '+d.views+' views; '+d.pdf+' PDFs'}><div className={styles.barPair}><div className={styles.viewBar} style={{height:(d.views/max*100)+'%'}}/><div className={styles.pdfBar} style={{height:(d.pdf/max*100)+'%'}}/></div><span>{d.day.slice(5)}</span></div>)}
      </div></div>
      <details className={styles.details}><summary>{en?'Daily table':'Tabela diária'}</summary><div className={styles.tableScroll}><table><thead><tr><th>{en?'Day':'Dia'}</th><th>{en?'Views':'Vistas'}</th><th>{en?'Builder':'Editor'}</th><th>PDF</th></tr></thead><tbody>{data.daily.map(d=><tr key={d.day}><td>{d.day}</td><td>{d.views}</td><td>{d.builder}</td><td>{d.pdf}</td></tr>)}</tbody></table></div></details>
    </section>
    <section className={styles.panel}><h3>{en?'Page view sources':'Origem das visualizações'}</h3>
      <p className={styles.subtle}>{en?'Referrer categories only; not acquisition attribution for PDF exports.':'Apenas categorias de referrer; não representa a origem das transferências de PDF.'}</p>
      {data.sources.filter(s=>s.count>0).length===0?<p>{en?'No views in this period.':'Sem visualizações neste período.'}</p>:data.sources.filter(s=>s.count>0).map(s=><div className={styles.source} key={s.source}><div><span>{makeLabel(s.source,en)}</span><strong>{s.count}</strong></div><div className={styles.track}><div style={{width:(totalSources?s.count/totalSources*100:0)+'%'}}/></div></div>)}
    </section>
   </div>
   <section className={styles.panel}><h3>{en?'Most viewed pages':'Páginas mais visualizadas'}</h3><div className={styles.tableScroll}><table><thead><tr><th>{en?'Page':'Página'}</th><th>{en?'Page views':'Visualizações'}</th></tr></thead><tbody>{data.topPages.map(p=><tr key={p.page}><td><code>{p.page}</code></td><td>{p.count}</td></tr>)}{data.topPages.length===0&&<tr><td colSpan={2}>{en?'No data for this period.':'Sem dados no período.'}</td></tr>}</tbody></table></div>
   </section>
   <p className={styles.note}>{en?'Days use Africa/Maputo time. Data is retained for about 90 days. Google Search Console remains the source for indexed URLs, impressions and queries.':'Os dias seguem a hora de Moçambique. Os dados são conservados cerca de 90 dias. O Google Search Console continua a ser a fonte para indexação, impressões e palavras-chave.'}</p>
 </section>;
}
