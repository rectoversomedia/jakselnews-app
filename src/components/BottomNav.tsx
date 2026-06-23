'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, BookOpen, Newspaper } from 'lucide-react';

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const navItems = [
  { href: '/', icon: Home, label: 'Beranda' },
  { href: '/artikel', icon: BookOpen, label: 'Artikel' },
  { href: '/lapor', label: 'Lapor', isSpecial: true },
  { href: '/breaking-news', icon: Newspaper, label: 'Info Terkini' },
  { href: '/layanan', label: 'Layanan', useGrid: true },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center px-1 -mt-3"
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-[2px] border-white">
                  <Image
                    src="/logo-button.png"
                    alt="Jakselnews"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-medium text-gray-600 mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-0.5 px-2 py-1
                transition-colors duration-200
                ${isActive
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              {item.useGrid ? <GridIcon /> : item.icon && <item.icon size={22} />}
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
