import Link from 'next/link';
import Image from 'next/image';
import { wpAPI, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from '@/lib/wordpress';
import { Clock, MapPin, ChevronRight, AlertCircle, Heart, MessageCircle, Share2, User } from 'lucide-react';

// Mock UGC data for Info Terkini (citizen reports) - using Jaksel neighborhood names
const ugcReports = [
  {
    id: 1,
    authorName: 'Warga Kemang',
    location: 'Kemang',
    time: '10 menit lalu',
    content: 'Air mulai pasang di Jl Kemang Raya arah Blok M. Tinggi air sudah 15cm. Masyarakat diminta waspada! 🌊',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80',
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
    image: null,
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
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
    likes: 42,
    comments: 12,
    shares: 3
  }
];

async function getBreakingNews() {
  try {
    const result = await wpAPI.getPosts({
      perPage: 5,
      categories: [], // Will use first 5 posts as breaking
      order: 'desc'
    });
    return result.posts;
  } catch {
    return [];
  }
}

async function getPeringatan() {
  try {
    const result = await wpAPI.getPosts({
      perPage: 3,
      order: 'desc'
    });
    return result.posts;
  } catch {
    return [];
  }
}

function BreakingNewsCard({ post }: { post: any }) {
  const featuredImage = getFeaturedImage(post);
  const title = stripHtml(post.title?.rendered || '');
  const date = formatPostDate(post.date);

  return (
    <Link href={`/artikel/${post.slug}`} className="block relative rounded-2xl overflow-hidden aspect-[16/10]">
      {featuredImage ? (
        <img
          src={featuredImage}
          alt={title}
          className="w-full h-full object-cover"
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
  if (posts.length === 0) {
    return (
      <section className="px-4 py-3">
        <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Loading breaking news...</p>
        </div>
      </section>
    );
  }

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
  const peringatanItems = posts.slice(0, 3).map((post, idx) => ({
    id: post.id,
    title: stripHtml(post.title?.rendered || 'Peringatan'),
    location: 'Jakarta Selatan',
    time: formatPostDate(post.date),
    icon: idx === 0 ? '🌊' : idx === 1 ? '🚧' : '⚠️',
    color: idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-orange-500' : 'bg-yellow-500'
  }));

  return (
    <section className="px-4 py-4">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={20} className="text-red-600" />
          <h2 className="text-base font-bold text-red-700">PERINGATAN</h2>
        </div>
        <div className="space-y-2">
          {peringatanItems.map((item) => (
            <Link
              key={item.id}
              href="/artikel"
              className="flex items-center gap-3 bg-white p-3 rounded-xl hover:bg-red-50 transition-colors"
            >
              <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-xl shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {item.location}
                  </span>
                  <span>•</span>
                  <span>{item.time}</span>
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

function UGCCard({ report }: { report: typeof ugcReports[0] }) {
  return (
    <Link href="/breaking-news" className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Author */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <User size={20} className="text-gray-500" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">{report.authorName}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={10} />
            {report.location} • {report.time}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-2">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{report.content}</p>
      </div>

      {/* Image */}
      {report.image && (
        <div className="aspect-[4/3]">
          <img
            src={report.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-around py-3 px-3 border-t border-gray-100">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
          <Heart size={16} />
          <span className="text-xs">{report.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
          <MessageCircle size={16} />
          <span className="text-xs">{report.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-500 transition-colors">
          <Share2 size={16} />
          <span className="text-xs">{report.shares}</span>
        </button>
      </div>
    </Link>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ugcReports.map((report) => (
          <UGCCard key={report.id} report={report} />
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
