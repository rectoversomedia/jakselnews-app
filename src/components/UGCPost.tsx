'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Heart, MessageCircle, Share2, X } from 'lucide-react';
import { MapPin as MapPinIcon } from 'lucide-react';

interface UGCReport {
  id: number;
  authorName: string;
  location: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
}

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

function SharePopup({ isOpen, onClose, url, title }: SharePopupProps) {
  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title + ' - Jakselnews');

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
    },
    {
      name: 'Instagram',
      icon: '📷',
      color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
      url: `https://instagram.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'TikTok',
      icon: '🎵',
      color: 'bg-black',
      url: `https://www.tiktok.com/share?url=${encodedUrl}`
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'X (Twitter)',
      icon: '🐦',
      color: 'bg-black',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('Link berhasil disalin!');
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Popup */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Bagikan ke</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {shareLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => window.open(link.url, '_blank')}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 ${link.color} rounded-2xl flex items-center justify-center text-2xl`}>
                {link.icon}
              </div>
              <span className="text-xs text-gray-600">{link.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <span>Salin Link</span>
        </button>
      </div>
    </>
  );
}

function UGCPostCard({ report }: { report: UGCReport }) {
  const [likes, setLikes] = useState(report.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(report.comments);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    // Navigate to full post page for comments
    window.location.href = '/breaking-news';
  };

  const shareUrl = `https://jakselnews.com/breaking-news/${report.id}`;
  const shareTitle = `${report.authorName}: ${report.content.substring(0, 50)}...`;

  return (
    <>
      <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <span className="text-gray-500 font-bold">W</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{report.authorName}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MapPinIcon size={10} />
                {report.location}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-400">{report.time}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{report.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="text-xs">{likes}</span>
              </button>
              <button
                onClick={handleComment}
                className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <MessageCircle size={16} />
                <span className="text-xs">{comments}</span>
              </button>
              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-green-500 transition-colors"
              >
                <Share2 size={16} />
                <span className="text-xs">{report.shares}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <SharePopup
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={shareUrl}
        title={shareTitle}
      />
    </>
  );
}

export { UGCPostCard, SharePopup };
