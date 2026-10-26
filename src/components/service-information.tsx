'use client';
import Header from '@/components/header';
import { useUILanguage } from '@/lib/ui-language';
export default function ServiceInformation({terms=false}:{terms?:boolean}) {
 const {locale}=useUILanguage(); const en=locale==='en';
 const sections=terms ? (en ? [
 ['Using CVMais','This version lets you create, edit and download a CV as a PDF for free. You can use the editor without an account. An account is optional for saving and synchronising CVs.'],
 ['Your content','Check that your information is accurate and that you have permission to use any photograph or other content you add. Do not use the service to impersonate another person or submit unlawful content. You retain control of the content you write.'],
 ['Templates and guidance','Template examples and portraits are fictional illustrations. Industry editions share layout families and adapt colours and example content. Guidance is general information; CVMais does not guarantee employment, interviews or compatibility with every recruitment system.'],
 ['Saving and availability','Download a private backup of important work. Browser data can be cleared, and connectivity or maintenance can interrupt the service. Review every page of the PDF before sending it.'],
 ['Changes and support','The features described here are currently free. Any future paid option will state its price and require your choice before purchase. Contact Soltech LDA about problems, data requests or these terms.'],
 ] : [
 ['Utilizar o CVMais','Esta versão permite criar, editar e descarregar um CV em PDF gratuitamente. Podes usar o editor sem conta. A conta é opcional para guardar e sincronizar CVs.'],
 ['O teu conteúdo','Confirma que a informação é verdadeira e que tens autorização para usar a fotografia ou outros conteúdos que adicionas. Não uses o serviço para te fazer passar por outra pessoa ou inserir conteúdo ilícito. Manténs o controlo do conteúdo que escreves.'],
 ['Modelos e orientações','Os exemplos e retratos dos modelos são ilustrações fictícias. As versões por área partilham famílias de composição e adaptam cores e conteúdos de exemplo. As orientações são informação geral; o CVMais não garante emprego, entrevistas ou compatibilidade com todos os sistemas de recrutamento.'],
 ['Guardar e disponibilidade','Descarrega uma cópia privada dos trabalhos importantes. Os dados do navegador podem ser apagados e a ligação ou a manutenção podem interromper o serviço. Revê todas as páginas do PDF antes de enviar.'],
 ['Alterações e apoio','As funcionalidades descritas aqui são actualmente gratuitas. Uma eventual opção paga indicará o preço e exigirá a tua escolha antes da compra. Contacta a Soltech LDA para problemas, pedidos sobre dados ou dúvidas sobre estes termos.'],
 ]) : (en ? [
 ['Made for your next step','CVMais helps people preparing applications in Mozambique present their education, experience and skills clearly. Portuguese (Mozambique) is the default; the interface and CV headings also support English.'],
 ['Who operates the service','CVMais is operated by Soltech LDA. For support, feedback and personal data requests, contact the email below. Never send your password or recovery code.'],
 ['What is available today','The editor, PDF export and current templates are free. No payment is required for these features. Guest drafts stay in your browser; an optional account lets you save and synchronise CVs.'],
 ] : [
 ['Feito para o teu próximo passo','O CVMais ajuda quem prepara candidaturas em Moçambique a apresentar a formação, a experiência e as competências com clareza. O português de Moçambique é o idioma predefinido; a interface e os títulos do CV também estão disponíveis em inglês.'],
 ['Quem opera o serviço','O CVMais é operado pela Soltech LDA. Para apoio, sugestões e pedidos sobre dados pessoais, usa o email abaixo. Nunca envies a tua palavra-passe ou código de recuperação.'],
 ['O que está disponível hoje','O editor, a exportação PDF e os modelos actuais são gratuitos. Não é necessário pagar por estas funcionalidades. Os rascunhos de visitante ficam no navegador; uma conta opcional permite guardar e sincronizar CVs.'],
 ]);
 return <><Header/><main className="container privacy-page"><span className="eyebrow">CVMais · Soltech LDA</span><h1>{terms?(en?'Terms of use':'Termos de utilização'):(en?'About and contact':'Sobre e contacto')}</h1>{sections.map(([title,text])=><section key={title}><h2>{title}</h2><p>{text}</p></section>)}<h2>{en?'Contact':'Contacto'}</h2><p><a href="mailto:admin@soltech.co.mz">admin@soltech.co.mz</a></p><p><a className="text-link" href="/privacidade">{en?'Privacy and data':'Privacidade e dados'}</a> · <a className="text-link" href={terms?'/sobre':'/termos'}>{terms?(en?'About and contact':'Sobre e contacto'):(en?'Terms of use':'Termos de utilização')}</a></p></main></>;
}
