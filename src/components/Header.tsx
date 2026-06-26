'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Colorful Phosphor-style SVG Icons with white background boxes
const MenuIcon = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-600" stroke="currentColor" strokeWidth={2}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </div>
);

const BellIcon = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm relative">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-600" stroke="currentColor" strokeWidth={2}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
  </div>
);

const CloseIcon = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-600" stroke="currentColor" strokeWidth={2}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </div>
);

const SunIcon = ({ active }: { active: boolean }) => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-amber-500'}`} stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  </div>
);

const MoonIcon = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-indigo-600" stroke="currentColor" strokeWidth={2}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  </div>
);

const ShieldIcon = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-blue-500" stroke="currentColor" strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  </div>
);

const FileTextIcon = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-green-500" stroke="currentColor" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  </div>
);

const MailIcon = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-purple-500" stroke="currentColor" strokeWidth={2}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  </div>
);

const InfoIcon = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-cyan-500" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  </div>
);

const HelpCircleIcon = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-orange-500" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  </div>
);

const AlertIcon = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-500" stroke="currentColor" strokeWidth={2}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  </div>
);

interface MenuItemType {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

const menuItems: MenuItemType[] = [
  { icon: <ShieldIcon />, label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
  { icon: <FileTextIcon />, label: 'Pedoman Media Siber', href: '/pedoman-media-siber' },
  { icon: <MailIcon />, label: 'Hubungi Kami', href: '/hubungi-kami' },
  { icon: <InfoIcon />, label: 'Tentang Jakselnews', href: '/tentang' },
  { icon: <HelpCircleIcon />, label: 'Pusat Bantuan', href: '/bantuan' },
  { icon: <AlertIcon />, label: 'Laporkan Masalah', href: '/lapor-masalah' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-50 shadow-sm">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Left - Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="transition-transform active:scale-95"
              aria-label="Menu"
            >
              <MenuIcon />
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
            <Link href="/notifikasi" className="transition-transform active:scale-95">
              <BellIcon />
            </Link>
          </div>
        </div>
      </header>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-80 max-w-[85vw] h-full bg-white z-50 shadow-2xl">
            {/* Header - Centered Logo */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <Image src="/logo-utama.png" alt="Jakselnews" width={120} height={30} className="h-8 w-auto" />
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 transition-transform active:scale-95"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
              {/* Dark Mode Toggle */}
              <div className="bg-gray-50 rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {darkMode ? <MoonIcon /> : <SunIcon active={false} />}
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

              {/* Divider */}
              <div className="border-t border-gray-100 my-3" />

              {/* Other Menu Items */}
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href || '#'}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  {item.icon}
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </Link>
              ))}
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
