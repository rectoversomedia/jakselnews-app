'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Info,
  FileText,
  Shield,
  BellRinging,
  GlobeHemisphereWest,
  Moon,
  Sun,
  CaretRight,
} from '@phosphor-icons/react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

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
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { href: '/tentang', icon: Info, label: t('menu.tentang') === 'Tentang' ? 'Tentang Jakselnews' : 'About Jakselnews' },
    { href: '/pedoman-media-siber', icon: FileText, label: t('menu.tentang') === 'Tentang' ? 'Pedoman Media Siber' : 'Media Guidelines' },
    { href: '/kebijakan-privasi', icon: Shield, label: t('menu.tentang') === 'Tentang' ? 'Kebijakan Privasi' : 'Privacy Policy' },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo-utama.png"
                alt="Jakselnews"
                width={168}
                height={43}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-1">
              {[
                { href: '/', icon: House, label: 'Beranda' },
                { href: '/artikel', icon: Newspaper, label: 'Artikel' },
                { href: '/lapor', icon: Warning, label: 'Lapor' },
                { href: '/info-terkini', icon: Bell, label: 'Info Terkini' },
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
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo-utama.png"
                  alt="Jakselnews"
                  width={132}
                  height={34}
                  className="object-contain"
                  priority
                />
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
            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500 to-rose-500">
              <span className="text-lg font-bold text-white">Menu</span>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 rounded-xl hover:bg-white/20 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Main Navigation */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Navigasi</p>
              <nav className="space-y-1">
                {[
                  { href: '/', icon: House, label: 'Beranda', color: 'from-red-500 to-rose-500' },
                  { href: '/artikel', icon: Newspaper, label: 'Artikel', color: 'from-blue-500 to-cyan-500' },
                  { href: '/lapor', icon: Warning, label: 'Lapor Kejadian', color: 'from-pink-400 to-pink-500' },
                  { href: '/info-terkini', icon: Bell, label: 'Info Terkini', color: 'from-violet-500 to-purple-500' },
                  { href: '/layanan', icon: SquaresFour, label: 'Layanan', color: 'from-emerald-500 to-teal-500' },
                ].map(({ href, icon: Icon, label, color }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg shrink-0`}>
                      <Icon size={20} weight="fill" className="text-white" />
                    </div>
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* About & Info Links */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Tentang</p>
              <nav className="space-y-1">
                {menuItems.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-gray-500" />
                    </div>
                    <span className="flex-1">{label}</span>
                    <CaretRight size={16} className="text-gray-400" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Settings */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Pengaturan</p>
              <nav className="space-y-1">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    {theme === 'dark' ? <Moon size={20} className="text-indigo-500" /> : <Sun size={20} className="text-amber-500" />}
                  </div>
                  <span className="flex-1 text-left">Tampilan</span>
                  <span className="text-sm text-gray-400">{theme === 'dark' ? 'Gelap' : 'Terang'}</span>
                </button>

                {/* Notification Settings */}
                <Link
                  href="/pengaturan-notifikasi"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <BellRinging size={20} className="text-gray-500" />
                  </div>
                  <span className="flex-1">Pengaturan Notifikasi</span>
                  <CaretRight size={16} className="text-gray-400" />
                </Link>

                {/* Language Toggle */}
                <button
                  onClick={() => {
                    setLanguage(language === 'id' ? 'en' : 'id');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <GlobeHemisphereWest size={20} className="text-gray-500" />
                  </div>
                  <span className="flex-1 text-left">Bahasa</span>
                  <span className="text-sm font-medium text-red-500">{language === 'id' ? 'ID' : 'EN'}</span>
                </button>
              </nav>
            </div>

            {/* Footer */}
            <div className="mt-auto p-4 bg-gray-50">
              <p className="text-xs text-gray-400 text-center">Jakselnews v2.0</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
