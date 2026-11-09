import type {Metadata} from 'next';
import Content from '@/components/privacy-content';
export const metadata:Metadata={
 title:'Privacidade e dados — CVMais',
 description:'Como o CVMais guarda os teus rascunhos, CVs e dados de conta, e como podes controlar ou eliminar os teus dados.',
 alternates:{canonical:'/privacidade'},
};
export default function Page(){return <Content/>;}
