'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  MapPin,
  CaretRight,
  Warning,
  X,
  ArrowsClockwise,
  Heart,
  ChatCircle,
  Share,
  MagnifyingGlass,
  User,
  List,
  Newspaper,
  SquaresFour,
  Star,
  Bell,
  PushPin,
  MapPinLine,
  Lightning,
  Tree,
  Car,
  Train,
  Bus,
  CurrencyDollar,
  GraduationCap,
  Camera,
  House,
} from '@phosphor-icons/react';
import { wp, getFeaturedImage, formatPostDate, stripHtml } from '@/lib/wordpress';
import { UGCPostCard } from './UGCPost';

// Trending citizen reports - grouped by category, top 3 most viral
const trendingReports = [
  {
    id: 1,
    warningType: 'Waspada Begal',
    location: 'Kawasan Kemang',
    reportCount: 47,
    reports: 47,
    time: '15 menit lalu',
    icon: '⚠️',
    color: 'bg-red-500',
    status: 'TRENDING',
    detail: {
      description: 'Laporan meningkat tentang aksi begal di kawasan Kemang. Korban kehilangan ponsel dan tas.',
      cause: 'Pelemahan patroli keamanan di jalan-jalan sepi.',
      impact: 'Warga dan pengguna jalan merasa tidak aman, terutama malam hari.',
      hotline: '110',
      related: ['Jl. Kemang Raya', 'Jl. Ampera', 'Jl. TB Simatupang']
    }
  },
  {
    id: 2,
    warningType: 'Waspada Maling',
    location: 'Kawasan Cilandak',
    reportCount: 38,
    reports: 38,
    time: '45 menit lalu',
    icon: '🚨',
    color: 'bg-orange-500',
    status: 'TRENDING',
    detail: {
      description: 'Serangkaian kasus pencurian motor dan properti dilaporkan di kawasan Cilandak.',
      cause: 'Operasi kelompok pencuri terorganisir.',
      impact: 'Kerugian finansial warga, kekuatiran masyarakat.',
      hotline: '110',
      related: ['Jl. Cilandak', 'Jl. MRT Cilandak', 'Pasar Cilandak']
    }
  },
  {
    id: 3,
    warningType: 'Waspada Jalan Berlubang',
    location: 'Kawasan Lenteng Agung',
    reportCount: 29,
    reports: 29,
    time: '1 jam lalu',
    icon: '🕳️',
    color: 'bg-amber-500',
    status: 'TRENDING',
    detail: {
      description: 'Jalan berlubang di berbagai titik Lenteng Agung menyebabkan kecelakaan dan kemacetan.',
      cause: 'Kerusakan infrastruktur jalan akibat hujan dan beban kendaraan.',
      impact: 'Kecelakaan motor, kerusakan kendaraan, kemacetan panjang.',
      hotline: '112',
      related: ['Jl. Lenteng Agung', 'Jl. Sirnak', 'Jl. Universitas']
    }
  }
];

function PeringatanPopup({ report, onClose }: { report: typeof trendingReports[0]; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${report.color} rounded-full flex items-center justify-center text-xl`}>
              {report.icon}
            </div>
            <div>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 font-medium rounded-full">
                {report.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{report.warningType}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <MapPin size={14} />
              {report.location} • {report.time}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-sm text-gray-700 leading-relaxed">{report.detail.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 rounded-xl p-3">
              <h3 className="text-xs font-semibold text-red-600 mb-1">📍 Penyebab</h3>
              <p className="text-xs text-gray-600">{report.detail.cause}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <h3 className="text-xs font-semibold text-amber-600 mb-1">⚠️ Dampak</h3>
              <p className="text-xs text-gray-600">{report.detail.impact}</p>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-3">
            <h3 className="text-xs font-semibold text-red-600 mb-2">📞 Hotline Darurat</h3>
            <p className="text-lg font-bold text-red-600">{report.detail.hotline}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {report.detail.related.map((area) => (
              <span key={area} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PeringatanSection() {
  const [selectedReport, setSelectedReport] = useState<typeof trendingReports[0] | null>(null);

  return (
    <>
      <section className="px-4 py-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Warning size={20} weight="fill" className="text-red-600" />
            <h2 className="text-base font-bold text-red-700">PERINGATAN</h2>
          </div>
          <div className="space-y-2">
            {trendingReports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="w-full flex items-center gap-3 bg-white p-3 rounded-xl hover:bg-red-50 transition-colors text-left"
              >
                <div className={`w-10 h-10 ${report.color} rounded-full flex items-center justify-center text-xl shrink-0`}>
                  {report.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {report.warningType} - {report.location}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full shrink-0">{report.reportCount}x</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} />
                    {report.location} • {report.time}
                  </p>
                </div>
                <CaretRight size={16} className="text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedReport && (
        <PeringatanPopup report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </>
  );
}

function BreakingNewsCard({ post, isFirst }: { post: any; isFirst?: boolean }) {
  const featuredImage = getFeaturedImage(post);
  const title = stripHtml(post.title?.rendered || '');
  const date = formatPostDate(post.date);

  return (
    <Link href={`/artikel/${post.slug}`} className="block relative rounded-2xl overflow-hidden aspect-[16/10]">
      {featuredImage ? (
        <Image src={featuredImage} alt={title} fill className="object-cover" sizes="85vw" priority={post.id === 1} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      {isFirst && (
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">BREAKING</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">{title}</h3>
        <div className="flex items-center gap-3 text-white/80 text-xs">
          <span className="flex items-center gap-1"><Clock size={12} />{date}</span>
        </div>
      </div>
    </Link>
  );
}

function BreakingNewsHero({ posts }: { posts: any[] }) {
  return (
    <section className="px-4 py-3">
      <div className="relative overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-3">
        {posts.slice(0, 3).map((post, index) => (
          <div key={post.id} className="snap-start shrink-0 w-[85%]">
            <BreakingNewsCard post={post} isFirst={index === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoTerkiniSection() {
  const mockReports = [
    {
      id: 1,
      authorName: 'Warga Kemang',
      location: 'Kemang',
      time: '10 menit lalu',
      content: 'Air mulai pasang di Jl Kemang Raya arah Blok M. Tinggi air sudah 15cm. Masyarakat diminta waspada! 🌊',
      likes: 24,
      comments: 8,
      shares: 5
    },
    {
      id: 2,
      authorName: 'Warga Blok M',
      location: 'Blok M',
      time: '25 menit lalu',
      content: 'Kemacetan parah di Jl. Melawai arah flyover. Estimated delay 30 menit. 🚗💨',
      likes: 18,
      comments: 12,
      shares: 3
    },
    {
      id: 3,
      authorName: 'Warga Cilandak',
      location: 'Cilandak',
      time: '45 menit lalu',
      content: 'Listrik padam di kawasan TB Simatupang. PLN sedang melakukan perbaikan. ⚡',
      likes: 15,
      comments: 6,
      shares: 2
    },
    {
      id: 4,
      authorName: 'Warga Kebayoran',
      location: 'Kebayoran',
      time: '1 jam lalu',
      content: 'Pohon tumbang di Jl. Trunojoyo. Arvodi dan tim kebersihan sudah di lokasi. 🌳',
      likes: 32,
      comments: 15,
      shares: 8
    },
    {
      id: 5,
      authorName: 'Warga Pasar Minggu',
      location: 'Pasar Minggu',
      time: '2 jam lalu',
      content: 'Jalan berlubang di Jl. RM. Soedirdja. Mohon perhatian khusus untuk pengendara motor. 🏍️',
      likes: 20,
      comments: 9,
      shares: 4
    }
  ];

  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base md:text-lg font-bold text-gray-900">INFO TERKINI</h2>
        <Link href="/breaking-news" className="text-xs text-primary font-medium flex items-center gap-0.5">
          Lihat Semua <CaretRight size={14} />
        </Link>
      </div>
      <div className="overflow-x-auto scrollbar-hide flex gap-3 -mx-4 px-4">
        {mockReports.map((report) => (
          <div key={report.id} className="shrink-0 w-[280px]">
            <UGCPostCard report={report} />
          </div>
        ))}
      </div>
    </section>
  );
}

function LayananPopulerSection() {
  const layananPopuler = [
    { id: 1, title: 'Cek Bansos', desc: 'Cek penerima', icon: '💰', color: 'bg-emerald-500' },
    { id: 2, title: 'KJP Plus', desc: 'Cek saldo', icon: '🎓', color: 'bg-violet-500' },
    { id: 3, title: 'Cek ETLE', desc: 'Tilang', icon: '📸', color: 'bg-blue-500' },
    { id: 4, title: 'Pajak', desc: 'Cek & Bayar', icon: '🚗', color: 'bg-amber-500' },
    { id: 5, title: 'KRL', desc: 'Jadwal', icon: '🚆', color: 'bg-blue-600' },
    { id: 6, title: 'TransJakarta', desc: 'Rute', icon: '🚌', color: 'bg-red-500' },
  ];

  return (
    <section className="px-4 py-4 mb-20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">LAYANAN POPULER</h2>
        <Link href="/layanan" className="text-xs text-primary font-medium flex items-center gap-0.5">
          Lihat Semua <CaretRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {layananPopuler.map((item) => (
          <Link key={item.id} href="/layanan" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl mb-2`}>
              {item.icon}
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
            <p className="text-[10px] text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function NotificationBanner() {
  return (
    <section className="px-4 pb-6">
      <div className="bg-gradient-to-r from-white to-red-50 border border-red-100 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Aktifkan Notifikasi</h3>
            <p className="text-xs text-gray-500">Dapatkan info terbaru dari Jakselnews</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-full shadow-md hover:shadow-lg transition-shadow">
          Aktifkan
        </button>
      </div>
    </section>
  );
}

export default function HomeContent() {
  // Real fallback data from jakselnews.com - show immediately
  const realFallbackPosts = [
    {
      id: 522,
      slug: 'rectoverso-narriv-ai-narasi-krisis',
      title: { rendered: 'Rectoverso Media Perkenalkan Narriv, Platform AI untuk Membantu Organisasi Mengelola Narasi Publik' },
      date: '2026-05-05T13:23:12',
      _embedded: {
        'wp:featuredmedia': [{
          source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/Fajar-Rectoverso-Media.png',
          media_details: { sizes: { medium_large: { source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/Fajar-Rectoverso-Media-768x615.png' } } }
        }]
      }
    },
    {
      id: 523,
      slug: 'festival-jaksel-2026',
      title: { rendered: 'Festival Jaksel 2026: Menyatu dalam Keberagaman Budaya Jakarta Selatan' },
      date: '2026-05-04T10:00:00',
      _embedded: {
        'wp:featuredmedia': [{
          source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/festival-jaksel.jpg',
          media_details: { sizes: { medium_large: { source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/festival-jaksel-768x615.jpg' } } }
        }]
      }
    },
    {
      id: 524,
      slug: 'mrt-jakarta-rute-baru',
      title: { rendered: 'MRT Jakarta Resmi Buka Rute Baru Menuju Kawasan Timur' },
      date: '2026-05-03T08:00:00',
      _embedded: {
        'wp:featuredmedia': [{
          source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/mrt-jakarta.jpg',
          media_details: { sizes: { medium_large: { source_url: 'https://jakselnews.com/wp-content/uploads/2026/05/mrt-jakarta-768x615.jpg' } } }
        }]
      }
    }
  ];

  const [breakingPosts, setBreakingPosts] = useState<any[]>(realFallbackPosts);

  useEffect(() => {
    async function fetchBreakingNews() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'https://jakselnews.com/wp-json/wp/v2';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        const response = await fetch(`${apiUrl}/posts?per_page=3&_embed&status=publish`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const posts = await response.json();
          if (posts && posts.length > 0) {
            setBreakingPosts(posts);
          }
        }
      } catch (error) {
        // Keep fallback data on error
      }
    }
    fetchBreakingNews();
	}, []);

	return (
		<>
			{breakingPosts.length > 0 && <BreakingNewsHero posts={breakingPosts} />}
			<PeringatanSection />
			<InfoTerkiniSection />
			<LayananPopulerSection />
			<NotificationBanner />
		</>
	);
}
