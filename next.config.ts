import type { NextConfig } from 'next';
const privatePages = ['/conta/:path*','/meus-cvs/:path*','/criar-cv/:path*','/confirmar-email/:path*','/repor-acesso/:path*','/mudar-endereco/:path*','/operacoes/:path*'];
const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  experimental: { cpus: 2 },
  async headers() {
    return privatePages.map(source => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }));
  },
};
export default nextConfig;
