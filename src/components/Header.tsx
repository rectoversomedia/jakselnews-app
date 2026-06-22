'use client';

import { useState } from 'react';
import { Bell, Menu, X, Search } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main Header */}
      <div className="container">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-base md:text-lg">J</span>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-base md:text-lg font-bold text-gray-900 leading-tight">Jakselnews</h1>
              <p className="text-[10px] md:text-xs text-gray-500 leading-tight">Hyperlocal Media Jaksel</p>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search Button - Desktop */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex p-2.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-gray-600" />
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X size={20} className="text-gray-600" />
              ) : (
                <Menu size={20} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        {isSearchOpen && (
          <div className="hidden md:block pb-3 animate-fade-in">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita, topik, atau lokasi..."
                className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 md:hidden animate-slide-up">
            <div className="container py-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary text-sm">🏠</span>
                  </span>
                  Beranda
                </Link>
                <Link
                  href="/breaking-news"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-red-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-sm">⚡</span>
                  </span>
                  Breaking News
                </Link>
                <Link
                  href="/artikel"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="w-8 h-8 bg-jaksel-blue/10 rounded-lg flex items-center justify-center">
                    <span className="text-jaksel-blue text-sm">📰</span>
                  </span>
                  Semua Berita
                </Link>
                <Link
                  href="/kategori/banjir"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="w-8 h-8 bg-jaksel-flood/10 rounded-lg flex items-center justify-center">
                    <span className="text-jaksel-flood text-sm">🌊</span>
                  </span>
                  Info Banjir
                </Link>
                <Link
                  href="/kategori/lalu-lintas"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="w-8 h-8 bg-jaksel-traffic/10 rounded-lg flex items-center justify-center">
                    <span className="text-jaksel-traffic text-sm">🚗</span>
                  </span>
                  Lalu Lintas
                </Link>
                <Link
                  href="/layanan"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary text-sm">📋</span>
                  </span>
                  Layanan Publik
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
