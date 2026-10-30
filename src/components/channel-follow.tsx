'use client';
import {MessageCircle,ArrowUpRight} from 'lucide-react';
import {useUILanguage} from '@/lib/ui-language';
import {officialChannelURL,WHATSAPP_CHANNEL_URL} from '@/lib/community';

export default function ChannelFollow(){
 const {translate:ui}=useUILanguage();
 const channel=officialChannelURL(WHATSAPP_CHANNEL_URL);
 if(!channel)return null;
 return <a className="hero-channel-follow" href={channel} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true"/><span>{ui('Seguir o canal CVMais no WhatsApp')}</span><ArrowUpRight size={17} aria-hidden="true"/></a>;
}
