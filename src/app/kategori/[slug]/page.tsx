import { notFound } from 'next/navigation';
import Image from 'next/image';
import { wp, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from '@/lib/wordpress';
import Link from 'next/link';

// Simple inline SVG icons for server components
const ClockIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" className={className}>
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/>
  </svg>
);

const MapPinIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" className={className}>
    <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,1,1,144,0C200,161.23,144.53,209,128,222Z"/>
  </svg>
);

const CaretRightIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" className={className}>
    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/>
  </svg>
);

const FileTextIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" className={className}>
    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"/>
  </svg>
);

interface PageProps {
  params: { slug: string };
}

export const metadata = {
  title: 'Kategori | Jakselnews',
  description: 'Kategori berita Jakselnews',
};

const categoryMeta: Record<string, { title: string; description: string; emoji: string }> = {
  'jaksel': { title: 'Jaksel', description: 'Berita dan informasi seputar Jakarta Selatan', emoji: '📍' },
  'metro': { title: 'Metro', description: 'Berita metropolitan dan ibu kota', emoji: '🏙️' },
  'ekonomi': { title: 'Ekonomi', description: 'Berita ekonomi dan bisnis', emoji: '💰' },
  'gaya-hidup': { title: 'Gaya Hidup', description: 'Tips dan tren gaya hidup', emoji: '✨' },
  'banjir': { title: 'Info Banjir', description: 'Informasi banjir di Jakarta Selatan', emoji: '🌊' },
  'lalu-lintas': { title: 'Lalu Lintas', description: 'Info lalu lintas dan transportasi', emoji: '🚗' },
};

function CategoryCard({ post }: { post: any }) {
  const featuredImage = getFeaturedImage(post);
  const category = getPostCategory(post);
  const date = formatPostDate(post.date);
  const title = stripHtml(post.title.rendered);

  return (
    <Link href={`/artikel/${post.slug}`} className="card overflow-hidden block">
      <div className="relative aspect-[16/10]">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            <MapPinIcon size={12} className="md:size-3.5" />
            Jakarta Selatan
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon size={12} className="md:size-3.5" />
            {date}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function KategoriPage({ params }: PageProps) {
  const { slug } = params;
  const meta = categoryMeta[slug];

  if (!meta) {
    notFound();
  }

  // Get categories and find matching one
  const categoriesResult = await wp.getCategories();
  const category = categoriesResult.success
    ? categoriesResult.data.find(c => c.slug === slug)
    : null;

  const postsResult = await wp.getPosts({
    perPage: 20,
    categories: category ? [category.id] : undefined,
  });
  const posts = postsResult.success ? postsResult.data : [];

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container py-6 md:py-8">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <CaretRightIcon size={14} />
            <span>Kategori</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{meta.emoji}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{meta.title}</h1>
              <p className="text-white/80 text-sm mt-1">{meta.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container py-4">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {posts.map((post) => (
              <CategoryCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileTextIcon size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Tidak ada berita di kategori ini</p>
            <Link
              href="/artikel"
              className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline"
            >
              Lihat semua berita <CaretRightIcon size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
