'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PhHouse,
  PhNewspaper,
  PhWarning,
  PhBell,
  PhSquaresFour,
  PhPlus,
  PhList,
  PhX,
  PhMagnifyingGlass,
  PhUser,
} from '@phosphor-icons/react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  isCenter?: boolean;
  gradient?: string;
}

const navItems: NavItem[] = [
  { id: 'beranda', label: 'Beranda', icon: <PhHouse size={24} weight="fill" />, href: '/', gradient: 'from-red-500 to-rose-500' },
  { id: 'artikel', label: 'Artikel', icon: <PhNewspaper size={24} weight="fill" />, href: '/artikel', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'lapor', label: 'Lapor', icon: <PhPlus size={28} weight="bold" />, href: '/lapor', isCenter: true, gradient: 'from-red-500 to-rose-500' },
  { id: 'info', label: 'Info', icon: <PhBell size={24} weight="fill" />, href: '/info-terkini', gradient: 'from-violet-500 to-purple-500' },
  { id: 'layanan', label: 'Layanan', icon: <PhSquaresFour size={24} weight="fill" />, href: '/layanan', gradient: 'from-emerald-500 to-teal-500' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopNav, setShowTopNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Header - Hidden on mobile */}
      {/* Note: Header is now in Header.tsx component */}

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-safe">
        <div className="flex items-center justify-around h-16 relative">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${
                isActive(item.href)
                  ? 'text-gray-900'
                  : 'text-gray-400'
              }`}
            >
              {item.isCenter ? (
                <div className={`flex items-center justify-center w-14 h-14 -mt-6 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-110 transition-all duration-300`}>
                  <span className="text-white">{item.icon}</span>
                </div>
              ) : (
                <>
                  <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-br ' + item.gradient + ' text-white shadow-lg'
                      : ''
                  }`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </>
              )}
            </Link>
          ))}
        </div>

        {/* Gradient overlay at top */}
        <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-b from-gray-50/0 to-gray-50/100 pointer-events-none" />
      </nav>
    </>
  );
}
