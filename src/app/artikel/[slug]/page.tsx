import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { wpAPI, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from "@/lib/wordpress";
import { Clock, MapPin, Bookmark, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await wpAPI.getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Artikel Tidak Ditemukan | Jakselnews",
    };
  }

  const title = stripHtml(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered).slice(0, 160);
  const featuredImage = getFeaturedImage(post, "large");

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
  const post = await wpAPI.getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const featuredImage = getFeaturedImage(post, "large");
  const category = getPostCategory(post);
  const title = stripHtml(post.title.rendered);
  const date = formatPostDate(post.date);

  return (
    <article className="pb-safe">
      <div className="container py-3">
        <Link
          href="/artikel"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
        >
          <ChevronLeft size={18} />
          Kembali
        </Link>
      </div>

      <div className="relative w-full bg-gray-100">
        <div className="aspect-video md:aspect-[21/9] max-h-[500px]">
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover"
              width={1200}
              height={675}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
              <span className="text-red-300 font-bold text-6xl">J</span>
            </div>
          )}
        </div>
      </div>

      <div className="container py-4 md:py-6">
        <div className="max-w-3xl mx-auto">
          {category && (
            <Link
              href={`/kategori/${category.slug}`}
              className={`category-badge ${category.slug} mb-3 inline-block`}
            >
              {category.name}
            </Link>
          )}

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 pb-4 border-b border-gray-100">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              Jakarta Selatan
            </span>
            <div className="flex-1" />
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <Bookmark size={16} />
              Simpan
            </button>
          </div>

          <div
            className="prose prose-gray max-w-none mt-6"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </div>
      </div>
    </article>
  );
}
