import type { Metadata } from 'next';
import './globals.css';
import AddressNotice from '@/components/address-notice';
import { SITE_ORIGIN } from '@/lib/site';
export const metadata: Metadata = {title:'CVMais — O teu próximo passo começa aqui',description:'Cria um currículo claro e profissional. Modelos de CV e orientação para a tua candidatura em Moçambique.',metadataBase:new URL(SITE_ORIGIN)};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-MZ" data-scroll-behavior="smooth"><body><AddressNotice />{children}</body></html>; }
