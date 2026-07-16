'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Shield,
  Lock,
  Eye,
  Cookie,
  FileText,
  Envelope,
  CaretRight,
} from '@phosphor-icons/react/dist/ssr';

export default function KebijakanPrivasiPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  const sections = [
    {
      icon: Eye,
      title: t('privacy.section1Title'),
      content: t('privacy.section1Text'),
    },
    {
      icon: Lock,
      title: t('privacy.section2Title'),
      content: t('privacy.section2Text'),
    },
    {
      icon: Shield,
      title: t('privacy.section3Title'),
      content: t('privacy.section3Text'),
    },
    {
      icon: FileText,
      title: t('privacy.section4Title'),
      content: t('privacy.section4Text'),
    },
    {
      icon: Cookie,
      title: t('privacy.section5Title'),
      content: t('privacy.section5Text'),
    },
    {
      icon: CaretRight,
      title: t('privacy.section6Title'),
      content: t('privacy.section6Text'),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 pt-14 lg:pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <h1 className="text-2xl font-bold mb-2">{t('privacy.title')}</h1>
          <p className="text-white/80 text-sm">{t('privacy.lastUpdated')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <p className="text-gray-600 leading-relaxed">{t('privacy.intro')}</p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <section.icon size={20} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-13">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">{t('privacy.contactTitle')}</h2>
          <p className="text-gray-600 mb-4">{t('privacy.contactText')}</p>
          <div className="flex items-center gap-2 text-blue-600">
            <Envelope size={18} />
            <a href="mailto:privacy@jakselnews.com" className="font-medium">privacy@jakselnews.com</a>
          </div>
        </div>
      </div>
    </main>
  );
}
