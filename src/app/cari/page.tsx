'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MagnifyingGlass,
  Clock,
  MapPinLine,
  X,
  Spinner,
  Warning,
  Article,
} from '@phosphor-icons/react';
import { wp, WPPost, getFeaturedImage, formatPostDate, stripHtml } from '@/lib/wordpress';
import Header from '@/components/layout/Header';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [results, setResults] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await wp.search(searchQuery.trim(), 1);

      if (result.success) {
        setResults(result.data);
      } else {
        setError(result.error || 'Gagal mencari');
        setResults([]);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mencari');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial search from URL
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  // Debounced search as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== query) {
        setQuery(inputValue);
        if (inputValue.trim()) {
          // Update URL without navigation
          const url = new URL(window.location.href);
          url.searchParams.set('q', inputValue.trim());
          window.history.replaceState({}, '', url.toString());
          performSearch(inputValue);
        } else {
          setResults([]);
          setHasSearched(false);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, query, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setQuery(inputValue.trim());
      performSearch(inputValue.trim());
    }
  };

  const clearSearch = () => {
    setInputValue('');
    setQuery('');
    setResults([]);
    setHasSearched(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:pt-20">
      <Header title="Cari" showBack />

      <div className="pt-14 lg:pt-4 px-4 py-6 max-w-3xl mx-auto">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <label htmlFor="search-input" className="sr-only">Cari artikel</label>
            <MagnifyingGlass
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="search-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Cari berita, artikel, atau informasi..."
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-500/20 transition-all"
              aria-label="Cari berita"
              autoFocus
            />
            {inputValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Hapus pencarian"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size={40} className="animate-spin text-red-500 mb-4" />
            <p className="text-gray-500">Mencari...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <Warning size={40} className="text-red-500 mx-auto mb-3" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => performSearch(query)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && hasSearched && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {results.length > 0
                  ? `Ditemukan ${results.length} hasil untuk "${query}"`
                  : `Tidak ada hasil untuk "${query}"`
                }
              </p>
            </div>

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((post) => {
                  const featuredImage = getFeaturedImage(post, 'medium');
                  const category = post._embedded?.['wp:term']?.[0]?.[0];

                  return (
                    <Link
                      key={post.id}
                      href={`/artikel/${post.slug}`}
                      className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        {featuredImage && (
                          <div className="relative w-24 h-16 shrink-0 rounded-xl overflow-hidden">
                            <Image
                              src={featuredImage}
                              alt={stripHtml(post.title.rendered)}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          {category && (
                            <p className="text-xs text-red-600 font-medium uppercase tracking-wide mb-1">
                              {category.name}
                            </p>
                          )}
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                            {stripHtml(post.title.rendered)}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock size={12} aria-hidden="true" />
                            {formatPostDate(post.date)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlass size={32} className="text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Tidak Ditemukan</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Coba kata kunci lain atau periksa ejaan
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['berita jaksel', 'kemacetan', 'banjir', 'keamanan'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInputValue(suggestion);
                        setQuery(suggestion);
                        performSearch(suggestion);
                      }}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Initial State - No Search Yet */}
        {!loading && !error && !hasSearched && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlass size={32} className="text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Cari Berita</h3>
            <p className="text-gray-500 text-sm mb-6">
              Temukan berita dan informasi terkini dari Jakarta Selatan
            </p>

            {/* Popular Categories */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Kategori Populer</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Kriminal', 'Kemacetan', 'Banjir', 'Kebakaran', 'Lingkungan'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setInputValue(cat);
                      setQuery(cat);
                      performSearch(cat);
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches (if any stored) */}
            {typeof window !== 'undefined' && localStorage.getItem('recentSearches') && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Pencarian Terakhir</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {JSON.parse(localStorage.getItem('recentSearches') || '[]').slice(0, 5).map((term: string) => (
                    <button
                      key={term}
                      onClick={() => {
                        setInputValue(term);
                        setQuery(term);
                        performSearch(term);
                      }}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
