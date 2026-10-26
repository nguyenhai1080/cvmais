'use client';
import { t as ui, useUILanguage } from '@/lib/ui-language';
import { useEffect, useState } from 'react';
import { SITE_ORIGIN, PREVIOUS_ORIGINS } from '@/lib/site';
export default function AddressNotice() {const {translate:ui}=useUILanguage();
  const [legacy, setLegacy] = useState(false);
  useEffect(() => { setLegacy(PREVIOUS_ORIGINS.some(origin=>origin===window.location.origin)); }, []);
  if (!legacy) return null;
  return <aside className="address-notice" aria-label={ui("Novo endereço do CVMais")}><div className="container"><strong>{ui("O CVMais já está em cvmais.co.mz.")}</strong><span>{ui("Os CVs da conta continuam disponíveis. Os rascunhos deste navegador precisam de ser transferidos.")}</span><a href="/mudar-endereco">{ui("Como levar o meu CV →")}</a><a href={SITE_ORIGIN}>{ui("Abrir cvmais.co.mz ↗")}</a></div></aside>;
}
