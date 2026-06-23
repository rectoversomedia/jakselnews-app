'use client';

import { useState } from 'react';
import { Bell, Menu, X, Moon, Sun, Globe, Shield, Mail, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuItems = [
    { icon: Globe, label: 'Theme Setting', onClick: () => setIsDarkMode(!isDarkMode) },
    { icon: Shield, label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
    { icon: FileText, label: 'Pedoman Media Siber', href: '/pedoman-media-siber' },
    { icon: Mail, label: 'Hubungi Kami', href: '/hubungi-kami' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Left - Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Menu"
            >
              <Menu size={22} className="text-gray-700" />
            </button>

            {/* Center - Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-utama.png"
                alt="Jakselnews"
                width={140}
                height={35}
                className="h-7 md:h-9 w-auto object-contain"
                priority
              />
            </Link>

            {/* Right - Notification Bell */}
            <Link href="/notifikasi" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
          </div>
        </div>
      </header>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-72 h-full bg-white z-50 animate-slide-right">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href || '#'}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <item.icon size={20} className="text-gray-600" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                  {item.label === 'Theme Setting' && (
                    <span className="ml-auto text-xs text-gray-400">
                      {isDarkMode ? '🌙' : '☀️'}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
