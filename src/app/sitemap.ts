import type {MetadataRoute} from 'next';
import {guides} from '@/lib/guides';
import {professions,professionUrl} from '@/lib/profession-seo';
import {SITE_ORIGIN} from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{
 return [
  {url:SITE_ORIGIN,changeFrequency:'monthly',priority:1},
  {url:SITE_ORIGIN+'/modelos',changeFrequency:'monthly',priority:0.9},
  {url:SITE_ORIGIN+'/orientacoes',changeFrequency:'monthly',priority:0.8},
  ...['sobre','termos','privacidade'].map(path=>({url:SITE_ORIGIN+'/'+path,changeFrequency:'monthly' as const,priority:0.5})),
  ...guides.map(g=>({url:SITE_ORIGIN+'/orientacoes/'+g.slug,changeFrequency:'monthly' as const,priority:0.7})),
  ...professions.map(({slug})=>({url:SITE_ORIGIN+professionUrl(slug),changeFrequency:'monthly' as const,priority:0.75})),
 ];
}
