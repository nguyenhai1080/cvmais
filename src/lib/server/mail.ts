import { deliverBody } from '../../../scripts/auth-mail-transport.mjs';
export { mailEnabled,tokenMessage,sendTokenEmail } from '../../../scripts/auth-mail-transport.mjs';
export { queuedMailEnabled } from '../../../scripts/auth-mail-core.mjs';
export type MailPurpose = 'verify' | 'reset';
export function sendDeliveryTest(email: string) {
  return deliverBody({from:process.env.MAIL_FROM,to:[email],subject:'CVMais · Teste de envio de email',text:'Este é o teste técnico de envio de email do CVMais, solicitado pelo administrador DGC. O domínio cvmais.win está configurado para as mensagens de confirmação e recuperação de acesso. Não precisas de responder nem de realizar qualquer acção.\n\nCVMais'},'cvmais-delivery-test-20261024');
}
