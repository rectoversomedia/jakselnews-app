'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, MapPin, User, Zap } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Beranda' },
  { href: '/breaking-news', icon: Zap, label: 'Breaking', highlight: true },
  { href: '/artikel', icon: BookOpen, label: 'Berita' },
  { href: '/kategori/jaksel', icon: MapPin, label: 'Jaksel' },
  { href: '/profil', icon: User, label: 'Profil' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden shadow-nav">
      <div className="flex items-center justify-around h-16 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[60px]
                transition-colors duration-200
                ${item.highlight
                  ? isActive
                    ? 'text-red-600'
                    : 'text-red-500 hover:text-red-600'
                  : isActive
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              {item.highlight ? (
                <div className="relative">
                  <item.icon size={22} />
                  {!isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  )}
                </div>
              ) : (
                <item.icon size={22} />
              )}
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''} ${item.highlight ? (isActive ? 'text-red-600' : 'text-red-500') : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
