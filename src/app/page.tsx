'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  MapPin,
  Warning,
  X,
  Heart,
  ChatCircle,
  Share,
  CaretRight,
  House,
} from '@phosphor-icons/react';
import { wp, WPPost, getFeaturedImage, formatPostDate, stripHtml } from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export default function HomePage() {
  const [breakingNews, setBreakingNews] = useState<WPPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarning, setSelectedWarning] = useState<WarningReport | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gradient warning data
  const warnings: WarningReport[] = [
    {
      id: 1,
      type: 'Waspada Begal',
      location: 'Kawasan Kemang',
      reports: 47,
      time: '15 menit lalu',
      gradient: 'from-red-500 to-rose-500',
      hotline: '110',
      description: 'Laporan meningkat tentang aksi begal di kawasan Kemang. Korban kehilangan ponsel dan tas.',
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
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const breaking = await wp.getBreakingNews();
        if (breaking.success && breaking.data.length > 0) {
          setBreakingNews(breaking.data);
        }
        const latest = await wp.getLatest(5);
        if (latest.success && latest.data.length > 0) {
          setLatestPosts(latest.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Auto-slide for breaking news
  useEffect(() => {
    if (breakingNews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % breakingNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [breakingNews.length]);

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <main className="pb-20 lg:pb-0 bg-gray-50 min-h-screen">
      <Header />
      <BottomNav />

      {/* Full Width Breaking News Slider */}
      <section className="relative w-full">
        {loading ? (
          <div className="h-56 md:h-72 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        ) : breakingNews.length > 0 ? (
          <div className="relative w-full h-56 md:h-72 overflow-hidden">
            {breakingNews.slice(0, 5).map((post, index) => (
              <div
                key={post.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Link href={`/artikel/${post.slug}`} className="block w-full h-full">
                  <Image
                    src={getFeaturedImage(post) || '/placeholder.jpg'}
                    alt={stripHtml(post.title.rendered)}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </Link>

                {/* Breaking Badge */}
                {index === currentSlide && (
                  <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">
                      BREAKING
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h2 className="text-white font-bold text-lg md:text-xl line-clamp-2 drop-shadow">
                    {stripHtml(post.title.rendered)}
                  </h2>
                  <p className="text-white/80 text-xs md:text-sm mt-1 flex items-center gap-2">
                    <Clock size={12} />
                    {formatPostDate(post.date)}
                  </p>
                </div>
              </div>
            ))}

            {/* Slider Dots */}
            {breakingNews.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                {breakingNews.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Tidak ada berita terbaru</p>
          </div>
        )}
      </section>

      {/* Peringatan Warga */}
      <section className="w-full px-4 py-5 bg-white border-b">
        <h2 className="text-base font-bold text-gray-900 mb-3">PERINGATAN WARGA</h2>
        <div className="space-y-2">
          {warnings.map((warning) => (
            <button
              key={warning.id}
              onClick={() => setSelectedWarning(warning)}
              className={`w-full rounded-xl p-3 bg-gradient-to-r ${warning.gradient} text-white flex items-center gap-3`}
            >
              <Warning size={20} weight="fill" />
              <div className="flex-1 text-left">
                <span className="font-semibold text-sm">{warning.type}</span>
                <span className="text-white/80 text-xs ml-2">{warning.location}</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{warning.reports}x</span>
              <CaretRight size={16} className="text-white/70" />
            </button>
          ))}
        </div>
      </section>

      {/* Info Terkini */}
      <section className="w-full px-4 py-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">INFO TERKINI</h2>
          <Link href="/info-terkini" className="text-sm text-gray-500">
            Lihat Semua <CaretRight size={14} className="inline" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shrink-0 w-64 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                  W{i}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-xs">Warga Kemang</p>
                  <p className="text-gray-400 text-[10px]">Kemang • 10 menit</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs line-clamp-2">
                Air mulai pasang di Jl Kemang Raya arah Blok M. Tinggi air sudah 15cm...
              </p>
              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1 text-gray-400 text-xs"><Heart size={12} /> 24</span>
                <span className="flex items-center gap-1 text-gray-400 text-xs"><ChatCircle size={12} /> 8</span>
                <span className="flex items-center gap-1 text-gray-400 text-xs ml-auto"><Share size={12} /> 5</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Artikel Terbaru - List */}
      <section className="w-full px-4 py-5 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">ARTIKEL TERBARU</h2>
          <Link href="/artikel" className="text-sm text-gray-500">
            Lihat Semua <CaretRight size={14} className="inline" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {latestPosts.slice(0, 5).map((post, index) => (
              <Link
                key={post.id}
                href={`/artikel/${post.slug}`}
                className="flex gap-3 group"
              >
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={getFeaturedImage(post) || '/placeholder.jpg'}
                    alt={stripHtml(post.title.rendered)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium uppercase mb-0.5">
                    {post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Artikel'}
                  </p>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                    {stripHtml(post.title.rendered)}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {formatPostDate(post.date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Warning Modal */}
      {selectedWarning && (
        <WarningModal
          warning={selectedWarning}
          onClose={() => setSelectedWarning(null)}
        />
      )}
    </main>
  );
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
}

function WarningModal({ warning, onClose }: { warning: WarningReport; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl z-50 p-5">
        <div className={`bg-gradient-to-r ${warning.gradient} p-4 rounded-xl text-white mb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Warning size={24} weight="fill" />
              <span className="font-bold">{warning.type}</span>
            </div>
            <button onClick={onClose}><X size={20} /></button>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">{warning.description}</p>
        <p className="text-gray-500 text-xs mb-3 flex items-center gap-1">
          <MapPin size={12} /> {warning.location} • {warning.time}
        </p>
        <a
          href={`tel:${warning.hotline}`}
          className={`block w-full py-3 bg-gradient-to-r ${warning.gradient} text-white font-bold rounded-xl text-center text-sm`}
        >
          Hubungi {warning.hotline}
        </a>
      </div>
    </>
  );
}
