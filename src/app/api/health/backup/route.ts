import { backupHealth } from '../../../../../scripts/backup-health.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  const health = await backupHealth();
  return Response.json({ status: health.healthy ? 'ok' : 'attention', service: 'cvmais-backup' }, { status: health.healthy ? 200 : 503, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
}
