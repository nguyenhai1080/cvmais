import { NextResponse, type NextRequest } from 'next/server';
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}
export const config = { matcher: ['/conta', '/meus-cvs', '/criar-cv', '/confirmar-email', '/repor-acesso', '/mudar-endereco', '/api/:path*'] };
