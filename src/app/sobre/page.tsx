import type { Metadata } from 'next';
import ServiceInformation from '@/components/service-information';
export const metadata:Metadata={title:'Sobre e contacto — CVMais',alternates:{canonical:'/sobre'}};
export default function Page(){return <ServiceInformation/>;}
