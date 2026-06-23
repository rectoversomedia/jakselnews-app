'use client';

import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left - Hamburger Menu */}
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Menu"
          >
            <Menu size={22} className="text-gray-700" />
          </button>

          {/* Center - Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="font-bold text-gray-900">Jakselnews</span>
          </Link>

          {/* Right - Notification Bell */}
          <button
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell size={22} className="text-gray-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
