'use client';

import { PhX } from '@phosphor-icons/react';
import { socialShareLinks } from './SocialIcons';

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function SharePopup({ isOpen, onClose, url, title }: SharePopupProps) {
  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title + ' - Jakselnews');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // Simple toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in';
      toast.textContent = 'Link berhasil disalin!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Bagikan ke</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <PhX size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {socialShareLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => window.open(link.url(encodedUrl, encodedTitle), '_blank', 'noopener,noreferrer')}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 ${link.bg} rounded-2xl flex items-center justify-center text-2xl text-white`}>
                {link.icon}
              </div>
              <span className="text-xs text-gray-600">{link.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={copyToClipboard}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          Salin Link
        </button>
      </div>
    </>
  );
}
