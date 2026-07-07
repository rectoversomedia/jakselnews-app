import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { wp, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from "@/lib/wordpress";

// Simple inline SVG icons for server components
const ClockIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor">
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/>
  </svg>
);

const MapPinIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor">
    <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,1,1,144,0C200,161.23,144.53,209,128,222Z"/>
  </svg>
);

const BookmarkIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor">
    <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32ZM72,48h112V176.73L128,151.51l-56,25.22Z"/>
  </svg>
);

const CaretLeftIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor">
    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/>
  </svg>
);

interface PageProps {
  params: { slug: string };
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
  const result = await wp.getPost(params.slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  const featuredImage = getFeaturedImage(post, "large");
  const category = getPostCategory(post);
  const title = stripHtml(post.title.rendered);
  const date = formatPostDate(post.date);

  return (
    <article className="pb-safe">
      <div className="px-4 py-3">
        <Link
          href="/artikel"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
        >
          <CaretLeftIcon size={18} />
          Kembali
        </Link>
      </div>

      <div className="relative w-full bg-gray-100">
        <div className="aspect-video md:aspect-[21/9] max-h-[500px]">
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
              <span className="text-red-300 font-bold text-6xl">J</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-4 md:py-6">
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
              <ClockIcon size={14} />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon size={14} />
              Jakarta Selatan
            </span>
            <div className="flex-1" />
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <BookmarkIcon size={16} />
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
