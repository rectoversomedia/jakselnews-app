import { wpAPI, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from '@/lib/wordpress';
import { getOptimizedFeaturedImage } from '@/lib/image-resizer';
import Link from 'next/link';
import { Clock, MapPin, Newspaper, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';

interface PageProps {
  searchParams: { page?: string; category?: string };
}

export const metadata = {
  title: 'Semua Berita | Jakselnews',
  description: 'Berita terbaru dari Jakarta Selatan',
};

async function getArticlesData(perPage: number = 12) {
  try {
    const result = await wpAPI.getPosts({
      perPage,
    });
    return result;
  } catch {
    return { posts: [], totalPages: 0, totalPosts: 0 };
  }
}

async function getCategories() {
  try {
    return await wpAPI.getCategories();
  } catch {
    return [];
  }
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

export default async function ArtikelPage() {
  const { posts } = await getArticlesData(12);
  const categories = await getCategories();

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="container py-4">
        <div className="flex items-center gap-3 mb-1">
          <Newspaper size={24} className="text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Semua Berita</h1>
        </div>
        <p className="text-sm text-gray-500">Berita terbaru dari Jakarta Selatan</p>
      </div>

      {/* Breaking News Quick Access */}
      <div className="container">
        <Link
          href="/breaking-news"
          className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-700">Breaking News</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-red-600">
            <AlertTriangle size={14} />
            Lihat
            <ChevronRight size={14} />
          </div>
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="container py-4">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="px-4 py-2 bg-primary text-white rounded-full text-xs md:text-sm font-medium whitespace-nowrap shrink-0">
            Semua
          </span>
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.slug}`}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-xs md:text-sm font-medium whitespace-nowrap shrink-0 hover:bg-gray-200 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Tidak ada berita ditemukan</p>
          </div>
        )}

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </span>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="container py-6">
        <Link
          href="/breaking-news"
          className="flex items-center justify-center gap-2 w-full py-4 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-colors"
        >
          <AlertTriangle size={18} className="animate-pulse" />
          Lihat Semua Breaking News
        </Link>
      </div>
    </div>
  );
}
