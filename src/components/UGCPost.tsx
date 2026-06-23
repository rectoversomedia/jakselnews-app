'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, MessageCircle, Share2, X, Send, CornerDownLeft, ChevronDown, ChevronUp } from 'lucide-react';

// Social Media Icons as SVG components
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="url(#instagram-gradient)">
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80"/>
        <stop offset="25%" stopColor="#F56040"/>
        <stop offset="50%" stopColor="#F77737"/>
        <stop offset="75%" stopColor="#FCAF45"/>
        <stop offset="100%" stopColor="#C13584"/>
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
  replies?: Comment[];
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
    { name: 'WhatsApp', icon: <WhatsAppIcon />, url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { name: 'Instagram', icon: <InstagramIcon />, url: `https://instagram.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: 'TikTok', icon: <TikTokIcon />, url: `https://www.tiktok.com/share?url=${encodedUrl}` },
    { name: 'Facebook', icon: <FacebookIcon />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: 'X', icon: <TwitterIcon />, url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { name: 'LinkedIn', icon: <LinkedInIcon />, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('Link berhasil disalin!');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Bagikan ke</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {shareLinks.map((link) => (
            <button key={link.name} onClick={() => window.open(link.url, '_blank')} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
                {link.icon}
              </div>
              <span className="text-xs text-gray-600">{link.name}</span>
            </button>
          ))}
        </div>
        <button onClick={copyToClipboard} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
          Salin Link
        </button>
      </div>
    </>
  );
}

interface CommentsSectionProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

function CommentsSection({ isOpen, onClose, postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: 'Warga Blok M', text: 'Tetap waspada ya! 🙏', time: '5 menit lalu', replies: [
      { id: 11, author: 'Warga Kemang', text: 'Iya makasih infonya!', time: '3 menit lalu' }
    ]},
    { id: 2, author: 'Warga Ragunan', text: 'Semoga cepat surut ya', time: '8 menit lalu', replies: [] },
    { id: 3, author: 'Warga Cilandak', text: 'Baru lewat tadi, emang udah mulai ngumpul airnya', time: '10 menit lalu', replies: [] },
  ]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = { id: Date.now(), author: 'Warga Jakarta', text: newComment, time: 'Baru saja' };
    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleReply = (parentId: number) => {
    if (!replyText.trim()) return;
    const reply: Comment = { id: Date.now(), author: 'Warga Jakarta', text: replyText, time: 'Baru saja' };
    setComments(comments.map(c =>
      c.id === parentId ? { ...c, replies: [...(c.replies || []), reply] } : c
    ));
    setReplyTo(null);
    setReplyText('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 top-[40%] bg-white rounded-t-3xl z-50 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Komentar ({comments.length})</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-gray-500">W</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3">
                    <p className="font-semibold text-sm text-gray-900">{comment.author}</p>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 ml-1">
                    <span className="text-xs text-gray-400">{comment.time}</span>
                    <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} className="text-xs text-gray-500 hover:text-primary">
                      Balas
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies?.map((reply) => (
                <div key={reply.id} className="flex gap-3 ml-8">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-500">W</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3">
                      <p className="font-semibold text-sm text-gray-900">{reply.author}</p>
                      <p className="text-sm text-gray-700">{reply.text}</p>
                    </div>
                    <span className="text-xs text-gray-400 ml-1">{reply.time}</span>
                  </div>
                </div>
              ))}

              {/* Reply Input */}
              {replyTo === comment.id && (
                <div className="flex gap-2 ml-8">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis balasan..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button onClick={() => handleReply(comment.id)} className="p-2 bg-primary text-white rounded-full">
                    <Send size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={handleSubmitComment} className="p-3 bg-primary text-white rounded-full">
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}

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

function UGCPostCard({ report }: { report: UGCReport }) {
  const [likes, setLikes] = useState(report.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(report.comments);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleLike = () => {
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  const shareUrl = `https://jakselnews.com/breaking-news/${report.id}`;
  const shareTitle = `${report.authorName}: ${report.content.substring(0, 50)}...`;

  return (
    <>
      <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <span className="text-gray-500 font-bold">W</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{report.authorName}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin size={10} />
                {report.location}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-400">{report.time}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{report.content}</p>

            <div className="flex items-center gap-4 mt-3">
              <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="text-xs">{likes}</span>
              </button>
              <button onClick={() => setIsCommentsOpen(true)} className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                <MessageCircle size={16} />
                <span className="text-xs">{comments}</span>
              </button>
              <button onClick={() => setIsShareOpen(true)} className="flex items-center gap-1.5 text-gray-400 hover:text-green-500 transition-colors">
                <Share2 size={16} />
                <span className="text-xs">{report.shares}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <SharePopup isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} url={shareUrl} title={shareTitle} />
      <CommentsSection isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} postId={report.id} />
    </>
  );
}

export { UGCPostCard, SharePopup, CommentsSection };
