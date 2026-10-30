import {metricPage, type MetricEvent} from './anonymous-metrics.ts';

// Umami Cloud only receives an approved public page category and allowlisted
// campaign parameters. Never transmit CV contents, IDs, search terms or tokens.
type UmamiProps = Record<string, unknown>;
type UmamiTracker = {track: (payload: (props: UmamiProps) => UmamiProps) => void};

declare global {
  interface Window { umami?: UmamiTracker }
}

const allowedCampaignParams = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
let previousUmamiPage = '';

export function safeUmamiUrl(pathname: string, search = ''): string {
  const page = metricPage(pathname);
  const input = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const output = new URLSearchParams();

  for (const key of allowedCampaignParams) {
    const value = input.get(key);
    if (value && /^[a-zA-Z0-9_-]{1,60}$/.test(value)) output.set(key, value);
  }
  return output.size ? page + '?' + output.toString() : page;
}

export function safeUmamiReferrer(referrer: string): string {
  if (!referrer) return '';
  try {
    const url = new URL(referrer);
    return ['https:', 'http:'].includes(url.protocol) ? url.origin + '/' : '';
  } catch {
    return '';
  }
}

function availableTracker(): UmamiTracker | null {
  if (typeof window === 'undefined' || window.location.hostname !== 'cvmais.co.mz') return null;
  return typeof window.umami?.track === 'function' ? window.umami : null;
}

export function trackUmamiPage(pathname: string): void {
  const tracker = availableTracker();
  if (!tracker) return;
  const page = metricPage(pathname);
  if (page === previousUmamiPage) return; // Prevent re-mount and hydration duplicates.
  const referrer = previousUmamiPage ? window.location.origin + '/' : safeUmamiReferrer(document.referrer);
  previousUmamiPage = page;

  tracker.track(props => ({
    ...props,
    url: safeUmamiUrl(pathname, window.location.search),
    referrer,
    title: document.title || 'CVMais',
  }));
}

export function trackUmamiConversion(event: Exclude<MetricEvent, 'page_view'>): void {
  const tracker = availableTracker();
  if (!tracker) return;

  tracker.track(props => ({
    ...props,
    name: event,
    url: safeUmamiUrl(window.location.pathname, window.location.search),
    referrer: safeUmamiReferrer(document.referrer),
  }));
}
