'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  House,
  Newspaper,
  Bell,
  SquaresFour,
  MagnifyingGlass,
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
  { id: 'beranda', label: 'Beranda', icon: <House size={22} weight="fill" />, href: '/' },
  { id: 'artikel', label: 'Artikel', icon: <Newspaper size={22} weight="fill" />, href: '/artikel' },
  { id: 'lapor', label: 'Lapor', icon: null, href: '/lapor', isCenter: true, gradient: 'from-red-500 to-rose-600' },
  { id: 'info', label: 'Info Terkini', icon: <Bell size={22} weight="fill" />, href: '/info-terkini' },
  { id: 'layanan', label: 'Layanan', icon: <SquaresFour size={22} weight="fill" />, href: '/layanan' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getColorClass = (itemId: string) => {
    if (itemId === 'beranda') return 'text-red-500';
    if (itemId === 'artikel') return 'text-blue-500';
    if (itemId === 'info') return 'text-violet-500';
    if (itemId === 'layanan') return 'text-emerald-500';
    return 'text-gray-500';
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo-utama.png"
                alt="Jakselnews"
                width={140}
                height={36}
                className="object-contain"
                priority
              />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
                />
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="flex items-center gap-1">
              {navItems.filter(item => !item.isCenter).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'text-red-500 bg-red-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - STICKY */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white backdrop-blur-xl border-t border-gray-100"
        aria-label="Navigasi utama"
        role="navigation"
      >
        <div className="flex items-center justify-around h-16 relative">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200 ${
                isActive(item.href)
                  ? 'text-red-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.isCenter ? (
                <div
                  className="flex items-center justify-center w-14 h-14 -mt-6 transition-all duration-200"
                  aria-hidden="true"
                >
                  <Image
                    src="/logo-jakselnews.png"
                    alt="Lapor"
                    width={44}
                    height={44}
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
              ) : (
                <>
                  <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-red-50'
                      : ''
                  }`} aria-hidden="true">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </>
              )}
            </Link>
          ))}
        </div>

        {/* Safe area for notch devices */}
        <div className="h-[env(safe-area-inset-bottom)] bg-white/98" aria-hidden="true" />
      </nav>
    </>
  );
}
