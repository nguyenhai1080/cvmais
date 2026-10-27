'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {useUILanguage} from '@/lib/ui-language';
import {
  CONSENT_KEY, CONSENT_CHANGED, OPEN_PREFERENCES,
  chooseAnalyticsConsent, getAnalyticsConsent, isAnalyticsConfigured,
  trackAnalyticsPage, type AnalyticsConsent,
} from '@/lib/seo-analytics';
import styles from './analytics-consent.module.css';

export default function AnalyticsConsentManager(){
  const pathname=usePathname();
  const {locale}=useUILanguage();
  const [choice,setChoice]=useState<AnalyticsConsent|null|undefined>(undefined);
  const [isEditing,setIsEditing]=useState(false);
  useEffect(()=>{
    setChoice(getAnalyticsConsent());
    const sync=()=>setChoice(getAnalyticsConsent());
    const storage=(event:StorageEvent)=>{
      if(event.key===CONSENT_KEY)setChoice(getAnalyticsConsent());
    };
    const open=()=>setIsEditing(true);
    window.addEventListener(CONSENT_CHANGED,sync);
    window.addEventListener(OPEN_PREFERENCES,open);
    window.addEventListener('storage',storage);
    return ()=>{
      window.removeEventListener(CONSENT_CHANGED,sync);
      window.removeEventListener(OPEN_PREFERENCES,open);
      window.removeEventListener('storage',storage);
    };
  },[]);
  useEffect(()=>{
    if(choice==='accepted')trackAnalyticsPage(pathname||'/');
  },[choice,pathname]);

  if(!isAnalyticsConfigured()||choice===undefined||(choice!==null&&!isEditing))return null;
  function choose(next:AnalyticsConsent){
    chooseAnalyticsConsent(next);
    setChoice(next);
    setIsEditing(false);
  }
  const en=locale==='en';
  return <section className={styles.notice} role="region" aria-label={en?'Optional statistics preferences':'Preferências de estatísticas opcionais'}>
    <strong>{en?'Help us improve CVMais':'Ajuda-nos a melhorar o CVMais'}</strong>
    <p>{en
      ?'With permission, Google Analytics 4 records visits and general actions such as opening the CV builder or initiating a PDF download. We do not send names, CV text, email addresses or document IDs. You may decline and use the site normally.'
      :'Com a tua autorização, o Google Analytics 4 regista visitas e acções gerais, como abrir o editor ou iniciar a transferência de PDF. Não enviamos nomes, conteúdo do CV, emails ou identificadores de documentos. Podes recusar e usar o site normalmente.'}
      {' '}<Link href="/privacidade">{en?'Privacy policy':'Política de privacidade'}</Link>.
    </p>
    <div className={styles.actions}>
      <button type="button" onClick={()=>choose('accepted')}>{en?'Accept statistics':'Aceitar estatísticas'}</button>
      <button type="button" onClick={()=>choose('declined')}>{en?'Reject statistics':'Recusar estatísticas'}</button>
    </div>
  </section>;
}
export function AnalyticsPrivacyPreferences(){
  const {locale}=useUILanguage();
  const [choice,setChoice]=useState<AnalyticsConsent|null>(null);
  useEffect(()=>{
    setChoice(getAnalyticsConsent());
    const sync=()=>setChoice(getAnalyticsConsent());
    window.addEventListener(CONSENT_CHANGED,sync);
    return ()=>window.removeEventListener(CONSENT_CHANGED,sync);
  },[]);
  if(!isAnalyticsConfigured())return null;
  const en=locale==='en';
  return <div className={styles.preference}>
    <p>{en?'Optional statistics:':'Estatísticas opcionais:'} <strong>{choice==='accepted'?(en?'Enabled':'Activadas'):choice==='declined'?(en?'Disabled':'Desactivadas'):(en?'Not chosen':'Sem escolha')}</strong></p>
    <button type="button" className={styles.preferenceButton} onClick={()=>window.dispatchEvent(new Event(OPEN_PREFERENCES))}>
      {en?'Change statistics preferences':'Alterar preferências de estatísticas'}
    </button>
  </div>;
}
