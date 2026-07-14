'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  List,
  X,
  Bell,
  MagnifyingGlass,
  User,
  House,
  Newspaper,
  Warning,
  SquaresFour,
} from '@phosphor-icons/react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  rightAction?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  showLogo = true,
  rightAction,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Jaksel<span className="text-red-500">news</span></span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-1">
              {[
                { href: '/', icon: House, label: 'Beranda' },
                { href: '/artikel', icon: Newspaper, label: 'Artikel' },
                { href: '/lapor', icon: Warning, label: 'Lapor' },
                { href: '/info-terkini', icon: Bell, label: 'Info' },
                { href: '/layanan', icon: SquaresFour, label: 'Layanan' },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                >
                  <Icon size={18} weight="regular" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
                <MagnifyingGlass size={20} />
              </button>
              <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link
                href="/admin"
                className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <User size={20} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-md' : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left */}
          <div className="flex items-center gap-2">
            {showBack ? (
              <Link
                href="javascript:history.back()"
                className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={() => setShowMenu(true)}
                className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <List size={24} weight="bold" className="text-gray-700" />
              </button>
            )}
          </div>

          {/* Center */}
          <div className="flex items-center">
            {showLogo ? (
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <span className="font-bold text-gray-900">Jaksel<span className="text-red-500">news</span></span>
              </Link>
            ) : title ? (
              <h1 className="font-bold text-gray-900 truncate max-w-[180px]">
                {title}
              </h1>
            ) : null}
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            {rightAction}
            <Link href="/artikel" className="p-2 -mr-2 rounded-xl hover:bg-gray-100 transition-colors">
              <MagnifyingGlass size={20} className="text-gray-700" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {showMenu && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-red-500 to-rose-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <span className="font-bold text-xl text-white">Jakselnews</span>
              </div>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 rounded-xl hover:bg-white/20 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {[
                { href: '/', icon: House, label: 'Beranda', color: 'from-red-500 to-rose-500' },
                { href: '/artikel', icon: Newspaper, label: 'Artikel', color: 'from-blue-500 to-cyan-500' },
                { href: '/lapor', icon: Warning, label: 'Lapor Kejadian', color: 'from-amber-500 to-orange-500' },
                { href: '/info-terkini', icon: Bell, label: 'Info Terkini', color: 'from-violet-500 to-purple-500' },
                { href: '/layanan', icon: SquaresFour, label: 'Layanan', color: 'from-emerald-500 to-teal-500' },
              ].map(({ href, icon: Icon, label, color }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon size={20} weight="fill" className="text-white" />
                  </div>
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            {/* Admin Link */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
              <Link
                href="/admin"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <span>Admin Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
