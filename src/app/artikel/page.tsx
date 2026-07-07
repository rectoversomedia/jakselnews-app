'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  PhMagnifyingGlass,
  PhFunnel,
  PhX,
  PhSpinner,
  PhShare,
  PhBookmark,
  PhClock,
} from '@phosphor-icons/react';
import {
  wp,
  WPPost,
  WPCategory,
  getFeaturedImage,
  formatPostDate,
  stripHtml,
} from '@/lib/wordpress';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export default function ArtikelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [posts, setPosts] = useState<WPPost[]>([]);
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('kategori') || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const result = await wp.getCategories();
      if (result.success) {
        setCategories(result.data);
      }
    }
    fetchCategories();
  }, []);

  const fetchPosts = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const result = await wp.getPosts({
        page: pageNum,
        perPage: 12,
        categories: selectedCategory ? parseInt(selectedCategory) : undefined,
        search: searchQuery || undefined,
      });

      if (result.success) {
        if (reset) {
          setPosts(result.data);
        } else {
          setPosts((prev) => [...prev, ...result.data]);
        }
        setTotalPages(result.pagination?.totalPages || 1);
        setHasMore(pageNum < (result.pagination?.totalPages || 1));
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  }, [selectedCategory, searchQuery, fetchPosts]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowFilters(false);
    const params = new URLSearchParams();
    if (categoryId) params.set('kategori', categoryId);
    const query = params.toString();
    router.push(`/artikel${query ? `?${query}` : ''}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPage(1);
    setHasMore(true);
    router.push('/artikel');
    fetchPosts(1, true);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 lg:pb-0 lg:pt-20">
      <Header title="Artikel" />
      <BottomNav />

      {/* Search & Filter Bar */}
      <div className="sticky top-14 lg:top-16 z-30 bg-white border-b px-4 py-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <PhMagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <PhX size={16} className="text-gray-400" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl transition-all ${
              showFilters || selectedCategory
                ? 'bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <PhFunnel size={20} weight={showFilters || selectedCategory ? 'fill' : 'regular'} />
          </button>
        </form>

        {/* Category Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(String(cat.id))}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === String(cat.id)
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(selectedCategory || searchQuery) && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">{posts.length} artikel ditemukan</p>
            <button onClick={clearFilters} className="text-sm text-red-500 font-medium hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Articles Grid */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PhMagnifyingGlass size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">Tidak ada artikel ditemukan</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-500/30"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-red-500 hover:text-red-500 hover:shadow-lg hover:shadow-red-500/10 disabled:opacity-50 transition-all duration-300"
                >
                  {loadingMore ? (
                    <>
                      <PhSpinner size={20} className="animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    'Lihat Lebih Banyak'
                  )}
                </button>
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <p className="text-center text-gray-400 text-sm mt-8">
                ✓ Semua artikel telah dimuat
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function ArticleCard({ post }: { post: WPPost }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const category = post._embedded?.['wp:term']?.[0]?.[0];

  const handleShare = async () => {
    const url = `${window.location.origin}/artikel/${post.slug}`;
    const title = stripHtml(post.title.rendered);
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link berhasil disalin!');
    }
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:border-red-100 hover:-translate-y-1 transition-all duration-300">
      <Link href={`/artikel/${post.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={getFeaturedImage(post) || '/placeholder.jpg'}
            alt={stripHtml(post.title.rendered)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {category && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-lg shadow-lg">
              {category.name}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/artikel/${post.slug}`}>
          <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-red-500 transition-colors">
            {stripHtml(post.title.rendered)}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <PhClock size={14} />
            <span>{formatPostDate(post.date)}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-lg transition-all ${
                isLiked
                  ? 'text-red-500 bg-red-50'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <PhBookmark size={18} weight={isLiked ? 'fill' : 'regular'} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
            >
              <PhShare size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
      <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}
