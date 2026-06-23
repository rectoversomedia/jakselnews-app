'use client';

import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left - Hamburger Menu */}
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Menu"
          >
            <Menu size={22} className="text-gray-700" />
          </button>

          {/* Center - Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center gap-1">
              <div className="relative">
                <span className="text-2xl md:text-3xl font-black text-red-600">J</span>
                <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              </div>
              <span className="font-black text-lg md:text-xl text-gray-900">akselnews</span>
              <span className="font-medium text-xs md:text-sm text-gray-400">.com</span>
            </div>
          </Link>

          {/* Right - Notification Bell */}
          <button
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
