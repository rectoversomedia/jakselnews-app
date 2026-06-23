'use client';

import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left - Hamburger Menu */}
          <button
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Menu"
          >
            <Menu size={24} className="text-gray-700" />
          </button>

          {/* Center - Logo */}
          <Link href="/" className="flex items-center mx-auto">
            <Image
              src="/logo-utama.png"
              alt="Jakselnews"
              width={160}
              height={40}
              className="h-9 md:h-11 w-auto"
              priority
            />
          </Link>

          {/* Right - Notification Bell */}
          <button
            className="relative p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell size={24} className="text-gray-700" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
