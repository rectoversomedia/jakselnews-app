'use client';

import { useLanguage, Language } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import {
  GlobeHemisphereWest,
  Check,
} from '@phosphor-icons/react/dist/ssr';

export default function BahasaPage() {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; native: string; flag: string }[] = [
    { code: 'id', name: 'Indonesian', native: 'Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 pt-14 lg:pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-4xl font-black mb-4 tracking-tight">Jakselnews</p>
          <h1 className="text-2xl font-bold mb-2">{t('lang.title')}</h1>
          <p className="text-white/80 text-sm">{t('lang.subtitle')}</p>
        </div>
      </div>

      {/* Language Options */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full bg-white rounded-2xl p-5 shadow-sm transition-all hover:scale-[1.01] ${
                language === lang.code ? 'ring-2 ring-red-500' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{lang.native}</h3>
                  <p className="text-sm text-gray-500">{lang.name}</p>
                </div>
                {language === lang.code && (
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Check size={18} className="text-white" weight="bold" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
