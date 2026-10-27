#!/usr/bin/env node
// Read-only, public-only audit for CVMais v27. No cookies, consent or user data.
const ORIGIN = 'https://cvmais.co.mz';
const MEASUREMENT_ID = 'G-JNHPNNCZRF';
const checks = [];

function record(name, success, detail) {
  checks.push({ name, success, detail });
  console.log((success ? 'PASS ' : 'FAIL ') + name + ': ' + detail);
}
async function get(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
    headers: { 'User-Agent': 'CVMais-GA4-ReadOnly-Audit/1.0' }
  });
  return { response, body: await response.text() };
}

const paths = ['/', '/privacidade', '/criar-cv'];
const html = new Map();
for (const path of paths) {
  try {
    const page = await get(new URL(path, ORIGIN));
    html.set(path, page.body);
    record('HTTP ' + path, page.response.status === 200 && page.response.url.startsWith(ORIGIN),
      'HTTP ' + page.response.status + ' ' + page.response.url);
    // The analytics provider must not be embedded as an eager external script.
    const scripts = [...page.body.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(x => x[1]);
    const eager = scripts.filter(src => /googletagmanager\.com|google-analytics\.com/i.test(src));
    record('No eager GA4 script on ' + path, eager.length === 0,
      eager.length ? eager.join(', ').slice(0, 180) : 'Only application scripts before consent');
  } catch (error) {
    record('HTTP ' + path, false, String(error).slice(0, 200));
  }
}

const assets = new Set();
for (const page of html.values()) {
  const scriptTags = [...page.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
  for (const match of scriptTags) {
    try {
      const url = new URL(match[1].replaceAll('&amp;', '&'), ORIGIN);
      if (url.origin === ORIGIN && url.pathname.startsWith('/_next/static/') && url.pathname.endsWith('.js')) {
        assets.add(url.href);
      }
    } catch { /* Ignore malformed external URL. */ }
  }
}
record('Next.js JS assets discovered', assets.size > 0, String(assets.size) + ' JS files');
const sources = [];
const urls = [...assets];
let failures = 0;
for (let start = 0; start < urls.length; start += 6) {
  const batch = await Promise.all(urls.slice(start, start + 6).map(async url => {
    try {
      const { response, body } = await get(url);
      return response.ok ? body : null;
    } catch { return null; }
  }));
  for (const body of batch) {
    if (body !== null) sources.push(body);
    else failures++;
  }
}
record('All production JS assets fetched', failures === 0 && sources.length > 0,
  String(sources.length) + ' fetched; ' + String(failures) + ' failed');
const bundled = sources.join('\n');
record('GA4 measurement ID in production JS', bundled.includes(MEASUREMENT_ID),
  bundled.includes(MEASUREMENT_ID) ? 'ID embedded in deployed Next.js build' : 'Missing ID; check Vibehost build environment and rebuild');
record('Consent gating in production JS',
  bundled.includes('cvmais-analytics-consent-v1') &&
    bundled.includes('Aceitar estatísticas') &&
    bundled.includes('Recusar estatísticas'),
  'Consent key and Portuguese options in deployed JS');
record('Conversion event names in production JS',
  ['cv_builder_started', 'cv_template_selected', 'cv_pdf_exported'].every(event => bundled.includes(event)),
  'Builder, template and PDF initiation events');
const passed = checks.filter(x => x.success).length;
console.log('\n' + passed + '/' + checks.length + ' checks passed');
if (passed !== checks.length) process.exitCode = 1;
