'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PhClock,
  PhMapPin,
  PhCaretRight,
  PhWarning,
  PhX,
  PhArrowRight,
  PhHeart,
  PhChatCircle,
  PhShare,
  PhBookmark,
  PhBell,
  PhNewspaper,
  PhSquaresFour,
  PhHouse,
  PhMagnifyingGlass,
  PhUser,
  PhList,
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

  // Gradient warning data
  const warnings: WarningReport[] = [
    {
      id: 1,
      type: 'Waspada Begal',
      location: 'Kawasan Kemang',
      reports: 47,
      time: '15 menit lalu',
      gradient: 'from-red-500 via-rose-500 to-pink-500',
      hotline: '110',
      description: 'Laporan meningkat tentang aksi begal di kawasan Kemang. Korban kehilangan ponsel dan tas.',
    },
    {
      id: 2,
      type: 'Genangan Air',
      location: 'Jl. TB Simatupang',
      reports: 32,
      time: '30 menit lalu',
      gradient: 'from-blue-500 via-cyan-500 to-teal-400',
      hotline: '112',
      description: 'Genangan air setinggi 20cm akibat hujan deras. Arus kendaraan dihimbau berhati-hati.',
    },
    {
      id: 3,
      type: 'Kemacetan Parah',
      location: 'Jl. MT. Haryono',
      reports: 25,
      time: '1 jam lalu',
      gradient: 'from-amber-500 via-orange-400 to-yellow-400',
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
        const latest = await wp.getLatest(12);
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
    <main className="pb-24 lg:pb-0 lg:pt-20 bg-gray-50 min-h-screen">
      <Header />
      <BottomNav />

      {/* Breaking News Hero with Gradient Overlay */}
      <section className="relative">
        {loading ? (
          <div className="h-64 md:h-80 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        ) : breakingNews.length > 0 ? (
          <div className="relative overflow-hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {breakingNews.slice(0, 5).map((post, index) => (
                <Link
                  key={post.id}
                  href={`/artikel/${post.slug}`}
                  className="snap-start shrink-0 w-full relative h-64 md:h-80"
                >
                  <Image
                    src={getFeaturedImage(post) || '/placeholder.jpg'}
                    alt={stripHtml(post.title.rendered)}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Breaking Badge */}
                  {index === 0 && (
                    <div className="absolute top-4 left-4 md:top-6 md:left-6">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs md:text-sm font-bold rounded-full shadow-lg animate-pulse">
                        🔴 BREAKING
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h2 className="text-white font-bold text-lg md:text-2xl line-clamp-2 mb-2 drop-shadow-lg">
                      {stripHtml(post.title.rendered)}
                    </h2>
                    <div className="flex items-center gap-3 text-white/90 text-xs md:text-sm">
                      <span className="flex items-center gap-1">
                        <PhClock size={14} weight="fill" />
                        {formatPostDate(post.date)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Gradient fade edges */}
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Tidak ada berita terbaru</p>
          </div>
        )}
      </section>

      {/* Gradient Alert Cards */}
      <section className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center">
              <PhWarning size={18} weight="fill" className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900">PERINGATAN WARGA</h2>
          </div>

          <div className="space-y-3">
            {warnings.map((warning) => (
              <button
                key={warning.id}
                onClick={() => setSelectedWarning(warning)}
                className={`w-full rounded-xl p-4 bg-gradient-to-r ${warning.gradient} text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <PhWarning size={24} weight="fill" className="text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{warning.type}</h4>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">🔥 {warning.reports}x</span>
                    </div>
                    <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
                      <PhMapPin size={12} />
                      {warning.location} • {warning.time}
                    </p>
                  </div>
                  <PhCaretRight size={20} className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Info Terkini Feed */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
              <PhNewspaper size={18} weight="fill" className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">INFO TERKINI</h2>
          </div>
          <Link href="/info-terkini" className="text-sm text-violet-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <PhCaretRight size={16} />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="shrink-0 w-72 bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  W{i}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Warga Kemang</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <PhMapPin size={10} /> Kemang • 10 menit
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">
                Air mulai pasang di Jl Kemang Raya arah Blok M. Tinggi air sudah 15cm. Masyarakat diminta waspada! 🌊
              </p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors">
                  <PhHeart size={16} /> 24
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-500 transition-colors">
                  <PhChatCircle size={16} /> 8
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-500 transition-colors ml-auto">
                  <PhShare size={16} /> 5
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <PhNewspaper size={18} weight="fill" className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">ARTIKEL TERBARU</h2>
          </div>
          <Link href="/artikel" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <PhCaretRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md">
                <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/artikel/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={getFeaturedImage(post) || '/placeholder.jpg'}
                    alt={stripHtml(post.title.rendered)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-blue-600 font-semibold mb-1">
                    {post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Artikel'}
                  </p>
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {stripHtml(post.title.rendered)}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <PhClock size={12} />
                    <span>{formatPostDate(post.date)}</span>
                    <button
                      onClick={(e) => { e.preventDefault(); handleLike(post.id); }}
                      className={`ml-auto p-1 rounded-lg transition-colors ${likedPosts.has(post.id) ? 'text-red-500 bg-red-50' : 'hover:bg-gray-100'}`}
                    >
                      <PhHeart size={16} weight={likedPosts.has(post.id) ? 'fill' : 'regular'} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Lihat Semua Artikel
            <PhArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Popular Services */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <PhSquaresFour size={18} weight="fill" className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">LAYANAN POPULER</h2>
          </div>
          <Link href="/layanan" className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <PhCaretRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'Cek Bansos', icon: '💰', color: 'from-emerald-500 to-teal-500' },
            { name: 'KJP Plus', icon: '🎓', color: 'from-violet-500 to-purple-500' },
            { name: 'Cek ETLE', icon: '📸', color: 'from-blue-500 to-cyan-500' },
            { name: 'Pajak', icon: '🚗', color: 'from-amber-500 to-orange-500' },
            { name: 'KRL', icon: '🚆', color: 'from-blue-600 to-blue-400' },
            { name: 'TransJakarta', icon: '🚌', color: 'from-red-500 to-rose-500' },
          ].map((service) => (
            <Link
              key={service.name}
              href="/layanan"
              className="group bg-white rounded-xl p-4 text-center shadow-md border border-gray-100 hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                {service.icon}
              </div>
              <p className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{service.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-6 pb-8">
        <div className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl shadow-red-500/30 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xl mb-1">Laporkan Kejadian!</h3>
              <p className="text-white/80 text-sm">Bantu kami wujudkan Jaksel yang lebih aman</p>
            </div>
            <Link
              href="/lapor"
              className="px-5 py-2.5 bg-white text-red-500 font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              Lapor Sekarang
            </Link>
          </div>
        </div>
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
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-3xl z-50 overflow-hidden shadow-2xl">
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${warning.gradient} p-6 text-white relative`}>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/20 rounded-full blur-xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <PhWarning size={28} weight="fill" className="text-white" />
              </div>
              <div>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">⚠️ {warning.reports}x Laporan</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <PhX size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{warning.type}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <PhMapPin size={14} />
              {warning.location} • {warning.time}
            </p>
          </div>

          <div className={`p-4 bg-gradient-to-r ${warning.gradient} bg-opacity-10 rounded-xl border border-${warning.gradient.split('-')[1]}-100`}>
            <p className="text-sm text-gray-700 leading-relaxed">{warning.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3">
              <h3 className="text-xs font-semibold text-blue-600 mb-1">📍 Lokasi</h3>
              <p className="text-xs text-gray-600">{warning.location}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <h3 className="text-xs font-semibold text-orange-600 mb-1">⚠️ Laporan</h3>
              <p className="text-xs text-gray-600">{warning.reports} laporan</p>
            </div>
          </div>

          <a
            href={`tel:${warning.hotline}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all"
          >
            <PhWarning size={18} weight="fill" />
            Hubungi {warning.hotline}
          </a>

          <Link
            href="/lapor"
            className="block w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl text-center hover:bg-gray-200 transition-colors"
          >
            Laporkan Kejadian Serupa
          </Link>
        </div>
      </div>
    </>
  );
}
