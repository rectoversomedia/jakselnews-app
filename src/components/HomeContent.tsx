import Link from 'next/link';
import Image from 'next/image';
import { wpAPI, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from '@/lib/wordpress';
import { Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { UGCPostCard } from './UGCPost';

// Mock Breaking News data - fallback if WP API fails
const mockBreakingNews = [
  {
    id: 1,
    slug: 'rectoverso-narriv-ai',
    title: { rendered: 'Rectoverso Media Perkenalkan Narriv, Platform AI untuk Membantu Organisasi Mengelola Narasi Publik' },
    date: new Date().toISOString(),
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        media_details: { sizes: { medium_large: { source_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80' } } }
      }]
    }
  },
  {
    id: 2,
    slug: 'festival-jaksel-2026',
    title: { rendered: 'Festival Jaksel 2026: Menyatu dalam Keberagaman Budaya Jakarta Selatan' },
    date: new Date(Date.now() - 3600000).toISOString(),
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
        media_details: { sizes: { medium_large: { source_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80' } } }
      }]
    }
  },
  {
    id: 3,
    slug: 'mrt-jakarta-rute-baru',
    title: { rendered: 'MRT Jakarta Resmi Buka Rute Baru Menuju Kawasan Timur' },
    date: new Date(Date.now() - 7200000).toISOString(),
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80',
        media_details: { sizes: { medium_large: { source_url: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80' } } }
      }]
    }
  }
];

// Mock Peringatan data
const mockPeringatan = [
  { id: 1, title: 'Genangan Air ±20cm di Jl. Kemang Raya', location: 'Kemang', time: 'Baru saja' },
  { id: 2, title: 'Jalan Ditutup Sementara di Jl. Ragunan', location: 'Ragunan', time: 'Baru saja' },
  { id: 3, title: 'Potensi Banjir Rendah di Cilandak', location: 'Cilandak', time: 'Baru saja' }
];

// Mock UGC data for Info Terkini
const ugcReports = [
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
    content: 'Jalanan di Jl Radio Dalam mulai ramai nih, ada lampu merah mati. Hati-hati ya! 🚦',
    likes: 15,
    comments: 3,
    shares: 2
  },
  {
    id: 3,
    authorName: 'Warga Pasar Minggu',
    location: 'Pasar Minggu',
    time: '1 jam lalu',
    content: 'Baru lihat mobil ambulance lewat cepat banget. Semoga bukan hal yang buruk ya 🙏',
    likes: 8,
    comments: 1,
    shares: 0
  },
  {
    id: 4,
    authorName: 'Warga Cilandak',
    location: 'Cilandak',
    time: '2 jam lalu',
    content: 'Enaknya makan siang di mana ya? Yang open space gitu, bisa kerja sambil makan. Ada rekomendasi? 🍜',
    likes: 42,
    comments: 12,
    shares: 3
  }
];

async function getBreakingNews() {
  try {
    const result = await wpAPI.getPosts({
      perPage: 5,
      order: 'desc'
    });
    if (result.posts.length > 0) {
      return result.posts;
    }
    return mockBreakingNews;
  } catch (error) {
    console.error('WP API Error:', error);
    return mockBreakingNews;
  }
}

async function getPeringatan() {
  try {
    const result = await wpAPI.getPosts({
      perPage: 3,
      order: 'desc'
    });
    if (result.posts.length > 0) {
      return result.posts;
    }
    return mockPeringatan.map(p => ({
      id: p.id,
      slug: 'peringatan',
      title: { rendered: p.title },
      date: new Date().toISOString(),
      _embedded: { 'wp:featuredmedia': [] }
    }));
  } catch (error) {
    console.error('WP API Error:', error);
    return mockPeringatan.map(p => ({
      id: p.id,
      slug: 'peringatan',
      title: { rendered: p.title },
      date: new Date().toISOString(),
      _embedded: { 'wp:featuredmedia': [] }
    }));
  }
}

function BreakingNewsCard({ post }: { post: any }) {
  const featuredImage = getFeaturedImage(post);
  const title = stripHtml(post.title?.rendered || '');
  const date = formatPostDate(post.date);

  return (
    <Link href={`/artikel/${post.slug}`} className="block relative rounded-2xl overflow-hidden aspect-[16/10]">
      {featuredImage ? (
        <Image
          src={featuredImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 85vw, 45vw"
          priority={post.id === mockBreakingNews[0]?.id}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
          BREAKING
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-2 mb-2">
          {title || 'Judul tidak tersedia'}
        </h3>
        <div className="flex items-center gap-3 text-white/80 text-xs">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {date}
          </span>
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
          <div
            key={post.id}
            className="snap-start shrink-0 w-[85%] md:w-[45%] lg:w-[30%]"
          >
            <BreakingNewsCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}

function PeringatanSection({ posts }: { posts: any[] }) {
  const peringatanIcons = ['🌊', '🚧', '⚠️'];
  const peringatanColors = ['bg-blue-500', 'bg-orange-500', 'bg-yellow-500'];

  return (
    <section className="px-4 py-4">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={20} className="text-red-600" />
          <h2 className="text-base font-bold text-red-700">PERINGATAN</h2>
        </div>
        <div className="space-y-2">
          {posts.slice(0, 3).map((item, idx) => (
            <Link
              key={item.id}
              href="/artikel"
              className="flex items-center gap-3 bg-white p-3 rounded-xl hover:bg-red-50 transition-colors"
            >
              <div className={`w-10 h-10 ${peringatanColors[idx] || 'bg-yellow-500'} rounded-full flex items-center justify-center text-xl shrink-0`}>
                {peringatanIcons[idx] || '⚠️'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                  {stripHtml(item.title?.rendered || item.title || 'Peringatan')}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    Jakarta Selatan
                  </span>
                  <span>•</span>
                  <span>{formatPostDate(item.date)}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
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
        {ugcReports.map((report) => (
          <UGCPostCard key={report.id} report={report} />
        ))}
      </div>
    </section>
  );
}

function LayananPopulerSection() {
  const layananPopuler = [
    { id: 1, title: 'Cek Bansos', desc: 'Cek penerima bantuan', icon: '💰', color: 'bg-emerald-500' },
    { id: 2, title: 'KJP Plus', desc: 'Cek saldo KJP', icon: '🎓', color: 'bg-violet-500' },
    { id: 3, title: 'Cek ETLE', desc: 'Tilang elektronik', icon: '📸', color: 'bg-blue-500' },
    { id: 4, title: 'Pajak Kendaraan', desc: 'Cek & bayar', icon: '🚗', color: 'bg-amber-500' },
    { id: 5, title: 'KRL', desc: 'Jadwal & rute', icon: '🚆', color: 'bg-blue-600' },
    { id: 6, title: 'Transjakarta', desc: 'Rute & halte', icon: '🚌', color: 'bg-red-500' },
  ];

  return (
    <section className="px-4 py-4 mb-20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base md:text-lg font-bold text-gray-900">LAYANAN POPULER</h2>
        <Link href="/layanan" className="text-xs text-primary font-medium flex items-center gap-0.5">
          Lihat Semua <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {layananPopuler.map((item) => (
          <Link
            key={item.id}
            href="/layanan"
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
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

export default async function HomeContent() {
  const [breakingPosts, peringatanPosts] = await Promise.all([
    getBreakingNews(),
    getPeringatan()
  ]);

  return (
    <>
      <BreakingNewsHero posts={breakingPosts} />
      <PeringatanSection posts={peringatanPosts} />
      <InfoTerkiniSection />
      <LayananPopulerSection />
    </>
  );
}
