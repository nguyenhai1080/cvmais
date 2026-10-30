'use client';

import {useEffect, useState} from 'react';
import Script from 'next/script';
import {usePathname} from 'next/navigation';
import {trackUmamiPage} from '@/lib/umami-analytics';
import {UMAMI_WEBSITE_ID} from '@/lib/umami-config';

const websiteId = UMAMI_WEBSITE_ID;

export default function UmamiAnalytics() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) trackUmamiPage(pathname || '/');
  }, [ready, pathname]);

  // Disabled by default: enabling requires the exact Umami Cloud Website ID.
  if (!websiteId) return null;

  return (
    <Script
      id="umami-cloud"
      src="https://cloud.umami.is/script.js"
      strategy="afterInteractive"
      data-website-id={websiteId}
      data-domains="cvmais.co.mz"
      data-auto-track="false"
      onReady={() => setReady(true)}
    />
  );
}
