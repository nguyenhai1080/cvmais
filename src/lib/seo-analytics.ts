'use client';
import {metricPage,metricSource,type MetricEvent,type MetricPayload} from './anonymous-metrics.ts';

// First-party aggregated telemetry. No third-party tracking or persistent client state,
// IP capture in the application, persistent identifier, CV content or text fields.
const ENDPOINT = '/api/analytics';
let previousPage = '';
function send(payload:MetricPayload):void {
  if (typeof window === 'undefined') return;
  try {
    // Do not attach a logged-in session to aggregate events.
    void fetch(ENDPOINT,{
      method:'POST',
      credentials:'omit',
      cache:'no-store',
      referrerPolicy:'no-referrer',
      keepalive:true,
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
    }).catch(()=>{ /* Analytics must never interfere with CV creation. */ });
  } catch { /* Ignore network/storage restrictions. */ }
}
export function trackAnalyticsPage(path:string):void {
  const page=metricPage(path);
  if (page===previousPage) return; // No duplicate mount/hydration events.
  previousPage=page;
  const source=metricSource(document.referrer,window.location.origin);
  send({event:'page_view',page,source});
}
export function trackConversion(event:Exclude<MetricEvent,'page_view'>):void {
  send({event,page:metricPage(window.location.pathname),source:'none'});
}
