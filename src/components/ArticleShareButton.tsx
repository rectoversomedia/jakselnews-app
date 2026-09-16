'use client';

import { useState } from 'react';
import { SharePopup } from '@/components/SharePopup';
import { trackArticleShare } from '@/lib/ga4';

interface ArticleShareButtonProps {
  title: string;
  articleId?: string | number;
  articleSlug?: string;
}

export function ArticleShareButton({ title, articleId, articleSlug }: ArticleShareButtonProps) {
  const [showShare, setShowShare] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleOpen = () => {
    setShowShare(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
          <path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88.11,88.11,0,0,0-88,88,8,8,0,0,1-16,0A104.11,104.11,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66Z"/>
        </svg>
        Bagikan
      </button>
      <SharePopup
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        url={url}
        title={title}
        onShare={(platform) => {
          if (articleId) {
            trackArticleShare({ articleId, articleTitle: title, platform });
          }
        }}
      />
    </>
  );
}
