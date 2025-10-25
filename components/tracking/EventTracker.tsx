'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getTracker, type PageType } from '@/lib/tracking';

export default function EventTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize tracker
    const tracker = getTracker();

    // Determine current page
    let page: PageType = 'hub';
    if (pathname.includes('/uniformish')) page = 'uniformish';
    else if (pathname.includes('/catnip')) page = 'catnip';
    else if (pathname.includes('/bad-arctic')) page = 'bad-arctic';

    // Track page view
    tracker.trackPageView(page);
  }, [pathname]);

  return null;
}
