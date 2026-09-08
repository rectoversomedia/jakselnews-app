// WordPress API Client for Jakselnews
// Fetches via Next.js proxy to bypass DNS (WP still lives at old IP 153.92.8.164)
const WP_API_BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jakselnews.com';
const WP_PROXY = `${WP_API_BASE}/api/wordpress`;

// Types
export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: WPTerm[][];
    author?: WPAuthor[];
  };
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    sizes: {
      thumbnail?: { source_url: string };
      medium?: { source_url: string };
      medium_large?: { source_url: string };
      large?: { source_url: string };
      full?: { source_url: string };
    };
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  avatar_urls?: Record<string, string>;
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WordPressResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    perPage: number;
    totalPages: number;
    totalPosts: number;
  };
  error?: string;
}

class WordPressClient {
  private baseUrl: string;
  private proxyUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheDuration: number;

  constructor(baseUrl: string = WP_PROXY) {
    this.proxyUrl = baseUrl;
    this.baseUrl = WP_API_BASE;
    this.cache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }

  private getFromCache<T>(key: string): T | null {
    if (typeof window === 'undefined') return null; // No cache on server

    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    if (typeof window === 'undefined') return;
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async fetch<T>(endpoint: string, params?: Record<string, string>): Promise<WordPressResponse<T>> {
    const cacheKey = `${endpoint}?${new URLSearchParams(params)}`;

    const cached = this.getFromCache<WordPressResponse<T>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Always use proxy — handles both browser and server-side rendering
      const queryParams = new URLSearchParams({ endpoint, ...(params || {}) });
      const proxyUrl = `${this.proxyUrl}?${queryParams.toString()}`;

      const res = await fetch(proxyUrl, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        return {
          success: false,
          data: [] as T,
          error: `HTTP ${res.status}: ${res.statusText}`,
        };
      }

      const wrapped = await res.json() as WordPressResponse<T>;
      // Cache client-side
      this.setCache(cacheKey, wrapped);
      return wrapped;
    } catch (error: any) {
      console.error('WordPress API Error:', error);
      return {
        success: false,
        data: [] as T,
        error: error.message || 'Failed to fetch from WordPress',
      };
    }
  }

  // Get posts with pagination
  async getPosts(options: {
    page?: number;
    perPage?: number;
    categories?: number | number[];
    tags?: number | number[];
    search?: string;
    orderBy?: 'date' | 'title' | 'modified';
    order?: 'asc' | 'desc';
  } = {}): Promise<WordPressResponse<WPPost[]>> {
    const params: Record<string, string> = {
      page: String(options.page || 1),
      per_page: String(options.perPage || 10),
      _embed: '1',
      status: 'publish',
    };

    if (options.categories) {
      params.categories = String(options.categories);
    }
    if (options.tags) {
      params.tags = String(options.tags);
    }
    if (options.search) {
      params.search = options.search;
    }
    if (options.orderBy) {
      params.orderby = options.orderBy;
    }
    if (options.order) {
      params.order = options.order;
    }

    return this.fetch<WPPost[]>('/posts', params);
  }

  // Get single post by slug
  async getPost(slug: string): Promise<WordPressResponse<WPPost | null>> {
    const result = await this.fetch<WPPost[]>('/posts', {
      slug,
      _embed: '1',
      status: 'publish',
    });

    return {
      success: result.success,
      data: result.data[0] || null,
      pagination: result.pagination,
      error: result.error,
    };
  }

  // Get categories
  async getCategories(): Promise<WordPressResponse<WPCategory[]>> {
    return this.fetch<WPCategory[]>('/categories', {
      per_page: '100',
      hide_empty: 'true',
    });
  }

  // Get tags
  async getTags(): Promise<WordPressResponse<WPTag[]>> {
    return this.fetch<WPTag[]>('/tags', {
      per_page: '100',
      hide_empty: 'true',
    });
  }

  // Search posts
  async search(query: string, page: number = 1): Promise<WordPressResponse<WPPost[]>> {
    return this.getPosts({ search: query, page, perPage: 10 });
  }

  // Get latest posts (for homepage)
  async getLatest(limit: number = 10): Promise<WordPressResponse<WPPost[]>> {
    return this.getPosts({ perPage: limit });
  }

  // Get breaking news (latest 5)
  async getBreakingNews(): Promise<WordPressResponse<WPPost[]>> {
    return this.getPosts({ perPage: 5 });
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      // Also clear localStorage if used
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('wp_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }
}

// Export singleton
export const wp = new WordPressClient();

// Helper functions
export function getFeaturedImage(post: WPPost, size: 'thumbnail' | 'medium' | 'medium_large' | 'large' | 'full' = 'medium_large'): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  return media.media_details?.sizes?.[size]?.source_url || media.source_url || null;
}

export function getPostCategory(post: WPPost): WPTerm | null {
  return post._embedded?.['wp:term']?.[0]?.[0] || null;
}

export function getPostAuthor(post: WPPost): WPAuthor | null {
  return post._embedded?.author?.[0] || null;
}

export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'Baru saja';
  } else if (diffInHours < 24) {
    return `${diffInHours} jam lalu`;
  } else if (diffInDays < 7) {
    return `${diffInDays} hari lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export { WordPressClient };
