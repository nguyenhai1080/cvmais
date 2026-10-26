import type { Metadata } from 'next';
import ServiceInformation from '@/components/service-information';
export const metadata:Metadata={title:'Termos de utilização — CVMais',alternates:{canonical:'/termos'}};
export default function Page(){return <ServiceInformation terms/>;}
