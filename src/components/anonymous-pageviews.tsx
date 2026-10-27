'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {trackAnalyticsPage} from '@/lib/seo-analytics';

export default function AnonymousPageviews(){
  const pathname=usePathname();
  useEffect(()=>{trackAnalyticsPage(pathname || '/');},[pathname]);
  return null;
}
