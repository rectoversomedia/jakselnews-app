import Link from 'next/link';
import { wpAPI, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from '@/lib/wordpress';
import { Clock, MapPin, ChevronRight, AlertTriangle, GraduationCap, Car, Search, Train, Bus, Cloud, Phone } from 'lucide-react';

async function getHomeData() {
  try {
    const [postsResult, categories] = await Promise.all([
      wpAPI.getLatestPosts(10),
      wpAPI.getCategories(),
    ]);
    return { posts: postsResult.posts, categories };
  } catch {
    return { posts: [], categories: [] };
  }
}

function AlertCard() {
  return (
    <Link href="/kategori/banjir" className="bg-jaksel-flood/5 rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 block">
      <div className="bg-jaksel-flood w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white text-xl shrink-0">
        🌊
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-jaksel-flood text-[10px] md:text-xs font-semibold uppercase tracking-wide">
          Info Banjir
        </span>
        <h4 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-1">
          Genangan air setinggi ±20cm di Jl. Kemang Raya
        </h4>
        <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
          <span className="flex items-center gap-1">
            <MapPin size={10} className="md:size-3" />
            Kemang
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} className="md:size-3" />
            12 menit lalu
          </span>
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-400 shrink-0 hidden sm:block" />
    </Link>
  );
}

function ArticleCard({ post }: { post: any }) {
  const featuredImage = getFeaturedImage(post);
  const category = getPostCategory(post);
  const date = formatPostDate(post.date);
  const title = stripHtml(post.title.rendered);

  return (
    <Link href={`/artikel/${post.slug}`} className="card overflow-hidden block">
      <div className="relative aspect-[16/10]">
        {featuredImage ? (
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 font-bold text-3xl">J</span>
          </div>
        )}
        {category && (
          <span className={`category-badge ${category.slug} absolute top-2 left-2 md:top-3 md:left-3`}>
            {category.name}
          </span>
        )}
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm md:text-base">{title}</h3>
        <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            Jakarta Selatan
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {date}
          </span>
        </div>
      </div>
    </Link>
  );
}

function QuickServiceCard({ icon, title, desc, color, href }: { icon: React.ReactNode; title: string; desc: string; color: string; href: string }) {
  return (
    <Link href={href} className="card p-3 md:p-4 flex items-center gap-3">
      <div className={`w-10 h-10 md:w-12 md:h-12 ${color} rounded-xl flex items-center justify-center text-white shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm md:text-base">{title}</h4>
        <p className="text-[10px] md:text-xs text-gray-500 truncate">{desc}</p>
      </div>
      <ChevronRight size={18} className="text-gray-400 shrink-0 hidden sm:block" />
    </Link>
  );
}

export default async function HomeContent() {
  const { posts, categories } = await getHomeData();

  return (
    <>
      {/* Alert Section */}
      <section className="container py-3 md:py-4">
        <AlertCard />
      </section>

      {/* Quick Services */}
      <section className="container py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base md:text-lg font-bold text-gray-900">Layanan Populer</h2>
          <Link href="/layanan" className="text-xs md:text-sm text-primary font-medium flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          <QuickServiceCard icon={<AlertTriangle size={20} />} title="Cek Bansos" desc="Cek penerima bantuan" color="bg-emerald-500" href="/layanan/bansos" />
          <QuickServiceCard icon={<GraduationCap size={20} />} title="KJP Plus" desc="Cek saldo KJP" color="bg-violet-500" href="/layanan/kjp" />
          <QuickServiceCard icon={<Search size={20} />} title="Cek ETLE" desc="Tilang elektronik" color="bg-blue-500" href="/layanan/etle" />
          <QuickServiceCard icon={<Car size={20} />} title="Pajak Kendaraan" desc="Cek & bayar" color="bg-amber-500" href="/layanan/pajak-kendaraan" />
          <QuickServiceCard icon={<Train size={20} />} title="KRL" desc="Jadwal & rute" color="bg-blue-500" href="/layanan/krl" />
          <QuickServiceCard icon={<Bus size={20} />} title="Transjakarta" desc="Rute & halte" color="bg-red-500" href="/layanan/transjakarta" />
          <QuickServiceCard icon={<Cloud size={20} />} title="Cuaca" desc="Info cuaca" color="bg-amber-500" href="/layanan/cuaca" />
          <QuickServiceCard icon={<Phone size={20} />} title="Darurat" desc="Nomor darurat" color="bg-primary" href="/layanan/darurat" />
        </div>
      </section>

      {/* Latest Articles */}
      <section className="container py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base md:text-lg font-bold text-gray-900">Berita Terbaru</h2>
          <div className="flex items-center gap-2">
            <Link href="/breaking-news" className="text-xs md:text-sm text-red-600 font-medium flex items-center gap-0.5 animate-pulse">
              <AlertTriangle size={14} />
              Breaking
            </Link>
            <Link href="/artikel" className="text-xs md:text-sm text-primary font-medium flex items-center gap-0.5">
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="px-4 py-2 bg-primary text-white rounded-full text-xs md:text-sm font-medium whitespace-nowrap shrink-0">
            Semua
          </span>
          {categories.slice(0, 6).map((cat) => (
            <Link key={cat.id} href={`/kategori/${cat.slug}`} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-xs md:text-sm font-medium whitespace-nowrap shrink-0 hover:bg-gray-200 transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Belum ada artikel</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
