import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'CVMais — O teu próximo passo começa aqui',description:'Cria um currículo claro e profissional. Modelos de CV e orientação para a tua candidatura em Moçambique.',metadataBase:new URL('https://cvmais.co.mz')};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-MZ" data-scroll-behavior="smooth"><body>{children}</body></html>; }
