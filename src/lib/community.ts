import { SITE_ORIGIN } from './site.ts';

// Official public channel supplied by the owner.
export const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbEAD4VG8l58vnbH4u1t';
export function officialChannelURL(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'whatsapp.com' || url.port || url.username || url.password || !/^\/channel\/[a-zA-Z0-9_-]{10,100}\/?$/.test(url.pathname) || url.search || url.hash) return null;
    return url.href;
  } catch { return null; }
}
export function invitation(language: 'pt' | 'en') {
  return language === 'en'
    ? `Hi! Try CVMais to create a free CV in Portuguese or English and download it as a PDF without a watermark. You can start without an account.\n${SITE_ORIGIN}`
    : `Olá! Conheces o CVMais? Podes criar um CV grátis em português ou inglês e descarregá-lo em PDF sem marca de água. Podes começar sem conta.\n${SITE_ORIGIN}`;
}
export function whatsappInvitationURL(language: 'pt' | 'en') {
  return `https://wa.me/?text=${encodeURIComponent(invitation(language))}`;
}
