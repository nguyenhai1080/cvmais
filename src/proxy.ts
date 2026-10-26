import { NextResponse, type NextRequest } from 'next/server';
import { publicDomainRedirect } from './lib/domain-migration';
export function proxy(request: NextRequest) {
  const target=publicDomainRedirect(request.headers.get('host')||'',request.nextUrl.pathname,request.nextUrl.search,request.method);
  if(target)return NextResponse.redirect(target,308);
  const response = NextResponse.next();
  if(!['/','/modelos','/orientacoes','/sobre','/termos','/privacidade','/sitemap.xml','/robots.txt'].includes(request.nextUrl.pathname)&&!request.nextUrl.pathname.startsWith('/orientacoes/'))response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}
export const config = { matcher: ['/', '/modelos', '/orientacoes/:path*', '/sobre', '/termos', '/privacidade', '/sitemap.xml', '/robots.txt', '/operacoes', '/conta', '/meus-cvs', '/criar-cv', '/confirmar-email', '/repor-acesso', '/mudar-endereco', '/api/:path*'] };
