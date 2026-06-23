import { notFound } from 'next/navigation';
import { wpAPI, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from '@/lib/wordpress';
import Link from 'next/link';
import { Clock, MapPin, ChevronRight, FileText } from 'lucide-react';

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
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover"
            width={400}
            height={250}
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
            <MapPin size={12} className="md:size-3.5" />
            Jakarta Selatan
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="md:size-3.5" />
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

  const category = await wpAPI.getCategoryBySlug(slug);
  const { posts } = await wpAPI.getPosts({
    perPage: 20,
    categories: category ? [category.id] : undefined,
  });

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container py-6 md:py-8">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} />
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
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Tidak ada berita di kategori ini</p>
            <Link
              href="/artikel"
              className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline"
            >
              Lihat semua berita <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
