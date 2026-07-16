'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import {
  FileText,
  CheckCircle,
  Quotes,
  Lock,
  HandPalm,
  Megaphone,
} from '@phosphor-icons/react/dist/ssr';

export default function PedomanMediaSiberPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  const sections = [
    {
      icon: CheckCircle,
      title: t('media.section1Title'),
      content: t('media.section1Text'),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Quotes,
      title: t('media.section2Title'),
      content: t('media.section2Text'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: FileText,
      title: t('media.section3Title'),
      content: t('media.section3Text'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Lock,
      title: t('media.section4Title'),
      content: t('media.section4Text'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      icon: HandPalm,
      title: t('media.section5Title'),
      content: t('media.section5Text'),
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Megaphone,
      title: t('media.section6Title'),
      content: t('media.section6Text'),
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 pt-14 lg:pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <h1 className="text-2xl font-bold mb-2">{t('media.title')}</h1>
          <p className="text-white/80 text-sm">{t('media.lastUpdated')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <p className="text-gray-600 leading-relaxed">{t('media.intro')}</p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${section.bgColor} rounded-xl flex items-center justify-center shrink-0`}>
                  <section.icon size={20} className={section.color} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-13">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
