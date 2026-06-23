'use client';

import { useState } from 'react';
import { Bell, Menu, X, Sun, Moon, Globe, Shield, FileText, Mail, Info, HelpCircle, AlertTriangle, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface MenuItem {
  icon?: LucideIcon;
  label: string;
  href?: string;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: Globe, label: 'Bahasa Indonesia' },
    { icon: Shield, label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
    { icon: FileText, label: 'Pedoman Media Siber', href: '/pedoman-media-siber' },
    { icon: Mail, label: 'Hubungi Kami', href: '/hubungi-kami' },
    { icon: Info, label: 'Tentang Jakselnews', href: '/tentang' },
    { icon: HelpCircle, label: 'Pusat Bantuan', href: '/bantuan' },
    { icon: AlertTriangle, label: 'Laporkan Masalah', href: '/lapor-masalah' },
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
          <div className="fixed top-0 left-0 w-80 max-w-[85vw] h-full bg-white z-50 shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/logo-utama.png" alt="Jakselnews" width={100} height={25} className="h-6 w-auto" />
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
              {/* Dark Mode Toggle */}
              <div className="bg-gray-50 rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {darkMode ? (
                      <Moon size={20} className="text-indigo-600" />
                    ) : (
                      <Sun size={20} className="text-amber-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {darkMode ? 'Mode Gelap' : 'Mode Terang'}
                    </span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <Globe size={20} className="text-gray-500" />
                <span className="text-sm text-gray-700">Bahasa Indonesia</span>
                <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Aktif</span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-3" />

              {/* Other Menu Items */}
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={index}
                    href={item.href || '#'}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {IconComponent && <IconComponent size={20} className="text-gray-500" />}
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-400 text-center">
                Jakselnews.com v1.0
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
