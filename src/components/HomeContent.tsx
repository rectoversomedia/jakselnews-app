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
} from '@phosphor-icons/react';
import { UGCPostCard } from './UGCPost';

interface BreakingPost {
  id: number;
  slug: string;
  title: { rendered: string };
  date: string;
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

// Fallback data dari jakselnews.com
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
    gradient: 'from-red-500 to-rose-500',
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
    gradient: 'from-blue-500 to-cyan-500',
    hotline: '112',
    description: 'Genangan air setinggi 20cm akibat hujan deras. Arus kendaraan dihimbau berhati-hati.',
    related: ['Jl. TB Simatupang', 'Jl. Cilandak', 'Jl. pasar minggu']
  },
  {
    id: 3,
    type: 'Kemacetan Parah',
    location: 'Jl. MT. Haryono',
    reports: 25,
    time: '1 jam lalu',
    gradient: 'from-amber-500 to-orange-500',
    hotline: '110',
    description: 'Volume kendaraan sangat tinggi, estimasi delay 30 menit akibat lampu merah mati.',
    related: ['Jl. MT. Haryono', 'Jl. Gatot Subroto', 'Jl. Rasuna Said']
  }
];

// Helper function untuk get featured image
function getFeaturedImageUrl(post: BreakingPost): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return '/placeholder.jpg';
  return media.media_details?.sizes?.large?.source_url ||
         media.media_details?.sizes?.medium_large?.source_url ||
         media.source_url;
}

// Helper function untuk strip HTML
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

// Helper function untuk format date
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

// Breaking News Card Component - Square aspect ratio
function BreakingNewsCard({ post, aspectRatio = 'aspect-[4/3]' }: { post: BreakingPost; aspectRatio?: string }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getFeaturedImageUrl(post);
  const title = stripHtml(post.title.rendered);
  const date = formatDate(post.date);

  return (
    <Link href={`/artikel/${post.slug}`} className="block group">
      <div className={`relative w-full ${aspectRatio} overflow-hidden rounded-2xl bg-gray-800`}>
        {/* Background Image */}
        {!imageError ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-gray-500 text-4xl">📰</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content - Bottom positioned */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded mb-2">
            BREAKING
          </span>
          <h2 className="text-white font-bold text-sm line-clamp-2 mb-1 drop-shadow-lg">
            {title}
          </h2>
          <p className="text-white/80 text-xs flex items-center gap-1.5">
            <Clock size={12} />
            {date}
          </p>
        </div>
      </div>
    </Link>
  );
}

// Breaking News Hero Section
function BreakingNewsSection({ posts }: { posts: BreakingPost[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posts.length]);

  if (posts.length === 0) {
    return (
      <section className="px-4 py-4">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          <p className="text-gray-500">Tidak ada berita terbaru</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-4">
      {/* Mobile: Single Card with Slides */}
      <div className="lg:hidden">
        {/* Main Card */}
        <div className="relative w-full">
          {posts.slice(0, 3).map((post, index) => (
            <div
              key={post.id}
              className={`transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            >
              <BreakingNewsCard post={post} aspectRatio="aspect-[4/3]" />
            </div>
          ))}
        </div>

        {/* Dots */}
        {posts.length > 1 && (
          <div className="flex justify-center gap-1.5 py-3">
            {posts.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-red-500 w-4' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-3 gap-4">
          {/* Main Featured */}
          <div className="col-span-2">
            <BreakingNewsCard post={posts[0]} aspectRatio="aspect-[16/9]" />
          </div>

          {/* Side Cards */}
          <div className="space-y-4">
            {posts.slice(1, 3).map((post) => (
              <BreakingNewsCard key={post.id} post={post} aspectRatio="aspect-[4/3]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Warning Modal
function WarningModal({ warning, onClose }: { warning: WarningReport; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl z-50 max-h-[85vh] overflow-y-auto">
        <div className={`bg-gradient-to-r ${warning.gradient} p-4 rounded-t-2xl`}>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Warning size={24} weight="fill" />
              <span className="font-bold text-lg">{warning.type}</span>
            </div>
            <button onClick={onClose}><X size={20} /></button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-gray-600">{warning.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={14} />
            <span>{warning.location}</span>
            <span>•</span>
            <span>{warning.time}</span>
          </div>
          <div className="bg-red-50 rounded-xl p-3">
            <p className="text-xs text-red-600 font-semibold mb-1">📞 Hotline Darurat</p>
            <p className="text-2xl font-bold text-red-600">{warning.hotline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {warning.related.map((area) => (
              <span key={area} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {area}
              </span>
            ))}
          </div>
          <a
            href={`tel:${warning.hotline}`}
            className={`block w-full py-3 bg-gradient-to-r ${warning.gradient} text-white font-bold rounded-xl text-center`}
          >
            Hubungi {warning.hotline}
          </a>
        </div>
      </div>
    </>
  );
}

// Peringatan Section
function PeringatanSection() {
  const [selectedWarning, setSelectedWarning] = useState<WarningReport | null>(null);

  return (
    <>
      <section className="px-4 py-5 bg-white border-b">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          PERINGATAN WARGA
        </h2>
        <div className="space-y-2">
          {staticWarnings.map((warning) => (
            <button
              key={warning.id}
              onClick={() => setSelectedWarning(warning)}
              className={`w-full rounded-xl p-3 bg-gradient-to-r ${warning.gradient} text-white flex items-center gap-3 hover:opacity-90 transition-opacity`}
            >
              <Warning size={20} weight="fill" />
              <div className="flex-1 text-left">
                <span className="font-semibold text-sm">{warning.type}</span>
                <span className="text-white/80 text-xs ml-2">{warning.location}</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{warning.reports}x</span>
              <ArrowRight size={16} className="text-white/70" />
            </button>
          ))}
        </div>
      </section>

      {selectedWarning && (
        <WarningModal warning={selectedWarning} onClose={() => setSelectedWarning(null)} />
      )}
    </>
  );
}

// Info Terkini Section
function InfoTerkiniSection() {
  const mockReports = [
    { id: 1, authorName: 'Warga Kemang', location: 'Kemang', time: '10 menit lalu', content: 'Air mulai pasang di Jl Kemang Raya arah Blok M. Tinggi air sudah 15cm. Masyarakat diminta waspada! 🌊', likes: 24, comments: 8, shares: 5 },
    { id: 2, authorName: 'Warga Blok M', location: 'Blok M', time: '25 menit lalu', content: 'Kemacetan parah di Jl. Melawai arah flyover. Estimated delay 30 menit. 🚗💨', likes: 18, comments: 12, shares: 3 },
    { id: 3, authorName: 'Warga Cilandak', location: 'Cilandak', time: '45 menit lalu', content: 'Listrik padam di kawasan TB Simatupang. PLN sedang melakukan perbaikan. ⚡', likes: 15, comments: 6, shares: 2 },
    { id: 4, authorName: 'Warga Kebayoran', location: 'Kebayoran', time: '1 jam lalu', content: 'Pohon tumbang di Jl. Trunojoyo. Arvodi dan tim kebersihan sudah di lokasi. 🌳', likes: 32, comments: 15, shares: 8 }
  ];

  return (
    <section className="px-4 py-5">
      <div className="flex items-center justify-between mb-3">
        <Link href="/info-terkini" className="text-base font-bold text-gray-900">
          INFO TERKINI
        </Link>
        <Link href="/info-terkini" className="text-sm text-gray-500 flex items-center gap-1">
          Lihat Semua <ArrowRight size={14} />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
        {mockReports.map((report) => (
          <div key={report.id} className="shrink-0 w-64">
            <UGCPostCard report={report} />
          </div>
        ))}
      </div>
    </section>
  );
}

// Layanan Populer Section
function LayananPopulerSection() {
  const layananPopuler = [
    { id: 1, title: 'Cek Bansos', desc: 'Cek penerima', icon: '💰', gradient: 'bg-emerald-500' },
    { id: 2, title: 'KJP Plus', desc: 'Cek saldo', icon: '🎓', gradient: 'bg-violet-500' },
    { id: 3, title: 'Cek ETLE', desc: 'Tilang', icon: '📸', gradient: 'bg-blue-500' },
    { id: 4, title: 'Pajak', desc: 'Cek & Bayar', icon: '🚗', gradient: 'bg-amber-500' },
    { id: 5, title: 'KRL', desc: 'Jadwal', icon: '🚆', gradient: 'bg-blue-600' },
    { id: 6, title: 'TransJakarta', desc: 'Rute', icon: '🚌', gradient: 'bg-red-500' },
  ];

  return (
    <section className="px-4 py-5 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">
          LAYANAN POPULER
        </h2>
        <Link href="/layanan" className="text-sm text-gray-500 flex items-center gap-1">
          Lihat Semua <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {layananPopuler.map((item) => (
          <Link key={item.id} href="/layanan" className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors">
            <div className={`w-10 h-10 ${item.gradient} rounded-lg flex items-center justify-center text-xl`}>
              {item.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Artikel Terbaru Section
function ArtikelTerbaruSection() {
  const [articles, setArticles] = useState<BreakingPost[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'https://jakselnews.com/wp-json/wp/v2';
        const response = await fetch(`${apiUrl}/posts?per_page=5&_embed&status=publish`);
        if (response.ok) {
          const posts = await response.json();
          if (posts && posts.length > 0) {
            setArticles(posts.slice(0, 5));
          }
        }
      } catch (error) {
        // Silently fail
      }
    }
    fetchArticles();
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="px-4 py-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">
          ARTIKEL TERBARU
        </h2>
        <Link href="/artikel" className="text-sm text-gray-500 flex items-center gap-1">
          Lihat Semua <ArrowRight size={14} />
        </Link>
      </div>
      <div className="space-y-3">
        {articles.map((article, index) => {
          const title = stripHtml(article.title.rendered);
          const imageUrl = getFeaturedImageUrl(article);
          const date = formatDate(article.date);

          return (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="%239ca3af" font-size="30"%3E📰%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase">
                  {index === 0 ? 'Terbaru' : 'Artikel'}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mt-1">
                  {title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock size={12} />
                  {date}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Notification Banner
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
    <section className="px-4 pb-6">
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">🔔</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Aktifkan Notifikasi</h3>
            <p className="text-xs text-gray-500">Dapatkan info terbaru dari Jakselnews</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDismiss} className="p-2 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-semibold rounded-full">
            Aktifkan
          </button>
        </div>
      </div>
    </section>
  );
}

// Main HomeContent Component
export default function HomeContent() {
  const [breakingPosts, setBreakingPosts] = useState<BreakingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBreakingNews() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'https://jakselnews.com/wp-json/wp/v2';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${apiUrl}/posts?per_page=5&_embed&status=publish`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

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
      <BreakingNewsSection posts={breakingPosts} />
      <PeringatanSection />
      <InfoTerkiniSection />
      <LayananPopulerSection />
      <ArtikelTerbaruSection />
      <NotificationBanner />
    </>
  );
}
