import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/site';
// Do not disallow routes that must expose X-Robots-Tag: noindex to Googlebot.
export default function robots():MetadataRoute.Robots {
  return {rules:{userAgent:'*',allow:'/',disallow:['/operacoes','/api/']},sitemap:`${SITE_ORIGIN}/sitemap.xml`};
}
