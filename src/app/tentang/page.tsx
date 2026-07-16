'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Info,
  Envelope,
  MapPin,
  Heart,
  Target,
  Eye,
  DeviceMobile,
  Users,
  Newspaper,
  Warning,
} from '@phosphor-icons/react/dist/ssr';

export default function TentangPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  const stats = [
    { icon: Newspaper, value: '10K+', label: language === 'id' ? 'Artikel' : 'Articles' },
    { icon: Users, value: '50K+', label: language === 'id' ? 'Pembaca' : 'Readers' },
    { icon: Warning, value: '5K+', label: language === 'id' ? 'Laporan' : 'Reports' },
    { icon: MapPin, value: '10', label: language === 'id' ? 'Kecamatan' : 'Districts' },
  ];

  const features = [
    {
      icon: DeviceMobile,
      title: language === 'id' ? 'Real-time Updates' : 'Real-time Updates',
      desc: language === 'id' ? 'Dapatkan berita terkini secara langsung' : 'Get latest news in real-time',
    },
    {
      icon: Users,
      title: language === 'id' ? 'Laporan Warga' : 'Citizen Reports',
      desc: language === 'id' ? 'Laporkan kejadian di sekitarmu' : 'Report incidents around you',
    },
    {
      icon: MapPin,
      title: language === 'id' ? 'Hyperlocal' : 'Hyperlocal',
      desc: language === 'id' ? 'Fokus pada berita Jakarta Selatan' : 'Focused on South Jakarta news',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 pt-14 lg:pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Newspaper size={40} weight="fill" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('about.title')}</h1>
          <p className="text-white/80 text-lg">{t('about.subtitle')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-2xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon size={24} className="mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Description */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info size={20} className="text-red-500" />
            {language === 'id' ? 'Tentang Kami' : 'About Us'}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">{t('about.p1')}</p>
          <p className="text-gray-600 leading-relaxed mb-4">{t('about.p2')}</p>
          <p className="text-gray-600 leading-relaxed">{t('about.p3')}</p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target size={20} className="text-red-500" />
            {t('about.mission')}
          </h2>
          <p className="text-gray-600 leading-relaxed">{t('about.missionText')}</p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye size={20} className="text-red-500" />
            {t('about.vision')}
          </h2>
          <p className="text-gray-600 leading-relaxed">{t('about.visionText')}</p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {language === 'id' ? 'Fitur Kami' : 'Our Features'}
          </h2>
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <feature.icon size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Heart size={20} className="text-red-500" />
            {t('about.contact')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Envelope size={20} className="text-gray-400" />
              <span>info@jakselnews.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin size={20} className="text-gray-400" />
              <span>Jakarta Selatan, Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
