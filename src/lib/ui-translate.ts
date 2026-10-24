import { uiEnglish } from './ui-en.ts';
export function translateUI(text:string,locale:'pt'|'en'):string {if(locale==='pt')return text;const trimmed=text.trim();const translated=uiEnglish[trimmed]??uiEnglish[text];if(translated===undefined)return text;return text.startsWith(' ')||text.endsWith(' ')?`${text.match(/^\s*/)?.[0]||''}${translated.trim()}${text.match(/\s*$/)?.[0]||''}`:translated;}
