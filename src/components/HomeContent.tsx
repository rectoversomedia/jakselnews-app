'use client';

import { useState, useEffect } from 'react';
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
} from '@phosphor-icons/react';
import { UGCPostCard } from './UGCPost';

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
  id: number;
  type: string;
  location: string;
  reports: number;
  time: string;
  gradient: string;
  hotline: string;
  description: string;
  related: string[];
}

// Fallback data
const fallbackPosts: BreakingPost[] = [
  {
    id: 522,
    slug: 'rectoverso-narriv-ai-narasi-krisis',
    title: { rendered: 'Rectoverso Media Perkenalkan Narriv, Platform AI untuk Membantu Organisasi Mengelola Narasi Publik' },
    date: '2026-07-15T08:00:00',
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/Fajar-Rectoverso-Media.png',
        media_details: { sizes: { large: { source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/Fajar-Rectoverso-Media.png' } } }
      }]
    }
  },
  {
    id: 523,
    slug: 'festival-jaksel-2026',
    title: { rendered: 'Festival Jaksel 2026: Menyatu dalam Keberagaman Budaya Jakarta Selatan' },
    date: '2026-07-14T10:00:00',
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/festival-jaksel.jpg',
        media_details: { sizes: { large: { source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/festival-jaksel.jpg' } } }
      }]
    }
  },
  {
    id: 524,
    slug: 'mrt-jakarta-rute-baru',
    title: { rendered: 'MRT Jakarta Resmi Buka Rute Baru Menuju Kawasan Timur' },
    date: '2026-07-13T08:00:00',
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/mrt-jakarta.jpg',
        media_details: { sizes: { large: { source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/mrt-jakarta.jpg' } } }
      }]
    }
  }
];

const staticWarnings: WarningReport[] = [
  {
    id: 1,
    type: 'Waspada Begal',
    location: 'Kawasan Kemang',
    reports: 47,
    time: '15 menit lalu',
    gradient: 'from-red-500 to-rose-600',
    hotline: '110',
    description: 'Laporan meningkat tentang aksi begal di kawasan Kemang. Korban kehilangan ponsel dan tas.',
    related: ['Jl. Kemang Raya', 'Jl. Ampera', 'Jl. TB Simatupang']
  },
  {
    id: 2,
    type: 'Genangan Air',
    location: 'Jl. TB Simatupang',
    reports: 32,
    time: '30 menit lalu',
    gradient: 'from-blue-500 to-cyan-600',
    hotline: '112',
    description: 'Genangan air setinggi 20cm akibat hujan deras. Arus kendaraan dihimbau berhati-hati.',
    related: ['Jl. TB Simatupang', 'Jl. Cilandak', 'Jl. Pasar Minggu']
  },
  {
    id: 3,
    type: 'Kemacetan Parah',
    location: 'Jl. MT. Haryono',
    reports: 25,
    time: '1 jam lalu',
    gradient: 'from-amber-500 to-orange-600',
    hotline: '110',
    description: 'Volume kendaraan sangat tinggi, estimasi delay 30 menit akibat lampu merah mati.',
    related: ['Jl. MT. Haryono', 'Jl. Gatot Subroto', 'Jl. Rasuna Said']
  }
];

function getFeaturedImageUrl(post: BreakingPost): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return '/placeholder.jpg';
  return media.media_details?.sizes?.large?.source_url ||
         media.media_details?.sizes?.medium_large?.source_url ||
         media.source_url;
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

// =====================================================
// DESKTOP: Enhanced Featured Article Card (Hero Style)
// =====================================================
function FeaturedArticleCard({ post, isMain = false }: { post: BreakingPost; isMain?: boolean }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getFeaturedImageUrl(post);
  const title = stripHtml(post.title.rendered);
  const date = formatDate(post.date);
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Artikel';

  return (
    <Link href={`/artikel/${post.slug}`} className="group block">
      <div className={`relative overflow-hidden rounded-2xl bg-gray-900 ${isMain ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
        {!imageError ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-6xl">📰</span>
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

  return (
    <Link href={`/artikel/${post.slug}`} className="group flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300">
      <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-100">📰</div>
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
function WarningCard({ warning }: { warning: WarningReport }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    'from-red-500 to-rose-600': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
    'from-blue-500 to-cyan-600': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    'from-amber-500 to-orange-600': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  };
  const color = colors[warning.gradient] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100' };

  return (
    <div className={`p-5 rounded-2xl ${color.bg} border ${color.border} transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${warning.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
          <Warning size={22} className="text-white" weight="fill" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2 gap-2">
            <h4 className="font-bold text-gray-900 text-sm">{warning.type}</h4>
            <span className="shrink-0 text-xs font-bold text-white bg-red-500 px-2.5 py-0.5 rounded-full shadow-sm">
              {warning.reports}x
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
            <MapPin size={11} />
            {warning.location}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{warning.time}</span>
            <a href={`tel:${warning.hotline}`} className={`text-xs font-medium ${color.text} hover:underline flex items-center gap-1`}>
              <span>Hubungi</span>
              <span className="font-bold">{warning.hotline}</span>
            </a>
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
// DESKTOP: Peringatan Section
// =====================================================
function PeringatanSection() {
  const [selectedWarning, setSelectedWarning] = useState<WarningReport | null>(null);

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
          <div className="grid grid-cols-3 gap-5">
            {staticWarnings.map((warning) => (
              <button
                key={warning.id}
                onClick={() => setSelectedWarning(warning)}
                className="text-left w-full"
              >
                <WarningCard warning={warning} />
              </button>
            ))}
          </div>
        </div>
      </section>
      {selectedWarning && (
        <WarningModal warning={selectedWarning} onClose={() => setSelectedWarning(null)} />
      )}
    </>
  );
}

// =====================================================
// DESKTOP: Info Terkini Section - Enhanced Cards
// =====================================================
function InfoTerkiniSection() {
  const mockReports = [
    { id: 1, authorName: 'Warga Kemang', location: 'Kemang', time: '10 menit lalu', content: 'Air mulai pasang di Jl Kemang Raya arah Blok M. Tinggi air sudah 15cm. Masyarakat diminta waspada! 🌊', likes: 24, comments: 8, shares: 5 },
    { id: 2, authorName: 'Warga Blok M', location: 'Blok M', time: '25 menit lalu', content: 'Kemacetan parah di Jl. Melawai arah flyover. Estimated delay 30 menit. 🚗💨', likes: 18, comments: 12, shares: 3 },
    { id: 3, authorName: 'Warga Cilandak', location: 'Cilandak', time: '45 menit lalu', content: 'Listrik padam di kawasan TB Simatupang. PLN sedang melakukan perbaikan. ⚡', likes: 15, comments: 6, shares: 2 },
    { id: 4, authorName: 'Warga Kebayoran', location: 'Kebayoran', time: '1 jam lalu', content: 'Pohon tumbang di Jl. Trunojoyo. Arvodi dan tim kebersihan sudah di lokasi. 🌳', likes: 32, comments: 15, shares: 8 },
    { id: 5, authorName: 'Warga Tebet', location: 'Tebet', time: '2 jam lalu', content: 'Laporan kerusakan jalan di Jl. Tebet Raya. Mohon perbaikan segera. 🛠️', likes: 12, comments: 4, shares: 2 },
    { id: 6, authorName: 'Warga Pasar Minggu', location: 'Pasar Minggu', time: '3 jam lalu', content: 'Positif! Masjid di Jl. RM Soedirdja sudah dibersihkan. Terima kasih warga! 🤝', likes: 45, comments: 18, shares: 12 },
  ];

  return (
    <section className="hidden lg:block bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <ChatCircle size={26} className="text-white" weight="fill" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Info Terkini</h2>
              <p className="text-sm text-gray-500">Laporan warga Jakarta Selatan</p>
            </div>
          </div>
          <Link href="/info-terkini" className="group text-sm text-violet-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Lihat Semua
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid - Enhanced */}
        <div className="grid grid-cols-3 gap-6">
          {mockReports.map((report) => (
            <div key={report.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 hover:-translate-y-1">
              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {report.authorName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{report.authorName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin size={10} /> {report.location} • {report.time}
                  </p>
                </div>
              </div>
              {/* Content */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">{report.content}</p>
              {/* Actions */}
              <div className="flex items-center gap-5 text-gray-400 text-xs pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                  <Heart size={14} /> {report.likes}
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                  <ChatCircle size={14} /> {report.comments}
                </button>
                <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors ml-auto">
                  <Share size={14} /> {report.shares}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// DESKTOP: Layanan Section - Enhanced
// =====================================================
function LayananPopulerSection() {
  const layananPopuler = [
    { id: 1, title: 'Bansos Jakarta', desc: 'Cek penerima bansos', icon: '💰', bg: 'bg-emerald-50', border: 'border-emerald-100', hover: 'hover:bg-emerald-100' },
    { id: 2, title: 'KJP Plus', desc: 'Saldo Kartu Jakarta Pintar', icon: '🎓', bg: 'bg-violet-50', border: 'border-violet-100', hover: 'hover:bg-violet-100' },
    { id: 3, title: 'Cek ETLE', desc: 'Tilang elektronik', icon: '📸', bg: 'bg-blue-50', border: 'border-blue-100', hover: 'hover:bg-blue-100' },
    { id: 4, title: 'Pajak Kendaraan', desc: 'Cek & bayar pajak', icon: '🚗', bg: 'bg-amber-50', border: 'border-amber-100', hover: 'hover:bg-amber-100' },
    { id: 5, title: 'KRL', desc: 'Jadwal & rute KRL', icon: '🚆', bg: 'bg-cyan-50', border: 'border-cyan-100', hover: 'hover:bg-cyan-100' },
    { id: 6, title: 'TransJakarta', desc: 'Rute & halte', icon: '🚌', bg: 'bg-red-50', border: 'border-red-100', hover: 'hover:bg-red-100' },
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
              href="/layanan"
              className={`${item.bg} ${item.border} border rounded-2xl p-5 text-center ${item.hover} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              <span className="text-4xl mb-3 block">{item.icon}</span>
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
        const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'https://jakselnews.com/wp-json/wp/v2';
        const response = await fetch(`${apiUrl}/posts?per_page=6&_embed&status=publish`);
        if (response.ok) {
          const posts = await response.json();
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
function MobileSections() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [breakingPosts, setBreakingPosts] = useState<BreakingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBreakingNews() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'https://jakselnews.com/wp-json/wp/v2';
        const response = await fetch(`${apiUrl}/posts?per_page=5&_embed&status=publish`);
        if (response.ok) {
          const posts = await response.json();
          if (posts && posts.length > 0) {
            setBreakingPosts(posts);
          } else {
            setBreakingPosts(fallbackPosts);
          }
        } else {
          setBreakingPosts(fallbackPosts);
        }
      } catch (error) {
        setBreakingPosts(fallbackPosts);
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
          {breakingPosts.slice(0, 3).map((post, index) => {
            const imageUrl = getFeaturedImageUrl(post);
            const title = stripHtml(post.title.rendered);
            return (
              <Link
                key={post.id}
                href={`/artikel/${post.slug}`}
                className={`block transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
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
              </Link>
            );
          })}
        </div>
        {breakingPosts.length > 1 && (
          <div className="flex justify-center gap-1.5 py-3">
            {breakingPosts.slice(0, 3).map((_, index) => (
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
          {staticWarnings.map((warning) => (
            <div
              key={warning.id}
              className={`w-full rounded-xl p-3 bg-gradient-to-r ${warning.gradient} text-white flex items-center gap-3`}
            >
              <Warning size={20} weight="fill" />
              <div className="flex-1 text-left">
                <span className="font-semibold text-sm">{warning.type}</span>
                <span className="text-white/80 text-xs ml-2">{warning.location}</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{warning.reports}x</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Info Terkini */}
      <section className="lg:hidden px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">INFO TERKINI</h2>
          <Link href="/info-terkini" className="text-xs text-gray-500 flex items-center gap-1">
            Lihat Semua <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {[
            { id: 1, authorName: 'Warga Kemang', location: 'Kemang', time: '10 menit lalu', content: 'Air mulai pasang di Jl Kemang Raya. Tinggi 15cm! 🌊', likes: 24, comments: 8, shares: 5 },
            { id: 2, authorName: 'Warga Blok M', location: 'Blok M', time: '25 menit lalu', content: 'Kemacetan parah arah flyover. Delay 30 menit. 🚗💨', likes: 18, comments: 12, shares: 3 },
            { id: 3, authorName: 'Warga Cilandak', location: 'Cilandak', time: '45 menit lalu', content: 'Listrik padam di TB Simatupang. PLN perbaikan. ⚡', likes: 15, comments: 6, shares: 2 },
          ].map((report) => (
            <div key={report.id} className="shrink-0 w-64">
              <UGCPostCard report={report} />
            </div>
          ))}
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
            { id: 1, title: 'Bansos Jakarta', icon: '💰', color: 'bg-emerald-50' },
            { id: 2, title: 'KJP Plus', icon: '🎓', color: 'bg-violet-50' },
            { id: 3, title: 'Cek ETLE', icon: '📸', color: 'bg-blue-50' },
            { id: 4, title: 'Pajak Kendaraan', icon: '🚗', color: 'bg-amber-50' },
          ].map((item) => (
            <Link key={item.id} href="/layanan" className={`${item.color} rounded-xl p-4 text-center`}>
              <span className="text-2xl mb-1 block">{item.icon}</span>
              <p className="font-medium text-gray-900 text-xs">{item.title}</p>
            </Link>
          ))}
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
      setCurrentSlide(prev => (prev + 1) % Math.min(breakingPosts.length, 3));
    }, 6000);
    return () => clearInterval(interval);
  }, [breakingPosts.length]);

  if (breakingPosts.length === 0) {
    return <div className="aspect-[16/10] bg-gray-200 rounded-2xl animate-pulse" />;
  }

  const featured = breakingPosts[currentSlide];
  const sides = breakingPosts.filter((_, i) => i !== currentSlide).slice(0, 2);

  return (
    <div>
      {/* Featured Slide with Navigation */}
      <div className="relative mb-5">
        <FeaturedArticleCard post={featured} isMain={true} />

        {/* Navigation Dots & Arrows */}
        {breakingPosts.length > 1 && (
          <>
            <div className="absolute bottom-4 left-4 flex gap-2">
              {breakingPosts.slice(0, 3).map((_, i) => (
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
// DESKTOP: Sidebar News - Elegant Numbered List
// =====================================================
function SidebarNews() {
  const [articles, setArticles] = useState<BreakingPost[]>([]);

  useEffect(() => {
    async function fetch() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'https://jakselnews.com/wp-json/wp/v2';
        const response = await fetch(`${apiUrl}/posts?per_page=5&_embed&status=publish`);
        if (response.ok) {
          const posts = await response.json();
          if (posts && posts.length > 0) {
            setArticles(posts.slice(3, 8));
          }
        }
      } catch (error) {
        // fail silently
      }
    }
    fetch();
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

      {/* Numbered List */}
      <div className="space-y-4">
        {articles.map((article, index) => (
          <Link key={article.id} href={`/artikel/${article.slug}`} className="group flex items-start gap-4 py-3 border-b border-gray-50 last:border-0 hover:border-transparent">
            <span className="text-2xl font-black text-gray-200 group-hover:text-red-200 transition-colors leading-none mt-0.5 w-8">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-red-600 transition-colors duration-200">
                {stripHtml(article.title.rendered)}
              </h4>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <Clock size={11} /> {formatDate(article.date)}
              </p>
            </div>
          </Link>
        ))}
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
        const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'https://jakselnews.com/wp-json/wp/v2';
        const response = await fetch(`${apiUrl}/posts?per_page=5&_embed&status=publish`);
        if (response.ok) {
          const posts = await response.json();
          if (posts && posts.length > 0) {
            setBreakingPosts(posts);
          } else {
            setBreakingPosts(fallbackPosts);
          }
        } else {
          setBreakingPosts(fallbackPosts);
        }
      } catch (error) {
        setBreakingPosts(fallbackPosts);
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
        {/* Hero: Featured Article + Sidebar */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8">
                {loading ? (
                  <div className="aspect-[16/10] bg-gray-200 rounded-2xl animate-pulse" />
                ) : (
                  <FeaturedArticleWithSides posts={breakingPosts} />
                )}
              </div>
              <div className="col-span-4">
                <SidebarNews />
              </div>
            </div>
          </div>
        </section>

        <PeringatanSection />
        <InfoTerkiniSection />
        <LayananPopulerSection />
        <ArtikelTerbaruSection />
      </div>

      {/* Mobile Layout */}
      <MobileSections />
    </>
  );
}
