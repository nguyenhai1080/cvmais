import './sector-designs.css';
import type { Metadata } from 'next';
import './globals.css';
import { LanguageSync } from '@/lib/ui-language';
import AddressNotice from '@/components/address-notice';
import AnonymousPageviews from '@/components/anonymous-pageviews';
import { SITE_ORIGIN } from '@/lib/site';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: 'Criar CV Grátis Online em Moçambique | CVMais',
  description: 'Cria um currículo profissional grátis em Moçambique. Escolhe um modelo, prepara o teu percurso e descarrega o CV em PDF.',
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-MZ" data-scroll-behavior="smooth"><body><LanguageSync/><AddressNotice /><AnonymousPageviews/>{children}</body></html>;
}
