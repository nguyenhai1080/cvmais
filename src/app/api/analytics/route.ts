import {NextRequest} from 'next/server';
import {allowedOrigin} from '@/lib/server/origins';
import {parseMetricPayload} from '@/lib/anonymous-metrics';
import {store} from '@/lib/server/store';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'};
const fail=(code:number)=>new Response(null,{status:code,headers});

export async function POST(request:NextRequest){
  if(!allowedOrigin(request.headers.get('origin'),new URL(request.url).origin))return fail(403);
  if(request.headers.get('sec-fetch-site')==='cross-site')return fail(403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return fail(415);
  const reader=request.body?.getReader();
  if(!reader)return fail(400);
  let size=0;
  const parts:Uint8Array[]=[];
  try{
    while(true){
      const {done,value}=await reader.read();
      if(done)break;
      size+=value.byteLength;
      if(size>220){await reader.cancel();return fail(413);}
      parts.push(value);
    }
    const payload=parseMetricPayload(JSON.parse(Buffer.concat(parts).toString('utf8')));
    if(!payload)return fail(400);
    const db=store();
    db.limit('aggregate-events-global',6000,60_000); // No client IP / device identifier stored.
    db.recordAnonymousMetric(payload);
    return new Response(null,{status:204,headers});
  }catch(error){
    // No request body, IP or other identifying context in server logs.
    if(error instanceof Error&&'status' in error&&(error as {status:number}).status===429)return fail(429);
    return fail(400);
  }
}
export function GET(){return fail(405);}
