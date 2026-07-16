'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPinLine,
  Heart,
  ChatCircle,
  ShareNetwork,
  Spinner,
  Warning,
  Clock,
  ArrowRight,
  Fire,
  CloudRain,
  TrafficCone,
  ShieldWarning,
} from '@phosphor-icons/react';
import { api, Report } from '@/lib/api';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

interface UGCReport {
  id: string;
  type: string;
  description: string;
  location_name: string | null;
  reporter_name: string | null;
  reporter_phone: string | null;
  reporter_email: string | null;
  status: 'pending' | 'verified' | 'processing' | 'resolved' | 'rejected';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
}

const categoryIcons: Record<string, { icon: React.ReactNode; gradient: string }> = {
  'keamanan': { icon: <ShieldWarning size={24} weight="fill" />, gradient: 'from-red-500 to-rose-600' },
  'lalu-lintas': { icon: <TrafficCone size={24} weight="fill" />, gradient: 'from-amber-500 to-orange-600' },
  'banjir': { icon: <CloudRain size={24} weight="fill" />, gradient: 'from-blue-500 to-cyan-600' },
  'kebakaran': { icon: <Fire size={24} weight="fill" />, gradient: 'from-orange-500 to-red-600' },
  'kemacetan': { icon: <TrafficCone size={24} weight="fill" />, gradient: 'from-yellow-500 to-amber-600' },
  'default': { icon: <Warning size={24} weight="fill" />, gradient: 'from-gray-500 to-gray-600' },
};

const statusLabels: Record<string, string> = {
  pending: 'Baru',
  verified: 'Terverifikasi',
  processing: 'Diproses',
  resolved: 'Selesai',
  rejected: 'Ditolak',
};

function UGCCard({ report, onLike }: { report: UGCReport; onLike: (id: string) => void }) {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 5);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount] = useState(Math.floor(Math.random() * 20));
  const [shares, setShares] = useState(Math.floor(Math.random() * 10));

  const categoryInfo = categoryIcons[report.type] || categoryIcons['default'];

  const handleLike = () => {
    if (!isLiked) {
      setLikes(prev => prev + 1);
      onLike(report.id);
    }
    setIsLiked(!isLiked);
  };

  const getTimeAgo = (dateStr: string) => {
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
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jakselnews.com'}/lapor/${report.id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Laporan ${report.type}: ${report.location_name || 'Jaksel'}`,
          text: report.description.substring(0, 100) + '...',
          url: shareUrl,
        });
        setShares(prev => prev + 1);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setShares(prev => prev + 1);
    }
  };

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${categoryInfo.gradient} rounded-xl flex items-center justify-center text-white`}>
          {categoryInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 capitalize">{report.type.replace('-', ' ')}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPinLine size={14} />
            {report.location_name || 'Jakarta Selatan'}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            report.priority === 'urgent' || report.priority === 'high'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {report.priority === 'urgent' ? 'Urgent' : report.priority === 'high' ? 'High' : statusLabels[report.status]}
          </span>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Clock size={12} />
            {getTimeAgo(report.created_at)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-700 leading-relaxed line-clamp-4">{report.description}</p>
      </div>

      {/* Reporter Info (if not anonymous) */}
      {report.reporter_name && !report.reporter_email && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-400">
            Dilaporkan oleh: <span className="font-medium text-gray-600">{report.reporter_name}</span>
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-around py-3 px-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
          aria-label={isLiked ? 'Batal suka' : 'Suka'}
        >
          <Heart size={20} weight={isLiked ? 'fill' : 'regular'} />
          <span className="text-sm font-medium">{likes}</span>
        </button>
        <button
          className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
          aria-label="Komentar"
        >
          <ChatCircle size={20} />
          <span className="text-sm font-medium">{commentCount}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
          aria-label="Bagikan"
        >
          <ShareNetwork size={20} />
          <span className="text-sm font-medium">{shares}</span>
        </button>
      </div>
    </article>
  );
}

export default function BreakingNewsPage() {
  const [reports, setReports] = useState<UGCReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.getReports({ limit: 50 });

      if (result.success && result.data) {
        setReports(result.data as any);
      } else {
        // If API fails, show a helpful message
        setError('Tidak dapat memuat laporan. Pastikan Anda terhubung ke internet.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Filter reports based on selected category
  const filteredReports = filter
    ? reports.filter(r => r.type === filter)
    : reports;

  // Get unique report types for filter
  const reportTypes = [...new Set<string>(reports.map(r => r.type))];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Header title="Info Terkini" />

      <div className="pt-14 lg:pt-4">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-4 py-6 text-white">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Info Terkini</h1>
            <p className="text-white/80 text-sm">Laporan dan informasi dari warga Jakarta Selatan</p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-14 z-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              <button
                onClick={() => setFilter('')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  !filter
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semua
              </button>
              {reportTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                    filter === type
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4 max-w-3xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size={40} className="animate-spin text-red-500 mb-4" />
              <p className="text-gray-500">Memuat laporan...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-4">
              <Warning size={40} className="text-red-500 mx-auto mb-3" />
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredReports.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Warning size={32} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Belum Ada Laporan</h3>
              <p className="text-gray-500 text-sm mb-4">
                {filter ? 'Tidak ada laporan dalam kategori ini' : 'Jadilah yang pertama melapor'}
              </p>
              <Link
                href="/lapor"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <span>Lapor Kejadian</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Reports List */}
          {!loading && !error && filteredReports.length > 0 && (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {filteredReports.length} laporan ditemukan
              </p>

              {filteredReports.map((report) => (
                <UGCCard key={report.id} report={report} onLike={() => {}} />
              ))}

              {/* Load More / CTA */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Ingin melaporkan sesuatu?
                </p>
                <Link
                  href="/lapor"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  <Warning size={20} weight="fill" />
                  <span>Lapor Kejadian</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
