'use client';

import { X } from '@phosphor-icons/react';
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
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm z-[70] animate-fadeIn';
      toast.textContent = 'Link berhasil disalin!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } catch {
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
      <div className="fixed inset-0 bg-black/60 z-[60] animate-fadeIn" onClick={onClose} />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scaleIn pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Bagikan</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <div className="p-6">
            <div className="flex justify-around mb-6">
              {socialShareLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => window.open(link.url(encodedUrl, encodedTitle), '_blank', 'noopener,noreferrer')}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-14 h-14 ${link.bg} rounded-full flex items-center justify-center text-2xl text-white shadow-lg hover:scale-110 transition-transform`}>
                    {link.icon}
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{link.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={copyToClipboard}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              Salin Link
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
