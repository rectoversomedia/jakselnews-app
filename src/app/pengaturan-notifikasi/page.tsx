'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useNotifications } from '@/context/NotificationContext';
import {
  BellRinging,
  Newspaper,
  MapPin,
  ChatCircle,
  CalendarBlank,
  Push,
  Envelope,
  Check,
  X,
} from '@phosphor-icons/react/dist/ssr';

export default function NotificationSettingsPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { settings, toggleNotification, requestPermission, hasPermission } = useNotifications();
  const [saved, setSaved] = useState(false);

  const categories = [
    {
      key: 'breakingNews' as const,
      icon: Newspaper,
      title: t('notif.breakingNews'),
      desc: t('notif.breakingNewsDesc'),
      color: 'from-red-500 to-rose-500',
    },
    {
      key: 'localNews' as const,
      icon: MapPin,
      title: t('notif.localNews'),
      desc: t('notif.localNewsDesc'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      key: 'comments' as const,
      icon: ChatCircle,
      title: t('notif.comments'),
      desc: t('notif.commentsDesc'),
      color: 'from-green-500 to-emerald-500',
    },
    {
      key: 'weekly' as const,
      icon: CalendarBlank,
      title: t('notif.weekly'),
      desc: t('notif.weeklyDesc'),
      color: 'from-purple-500 to-violet-500',
    },
  ];

  const handleSave = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        alert(language === 'id' ? 'Izin notifikasi ditolak' : 'Notification permission denied');
        return;
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 pt-14 lg:pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-4xl font-black mb-4 tracking-tight">Jakselnews</p>
          <h1 className="text-2xl font-bold mb-2">{t('notif.title')}</h1>
          <p className="text-white/80 text-sm">{t('notif.subtitle')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Permission Banner */}
        {!hasPermission && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <BellRinging size={24} className="text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 flex-1">
              {language === 'id'
                ? 'Izinkan notifikasi untuk menerima pembaruan'
                : 'Allow notifications to receive updates'}
            </p>
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              {language === 'id' ? 'Izinkan' : 'Allow'}
            </button>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.key} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <cat.icon size={24} weight="fill" className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                  <p className="text-sm text-gray-500">{cat.desc}</p>
                </div>
              </div>

              {/* Toggle Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => toggleNotification(cat.key, 'push')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    settings[cat.key].push
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Push size={18} />
                  {t('notif.push')}
                  {settings[cat.key].push && <Check size={16} />}
                </button>
                <button
                  onClick={() => toggleNotification(cat.key, 'email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    settings[cat.key].email
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Envelope size={18} />
                  {t('notif.email')}
                  {settings[cat.key].email && <Check size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full mt-6 py-4 rounded-2xl font-semibold text-lg transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]'
          }`}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={20} />
              {t('notif.saved')}
            </span>
          ) : (
            t('notif.save')
          )}
        </button>
      </div>
    </main>
  );
}
