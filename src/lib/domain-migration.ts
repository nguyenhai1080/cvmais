import { SITE_ORIGIN, PREVIOUS_ORIGINS } from './site.ts';
const previousHosts=PREVIOUS_ORIGINS.map(origin=>new URL(origin).host);
const publicPaths=new Set(['/','/modelos','/orientacoes','/sobre','/termos','/privacidade','/sitemap.xml','/robots.txt']);
/** Keep old editor/auth/API routes available: drafts and sessions are origin scoped. */
export function publicDomainRedirect(host:string,pathname:string,search:string,method:string):string|null {
 if(!['GET','HEAD'].includes(method))return null;
 const officialWWW=host===`www.${new URL(SITE_ORIGIN).host}`;
 if(!officialWWW&&!previousHosts.includes(host))return null;
 if(!officialWWW&&!publicPaths.has(pathname)&&!pathname.startsWith('/orientacoes/')&&!pathname.startsWith('/modelos/para/'))return null;
 const target=new URL(SITE_ORIGIN);target.pathname=pathname;target.search=search;
 return target.href;
}
