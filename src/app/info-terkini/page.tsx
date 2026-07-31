'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Clock,
  Heart,
  ChatCircle,
  Share,
  PaperPlaneRight,
  X,
  Warning,
  Spinner,
  CaretRight,
  User,
  Link,
} from '@phosphor-icons/react';
import { api, Report, Comment } from '@/lib/api';

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  return `${diffDays} hari lalu`;
}

const categoryLabels: Record<string, string> = {
  keamanan: 'Keamanan',
  'lalu-lintas': 'Lalu Lintas',
  banjir: 'Banjir',
  kebakaran: 'Kebakaran',
  kemacetan: 'Kemacetan',
  penerangan: 'Penerangan',
  lingkungan: 'Lingkungan',
  'jalan-rusak': 'Jalan Rusak',
  kriminal: 'Kriminal',
  sampah: 'Sampah',
  fenomena: 'Fenomena',
  lainnya: 'Lainnya',
};

const categoryColors: Record<string, string> = {
  keamanan: 'bg-red-100 text-red-700',
  'lalu-lintas': 'bg-amber-100 text-amber-700',
  banjir: 'bg-blue-100 text-blue-700',
  kebakaran: 'bg-orange-100 text-orange-700',
  kemacetan: 'bg-yellow-100 text-yellow-700',
  penerangan: 'bg-yellow-100 text-yellow-600',
  lingkungan: 'bg-green-100 text-green-700',
  'jalan-rusak': 'bg-yellow-100 text-yellow-800',
  kriminal: 'bg-red-100 text-red-800',
  sampah: 'bg-emerald-100 text-emerald-700',
  fenomena: 'bg-purple-100 text-purple-700',
  lainnya: 'bg-gray-100 text-gray-600',
};

const categoryGradients: Record<string, string> = {
  keamanan: 'from-red-500 to-rose-600',
  'lalu-lintas': 'from-amber-500 to-orange-600',
  banjir: 'from-blue-500 to-cyan-600',
  kebakaran: 'from-orange-500 to-red-600',
  kemacetan: 'from-yellow-500 to-amber-600',
  penerangan: 'from-yellow-400 to-amber-500',
  lingkungan: 'from-green-500 to-emerald-600',
  'jalan-rusak': 'from-yellow-400 to-yellow-600',
  kriminal: 'from-red-500 to-red-700',
  sampah: 'from-emerald-500 to-teal-600',
  fenomena: 'from-purple-500 to-indigo-600',
  lainnya: 'from-gray-500 to-gray-600',
};

// Share Modal
function ShareModal({
  isOpen,
  onClose,
  title,
  url,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareOptions = [
    {
      name: 'WhatsApp',
      color: 'bg-green-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'Instagram',
      color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
      url: `https://www.instagram.com/share/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'X',
      color: 'bg-black',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      color: 'bg-blue-700',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1500);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[70]" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-end justify-center pointer-events-none">
        <div className="bg-white rounded-t-3xl w-full max-w-md shadow-2xl pointer-events-auto animate-slideUp">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Bagikan ke</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Share options */}
          <div className="grid grid-cols-3 gap-4 px-5 py-5">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-14 h-14 ${option.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  {option.icon}
                </div>
                <span className="text-xs font-medium text-gray-600">{option.name}</span>
              </a>
            ))}

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-gray-200 group-hover:scale-110 transition-all">
                {copied ? (
                  <svg viewBox="0 0 20 20" className="w-6 h-6 text-green-500" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <Link size={24} className="text-gray-500" />
                )}
              </div>
              <span className="text-xs font-medium text-gray-600">
                {copied ? 'Tersalin!' : 'Copy Link'}
              </span>
            </button>
          </div>

          {/* Cancel */}
          <div className="px-5 pb-6">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Comments Modal
function CommentsModal({
  report,
  onClose,
}: {
  report: Report;
  onClose: () => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    setCommentError('');
    const res = await api.getComments(report.id);
    if (res.success && res.data) {
      setComments(res.data as Comment[]);
    } else {
      setCommentError('Gagal memuat komentar');
    }
    setLoadingComments(false);
  }, [report.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    setSubmitMsg('');
    const res = await api.createComment({
      report_id: report.id,
      author_name: authorName.trim() || 'Warga Jaksel',
      comment: newComment.trim(),
    });
    if (res.success && res.data) {
      setComments(prev => [...prev, res.data as Comment]);
      setNewComment('');
      setSubmitMsg('Komentar terkirim!');
      setTimeout(() => setSubmitMsg(''), 2000);
    } else {
      setSubmitMsg('Gagal mengirim.');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[70]" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-end justify-center pointer-events-none">
        <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl pointer-events-auto animate-slideUp">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <h3 className="text-base font-bold text-gray-900">Komentar</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Post preview */}
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 shrink-0">
            <p className="text-xs text-gray-400 mb-1.5">Melaporkan:</p>
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[report.type] || categoryColors['lainnya']}`}>
                  {categoryLabels[report.type] || report.type}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin size={10} />
                  {report.location_name || 'Jakarta Selatan'}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                {report.description}
              </p>
            </div>
          </div>

          {/* Comments list */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
            {loadingComments ? (
              <div className="flex justify-center py-10">
                <Spinner size={28} className="animate-spin text-gray-400" />
              </div>
            ) : commentError ? (
              <div className="text-center py-8">
                <p className="text-sm text-red-500">{commentError}</p>
                <button onClick={fetchComments} className="text-xs text-red-600 mt-1 underline">Coba lagi</button>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-10">
                <ChatCircle size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Belum ada komentar. Jadilah yang pertama!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white uppercase">
                      {(comment.author_name || 'WJ').charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-semibold text-xs text-gray-900">
                          {comment.author_name || 'Warga Jaksel'}
                        </span>
                        <span className="text-gray-400 text-[10px]">·</span>
                        <span className="text-gray-400 text-[10px]">{timeAgo(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{comment.body}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-gray-100 shrink-0 space-y-2">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                placeholder="Tulis komentar..."
                maxLength={1000}
                className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700"
              />
              <button
                onClick={handleSubmit}
                disabled={!newComment.trim() || isSubmitting}
                className="text-red-500 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {isSubmitting ? (
                  <Spinner size={16} className="animate-spin" />
                ) : (
                  <PaperPlaneRight size={18} weight="fill" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Nama (opsional)"
                maxLength={50}
                className="flex-1 text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-red-300 transition-colors"
              />
              {submitMsg && (
                <span className={`text-xs font-medium ${submitMsg.includes('Gagal') ? 'text-red-500' : 'text-green-600'}`}>
                  {submitMsg}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Report Card — matches breaking-news style
function ReportCard({
  report,
  onCommentClick,
  likedIds,
  onLike,
  onShareClick,
}: {
  report: Report;
  onCommentClick: (r: Report) => void;
  likedIds: Set<string>;
  onLike: (id: string) => void;
  onShareClick: (r: Report) => void;
}) {
  const [localLikes, setLocalLikes] = useState(0);
  const isLiked = likedIds.has(report.id);

  const handleLike = () => {
    if (!isLiked) {
      setLocalLikes(prev => prev + 1);
      onLike(report.id);
    }
  };

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-3">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${categoryGradients[report.type] || categoryGradients['lainnya']} flex items-center justify-center shrink-0 shadow-sm`}>
            <Warning size={22} weight="fill" className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[report.type] || categoryColors['lainnya']}`}>
                {categoryLabels[report.type] || report.type}
              </span>
              {report.priority === 'urgent' && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full uppercase tracking-wide">
                  Urgent
                </span>
              )}
              {report.priority === 'high' && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                  High
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin size={11} />
              {report.location_name || 'Jakarta Selatan'}
              <span className="mx-1">·</span>
              <Clock size={11} />
              {timeAgo(report.created_at)}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-700 leading-relaxed text-sm mt-3">{report.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart size={18} weight={isLiked ? 'fill' : 'regular'} />
          <span>{localLikes}</span>
        </button>
        <button
          onClick={() => onCommentClick(report)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors border-x border-gray-100"
        >
          <ChatCircle size={18} />
          <span>Komentar</span>
        </button>
        <button
          onClick={() => onShareClick(report)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
        >
          <Share size={18} />
          <span>Bagikan</span>
        </button>
      </div>
    </article>
  );
}

const REPORT_CATEGORIES = [
  { id: '', name: 'Semua' },
  { id: 'banjir', name: 'Banjir' },
  { id: 'keamanan', name: 'Keamanan' },
  { id: 'lalu-lintas', name: 'Lalu Lintas' },
  { id: 'kemacetan', name: 'Kemacetan' },
  { id: 'kebakaran', name: 'Kebakaran' },
  { id: 'penerangan', name: 'Penerangan' },
  { id: 'lingkungan', name: 'Lingkungan' },
  { id: 'jalan-rusak', name: 'Jalan Rusak' },
  { id: 'kriminal', name: 'Kriminal' },
  { id: 'lainnya', name: 'Lainnya' },
];

export default function InfoTerkiniPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [activeCommentReport, setActiveCommentReport] = useState<Report | null>(null);
  const [activeShareReport, setActiveShareReport] = useState<Report | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');
    const res = filter
      ? await api.getReports({ type: filter, limit: 50 })
      : await api.getReports({ limit: 50 });
    if (res.success && res.data) {
      setReports(res.data as Report[]);
    } else {
      setError('Gagal memuat laporan');
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.jakselnews.com'}/info-terkini`;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 px-4 pt-20 pb-5 lg:pt-4 text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Info Terkini</h1>
          <p className="text-white/80 text-sm">Laporan dan informasi dari warga Jakarta Selatan</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-14 lg:top-16 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {REPORT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === cat.id
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 py-4 max-w-3xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner size={36} className="animate-spin text-red-500 mb-3" />
            <p className="text-gray-500 text-sm">Memuat laporan...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <Warning size={40} className="text-red-400 mx-auto mb-3" />
            <p className="text-red-500 mb-3">{error}</p>
            <button onClick={fetchReports} className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition-colors">
              Coba Lagi
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <Warning size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">Belum ada laporan</p>
            <a href="/lapor" className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 transition-colors">
              Laporkan <CaretRight size={14} />
            </a>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-medium mb-3">{reports.length} laporan ditemukan</p>
            {reports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                onCommentClick={setActiveCommentReport}
                likedIds={likedIds}
                onLike={handleLike}
                onShareClick={setActiveShareReport}
              />
            ))}
          </>
        )}
      </div>

      {/* Modals */}
      {activeCommentReport && (
        <CommentsModal
          report={activeCommentReport}
          onClose={() => setActiveCommentReport(null)}
        />
      )}

      {activeShareReport && (
        <ShareModal
          isOpen={true}
          onClose={() => setActiveShareReport(null)}
          title={`Laporan ${categoryLabels[activeShareReport.type] || activeShareReport.type}: ${activeShareReport.description.substring(0, 60)}...`}
          url={shareUrl}
        />
      )}
    </main>
  );
}
