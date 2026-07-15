'use client';

import HomeContent from '@/components/HomeContent';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export default function HomePage() {
  return (
    <main className="pb-20 lg:pb-0 bg-gray-50 min-h-screen">
      <Header />
      <BottomNav />
      <HomeContent />
    </main>
  );
}
