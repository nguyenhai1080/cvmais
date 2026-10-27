#!/usr/bin/env node
// Read-only production SEO audit. Never submits forms or reads private user data.
import { appendFileSync } from 'node:fs';

const origin = 'https://cvmais.co.mz';
const checks = [];

async function request(path) {
  try {
    const response = await fetch(new URL(path, origin), {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'CVMais-SEO-Audit/1.0' },
    });
    const body = await response.text();
    return { response, body };
  } catch (error) {
    return { error: error.message };
  }
}

function add(label, passed, details) {
  checks.push({ label, passed, details: String(details || '').slice(0, 220) });
  console.log(`${passed ? 'PASS' : 'FAIL'} ${label}: ${details || ''}`);
}

function inspect(label, result, criteria) {
  if (result.error) {
    add(label, false, result.error);
    return;
  }
  const { response, body } = result;
  const issue = criteria(response, body);
  add(label, !issue, issue || `HTTP ${response.status} — ${response.url}`);
}

const home = await request('/');
inspect('Homepage: metadata and JSON-LD', home, (r, body) => {
  if (r.status !== 200) return `HTTP ${r.status}`;
  if (!r.url.startsWith(origin)) return `Unexpected destination ${r.url}`;
  if (!body.includes('Criar CV Grátis Online em Moçambique')) return 'SEO title missing (new version not deployed?)';
  if (!body.includes('WebApplication')) return 'WebApplication JSON-LD missing';
  if (!body.includes('https://cvmais.co.mz')) return 'Canonical origin missing';
  return '';
});

const models = await request('/modelos');
inspect('Models: breadcrumb schema', models, (r, body) => {
  if (r.status !== 200) return `HTTP ${r.status}`;
  return body.includes('BreadcrumbList') ? '' : 'BreadcrumbList missing';
});

const guide = await request('/orientacoes/primeiro-cv');
inspect('Guide: Article schema', guide, (r, body) => {
  if (r.status !== 200) return `HTTP ${r.status}`;
  return body.includes('Article') ? '' : 'Article structured data missing';
});

const sitemap = await request('/sitemap.xml');
inspect('Sitemap: indexable pages only', sitemap, (r, body) => {
  if (r.status !== 200) return `HTTP ${r.status}`;
  if (!body.includes('https://cvmais.co.mz/modelos')) return 'Official models URL missing';
  if (body.includes('https://cvmais.co.mz/criar-cv') || body.includes('https://cvmais.co.mz/conta')) {
    return 'Private/editor route found in sitemap';
  }
  return '';
});

const robots = await request('/robots.txt');
inspect('Robots: official sitemap', robots, (r, body) => {
  if (r.status !== 200) return `HTTP ${r.status}`;
  return body.includes('https://cvmais.co.mz/sitemap.xml') ? '' : 'Official sitemap missing';
});

for (const path of ['/conta', '/criar-cv', '/meus-cvs']) {
  const result = await request(path);
  inspect(`Private route: ${path}`, result, (r) => {
    if (r.status >= 500) return `HTTP ${r.status}`;
    const header = r.headers.get('x-robots-tag') || '';
    return /\bnoindex\b/i.test(header) ? '' : 'Missing X-Robots-Tag: noindex';
  });
}


const professionSlugs = ['motorista', 'vendedor', 'estudante', 'administrativo', 'enfermeiro'];
inspect('Sitemap: 17 public URLs including 5 professions', sitemap, (r, body) => {
  if (r.status !== 200) return `HTTP ${r.status}`;
  const entries = [...body.matchAll(/<loc>/g)].length;
  if (entries !== 17) return `Expected 17 URLs, found ${entries}`;
  for (const slug of professionSlugs) {
    if (!body.includes(`${origin}/modelos/para/${slug}`)) return `Missing ${slug} in sitemap`;
  }
  return '';
});

inspect('Library: internal links to profession guides', models, (r, body) => {
  if (r.status !== 200) return `HTTP ${r.status}`;
  for (const slug of professionSlugs) {
    if (!body.includes(`/modelos/para/${slug}`)) return `Missing internal link: ${slug}`;
  }
  return '';
});

for (const slug of professionSlugs) {
  const path = `/modelos/para/${slug}`;
  const url = origin + path;
  const result = await request(path);
  inspect(`Profession page: ${slug}`, result, (response, body) => {
    if (response.status !== 200) return `HTTP ${response.status}`;
    if (response.url !== url) return `Unexpected final URL: ${response.url}`;
    if (!body.includes('<h1')) return 'No heading H1';
    if (!body.includes(`rel="canonical" href="${url}"`)) return 'Missing expected canonical';
    if (!body.includes('BreadcrumbList')) return 'Missing breadcrumb structured data';
    if (!body.includes('/criar-cv?')) return 'Missing editor CTA';
    if (/\\bnoindex\\b/i.test(response.headers.get('x-robots-tag') || '')) return 'Unexpected noindex header';
    return '';
  });
}

const passed = checks.filter((c) => c.passed).length;
const failed = checks.length - passed;
const summary = [
  '## CVMais production SEO audit',
  '',
  `Domain: \`${origin}\` | Passed: **${passed}/${checks.length}** | Failed: **${failed}**`,
  '',
  '| Check | Result | Details |',
  '|---|---|---|',
  ...checks.map((c) => `| ${c.label} | ${c.passed ? 'PASS' : 'FAIL'} | ${c.details.replaceAll('|','/')} |`),
  '',
  failed ? 'Deployment may be pending or the public domain may be unreachable.' : 'All tested SEO endpoints match the expected release.',
  '',
].join('\n');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
console.log(`\n${passed}/${checks.length} checks passed.\n`);
// On main pushes, report the pending manual deployment without marking CI red.
// Manual and scheduled runs are strict acceptance checks; push runs report only.
// This audit measures technical availability, NOT Google Search Console indexing.
if (failed && ['workflow_dispatch', 'schedule'].includes(process.env.GITHUB_EVENT_NAME || '')) process.exitCode = 1;
