'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  MapPin,
  Warning,
  X,
  ArrowRight,
  ArrowLeft,
  ChatCircle,
  Heart,
  Share,
  Eye,
  TrendUp,
  MagnifyingGlass,
  Cardholder,
  GraduationCap,
  CurrencyCircleDollar,
  Train,
  Bus,
  Camera,
  Newspaper,
} from '@phosphor-icons/react';

interface BreakingPost {
  id: number;
  slug: string;
  title: { rendered: string };
  date: string;
  excerpt?: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          medium_large?: { source_url: string };
          large?: { source_url: string };
          full?: { source_url: string };
        };
      };
    }>;
    'wp:term'?: Array<Array<{ name: string; slug: string }>>;
  };
}

interface WarningReport {
  id: string | number;
  type: string;
  location: string;
  reports: number;
  time: string;
  gradient: string;
  hotline: string;
  description: string;
  related: string[];
  verification_type: 'early' | 'verified';
  upvotes: number;
}

function rewriteWpUrl(url: string): string {
  return url
    .replace(/https:\/\/jakselnews\.com\//g, '/api/wp-image/')
    .replace(/https:\/\/www\.jakselnews\.com\//g, '/api/wp-image/')
}

function getFeaturedImageUrl(post: BreakingPost): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return '';
  const url = media.media_details?.sizes?.large?.source_url ||
         media.media_details?.sizes?.medium_large?.source_url ||
         media.source_url || '';
  return url ? rewriteWpUrl(url) : '';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} menit lalu`;
    } else if (hours < 24) {
      return `${hours} jam lalu`;
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  } catch {
    return dateStr;
  }
}

// Category color/gradient/label maps (shared across desktop & mobile sections)
const catColors: Record<string, string> = {
  keamanan: 'bg-red-100 text-red-700', 'lalu-lintas': 'bg-amber-100 text-amber-700',
  banjir: 'bg-blue-100 text-blue-700', kebakaran: 'bg-orange-100 text-orange-700',
  kemacetan: 'bg-yellow-100 text-yellow-700', penerangan: 'bg-yellow-100 text-yellow-600',
  lingkungan: 'bg-green-100 text-green-700', 'jalan-rusak': 'bg-yellow-100 text-yellow-800',
  kriminal: 'bg-red-100 text-red-800', sampah: 'bg-emerald-100 text-emerald-700',
  fenomena: 'bg-purple-100 text-purple-700', lainnya: 'bg-gray-100 text-gray-600',
};
const catGradients: Record<string, string> = {
  keamanan: 'from-red-500 to-rose-600', 'lalu-lintas': 'from-amber-500 to-orange-600',
  banjir: 'from-blue-500 to-cyan-600', kebakaran: 'from-orange-500 to-red-600',
  kemacetan: 'from-yellow-500 to-amber-600', penerangan: 'from-yellow-400 to-amber-500',
  lingkungan: 'from-green-500 to-emerald-600', 'jalan-rusak': 'from-yellow-400 to-yellow-600',
  kriminal: 'from-red-500 to-red-700', sampah: 'from-emerald-500 to-teal-600',
  fenomena: 'from-purple-500 to-indigo-600', lainnya: 'from-gray-500 to-gray-600',
};
const catLabels: Record<string, string> = {
  keamanan: 'Keamanan', 'lalu-lintas': 'Lalu Lintas', banjir: 'Banjir',
  kebakaran: 'Kebakaran', kemacetan: 'Kemacetan', penerangan: 'Penerangan',
  lingkungan: 'Lingkungan', 'jalan-rusak': 'Jalan Rusak', kriminal: 'Kriminal',
  sampah: 'Sampah', fenomena: 'Fenomena', lainnya: 'Lainnya',
};

// =====================================================
// DESKTOP: Enhanced Featured Article Card (Hero Style)
// =====================================================
function FeaturedArticleCard({ post, isMain = false }: { post: BreakingPost; isMain?: boolean }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getFeaturedImageUrl(post);
  const title = stripHtml(post.title.rendered);
  const date = formatDate(post.date);
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Artikel';
  const slug = post?.slug;
  const showPlaceholder = imageError || !imageUrl;

  return (
    slug ? (
    <Link href={`/artikel/${slug}`} className="group block">
      <div className={`relative overflow-hidden rounded-2xl bg-gray-900 ${isMain ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
        {!showPlaceholder ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl block mb-2">📰</span>
              <span className="text-white/50 text-sm">Gambar tidak tersedia</span>
            </div>
          </div>
        )}
        {/* Elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

        {/* Category Badge - Elegant pill */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full shadow-lg">
            {category}
          </span>
        </div>

        {/* Breaking Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full shadow-lg animate-pulse">
            BREAKING
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <h2 className={`font-bold text-white mb-3 drop-shadow-lg transition-all duration-300 group-hover:text-white/90 ${isMain ? 'text-xl lg:text-3xl' : 'text-lg'} line-clamp-2`}>
            {title}
          </h2>
          <div className="flex items-center gap-5 text-white/70 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock size={14} weight="bold" />
              {date}
            </span>
          </div>
        </div>
      </div>
    </Link>
    ) : (
      <div className={`relative overflow-hidden rounded-2xl bg-gray-900 ${isMain ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    )
  );
}

// =====================================================
// DESKTOP: Side Article Card - Refined
// =====================================================
function SideArticleCard({ post, index }: { post: BreakingPost; index: number }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getFeaturedImageUrl(post);
  const title = stripHtml(post.title.rendered);
  const date = formatDate(post.date);
  const showPlaceholder = imageError || !imageUrl;
  const slug = post?.slug;

  if (!slug) return null;

  return (
    <Link href={`/artikel/${slug}`} className="group flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300">
      <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {!showPlaceholder ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-2xl opacity-50">📰</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-red-600 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <Clock size={11} />
          {date}
        </p>
      </div>
    </Link>
  );
}

// =====================================================
// DESKTOP: Enhanced Warning Card
// =====================================================
function WarningCard({ warning, onUpvote }: { warning: WarningReport; onUpvote: (id: string | number) => void }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    'from-red-500 to-rose-600': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
    'from-blue-500 to-cyan-600': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    'from-amber-500 to-orange-600': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  };
  const color = colors[warning.gradient] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100' };

  const isVerified = warning.verification_type === 'verified';
  const badgeStyle = isVerified
    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    : 'bg-amber-100 text-amber-700 border border-amber-200';
  const badgeLabel = isVerified ? 'Terverifikasi' : 'Laporan Pertama';

  return (
    <div className={`p-5 rounded-2xl ${color.bg} border ${color.border} transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${warning.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
          <Warning size={22} className="text-white" weight="fill" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1 gap-2">
            <h4 className="font-bold text-gray-900 text-sm">{warning.type}</h4>
            <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeStyle}`}>
              {badgeLabel}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
            <MapPin size={11} />
            {warning.location}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{warning.time}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpvote(warning.id)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart size={14} />
                <span>{warning.upvotes}</span>
              </button>
              <a href={`tel:${warning.hotline}`} className={`text-xs font-medium ${color.text} hover:underline flex items-center gap-1`}>
                <span>Hubungi</span>
                <span className="font-bold">{warning.hotline}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// DESKTOP: Warning Modal
// =====================================================
function WarningModal({ warning, onClose }: { warning: WarningReport; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl z-50 max-h-[85vh] overflow-y-auto shadow-2xl animate-scaleIn">
        <div className={`bg-gradient-to-r ${warning.gradient} p-8 rounded-t-2xl relative`}>
          <div className="flex items-center justify-center gap-4 text-white">
            <Warning size={32} weight="fill" />
            <span className="font-bold text-2xl">{warning.type}</span>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 space-y-5">
          <p className="text-gray-700 text-center leading-relaxed text-base">{warning.description}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              <span>{warning.location}</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{warning.time}</span>
            </span>
          </div>
          <div className={`text-center p-6 rounded-2xl bg-gradient-to-r ${warning.gradient} text-white shadow-lg`}>
            <p className="text-xs opacity-80 mb-1 font-medium">Hotline Darurat</p>
            <p className="text-4xl font-black">{warning.hotline}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {warning.related.map((area) => (
              <span key={area} className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                {area}
              </span>
            ))}
          </div>
          <a href={`tel:${warning.hotline}`} className={`block w-full py-4 bg-gradient-to-r ${warning.gradient} text-white font-bold rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow`}>
            Hubungi {warning.hotline}
          </a>
        </div>
      </div>
    </>
  );
}

// =====================================================
// DESKTOP: Peringatan Section — real data from /api/alerts
// =====================================================
function PeringatanSection() {
  const [selectedWarning, setSelectedWarning] = useState<WarningReport | null>(null);
  const [alerts, setAlerts] = useState<WarningReport[]>([]);
  const [loading, setLoading] = useState(true);

  const handleUpvote = async (id: string | number) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.jakselnews.com';
    try {
      const res = await fetch(`${baseUrl}/api/alerts/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        setAlerts(prev => prev.map(a =>
          a.id === id ? { ...a, upvotes: data.data.upvotes } : a
        ));
      }
    } catch (_) {}
  };

  useEffect(() => {
    async function loadAlerts() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.jakselnews.com';
        const res = await fetch(`${baseUrl}/api/alerts`);
        const data = await res.json();
        if (data.success && data.data) {
          const gradientMap = [
            'from-red-500 to-rose-600',
            'from-blue-500 to-cyan-600',
            'from-amber-500 to-orange-600',
            'from-purple-500 to-indigo-600',
            'from-green-500 to-emerald-600',
          ];
          const top = (data.data as any[])
            .filter((a: any) => a.is_active)
            .sort((a: any, b: any) => b.upvotes - a.upvotes)
            .slice(0, 3)
            .map((a: any, i: number): WarningReport => ({
              id: a.id,
              type: a.title,
              location: a.category,
              reports: a.report_count,
              time: formatDate(a.created_at),
              gradient: gradientMap[i % gradientMap.length],
              hotline: '110',
              description: a.description || '',
              related: [],
              verification_type: a.verification_type || 'early',
              upvotes: a.upvotes || 0,
            }));
          setAlerts(top);
        }
      } catch (_) {}
      setLoading(false);
    }
    loadAlerts();
  }, []);

  return (
    <>
      <section className="hidden lg:block bg-gradient-to-b from-gray-50/50 to-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                <Warning size={26} className="text-white" weight="fill" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Peringatan Warga</h2>
                <p className="text-sm text-gray-500">Laporan langsung dari warga Jaksel</p>
              </div>
            </div>
            <Link href="/info-terkini" className="group text-sm text-red-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Lihat Semua
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-3 gap-5">
              {[0,1,2].map(i => (
                <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : alerts.length > 0 ? (
            <div className="grid grid-cols-3 gap-5">
              {alerts.map((warning) => (
                <button
                  key={warning.id}
                  onClick={() => setSelectedWarning(warning)}
                  className="text-left w-full"
                >
                  <WarningCard warning={warning} onUpvote={handleUpvote} />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm py-6">Belum ada peringatan aktif</p>
          )}
        </div>
      </section>
      {selectedWarning && (
        <WarningModal warning={selectedWarning} onClose={() => setSelectedWarning(null)} />
      )}
    </>
  );
}

// =====================================================
// =====================================================
// DESKTOP: Info Terkini Section - Real Supabase Data
// =====================================================
function InfoTerkiniSection() {
  const [reports, setReports] = useState<Array<{id: string; type: string; description: string; location_name: string|null; created_at: string}>>([]);
  const [loading, setLoading] = useState(true);

  const timeAgo = (d: string) => {
    const ms = new Date().getTime() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return 'Baru saja';
    if (m < 60) return `${m} menit lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    return `${Math.floor(h / 24)} hari lalu`;
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/reports?limit=3`);
        const data = await res.json();
        if (data.success && data.data) setReports(data.data);
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section className="hidden lg:block bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
              <Warning size={26} className="text-white" weight="fill" />
            </div>
            <div>
              <Link href="/info-terkini" className="text-xl font-bold text-gray-900 hover:text-red-600 transition-colors">Info Terkini</Link>
              <p className="text-sm text-gray-500">Laporan warga Jakarta Selatan</p>
            </div>
          </div>
          <Link href="/info-terkini" className="group text-sm text-red-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Belum ada laporan masuk</div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {reports.map(report => (
              <Link key={report.id} href="/info-terkini"
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-red-200 hover:shadow-xl hover:shadow-red-100/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 bg-gradient-to-br ${catGradients[report.type] || catGradients['lainnya']} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    <Warning size={18} weight="fill" />
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${catColors[report.type] || catColors['lainnya']}`}>
                      {catLabels[report.type] || report.type}
                    </span>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} />{report.location_name || 'Jakarta Selatan'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3">{report.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} />{timeAgo(report.created_at)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} {new Date(report.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


// DESKTOP: Layanan Section - Enhanced
// =====================================================
function LayananPopulerSection() {
  const layananPopuler = [
    { id: 1, title: 'Bansos Jakarta', desc: 'Cek penerima bansos', icon: <Cardholder size={32} className="text-emerald-600" />, bg: 'bg-emerald-50', border: 'border-emerald-100', hover: 'hover:bg-emerald-100', url: 'https://siladu.jakarta.go.id/' },
    { id: 2, title: 'KJP Plus', desc: 'Saldo Kartu Jakarta Pintar', icon: <GraduationCap size={32} className="text-violet-600" />, bg: 'bg-violet-50', border: 'border-violet-100', hover: 'hover:bg-violet-100', url: 'https://edu.jakarta.go.id/kjp-portal/cek-bansos' },
    { id: 3, title: 'Cek ETLE', desc: 'Tilang elektronik', icon: <Camera size={32} className="text-blue-600" />, bg: 'bg-blue-50', border: 'border-blue-100', hover: 'hover:bg-blue-100', url: 'https://etle-pmj.id/' },
    { id: 4, title: 'Pajak Kendaraan', desc: 'Cek & bayar pajak', icon: <CurrencyCircleDollar size={32} className="text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-100', hover: 'hover:bg-amber-100', url: 'https://samsat-pkb2.jakarta.go.id/' },
    { id: 5, title: 'KRL', desc: 'Jadwal & rute KRL', icon: <Train size={32} className="text-cyan-600" />, bg: 'bg-cyan-50', border: 'border-cyan-100', hover: 'hover:bg-cyan-100', url: '/layanan' },
    { id: 6, title: 'TransJakarta', desc: 'Rute & halte', icon: <Bus size={32} className="text-red-600" />, bg: 'bg-red-50', border: 'border-red-100', hover: 'hover:bg-red-100', url: '/layanan' },
  ];

  return (
    <section className="hidden lg:block bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <TrendUp size={26} className="text-white" weight="bold" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Layanan Publik</h2>
              <p className="text-sm text-gray-500">Akses cepat ke layanan pemerintah</p>
            </div>
          </div>
          <Link href="/layanan" className="group text-sm text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Lihat Semua
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-6 gap-4">
          {layananPopuler.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target={item.url.startsWith('http') ? '_blank' : undefined}
              rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`${item.bg} ${item.border} border rounded-2xl p-5 text-center ${item.hover} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              <div className="mb-3 flex justify-center">{item.icon}</div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// DESKTOP: Artikel Section - Magazine Layout
// =====================================================
function ArtikelTerbaruSection() {
  const [articles, setArticles] = useState<BreakingPost[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(`/api/wordpress?endpoint=/wp-json/wp/v2/posts&per_page=6&_embed&status=publish`);
        if (response.ok) {
          const wrapped = await response.json();
          const posts = wrapped.success ? wrapped.data : wrapped;
          if (posts && posts.length > 0) {
            setArticles(posts);
          }
        }
      } catch (error) {
        // Silently fail
      }
    }
    fetchArticles();
  }, []);

  if (articles.length === 0) return null;

  const featured = articles[0];
  const rest = articles.slice(1, 6);

  return (
    <section className="hidden lg:block bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
              <span className="text-xl">📰</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Artikel Terbaru</h2>
              <p className="text-sm text-gray-500">Berita dan liputan dari Jaksel</p>
            </div>
          </div>
          <Link href="/artikel" className="group text-sm text-red-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Lihat Semua
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Magazine Layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* Featured - Left Large */}
          <div className="col-span-7">
            <Link href={`/artikel/${featured.slug}`} className="group block">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
                <img
                  src={getFeaturedImageUrl(featured)}
                  alt={stripHtml(featured.title.rendered)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category & Date */}
                <div className="absolute top-5 left-5 flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full shadow-lg">
                    {featured._embedded?.['wp:term']?.[0]?.[0]?.name || 'Artikel'}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 line-clamp-2 drop-shadow-lg">
                    {stripHtml(featured.title.rendered)}
                  </h3>
                  <p className="text-white/70 text-sm flex items-center gap-2">
                    <Clock size={14} weight="bold" />
                    {formatDate(featured.date)}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Side - List */}
          <div className="col-span-5 space-y-3">
            {rest.map((article) => (
              <SideArticleCard key={article.id} post={article} index={0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// DESKTOP: Artikel Populer Section
// =====================================================
function ArtikelPopulerSection() {
  const [articles, setArticles] = useState<BreakingPost[]>([]);

  useEffect(() => {
    async function loadPopularArticles() {
      try {
        const response = await fetch(`/api/wordpress?endpoint=/wp-json/wp/v2/posts&per_page=10&_embed&status=publish`);
        if (response.ok) {
          const wrapped = await response.json();
          const posts = wrapped.success ? wrapped.data : wrapped;
          if (posts && posts.length > 0) {
            setArticles(posts);
          } else {
            setArticles([]);
          }
        } else {
          setArticles([]);
        }
      } catch (error) {
        setArticles([]);
      }
    }
    loadPopularArticles();
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="hidden lg:block bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <TrendUp size={26} className="text-white" weight="bold" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Artikel Populer</h2>
              <p className="text-sm text-gray-500">Bacaan terpopuler minggu ini</p>
            </div>
          </div>
          <Link href="/artikel" className="group text-sm text-orange-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Lihat Semua
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid with Image Thumbnails - 5 items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {articles.slice(0, 5).map((article) => {
            const imageUrl = getFeaturedImageUrl(article);
            const title = stripHtml(article.title.rendered);
            const category = article._embedded?.['wp:term']?.[0]?.[0]?.name || 'Artikel';
            const showImage = imageUrl && !imageUrl.includes('undefined');

            return (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {showImage ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.innerHTML =
                          '<div class="w-full h-full flex items-center justify-center bg-orange-50"><div class="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-50">
                      <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3">
                  <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-semibold rounded-full mb-1.5">
                    {category}
                  </span>
                  <h4 className="font-semibold text-gray-900 text-xs leading-snug line-clamp-2 mb-1.5 group-hover:text-orange-600 transition-colors duration-200">
                    {title}
                  </h4>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {formatDate(article.date)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// DESKTOP: Notification Banner
// =====================================================
function NotificationBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('notification_banner_dismissed');
    if (saved === 'true') setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('notification_banner_dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <section className="hidden lg:block">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border border-red-100 rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-red-100/50">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
              <span className="text-3xl">🔔</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Aktifkan Notifikasi</h3>
              <p className="text-sm text-gray-500">Dapatkan info terbaru dari Jakselnews langsung ke perangkat Anda</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleDismiss} className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition-colors">
              Nanti
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all">
              Aktifkan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// MOBILE SECTIONS (Keep as-is)

// =====================================================
// HERO SEARCH COMPONENT
// =====================================================
function HeroSearch() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input') as HTMLInputElement;
    if (input?.value.trim()) {
      router.push(`/cari?q=${encodeURIComponent(input.value.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <MagnifyingGlass size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari berita, artikel, atau informasi..."
          className="w-full pl-14 pr-36 py-4 bg-white border-2 border-transparent rounded-2xl text-base focus:outline-none focus:border-white focus:ring-4 focus:ring-red-400/40 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          Cari
        </button>
      </div>
    </form>
  );
}

// =====================================================
function MobileSections() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const [breakingPosts, setBreakingPosts] = useState<BreakingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarning, setSelectedWarning] = useState<WarningReport | null>(null);
  const [mobileAlerts, setMobileAlerts] = useState<WarningReport[]>([]);
  const [mobileReports, setMobileReports] = useState<Array<{id: string; type: string; description: string; location_name: string|null; created_at: string}>>([]);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.jakselnews.com';
        const res = await fetch(`${baseUrl}/api/alerts`);
        const data = await res.json();
        if (data.success && data.data) {
          const gradientMap = [
            'from-red-500 to-rose-600',
            'from-blue-500 to-cyan-600',
            'from-amber-500 to-orange-600',
          ];
          const top = (data.data as any[])
            .filter((a: any) => a.is_active)
            .sort((a: any, b: any) => b.upvotes - a.upvotes)
            .slice(0, 3)
            .map((a: any, i: number): WarningReport => ({
              id: a.id,
              type: a.title,
              location: a.category,
              reports: a.report_count,
              time: formatDate(a.created_at),
              gradient: gradientMap[i % gradientMap.length],
              hotline: '110',
              description: a.description || '',
              related: [],
              verification_type: a.verification_type || 'early',
              upvotes: a.upvotes || 0,
            }));
          setMobileAlerts(top);
        }
      } catch (_) {}
    }
    fetchAlerts();
  }, []);

  const handleMobileUpvote = async (id: string | number) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.jakselnews.com';
    try {
      const res = await fetch(`${baseUrl}/api/alerts/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        setMobileAlerts(prev => prev.map(a =>
          a.id === id ? { ...a, upvotes: data.data.upvotes } : a
        ));
      }
    } catch (_) {}
  };

  useEffect(() => {
    async function fetchMobileReports() {
      try {
        const res = await fetch(`/api/reports?limit=3`);
        const data = await res.json();
        if (data.success && data.data) setMobileReports(data.data);
      } catch (_) {}
    }
    fetchMobileReports();
  }, []);

  useEffect(() => {
    async function fetchBreakingNews() {
      try {
        const response = await fetch(`/api/wordpress?endpoint=/wp-json/wp/v2/posts&per_page=5&_embed&status=publish`);
        if (response.ok) {
          const wrapped = await response.json();
          const posts = wrapped.success ? wrapped.data : wrapped;
          if (posts && posts.length > 0) {
            setBreakingPosts(posts);
          } else {
            setBreakingPosts([]);
          }
        } else {
          setBreakingPosts([]);
        }
      } catch (error) {
        setBreakingPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBreakingNews();
  }, []);

  useEffect(() => {
    if (breakingPosts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % breakingPosts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [breakingPosts.length]);

  if (loading) {
    return (
      <div className="space-y-4 px-4 py-4">
        <div className="aspect-[4/3] bg-gray-200 animate-pulse rounded-2xl" />
        <div className="flex justify-center gap-1.5 py-3">
          <div className="w-4 h-2 bg-gray-300 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Only: Breaking News Carousel */}
      <section className="lg:hidden px-4 py-4">
        <div className="relative w-full">
          {breakingPosts.map((post, index) => {
            const imageUrl = getFeaturedImageUrl(post);
            const title = stripHtml(post.title.rendered);
            const isActive = index === currentSlide;

            const card = (
              <div
                className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800">
                  <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded mb-2">BREAKING</span>
                    <h2 className="text-white font-bold text-lg line-clamp-2">{title}</h2>
                    <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                      <Clock size={12} /> {formatDate(post.date)}
                    </p>
                  </div>
                </div>
              </div>
            );

            return isActive ? (
              <Link key={post.id} href={`/artikel/${post.slug}`}>
                {card}
              </Link>
            ) : (
              <div key={post.id}>{card}</div>
            );
          })}
        </div>
        {breakingPosts.length > 1 && (
          <div className="flex justify-center gap-1.5 py-3">
            {breakingPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-red-500 w-4' : 'bg-gray-300 w-2'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Mobile Peringatan */}
      <section className="lg:hidden px-4 py-4 bg-white border-b">
        <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Warning size={18} className="text-red-500" weight="fill" />
          PERINGATAN WARGA
        </h2>
        <div className="space-y-2">
          {mobileAlerts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada peringatan aktif</p>
          ) : (
            mobileAlerts.map((warning) => {
              const isVerified = warning.verification_type === 'verified';
              return (
                <div
                  key={warning.id}
                  className={`rounded-xl p-3 bg-gradient-to-r ${warning.gradient} text-white`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Warning size={20} weight="fill" />
                    <div className="flex-1 text-left">
                      <span className="font-semibold text-sm">{warning.type}</span>
                      <span className="text-white/80 text-xs ml-2">{warning.location}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isVerified ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                    }`}>
                      {warning.reports}x
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-[10px]">{warning.time}</span>
                    <button
                      onClick={() => handleMobileUpvote(warning.id)}
                      className="flex items-center gap-1 text-white/80 hover:text-white text-xs transition-colors"
                    >
                      <Heart size={12} />
                      {warning.upvotes}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Mobile Warning Modal */}
      {selectedWarning && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" onClick={() => setSelectedWarning(null)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto z-[70]">
            <div className={`bg-gradient-to-r ${selectedWarning.gradient} p-6 rounded-t-2xl`}>
              <div className="flex items-center justify-center gap-3 text-white">
                <Warning size={28} weight="fill" />
                <span className="font-bold text-xl">{selectedWarning.type}</span>
              </div>
              <button onClick={() => setSelectedWarning(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
                <X size={18} />
              </button>
            </div>
            <div className="bg-white rounded-b-2xl p-5 space-y-4">
              <p className="text-gray-700 text-center leading-relaxed">{selectedWarning.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                <span>{selectedWarning.location}</span>
                <span>•</span>
                <Clock size={14} />
                <span>{selectedWarning.time}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedWarning.related.map((area) => (
                  <span key={area} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {area}
                  </span>
                ))}
              </div>
              <a href={`tel:${selectedWarning.hotline}`} className={`block w-full py-3 bg-gradient-to-r ${selectedWarning.gradient} text-white font-bold rounded-xl text-center`}>
                Hubungi {selectedWarning.hotline}
              </a>
            </div>
          </div>
        </>
      )}

      {/* Mobile Info Terkini */}
      <section className="lg:hidden px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">INFO TERKINI</h2>
          <Link href="/info-terkini" className="text-xs text-gray-500 flex items-center gap-1">
            Lihat Semua <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {mobileReports.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center w-full">Belum ada laporan masuk</p>
          ) : (
            mobileReports.slice(0, 3).map(report => (
              <div key={report.id} className="shrink-0 w-64">
                <Link href="/info-terkini" className="group block">
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-r ${catGradients[report.type] || 'from-gray-400 to-gray-500'}`}>
                        <Warning size={14} weight="fill" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{catLabels[report.type] || report.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-2">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MapPin size={9} />{report.location_name || 'Jakarta Selatan'}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} {new Date(report.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Mobile Services */}
      <section className="lg:hidden px-4 py-4 bg-white border-t">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">LAYANAN POPULER</h2>
          <Link href="/layanan" className="text-xs text-gray-500 flex items-center gap-1">
            Lihat Semua <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 1, title: 'Bansos Jakarta', icon: <Cardholder size={28} className="text-emerald-600" />, color: 'bg-emerald-50', url: 'https://siladu.jakarta.go.id/' },
            { id: 2, title: 'KJP Plus', icon: <GraduationCap size={28} className="text-violet-600" />, color: 'bg-violet-50', url: 'https://edu.jakarta.go.id/kjp-portal/cek-bansos' },
            { id: 3, title: 'Cek ETLE', icon: <Camera size={28} className="text-blue-600" />, color: 'bg-blue-50', url: 'https://etle-pmj.id/' },
            { id: 4, title: 'Pajak Kendaraan', icon: <CurrencyCircleDollar size={28} className="text-amber-600" />, color: 'bg-amber-50', url: 'https://samsat-pkb2.jakarta.go.id/' },
          ].map((item) => (
            <Link key={item.id} href={item.url} target={item.url.startsWith('http') ? '_blank' : undefined} rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined} className={`${item.color} rounded-xl p-4 text-center`}>
              <div className="flex justify-center mb-2">{item.icon}</div>
              <p className="font-medium text-gray-900 text-xs">{item.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Mobile Artikel Populer */}
      <section className="lg:hidden px-4 py-4 bg-white border-t">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">ARTIKEL POPULER</h2>
          <Link href="/artikel" className="text-xs text-gray-500 flex items-center gap-1">
            Lihat Semua <ArrowRight size={12} />
          </Link>
        </div>
	        <div className="space-y-3">
	        {loading ? (
	          <>
	          <div key="0" className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl animate-pulse">
	            <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
	            <div className="flex-1 space-y-2 pt-1">
	              <div className="h-3 bg-gray-200 rounded w-full" />
	              <div className="h-3 bg-gray-200 rounded w-2/3" />
	              <div className="h-2 bg-gray-200 rounded w-1/3" />
	            </div>
	          </div>
	          <div key="1" className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl animate-pulse">
	            <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
	            <div className="flex-1 space-y-2 pt-1">
	              <div className="h-3 bg-gray-200 rounded w-full" />
	              <div className="h-3 bg-gray-200 rounded w-2/3" />
	              <div className="h-2 bg-gray-200 rounded w-1/3" />
	            </div>
	          </div>
	          <div key="2" className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl animate-pulse">
	            <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
	            <div className="flex-1 space-y-2 pt-1">
	              <div className="h-3 bg-gray-200 rounded w-full" />
	              <div className="h-3 bg-gray-200 rounded w-2/3" />
	              <div className="h-2 bg-gray-200 rounded w-1/3" />
	            </div>
	          </div>
	          <div key="3" className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl animate-pulse">
	            <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
	            <div className="flex-1 space-y-2 pt-1">
	              <div className="h-3 bg-gray-200 rounded w-full" />
	              <div className="h-3 bg-gray-200 rounded w-2/3" />
	              <div className="h-2 bg-gray-200 rounded w-1/3" />
	            </div>
	          </div>
	          <div key="4" className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl animate-pulse">
	            <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
	            <div className="flex-1 space-y-2 pt-1">
	              <div className="h-3 bg-gray-200 rounded w-full" />
	              <div className="h-3 bg-gray-200 rounded w-2/3" />
	              <div className="h-2 bg-gray-200 rounded w-1/3" />
	            </div>
	          </div>
	          </>
	        ) : (
	          breakingPosts.slice(0, 5).map((post) => {
	            const imageUrl = getFeaturedImageUrl(post);
	            const title = stripHtml(post.title.rendered);
	            const hasValidImage = imageUrl && imageUrl.length > 0 && !imageUrl.includes('undefined');

	            return (
	              <Link
	                key={post.id}
	                href={`/artikel/${post.slug}`}
	                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors"
	              >
	                {/* Thumbnail */}
	                <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
	                  {hasValidImage ? (
	                    <img
	                      src={imageUrl}
	                      alt={title}
	                      className="w-full h-full object-cover"
	                      onError={(e) => {
	                        (e.target as HTMLImageElement).parentElement!.innerHTML =
	                          '<div class="w-full h-full flex items-center justify-center bg-orange-50"><div class="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div></div>';
	                      }}
	                    />
	                  ) : (
	                    <div className="w-full h-full flex items-center justify-center bg-orange-50">
	                      <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
	                    </div>
	                  )}
	                </div>
	                <div className="flex-1 min-w-0">
	                  <p className="font-medium text-gray-900 text-sm line-clamp-2">
	                    {title}
	                  </p>
	                  <p className="text-xs text-gray-400 mt-1">{formatDate(post.date)}</p>
	                </div>
	              </Link>
	            );
	          })
	        )}
        </div>
      </section>
    </>
  );
}

// =====================================================
// DESKTOP: Hero Section - Featured with Sides
// =====================================================
function FeaturedArticleWithSides({ posts }: { posts: BreakingPost[] }) {
  const [breakingPosts, setBreakingPosts] = useState<BreakingPost[]>(posts);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setBreakingPosts(posts);
  }, [posts]);

  useEffect(() => {
    if (breakingPosts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % breakingPosts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [breakingPosts.length]);

  if (breakingPosts.length === 0) {
    return <div className="aspect-[16/10] bg-gray-200 rounded-2xl animate-pulse" />;
  }

  const featured = breakingPosts[currentSlide];
  const sides = breakingPosts.filter((_, i) => i !== currentSlide).slice(0, 2);

  if (!featured?.slug) {
    return (
      <div className="aspect-[16/10] bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Featured Slide with Navigation */}
      <div className="relative mb-5">
        <FeaturedArticleCard post={featured} isMain={true} />

        {/* Navigation Dots & Arrows */}
        {breakingPosts.length > 1 && (
          <>
            <div className="absolute bottom-4 left-4 flex gap-2">
              {breakingPosts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2.5 hover:bg-white/70'}`}
                />
              ))}
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => setCurrentSlide(prev => prev === 0 ? breakingPosts.length - 1 : prev - 1)}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
              >
                <ArrowLeft size={18} className="text-gray-700" />
              </button>
              <button
                onClick={() => setCurrentSlide(prev => (prev + 1) % breakingPosts.length)}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
              >
                <ArrowRight size={18} className="text-gray-700" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Side Cards - 2 Columns */}
      {sides.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {sides.map((post) => (
            <SideArticleCard key={`${post.id}-${currentSlide}`} post={post} index={0} />
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================
// DESKTOP: Artikel Terpopuler (untuk Hero Section)
// =====================================================
function DesktopPopularArticles() {
  const [articles, setArticles] = useState<BreakingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/wordpress?endpoint=/wp-json/wp/v2/posts&per_page=10&_embed&status=publish`);
        if (response.ok) {
          const wrapped = await response.json();
          const posts = wrapped.success ? wrapped.data : wrapped;
          if (posts && posts.length > 0) setArticles(posts.slice(0, 5));
        }
      } catch (_) {}
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 animate-pulse">
            <div className="w-24 h-16 bg-gray-200 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="font-bold text-gray-900 text-sm">Artikel Terpopuler</h3>
      </div>

      {/* Article List */}
      <div className="divide-y divide-gray-50">
        {articles.map((article) => {
          const imageUrl = getFeaturedImageUrl(article);
          const title = stripHtml(article.title.rendered);
          const date = formatDate(article.date);
          const hasImage = imageUrl && !imageUrl.includes('undefined') && imageUrl.length > 0;

          return (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="group flex gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              {/* Image */}
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {hasImage ? (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-sm opacity-40">📰</span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="font-semibold text-gray-800 text-xs leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  {title}
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{date}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div className="px-4 py-2.5 border-t border-gray-100 text-center">
        <Link
          href="/artikel"
          className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
        >
          Lihat Semua
        </Link>
      </div>
    </div>
  );
}

// =====================================================
// DESKTOP: Artikel Pilihan — merged Artikel Populer + Terbaru
// =====================================================
function DesktopArtikelPilihan() {
  const [articles, setArticles] = useState<BreakingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(`/api/wordpress?endpoint=/wp-json/wp/v2/posts&per_page=10&_embed&status=publish`);
        if (response.ok) {
          const wrapped = await response.json();
          const posts = wrapped.success ? wrapped.data : wrapped;
          if (posts && posts.length > 0) setArticles(posts.slice(0, 10));
        }
      } catch (_) {}
      finally { setLoading(false); }
    }
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-2.5 p-2.5 bg-white rounded-xl border border-gray-100 animate-pulse">
            <div className="w-20 h-14 bg-gray-100 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5 pt-0.5">
              <div className="h-3.5 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-50 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="font-bold text-gray-900 text-sm">Artikel Pilihan</h3>
      </div>

      {/* Long list */}
      <div className="divide-y divide-gray-50">
        {articles.map((article) => {
          const imageUrl = getFeaturedImageUrl(article);
          const title = stripHtml(article.title.rendered);
          const date = formatDate(article.date);
          const category = article._embedded?.['wp:term']?.[0]?.[0]?.name;
          const hasImage = imageUrl && !imageUrl.includes('undefined') && imageUrl.length > 0;

          return (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="group flex gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              {/* Image */}
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {hasImage ? (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-sm opacity-40">📰</span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                {category && (
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide mb-0.5">
                    {category}
                  </span>
                )}
                <h4 className="font-semibold text-gray-800 text-xs leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  {title}
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{date}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div className="px-4 py-2.5 border-t border-gray-100 text-center">
        <Link
          href="/artikel"
          className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
        >
          Lihat Semua
        </Link>
      </div>
    </div>
  );
}


// DESKTOP: Sidebar News - Elegant Numbered List
// =====================================================
function SidebarNews() {
  const [articles, setArticles] = useState<BreakingPost[]>([]);

  useEffect(() => {
    async function loadArticles() {
      try {
        const response = await fetch(`/api/wordpress?endpoint=/wp-json/wp/v2/posts&per_page=8&_embed&status=publish`);
        if (response.ok) {
          const wrapped = await response.json();
          const posts = wrapped.success ? wrapped.data : wrapped;
          if (posts && posts.length > 0) {
            setArticles(posts.slice(3, 8));
          }
        }
      } catch (error) {
        // fail silently
      }
    }
    loadArticles();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 h-fit shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
          <span className="text-lg">📰</span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg">Berita Lainnya</h3>
      </div>

      {/* Thumbnail List */}
      <div className="space-y-3">
        {articles.map((article) => {
          const imageUrl = getFeaturedImageUrl(article);
          const title = stripHtml(article.title.rendered);
          const hasImage = imageUrl && !imageUrl.includes('undefined');
          return (
          <Link key={article.id} href={`/artikel/${article.slug}`} className="group flex items-start gap-3 py-2 border-b border-gray-50 last:border-0 hover:border-transparent">
            <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {hasImage ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
	                      '<div class="w-full h-full flex items-center justify-center bg-orange-50"><div class="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div></div>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-50">
                  <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-xs leading-snug line-clamp-2 mb-1.5 group-hover:text-red-600 transition-colors duration-200">
                {title}
              </h4>
              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock size={10} /> {formatDate(article.date)}
              </p>
            </div>
          </Link>
          );
        })}
      </div>

      {/* View All Link */}
      <Link href="/artikel" className="mt-5 pt-4 border-t border-gray-100 block text-center text-sm text-red-600 font-semibold hover:text-red-700 transition-colors">
        Lihat Semua Artikel →
      </Link>
    </div>
  );
}

// =====================================================
// MAIN EXPORT
// =====================================================
export default function HomeContent() {
  const [breakingPosts, setBreakingPosts] = useState<BreakingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBreakingNews() {
      try {
        const response = await fetch(`/api/wordpress?endpoint=/wp-json/wp/v2/posts&per_page=5&_embed&status=publish`);
        if (response.ok) {
          const wrapped = await response.json();
          const posts = wrapped.success ? wrapped.data : wrapped;
          if (posts && posts.length > 0) {
            setBreakingPosts(posts);
          } else {
            setBreakingPosts([]);
          }
        } else {
          setBreakingPosts([]);
        }
      } catch (error) {
        setBreakingPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBreakingNews();
  }, []);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Hero: Breaking News Slider (kiri) + Sidebar Logo + Artikel Terpopuler (kanan) */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-5">
            <div className="grid grid-cols-12 gap-6">
              {/* Kiri: Breaking News Slider */}
              <div className="col-span-8">
                {loading ? (
                  <div className="aspect-[16/10] bg-gray-200 rounded-2xl animate-pulse" />
                ) : (
                  <FeaturedArticleWithSides posts={breakingPosts} />
                )}
              </div>

              {/* Kanan: Logo + Social + Artikel Terpopuler */}
              <div className="col-span-4 flex flex-col gap-4">
                {/* Logo + Social Icons */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 text-center">
                  <img
                    src="/logo-jakselnews.png"
                    alt="Jakselnews"
                    className="w-24 h-auto mx-auto mb-3 object-contain"
                  />
                  <p className="text-xs text-gray-400 mb-4">Portal Berita Warga Jakarta Selatan</p>
                  <div className="flex items-center justify-center gap-2.5">
                    <a href="https://instagram.com/jakselnews" target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                    <a href="https://twitter.com/jakselnews" target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  </div>
                </div>

                {/* Artikel Terpopuler */}
                <DesktopPopularArticles />
              </div>
            </div>
          </div>
        </section>

        {/* Layanan Publik */}
        <LayananPopulerSection />

        {/* Artikel Pilihan — merged Artikel Populer + Terbaru */}
        <section className="bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-5">
            <DesktopArtikelPilihan />
          </div>
        </section>
      </div>

      {/* Mobile Layout */}
      <MobileSections />
    </>
  );
}
