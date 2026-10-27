'use client';
// No Google tag or event without an explicit opt-in. No CV content ever passed.
export type AnalyticsConsent = 'accepted' | 'declined';
export type ConversionEvent = 'cv_builder_started' | 'cv_template_selected' | 'cv_pdf_exported';
export const CONSENT_KEY = 'cvmais-analytics-consent-v1';
export const CONSENT_CHANGED = 'cvmais:analytics-consent-changed';
export const OPEN_PREFERENCES = 'cvmais:analytics-open-preferences';
const rawId = (process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '').trim();
const MEASUREMENT_ID = /^G-[A-Z0-9]{6,20}$/.test(rawId) ? rawId : '';
const PATHS = new Set(['/', '/modelos', '/orientacoes', '/sobre', '/termos', '/privacidade', '/conta', '/meus-cvs', '/criar-cv']);
const GUIDES = new Set(['primeiro-cv', 'adaptar-a-oportunidade', 'email-de-candidatura', 'antes-de-enviar']);
const PROFESSIONS = new Set(['motorista', 'vendedor', 'estudante', 'administrativo', 'enfermeiro']);

type AnalyticsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
};
let temporaryChoice: AnalyticsConsent | null = null;
let isInitialized = false;

export function isAnalyticsConfigured(): boolean { return !!MEASUREMENT_ID; }
export function sanitizeAnalyticsPath(path: string): string {
  const pathname = (path || '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  if (PATHS.has(pathname)) return pathname;
  const guide = pathname.match(/^\/orientacoes\/([a-z0-9-]+)$/);
  if (guide && GUIDES.has(guide[1])) return pathname;
  const profession = pathname.match(/^\/modelos\/para\/([a-z0-9-]+)$/);
  if (profession && PROFESSIONS.has(profession[1])) return pathname;
  return '/outras-paginas';
}
export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (saved === 'accepted' || saved === 'declined') return saved;
  } catch { /* Storage access might be blocked. */ }
  return temporaryChoice;
}
function safeLocation(): string {
  return window.location.origin + sanitizeAnalyticsPath(window.location.pathname);
}
function safeReferrer(): string {
  try {
    const url = new URL(document.referrer);
    if (!['https:', 'http:'].includes(url.protocol)) return '';
    if (url.origin === window.location.origin) return url.origin + sanitizeAnalyticsPath(url.pathname);
    return url.origin + '/';
  } catch { return ''; }
}
function disableTracking() {
  if (!MEASUREMENT_ID || typeof window === 'undefined') return;
  (window as unknown as Record<string, unknown>)['ga-disable-' + MEASUREMENT_ID] = true;
  for (const pair of document.cookie.split(';')) {
    const name = pair.trim().split('=')[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax';
    if (window.location.hostname.endsWith('cvmais.co.mz')) {
      document.cookie = name + '=; Max-Age=0; Path=/; Domain=.cvmais.co.mz; SameSite=Lax';
    }
  }
}
export function chooseAnalyticsConsent(choice: AnalyticsConsent): void {
  if (typeof window === 'undefined') return;
  temporaryChoice = choice;
  try { window.localStorage.setItem(CONSENT_KEY, choice); } catch { /* In-memory for this tab. */ }
  if (choice === 'declined') disableTracking();
  window.dispatchEvent(new Event(CONSENT_CHANGED));
}
export function startAnalytics(): boolean {
  if (typeof window === 'undefined' || !MEASUREMENT_ID || getAnalyticsConsent() !== 'accepted') return false;
  const win = window as AnalyticsWindow;
  (window as unknown as Record<string, unknown>)['ga-disable-' + MEASUREMENT_ID] = false;
  if (!isInitialized) {
    isInitialized = true;
    win.dataLayer = win.dataLayer || [];
    win.gtag = (...args: unknown[]) => { win.dataLayer?.push(args); };
    win.gtag('js', new Date());
    win.gtag('config', MEASUREMENT_ID, {
      send_page_view: false,
      page_location: safeLocation(),
      page_referrer: safeReferrer(),
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    if (!document.getElementById('cvmais-ga4-script')) {
      const script = document.createElement('script');
      script.id = 'cvmais-ga4-script';
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
      document.head.appendChild(script);
    }
  }
  return true;
}
export function trackAnalyticsPage(path: string): void {
  if (!startAnalytics()) return;
  (window as AnalyticsWindow).gtag?.('event', 'page_view', {
    send_to: MEASUREMENT_ID,
    page_location: window.location.origin + sanitizeAnalyticsPath(path),
    page_referrer: safeReferrer(),
    page_title: 'CVMais',
  });
}
export function trackConversion(event: ConversionEvent): void {
  if (!startAnalytics()) return;
  (window as AnalyticsWindow).gtag?.('event', event, {
    send_to: MEASUREMENT_ID,
    page_location: safeLocation(),
    page_referrer: safeReferrer(),
  });
}
