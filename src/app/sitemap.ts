import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides';
import { SITE_ORIGIN } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: SITE_ORIGIN, changeFrequency: 'monthly', priority: 1 }, { url: `${SITE_ORIGIN}/modelos`, changeFrequency:'monthly',priority:0.9 }, { url: `${SITE_ORIGIN}/orientacoes`, changeFrequency: 'monthly', priority: 0.8 }, ...guides.map(g=>({url:`${SITE_ORIGIN}/orientacoes/${g.slug}`,changeFrequency:'monthly' as const,priority:0.7}))]; }
