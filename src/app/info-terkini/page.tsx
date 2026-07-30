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
  Image as ImageIcon,
  Warning,
  Spinner,
  CaretRight,
  User,
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
  keamanan: 'from-red-400 to-rose-500',
  'lalu-lintas': 'from-amber-400 to-orange-500',
  banjir: 'from-blue-400 to-cyan-500',
  kebakaran: 'from-orange-400 to-red-500',
  kemacetan: 'from-yellow-400 to-amber-500',
  penerangan: 'from-yellow-300 to-amber-400',
  lingkungan: 'from-green-400 to-emerald-500',
  'jalan-rusak': 'from-yellow-300 to-yellow-500',
  kriminal: 'from-red-400 to-red-600',
  sampah: 'from-emerald-400 to-teal-500',
  fenomena: 'from-purple-400 to-indigo-500',
  lainnya: 'from-gray-400 to-gray-500',
};

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
      setSubmitMsg('Komentar dikirim!');
      setTimeout(() => setSubmitMsg(''), 2000);
    } else {
      setSubmitMsg('Gagal mengirim. Coba lagi.');
    }
    setIsSubmitting(false);
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.jakselnews.com'}/info-terkini`;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60]" onClick={onClose} />
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div
          className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] flex flex-col shadow-2xl pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
            <h3 className="text-base font-bold text-gray-900">Komentar</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Post preview */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 shrink-0">
            <p className="text-xs text-gray-400 mb-1.5">Melaporkan:</p>
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <div className="flex items-center gap-2 mb-2">
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
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {loadingComments ? (
              <div className="flex justify-center py-8">
                <Spinner size={28} className="animate-spin text-gray-400" />
              </div>
            ) : commentError ? (
              <div className="text-center py-6">
                <p className="text-sm text-red-500">{commentError}</p>
                <button onClick={fetchComments} className="text-xs text-red-600 mt-1 underline">Coba lagi</button>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <ChatCircle size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Belum ada komentar</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white uppercase">
                      {(comment.author_name || 'WJ').charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2.5">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-semibold text-xs text-gray-900">
                          {comment.author_name || 'Warga Jaksel'}
                        </span>
                        <span className="text-gray-400 text-[10px]">•</span>
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
          <div className="px-4 py-3 border-t border-gray-100 shrink-0 space-y-2">
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <User size={14} className="text-gray-400" />
              </div>
              <div className="flex-1 flex gap-2 items-center bg-gray-100 rounded-full px-4 py-2">
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
                  className="text-red-500 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <Spinner size={16} className="animate-spin" />
                  ) : (
                    <PaperPlaneRight size={16} weight="fill" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Nama (opsional)"
                maxLength={50}
                className="flex-1 text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-red-300"
              />
              {submitMsg && (
                <span className="text-xs text-green-600 flex items-center">{submitMsg}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Post Card
function ReportCard({
  report,
  onCommentClick,
  likedIds,
  onLike,
}: {
  report: Report;
  onCommentClick: (r: Report) => void;
  likedIds: Set<string>;
  onLike: (id: string) => void;
}) {
  const [localLikes, setLocalLikes] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const isLiked = likedIds.has(report.id);

  const handleLike = () => {
    if (!isLiked) {
      setLocalLikes(prev => prev + 1);
      onLike(report.id);
    }
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.jakselnews.com'}/info-terkini`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Laporan ${categoryLabels[report.type] || report.type}`,
        text: report.description.substring(0, 100),
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setShareOpen(true);
      setTimeout(() => setShareOpen(false), 2000);
    }
  };

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="p-4">
        {/* Author + Meta */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${categoryGradients[report.type] || categoryGradients['lainnya']} flex items-center justify-center shrink-0`}>
            <Warning size={18} weight="fill" className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[report.type] || categoryColors['lainnya']}`}>
                {categoryLabels[report.type] || report.type}
              </span>
              {report.priority === 'high' || report.priority === 'urgent' ? (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                  {report.priority === 'urgent' ? 'Urgent' : 'High'}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={11} />
              {report.location_name || 'Jakarta Selatan'}
              <span className="mx-1">·</span>
              <Clock size={11} />
              {timeAgo(report.created_at)}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-700 text-sm leading-relaxed mt-3">{report.description}</p>
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
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
        >
          <ChatCircle size={18} />
          <span>Komentar</span>
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
        >
          <Share size={18} />
          <span>{shareOpen ? 'Tersalin!' : 'Bagikan'}</span>
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
  { id: 'sampah', name: 'Sampah' },
  { id: 'fenomena', name: 'Fenomena' },
  { id: 'lainnya', name: 'Lainnya' },
];

export default function InfoTerkiniPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [activeCommentReport, setActiveCommentReport] = useState<Report | null>(null);

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
      const next = new Set(prev)
      next.add(id)
      return next
    })
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 px-4 pt-20 pb-6 lg:pt-4 text-white">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Info Terkini</h1>
          <p className="text-white/80 text-sm">Laporan dan informasi dari warga Jakarta Selatan</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="sticky top-14 lg:top-16 z-30 bg-white border-b px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {REPORT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === cat.id
                    ? 'bg-red-500 text-white shadow-md'
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
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-3">
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
            <p className="text-gray-500 text-sm">Belum ada laporan</p>
            <a href="/lapor" className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 transition-colors">
              Laporkan <CaretRight size={14} />
            </a>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-medium">{reports.length} laporan</p>
            {reports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                onCommentClick={setActiveCommentReport}
                likedIds={likedIds}
                onLike={handleLike}
              />
            ))}
          </>
        )}
      </div>

      {/* Comments modal */}
      {activeCommentReport && (
        <CommentsModal
          report={activeCommentReport}
          onClose={() => setActiveCommentReport(null)}
        />
      )}
    </main>
  );
}
