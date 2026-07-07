'use client';

import { useState } from 'react';
import { PhLink, PhCheck } from '@phosphor-icons/react';
import { socialShareLinks } from './SocialIcons';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title + ' - Jakselnews');
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    if (typeof navigator !== 'undefined') {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      // Simple toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in';
      toast.textContent = 'Link berhasil disalin!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {socialShareLinks.map((social) => (
          <a
            key={social.name}
            href={social.url(encodedUrl, encodedTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 ${social.bg} text-white rounded-full flex items-center justify-center transition-colors`}
            aria-label={`Share on ${social.name}`}
          >
            {social.icon}
          </a>
        ))}
      </div>
      <button
        onClick={copyLink}
        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
      >
        {copied ? (
          <>
            <PhCheck size={16} className="text-green-600" />
            <span className="text-green-600">Link berhasil disalin!</span>
          </>
        ) : (
          <>
            <PhLink size={16} />
            <span>Salin Link</span>
          </>
        )}
      </button>
    </div>
  );
}
