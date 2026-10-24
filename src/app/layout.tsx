import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'CVMais — O teu próximo passo começa aqui',description:'Cria um currículo claro e profissional. Modelos de CV e orientação para a tua candidatura em Moçambique.',metadataBase:new URL(process.env.APP_ORIGIN || 'https://cvmais-dgc.n1.tinhgon.xyz')};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-MZ" data-scroll-behavior="smooth"><body>{children}</body></html>; }
