'use client';
import { useEffect, useState } from 'react';
import { SITE_ORIGIN, LEGACY_ORIGIN } from '@/lib/site';
export default function AddressNotice() {
  const [legacy, setLegacy] = useState(false);
  useEffect(() => { setLegacy(window.location.origin === LEGACY_ORIGIN); }, []);
  if (!legacy) return null;
  return <aside className="address-notice" aria-label="Novo endereço do CVMais"><div className="container"><strong>O CVMais já está em cvmais.win.</strong><span>Os CVs da conta continuam disponíveis. Os rascunhos deste navegador precisam de ser transferidos.</span><a href="/mudar-endereco">Como levar o meu CV →</a><a href={SITE_ORIGIN}>Abrir cvmais.win ↗</a></div></aside>;
}
