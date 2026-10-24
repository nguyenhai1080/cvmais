'use client';
import { usePathname } from 'next/navigation';
import { uiEnglish } from './ui-en';
import { useEffect, useSyncExternalStore } from 'react';
import { translateUI } from './ui-translate';
export type UILanguage = 'pt' | 'en';
export const UI_LANGUAGE_KEY = 'cvmais-ui-language';
let language: UILanguage = 'pt';
const listeners = new Set<()=>void>();
export function t(text:string):string{return translateUI(text,language);}
export function setUILanguage(next:UILanguage){language=next;try{localStorage.setItem(UI_LANGUAGE_KEY,next);}catch{/* The choice still works for this tab. */}document.documentElement.lang=next==='en'?'en':'pt-MZ';listeners.forEach(listener=>listener());}
function subscribe(listener:()=>void){listeners.add(listener);return ()=>{listeners.delete(listener);};}
export function useUILanguage(){const locale=useSyncExternalStore(subscribe,()=>language,()=> 'pt' as UILanguage);return {locale,setLocale:setUILanguage,translate:(text:string)=>translateUI(text,locale)};}
export function LanguageSync(){const path=usePathname();const {locale}=useUILanguage();useEffect(()=>{const current=document.title;const parts=current.split(' | ').map(part=>Object.entries(uiEnglish).find(([,en])=>en===part)?.[0]||part);document.title=parts.map(part=>translateUI(part,locale)).join(' | ');},[path,locale]);useEffect(()=>{try{const saved=localStorage.getItem(UI_LANGUAGE_KEY);if(saved==='en')setUILanguage('en');}catch{/* Portuguese remains the default. */}function sync(event:StorageEvent){if(event.key===UI_LANGUAGE_KEY)setUILanguage(event.newValue==='en'?'en':'pt');}window.addEventListener('storage',sync);return ()=>window.removeEventListener('storage',sync);},[]);return null;}
