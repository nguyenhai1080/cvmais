// Only explicit deployment-controlled origins are trusted, never request Host headers.
export function allowedOrigin(origin: string | null, fallback: string) {
  if (!origin) return false;
  const allowed = [process.env.APP_ORIGIN || fallback, ...(process.env.APP_ALLOWED_ORIGINS || '').split(',')];
  return allowed.some(value => {
    const configured = value.trim();
    try { const url = new URL(configured); return url.origin === configured && ['https:', 'http:'].includes(url.protocol) && configured === origin; }
    catch { return false; }
  });
}
