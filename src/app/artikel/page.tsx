import Link from 'next/link';
import Image from 'next/image';
import { wpAPI, getFeaturedImage, formatPostDate, stripHtml } from '@/lib/wordpress';
import { Clock, MapPin } from 'lucide-react';

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
  { id: 0, name: 'Semua', slug: 'semua' },
  { id: 1, name: 'Event', slug: 'event' },
  { id: 2, name: 'Hiburan', slug: 'hiburan' },
  { id: 3, name: 'Kuliner', slug: 'kuliner' },
  { id: 4, name: 'Lifestyle', slug: 'lifestyle' },
  { id: 5, name: 'Teknologi', slug: 'teknologi' },
  { id: 6, name: 'Transportasi', slug: 'transportasi' },
];

export const metadata = {
  title: 'Semua Berita | Jakselnews',
  description: 'Berita terbaru dan terlengkap dari Jakarta Selatan',
};

async function getPostsByCategory(categorySlug?: string) {
  try {
    const result = await wpAPI.getPosts({
      perPage: 10,
      order: 'desc',
    });
    if (result.posts.length > 0) {
      // Filter by category if specified
      if (categorySlug && categorySlug !== 'semua') {
        const filtered = result.posts.filter(post => {
          const category = post._embedded?.['wp:term']?.[0]?.[0];
          return category?.slug === categorySlug;
        });
        return filtered.length > 0 ? filtered : result.posts;
      }
      return result.posts;
    }
    return mockPosts;
  } catch (error) {
    console.error('WP API Error:', error);
    return mockPosts;
  }
}

async function getCategories() {
  try {
    const categories = await wpAPI.getCategories();
    if (categories.length > 0) {
      return [{ id: 0, name: 'Semua', slug: 'semua' }, ...categories.slice(0, 5)];
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
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
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
      <div className="p-3 text-center">
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-2">{title}</h3>
        <div className="flex items-center justify-center gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            Jakarta Selatan
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {date}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ArtikelPage({ searchParams }: { searchParams: { kategori?: string } }) {
  const selectedCategory = searchParams.kategori || 'semua';
  const [posts, categories] = await Promise.all([
    getPostsByCategory(selectedCategory),
    getCategories()
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header - Centered */}
      <div className="bg-white px-4 py-6 border-b border-gray-100 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Semua Berita</h1>
        <p className="text-sm text-gray-500">Berita terbaru dari Jakarta Selatan</p>
      </div>

      {/* Category Tabs - Horizontal Scroll */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug || (selectedCategory === 'semua' && cat.slug === 'semua');
            return (
              <Link
                key={cat.id}
                href={cat.slug === 'semua' ? '/artikel' : `/artikel?kategori=${cat.slug}`}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${isActive
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {cat.name}
              </Link>
            );
          })}
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
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-gray-900 font-semibold mb-1">Tidak ada berita ditemukan</h3>
            <p className="text-gray-500 text-sm mb-4">Pilih kategori lain</p>
            <Link
              href="/artikel"
              className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-xl"
            >
              Lihat Semua Berita
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
