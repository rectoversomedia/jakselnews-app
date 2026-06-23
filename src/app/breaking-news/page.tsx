import { wpAPI, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from "@/lib/wordpress";
import { Clock, MapPin, AlertTriangle, ChevronRight, FileText, RefreshCw } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata = {
  title: "Breaking News | Jakselnews",
  description: "Berita terkini dan breaking news dari Jakarta Selatan",
};

async function getBreakingNewsPosts(perPage: number = 20) {
  try {
    const result = await wpAPI.getPosts({
      page: 1,
      perPage,
      orderBy: "date",
      order: "desc",
    });
    return result;
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    return { posts: [], totalPages: 0, totalPosts: 0 };
  }
}

function BreakingBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full animate-pulse">
      <AlertTriangle size={14} />
      <span>Breaking</span>
    </div>
  );
}

export default async function BreakingNewsPage() {
  const { posts, totalPages, totalPosts } = await getBreakingNewsPosts(20);

  return (
    <div className="pb-safe">
      <div className="container py-4 md:py-6">
        <div className="flex items-center gap-3 mb-2">
          <BreakingBadge />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Breaking News
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {totalPosts} berita terkini dari Jakarta Selatan
        </p>
      </div>

      <div className="container">
        <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-700">LIVE UPDATE</span>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium">
            <RefreshCw size={14} className="animate-spin" style={{ animationDuration: "3s" }} />
            Refresh
          </button>
        </div>
      </div>

      <div className="container py-4 md:py-6">
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts[0] && (
              <Link href={`/artikel/${posts[0].slug}`} className="block">
                <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative aspect-video md:aspect-[21/9]">
                    {getFeaturedImage(posts[0]) ? (
                      <img
                        src={getFeaturedImage(posts[0])!}
                        alt={stripHtml(posts[0].title.rendered)}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <span className="text-red-300 font-bold text-6xl">J</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <BreakingBadge />
                        {getPostCategory(posts[0]) && (
                          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                            {getPostCategory(posts[0])?.name}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
                        {stripHtml(posts[0].title.rendered)}
                      </h2>
                      <div className="flex items-center gap-3 mt-3 text-white/80 text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          Jakarta Selatan
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatPostDate(posts[0].date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            <div className="space-y-3">
              {posts.slice(1).map((post) => {
                const featuredImage = getFeaturedImage(post);
                const category = getPostCategory(post);
                const title = stripHtml(post.title.rendered);
                const date = formatPostDate(post.date);

                return (
                  <Link key={post.id} href={`/artikel/${post.slug}`} className="block">
                    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex">
                        <div className="relative w-28 h-24 sm:w-36 sm:h-28 md:w-44 md:h-32 shrink-0">
                          {featuredImage ? (
                            <img
                              src={featuredImage}
                              alt={title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <span className="text-gray-400 font-bold text-2xl">J</span>
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded">
                              News
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                          <div>
                            {category && (
                              <span className={`category-badge ${category.slug} text-[10px] mb-1.5`}>
                                {category.name}
                              </span>
                            )}
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 leading-snug">
                              {title}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                              <MapPin size={10} className="sm:size-3" />
                              Jaksel
                            </span>
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                              <Clock size={10} className="sm:size-3" />
                              {date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <span className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                  1 / {totalPages}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Tidak Ada Berita</h3>
            <p className="text-sm text-gray-500">Tidak ada breaking news yang ditemukan</p>
          </div>
        )}
      </div>

      <div className="container py-6">
        <Link
          href="/artikel"
          className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-primary" />
            <span className="font-medium text-gray-700">Lihat Semua Artikel</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </Link>
      </div>
    </div>
  );
}
