// Isolated QA only. Every Resend request is intercepted; no external email is sent.
import {readFileSync,appendFileSync} from 'node:fs';
const original=globalThis.fetch;
globalThis.fetch=async(input,init)=>{
  const url=String(input?.url || input);
  if(url==='https://api.resend.com/emails'){
    const mode=readFileSync(process.env.QA_MAIL_MODE,'utf8').trim();
    appendFileSync(process.env.QA_MAIL_CAPTURE,JSON.stringify({body:JSON.parse(init.body),key:init.headers['Idempotency-Key'],mode})+'\n',{mode:0o600});
    return mode==='fail'?new Response('',{status:503}):mode==='reject'?new Response('',{status:401}):Response.json({id:'fictional-provider-receipt'});
  }
  return original(input,init);
};
