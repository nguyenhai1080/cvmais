// Low-cardinality, anonymous counters only. No free text, document/user IDs or raw URLs.
export const METRIC_EVENTS = ['page_view','cv_builder_started','cv_template_selected','cv_pdf_exported'] as const;
export const METRIC_SOURCES = ['none','direct','internal','google','bing','duckduckgo','social','other'] as const;
export type MetricEvent = typeof METRIC_EVENTS[number];
export type MetricSource = typeof METRIC_SOURCES[number];
export type MetricPayload = { event: MetricEvent; page: string; source: MetricSource };

const publicPaths = new Set(['/','/modelos','/orientacoes','/sobre','/termos','/privacidade']);
const privatePaths = new Set(['/criar-cv','/conta','/meus-cvs']);
const guideSlugs = new Set(['primeiro-cv','adaptar-a-oportunidade','email-de-candidatura','antes-de-enviar']);
const professionSlugs = new Set(['motorista','vendedor','estudante','administrativo','enfermeiro','contabilista','programador','engenheiro','fiel-de-armazem','recepcionista','tecnico-agricola','assistente-de-projectos']);
const allPaths = new Set([...publicPaths,...privatePaths,'/outras-paginas']);

export function metricPage(path: string): string {
  const pathname = (typeof path === 'string' ? path : '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  if (allPaths.has(pathname)) return pathname;
  const guide = pathname.match(/^\/orientacoes\/([a-z0-9-]+)$/);
  if (guide && guideSlugs.has(guide[1])) return pathname;
  const profession = pathname.match(/^\/modelos\/para\/([a-z0-9-]+)$/);
  if (profession && professionSlugs.has(profession[1])) return pathname;
  // Never store a CV id, email, user-defined path or query parameter.
  return '/outras-paginas';
}
export function metricSource(referrer: string, origin: string): MetricSource {
  if (!referrer) return 'direct';
  try {
    const ref = new URL(referrer);
    const site = new URL(origin);
    if (!['http:','https:'].includes(ref.protocol)) return 'other';
    if (ref.origin === site.origin) return 'internal';
    const host = ref.hostname.toLowerCase();
    if (host === 'google.com' || host.endsWith('.google.com') || /^google\.[a-z]{2,3}(?:\.[a-z]{2})?$/.test(host) || /^www\.google\.[a-z]{2,3}(?:\.[a-z]{2})?$/.test(host)) return 'google';
    if (host === 'bing.com' || host.endsWith('.bing.com')) return 'bing';
    if (host === 'duckduckgo.com' || host.endsWith('.duckduckgo.com')) return 'duckduckgo';
    if (['facebook.com','instagram.com','tiktok.com','linkedin.com','x.com','twitter.com','whatsapp.com'].some(domain => host === domain || host.endsWith('.'+domain))) return 'social';
    return 'other';
  } catch { return 'other'; }
}
export function parseMetricPayload(value: unknown): MetricPayload | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const obj = value as Record<string, unknown>;
  if (Object.keys(obj).length !== 3 ||
      typeof obj.event !== 'string' || !(METRIC_EVENTS as readonly string[]).includes(obj.event) ||
      typeof obj.page !== 'string' || metricPage(obj.page) !== obj.page ||
      typeof obj.source !== 'string' || !(METRIC_SOURCES as readonly string[]).includes(obj.source)) return null;
  if ((obj.event === 'page_view') === (obj.source === 'none')) return null;
  return {event: obj.event as MetricEvent,page: obj.page,source: obj.source as MetricSource};
}
