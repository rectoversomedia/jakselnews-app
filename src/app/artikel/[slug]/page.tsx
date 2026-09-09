// ISR: revalidate every 60s — fast for subsequent visitors
export const revalidate = 60;

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { wp, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from "@/lib/wordpress";

interface PageProps {
  params: { slug: string };
}

function rewriteWpUrl(url: string | null): string | null {
  if (!url) return null;
  return url
    .replace(/https:\/\/jakselnews\.com\//g, '/api/wp-image/')
    .replace(/https:\/\/www\.jakselnews\.com\//g, '/api/wp-image/');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await wp.getPost(params.slug);

  if (!result.success || !result.data) {
    return {
      title: "Artikel Tidak Ditemukan | Jakselnews",
    };
  }

  const post = result.data;
  const title = stripHtml(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered).slice(0, 160);
  const featuredImage = rewriteWpUrl(getFeaturedImage(post, "large"));

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: featuredImage ? [{ url: featuredImage }] : [],
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: featuredImage ? [featuredImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  // Parallel fetch: post + related articles (same category) simultaneously
  const [result, relatedResult] = await Promise.all([
    wp.getPost(params.slug),
    wp.getPosts({ perPage: 7 }), // fetch more to filter
  ]);

  if (!result.success || !result.data) {
    notFound();
  }

  // Rewrite WP image URLs: old WP host domain -> our image proxy
  function rewriteImageUrls(html: string): string {
    return html
      .replace(/https:\/\/jakselnews\.com\/wp-content\//g, '/api/wp-image/wp-content/')
      .replace(/https:\/\/www\.jakselnews\.com\/wp-content\//g, '/api/wp-image/wp-content/')
      .replace(/src="\/wp-content\//g, 'src="/api/wp-image/wp-content/')
      .replace(/src="https:\/\/[^"]+wp-content\//g, (match) => {
        return match.replace(/https:\/\/[^/]+/, '/api/wp-image');
      });
  }

  const post = result.data;
  const postCategory = getPostCategory(post);

  // Related articles: same category, exclude current post
  const relatedArticles = relatedResult.success
    ? relatedResult.data
        .filter(p => p.id !== post.id && p.categories?.includes(postCategory?.id ?? -1))
        .slice(0, 5)
    : [];

  const featuredImage = rewriteWpUrl(getFeaturedImage(post, "large"));
  const category = getPostCategory(post);
  const title = stripHtml(post.title.rendered);
  const date = formatPostDate(post.date);
  const contentHtml = rewriteImageUrls(post.content.rendered);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 pt-[60px] lg:pt-[72px]">
      {/* Back Button */}
      <div className="px-4 py-3 bg-white border-b">
        <Link
          href="/artikel"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
          </svg>
          Kembali ke Artikel
        </Link>
      </div>

      {/* Featured Image — constrained max-width so it doesn't stretch full-screen */}
      <div className="w-full bg-gray-100 overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="overflow-hidden">
            {featuredImage ? (
              // Use regular img so CSS can properly constrain dimensions
              // Next.js Image fill+aspect-ratio causes stretching on some images
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-auto object-cover"
                style={{ maxHeight: '420px' }}
              />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Category Badge */}
          {category && (
            <Link
              href={`/kategori/${category.slug}`}
              className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full mb-3"
            >
              {category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-200">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/>
              </svg>
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,1,1,144,0C200,161.23,144.53,209,128,222Z"/>
              </svg>
              Jakarta Selatan
            </span>
            <div className="flex-1" />
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32ZM72,48h112V176.73L128,151.51l-56,25.22Z"/>
              </svg>
              Simpan
            </button>
          </div>

          {/* Article Body */}
          <div
            className="mt-6 text-gray-700 leading-relaxed space-y-4 prose prose-sm md:prose-base max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-img:rounded-xl prose-img:shadow-md article-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </div>

      {/* Artikel Terkait */}
      {relatedArticles.length > 0 && (
        <div className="bg-white border-t">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className="text-red-500">
                <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72a12,12,0,1,0,12,12A12,12,0,0,0,128,72Zm0,112a12,12,0,1,0,12,12A12,12,0,0,0,128,184Zm104-56H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16Z"/>
              </svg>
              Artikel Terkait
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedArticles.map((article) => {
                const articleTitle = stripHtml(article.title.rendered);
                const articleImage = rewriteWpUrl(getFeaturedImage(article, "medium"));
                const articleDate = formatPostDate(article.date);
                return (
                  <Link
                    key={article.id}
                    href={`/artikel/${article.slug}`}
                    className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                      {articleImage ? (
                        <Image
                          src={articleImage}
                          alt={articleTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <h3 className="font-semibold text-xs text-gray-900 line-clamp-2 leading-snug">{articleTitle}</h3>
                      <p className="text-[10px] text-gray-400 mt-1">{articleDate}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Spacer */}
      <div className="h-4 lg:hidden" />
    </main>
  );
}
