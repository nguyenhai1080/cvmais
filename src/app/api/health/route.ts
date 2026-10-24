import { store } from '@/lib/server/store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export function GET() {
  try {
    store().db.prepare('SELECT 1').get();
    return Response.json({ status: 'ok', service: 'cvmais', storage: 'ready' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ status: 'unavailable', service: 'cvmais' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
