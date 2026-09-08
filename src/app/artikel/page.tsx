// Server component — disables ISR so client always gets fresh data
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ArtikelClient from './ArtikelClient';
import type { ComponentProps } from 'react';

type SuspenseProps = ComponentProps<typeof Suspense>;

export default function ArtikelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ArtikelClient />
    </Suspense>
  );
}
