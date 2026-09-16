'use client';

import { useEffect, useRef } from 'react';
import { trackPageView, trackScrollDepth, trackTimeOnPage } from '@/lib/ga4';

/**
 * Hook to track page views + scroll depth + time on page.
 * Use once per page component.
 */
export function useGA4() {
  const startTimeRef = useRef(Date.now());
  const trackedDepthsRef = useRef<Set<number>>(new Set());
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // Track page view on mount and route changes
    if (!hasTrackedRef.current) {
      trackPageView(window.location.pathname, document.title);
      hasTrackedRef.current = true;
    }

    // Reset state on path change
    const currentPath = window.location.pathname;
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        observer.disconnect();
        // Page changed — track time on previous page
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        trackTimeOnPage(elapsed);
        // Reset for new page
        startTimeRef.current = Date.now();
        trackedDepthsRef.current.clear();
        hasTrackedRef.current = false;
        trackPageView(window.location.pathname, document.title);
        hasTrackedRef.current = true;
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Scroll depth tracker
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percentage = Math.round((scrollTop / docHeight) * 100);

      // Track each 25% milestone once
      for (const milestone of [25, 50, 75, 100]) {
        if (percentage >= milestone && !trackedDepthsRef.current.has(milestone)) {
          trackedDepthsRef.current.add(milestone);
          trackScrollDepth(milestone);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Time on page on unload
    const handleUnload = () => {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      trackTimeOnPage(elapsed);
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        trackTimeOnPage(elapsed);
      }
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
}
