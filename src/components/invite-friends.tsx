'use client';
import { useState } from 'react';
import { Copy, MessageCircle, Users, ArrowUpRight } from 'lucide-react';
import { useUILanguage } from '@/lib/ui-language';
import { invitation, whatsappInvitationURL, officialChannelURL, WHATSAPP_CHANNEL_URL } from '@/lib/community';

export default function InviteFriends() {
  const {locale,translate:ui} = useUILanguage();
  const [status,setStatus] = useState('');
  const channel = officialChannelURL(WHATSAPP_CHANNEL_URL);
  return <section className="invite-friends" aria-labelledby="invite-friends-title">
    <div className="invite-heading"><Users aria-hidden="true" size={25}/><div><h3 id="invite-friends-title">{ui('Um bom começo merece ser partilhado.')}</h3><p>{ui('Convida alguém que esteja a preparar o seu próximo passo.')}</p></div></div>
    {channel && <p><a className="button small" href={channel} target="_blank" rel="noopener noreferrer">{ui('Seguir o canal CVMais no WhatsApp')}<ArrowUpRight size={17}/></a></p>}
    <details><summary>{ui('Ver a mensagem de convite')}</summary><p className="invite-message">{invitation(locale)}</p></details>
    <div className="invite-actions"><a className="button small" href={whatsappInvitationURL(locale)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true"/>{ui('Convidar pelo WhatsApp')}</a><button className="button outline small" type="button" onClick={async()=>{try{await navigator.clipboard.writeText(invitation(locale));setStatus('Convite copiado. Podes partilhá-lo com quem quiseres.');}catch{setStatus('Não foi possível copiar. Abre a mensagem de convite e copia o texto manualmente.');}}}><Copy size={17} aria-hidden="true"/>{ui('Copiar convite')}</button></div>
    <p className="invite-note">{ui('O WhatsApp abre para escolheres a quem enviar. A mensagem só é enviada quando confirmas no WhatsApp. O CVMais não acede aos teus contactos nem inclui dados do teu CV.')}</p>
    {status&&<p role="status">{ui(status)}</p>}
  </section>;
}
