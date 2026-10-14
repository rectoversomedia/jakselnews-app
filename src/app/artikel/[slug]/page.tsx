// Dynamic rendering — always fresh from WordPress
export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import https from "https";
import { getFeaturedImage, getPostCategory, getPostAuthor, formatPostDate, stripHtml } from "@/lib/wordpress";
import { ArticleShareButton } from "@/components/ArticleShareButton";
import { ArticleGA4Tracker } from "@/components/ga4/ArticleGA4Tracker";
import { ArticleSchema, BreadcrumbSchema } from "@/components/StructuredData";

const WP_OLD_HOST = "153.92.8.164";
const WP_DOMAIN = "www.jakselnews.com";

async function fetchWpPost(slug: string): Promise<any | null> {
  return new Promise((resolve) => {
    const wpPath = `/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1&status=publish`;
    const options = {
      hostname: WP_OLD_HOST,
      port: 443,
      path: wpPath,
      method: "GET",
      headers: {
        Host: WP_DOMAIN,
        Accept: "application/json",
        "User-Agent": "Jakselnews-SSR/1.0",
      },
      rejectUnauthorized: false,
      servername: WP_DOMAIN,
    };
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        try {
          const data = JSON.parse(body);
          resolve(Array.isArray(data) && data.length > 0 ? data[0] : null);
        } catch {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

async function fetchWpPosts(perPage: number): Promise<any[]> {
  return new Promise((resolve) => {
    const wpPath = `/wp-json/wp/v2/posts?_embed=1&status=publish&per_page=${perPage}`;
    const options = {
      hostname: WP_OLD_HOST,
      port: 443,
      path: wpPath,
      method: "GET",
      headers: {
        Host: WP_DOMAIN,
        Accept: "application/json",
        "User-Agent": "Jakselnews-SSR/1.0",
      },
      rejectUnauthorized: false,
      servername: WP_DOMAIN,
    };
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        try {
          resolve(JSON.parse(body) || []);
        } catch {
          resolve([]);
        }
      });
    });
    req.on("error", () => resolve([]));
    req.setTimeout(10000, () => { req.destroy(); resolve([]); });
    req.end();
  });
}

interface PageProps {
  params: { slug: string };
}

function rewriteWpUrl(url: string | null): string | null {
  if (!url) return null;
  return url
    .replace(/https:\/\/jakselnews\.com\//g, '/api/wp-image/')
    .replace(/https:\/\/www\.jakselnews\.com\//g, '/api/wp-image/');
}

function rewriteImageUrls(html: string): string {
  return html
    .replace(/https:\/\/jakselnews\.com\/wp-content\//g, '/api/wp-image/wp-content/')
    .replace(/https:\/\/www\.jakselnews\.com\/wp-content\//g, '/api/wp-image/wp-content/')
    .replace(/src="\/wp-content\//g, 'src="/api/wp-image/wp-content/')
    .replace(/src="https:\/\/[^"]+wp-content\//g, (match) => {
      return match.replace(/https:\/\/[^/]+/, '/api/wp-image');
    });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await fetchWpPost(params.slug);

  if (!post) {
    return {
      title: "Artikel Tidak Ditemukan | Jakselnews",
    };
  }

  const title = stripHtml(post.title?.rendered || "");
  const description = stripHtml(post.excerpt?.rendered || "").slice(0, 160);
  const featuredImage = rewriteWpUrl(getFeaturedImage(post, "large"));
  const category = getPostCategory(post);
  const canonicalUrl = `https://www.jakselnews.com/artikel/${params.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: "Jakselnews",
      images: featuredImage ? [{ url: featuredImage, alt: title }] : [],
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: ["Jakselnews"],
      tags: category ? [category.name] : [],
      section: category?.name,
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
  const [post, allPosts] = await Promise.all([
    fetchWpPost(params.slug),
    fetchWpPosts(20),
  ]);

  if (!post) {
    notFound();
  }

  const relatedArticles = allPosts
    ? allPosts
        .filter((p: any) => p.id !== post.id && p.categories?.includes(post.categories?.[0]))
        .slice(0, 5)
    : [];

  const featuredImage = rewriteWpUrl(getFeaturedImage(post, "large"));
  const category = getPostCategory(post);
  const author = getPostAuthor(post);
  const authorName = author?.name || "Tim Jakselnews";
  const title = stripHtml(post.title?.rendered || "");
  const date = formatPostDate(post.date);
  const contentHtml = rewriteImageUrls(post.content?.rendered || "");
  const articleUrl = `https://www.jakselnews.com/artikel/${params.slug}`;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 pt-[60px] lg:pt-[72px]">
      <ArticleSchema
        title={title}
        description={stripHtml(post.excerpt?.rendered || "").slice(0, 300)}
        url={articleUrl}
        imageUrl={featuredImage ?? undefined}
        author={authorName}
        datePublished={post.date}
        dateModified={post.modified}
        category={category?.name}
        section={category?.name ?? "news"}
      />
      <BreadcrumbSchema
        items={[
          { name: "Beranda", url: "https://www.jakselnews.com" },
          { name: "Artikel", url: "https://www.jakselnews.com/artikel" },
          { name: title, url: articleUrl },
        ]}
      />
      <ArticleGA4Tracker
        articleId={post.id}
        articleTitle={title}
        articleSlug={params.slug}
        category={category?.name}
        author={authorName}
        publishedDate={post.date}
      />
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

      <div className="w-full bg-gray-100 overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="overflow-hidden">
            {featuredImage ? (
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-auto object-cover"
                style={{ maxHeight: '420px' }}
                fetchPriority="high"
                loading="eager"
              />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {category && (
            <Link
              href={`/kategori/${category.slug}`}
              className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full mb-3"
            >
              {category.name}
            </Link>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {title}
          </h1>

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
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32ZM72,48h112V176.73L128,151.51l-56,25.22Z"/>
                </svg>
                Simpan
              </button>
              <ArticleShareButton title={title} articleId={post.id} articleSlug={params.slug} />
            </div>
          </div>

          <div
            className="mt-6 text-gray-700 leading-relaxed space-y-4 prose prose-sm md:prose-base max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-img:rounded-xl prose-img:shadow-md article-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </div>

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
              {relatedArticles.map((article: any) => {
                const articleTitle = stripHtml(article.title?.rendered || "");
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

      <div className="h-4 lg:hidden" />
    </main>
  );
}
