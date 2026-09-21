import { MetadataRoute } from 'next';
import { wp } from '@/lib/wordpress';

const BASE_URL = 'https://dev.jakselnews.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/artikel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/breaking-news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/info-terkini`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/layanan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/lapor`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/kebijakan-privasi`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/pedoman-media-siber`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch articles for dynamic URLs
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await wp.getPosts({ perPage: 100, page: 1 });
    if (result.success && result.data) {
      articleRoutes = result.data.map((post) => {
        const slug = (post as any).slug || '';
        const date = new Date((post as any).modified || (post as any).date || new Date());
        return {
          url: `${BASE_URL}/artikel/${slug}`,
          lastModified: date,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        };
      });
    }
  } catch (e) {
    console.error('Sitemap: failed to fetch articles', e);
  }

  return [...staticRoutes, ...articleRoutes];
}
