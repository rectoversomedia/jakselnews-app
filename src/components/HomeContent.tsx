'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { wpAPI, getFeaturedImage, formatPostDate, stripHtml } from '@/lib/wordpress';
import { Clock, MapPin, ChevronRight, AlertCircle, X, Phone } from 'lucide-react';
import { UGCPostCard } from './UGCPost';

const mockBreakingNews = [
  {
    id: 1,
    slug: 'rectoverso-narriv-ai',
    title: { rendered: 'Rectoverso Media Perkenalkan Narriv, Platform AI untuk Membantu Organisasi Mengelola Narasi Publik' },
    date: new Date().toISOString(),
    _embedded: { 'wp:featuredmedia': [{ source_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', media_details: { sizes: { medium_large: { source_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80' } } } }] }
  },
  {
    id: 2,
    slug: 'festival-jaksel-2026',
    title: { rendered: 'Festival Jaksel 2026: Menyatu dalam Keberagaman Budaya Jakarta Selatan' },
    date: new Date(Date.now() - 3600000).toISOString(),
    _embedded: { 'wp:featuredmedia': [{ source_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', media_details: { sizes: { medium_large: { source_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80' } } } }] }
  },
  {
    id: 3,
    slug: 'mrt-jakarta-rute-baru',
    title: { rendered: 'MRT Jakarta Resmi Buka Rute Baru Menuju Kawasan Timur' },
    date: new Date(Date.now() - 7200000).toISOString(),
    _embedded: { 'wp:featuredmedia': [{ source_url: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80', media_details: { sizes: { medium_large: { source_url: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80' } } } }] }
  }
];

// Trending citizen reports - viral complaints
const trendingReports = [
  {
    id: 1,
    author: 'Warga Kemang',
    title: 'Genangan Air ±20cm di Jl. Kemang Raya',
    location: 'Jl. Kemang Raya',
    reports: 47,
    time: '15 menit lalu',
    icon: '🌊',
    color: 'bg-blue-500',
    status: 'SEDANG DIPROSES',
    detail: {
      description: 'Air mulai pasang dan menggenang di Jl. Kemang Raya arah Blok M. Tinggi genangan sudah mencapai ±20cm dan terus meningkat.',
      cause: 'Hujan deras sejak pukul 14.00 WIB dan drainase yang tersumbat sampah.',
      impact: 'Kendaraan roda dua dan empat sulit melintas. Kemacetan sepanjang 500m.',
      actions: [
        { icon: '🚗', text: 'Kendaraan dialihkan via Jl.Ampera' },
        { icon: '🚑', text: 'Posko pengungsian di Balaidesa Kemang' },
        { icon: '🏊', text: 'Tim SAR siaga di lokasi' }
      ],
      hotline: '021-112',
      related: ['Jl.Ampera', 'Jl.Tebbenu', 'JlRadio Dalam']
    }
  },
  {
    id: 2,
    author: 'Warga Ragunan',
    title: 'Jalan Ditutup - Drainase Meluap',
    location: 'Jl. Ragunan',
    reports: 32,
    time: '30 menit lalu',
    icon: '🚧',
    color: 'bg-orange-500',
    status: 'VERIFIKASI',
    detail: {
      description: 'Drainase di Jl. Ragunan meluap akibat hujan deras. Jalan ditutup total untuk kendaraan roda empat.',
      cause: 'Saluran air tersumbat dan kapasitas tidak memadai.',
      impact: 'Akses ke Pasar Minggu dan direction ke TB Simatupang terganggu.',
      actions: [
        { icon: '🔄', text: 'Rute alternatif via Jl.Cilandak' },
        { icon: '🏢', text: 'Posko bantuan di Balaidesa Ragunan' }
      ],
      hotline: '021-114',
      related: ['Jl.Cilandak', 'Jl.TBS', 'Pasar Minggu']
    }
  },
  {
    id: 3,
    author: 'Warga Cilandak',
    title: 'Tanah Longsor di Tebing Kali',
    location: 'Kali Pesanggrahan',
    reports: 18,
    time: '1 jam lalu',
    icon: '⚠️',
    color: 'bg-yellow-500',
    status: 'WASPADA',
    detail: {
      description: 'Tanah longsor terjadi di tebing Kali Pesanggrahan. Area sekitar berbahaya untuk dilalui.',
      cause: 'Curah hujan tinggi dan tanah tidak stabil.',
      impact: 'Jalan inspeksi ditutup sementara. Warga diimbau menjauhi area sungai.',
      actions: [
        { icon: '🚧', text: 'Area ditutup radius 50m' },
        { icon: '📢', text: 'Pengumuman evacuation jika diperlukan' }
      ],
      hotline: '021-113',
      related: ['Kali Pesanggrahan', 'Tebet', 'Ps Minggu']
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
            <h2 className="text-lg font-bold text-gray-900 mb-1">{report.title}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <MapPin size={14} />
              {report.location} • {report.time}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-sm text-gray-700 leading-relaxed">{report.detail.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">📍 Penyebab</h3>
            <p className="text-sm text-gray-600">{report.detail.cause}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">⚠️ Dampak</h3>
            <p className="text-sm text-gray-600">{report.detail.impact}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">✅ Tindakan</h3>
            <div className="space-y-2">
              {report.detail.actions.map((action, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-sm text-gray-700">{action.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
            <Phone size={20} className="text-red-600" />
            <div>
              <p className="text-xs text-gray-500">Hotline Darurat</p>
              <p className="text-sm font-bold text-red-600">{report.detail.hotline}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">🔗 Area Terkait</h3>
            <div className="flex flex-wrap gap-2">
              {report.detail.related.map((area) => (
                <span key={area} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button className="flex-1 py-3 bg-primary text-white font-medium rounded-xl flex items-center justify-center gap-2">
              <Phone size={18} />
              Hubungi
            </button>
            <button className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl">
              Laporkan Update
            </button>
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
            <AlertCircle size={20} className="text-red-600" />
            <h2 className="text-base font-bold text-red-700">PERINGATAN</h2>
            <span className="ml-auto text-xs text-red-500">🔥 Virall</span>
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
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{report.title}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full shrink-0">{report.reports}x</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} />
                    {report.location}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-400 shrink-0" />
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

function BreakingNewsCard({ post }: { post: any }) {
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
      <div className="absolute top-3 left-3">
        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">BREAKING</span>
      </div>
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
        {posts.slice(0, 3).map((post) => (
          <div key={post.id} className="snap-start shrink-0 w-[85%]">
            <BreakingNewsCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoTerkiniSection() {
  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base md:text-lg font-bold text-gray-900">INFO TERKINI</h2>
        <Link href="/breaking-news" className="text-xs text-primary font-medium flex items-center gap-0.5">
          Lihat Semua <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <UGCPostCard />
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
          Lihat Semua <ChevronRight size={14} />
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

export default function HomeContent() {
  return (
    <>
      <BreakingNewsHero posts={mockBreakingNews} />
      <PeringatanSection />
      <InfoTerkiniSection />
      <LayananPopulerSection />
    </>
  );
}
