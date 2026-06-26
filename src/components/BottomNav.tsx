'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Colorful SVG Icons with white background boxes
const HomeIcon = ({ active }: { active: boolean }) => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${active ? 'text-red-500' : 'text-gray-500'}`} stroke="currentColor" strokeWidth={2}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  </div>
);

const ArticleIcon = ({ active }: { active: boolean }) => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${active ? 'text-red-500' : 'text-gray-500'}`} stroke="currentColor" strokeWidth={2}>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  </div>
);

const LaporIcon = () => (
  <div className="w-11 h-11 -mt-3 rounded-full bg-white shadow-lg flex items-center justify-center border-[2px] border-white">
    <Image
      src="/logo-button.png"
      alt="Jakselnews"
      width={44}
      height={44}
      className="w-full h-full object-cover rounded-full"
    />
  </div>
);

const InfoIcon = ({ active }: { active: boolean }) => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${active ? 'text-red-500' : 'text-gray-500'}`} stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  </div>
);

const LayananIcon = ({ active }: { active: boolean }) => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${active ? 'text-red-500' : 'text-gray-500'}`} stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  </div>
);

const navItems = [
  { href: '/', label: 'Beranda', icon: HomeIcon },
  { href: '/artikel', label: 'Artikel', icon: ArticleIcon },
  { href: '/lapor', label: 'Lapor', isSpecial: true },
  { href: '/breaking-news', label: 'Info Terkini', icon: InfoIcon },
  { href: '/layanan', label: 'Layanan', icon: LayananIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 z-50 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center"
              >
                <LaporIcon />
                <span className="text-[10px] font-medium text-gray-600 mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 py-1"
            >
              {IconComponent && <IconComponent active={isActive} />}
              <span className={`text-[10px] font-medium ${isActive ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
