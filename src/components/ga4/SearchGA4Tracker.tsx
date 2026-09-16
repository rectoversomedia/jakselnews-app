'use client';

import { useEffect } from 'react';
import { useGA4 } from '@/hooks/useGA4';
import { trackSearch } from '@/lib/ga4';

interface SearchTrackerProps {
  searchTerm: string;
  resultCount: number;
}

export function SearchGA4Tracker({ searchTerm, resultCount }: SearchTrackerProps) {
  useGA4();

  useEffect(() => {
    if (searchTerm.trim()) {
      trackSearch({
        searchTerm: searchTerm.trim(),
        resultCount,
        searchType: 'all',
      });
    }
  }, [searchTerm, resultCount]);

  return null;
}
