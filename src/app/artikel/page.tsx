import Link from 'next/link';
import { wpAPI, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from '@/lib/wordpress';
import { Clock, MapPin, ChevronRight, AlertTriangle, Newspaper } from 'lucide-react';

// Mock data fallback
const mockPosts = [
  {
    id: 1,
    slug: 'rectoverso-narriv-ai',
    title: { rendered: 'Rectoverso Media Perkenalkan Narriv, Platform AI untuk Membantu Organisasi Mengelola Narasi Publik' },
    date: '2026-06-23T10:00:00',
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        media_details: { sizes: { medium_large: { source_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80' } } }
      }]
    },
    _embedded_terms: [[{ id: 1, name: 'Teknologi', slug: 'teknologi' }]]
  },
  {
    id: 2,
    slug: 'festival-jaksel-2026',
    title: { rendered: 'Festival Jaksel 2026: Menyatu dalam Keberagaman Budaya Jakarta Selatan' },
    date: '2026-06-22T14:00:00',
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
        media_details: { sizes: { medium_large: { source_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80' } } }
      }]
    },
    _embedded_terms: [[{ id: 2, name: 'Event', slug: 'event' }]]
  },
  {
    id: 3,
    slug: 'mrt-jakarta-rute-baru',
    title: { rendered: 'MRT Jakarta Resmi Buka Rute Baru Menuju Kawasan Timur' },
    date: '2026-06-22T08:00:00',
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80',
        media_details: { sizes: { medium_large: { source_url: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80' } } }
      }]
    },
    _embedded_terms: [[{ id: 3, name: 'Transportasi', slug: 'transportasi' }]]
  },
  {
    id: 4,
    slug: 'pasar-murah-blok-m',
    title: { rendered: 'Pasar Murah di Blok M, Inilah Jadwal dan Lokasi' },
    date: '2026-06-21T16:00:00',
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
        media_details: { sizes: { medium_large: { source_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' } } }
      }]
    },
    _embedded_terms: [[{ id: 4, name: 'Ekonomi', slug: 'ekonomi' }]]
  }
];

const mockCategories = [
  { id: 1, name: 'Semua', slug: 'all' },
  { id: 2, name: 'Breaking News', slug: 'breaking' },
  { id: 3, name: 'Event', slug: 'event' },
  { id: 4, name: 'Transportasi', slug: 'transportasi' },
  { id: 5, name: 'Ekonomi', slug: 'ekonomi' },
];

export const metadata = {
  title: 'Semua Berita | Jakselnews',
  description: 'Berita terbaru dari Jakarta Selatan',
};

async function getArticlesData(perPage: number = 12) {
  try {
    const result = await wpAPI.getPosts({
      perPage,
    });
    if (result.posts.length > 0) {
      return result;
    }
    return { posts: mockPosts, totalPages: 1, totalPosts: mockPosts.length };
  } catch (error) {
    console.error('WP API Error:', error);
    return { posts: mockPosts, totalPages: 1, totalPosts: mockPosts.length };
  }
}

async function getCategories() {
  try {
    const categories = await wpAPI.getCategories();
    if (categories.length > 0) {
      return [{ id: 0, name: 'Semua', slug: 'all' }, ...categories.slice(0, 4)];
    }
    return mockCategories;
  } catch {
    return mockCategories;
  }
}

function ArticleCard({ post }: { post: any }) {
  const featuredImage = getFeaturedImage(post);
  const category = post._embedded_terms?.[0]?.[0];
  const date = formatPostDate(post.date);
  const title = stripHtml(post.title?.rendered || '');

  return (
    <Link href={`/artikel/${post.slug}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
          <span className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-[10px] font-medium rounded-full">
            {category.name}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">{title}</h3>
        <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2">
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            Jakarta Selatan
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {date}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ArtikelPage() {
  const [{ posts }, categories] = await Promise.all([
    getArticlesData(12),
    getCategories()
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Semua Berita</h1>
        <p className="text-sm text-gray-500">Berita terbaru dari Jakarta Selatan</p>
      </div>

      {/* Breaking News Quick Access */}
      <div className="px-4 py-3">
        <Link
          href="/breaking-news"
          className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-700">Breaking News</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-red-600">
            Lihat
            <ChevronRight size={14} />
          </div>
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.slug === 'all' ? '/artikel' : `/kategori/${cat.slug}`}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors bg-gray-100 text-gray-600 hover:bg-primary hover:text-white"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="px-4 py-4">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Newspaper size={32} className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-semibold mb-1">Tidak ada berita ditemukan</h3>
            <p className="text-gray-500 text-sm mb-4">Coba pilih kategori lain</p>
            <Link
              href="/breaking-news"
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-xl"
            >
              ▲ Lihat Semua Breaking News
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
