import { WPPost, WPCategory, WPTag, WPMedia, WPAuthor, WPTerm, WPPage } from '@/types/wordpress';

// Configure your WordPress site URL
const WP_API_BASE = process.env.NEXT_PUBLIC_WP_API_URL || 'https://jakselnews.com/wp-json/wp/v2';

class WordPressAPI {
  private baseUrl: string;

  constructor(baseUrl: string = WP_API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60, // Cache for 60 seconds (ISR)
      },
    });

    if (!response.ok) {
      throw new Error(`WP API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ============ POSTS ============

  /**
   * Get all posts with pagination
   */
  async getPosts(options: {
    page?: number;
    perPage?: number;
    categories?: number[];
    tags?: number[];
    search?: string;
    orderBy?: 'date' | 'title' | 'modified';
    order?: 'asc' | 'desc';
  } = {}): Promise<{ posts: WPPost[]; totalPages: number; totalPosts: number }> {
    const {
      page = 1,
      perPage = 10,
      categories,
      tags,
      search,
      orderBy = 'date',
      order = 'desc',
    } = options;

    const params: Record<string, string> = {
      page: page.toString(),
      per_page: perPage.toString(),
      orderby: orderBy,
      order,
      _embed: '1', // Include featured media, terms, author
    };

    if (categories?.length) {
      params.categories = categories.join(',');
    }
    if (tags?.length) {
      params.tags = tags.join(',');
    }
    if (search) {
      params.search = search;
    }

    const posts = await this.fetch<WPPost[]>('/posts', params);
    const totalPages = parseInt((posts as unknown as { headers: { get: (key: string) => string } }).headers?.get('X-WP-TotalPages') || '1');
    const totalPosts = parseInt((posts as unknown as { headers: { get: (key: string) => string } }).headers?.get('X-WP-Total') || '0');

    return { posts, totalPages, totalPosts };
  }

  /**
   * Get a single post by slug
   */
  async getPostBySlug(slug: string): Promise<WPPost | null> {
    try {
      const posts = await this.fetch<WPPost[]>('/posts', {
        slug,
        _embed: '1',
      });
      return posts[0] || null;
    } catch {
      return null;
    }
  }

  /**
   * Get a single post by ID
   */
  async getPostById(id: number): Promise<WPPost | null> {
    try {
      return await this.fetch<WPPost>(`/posts/${id}`, {
        _embed: '1',
      });
    } catch {
      return null;
    }
  }

  /**
   * Get latest posts (for homepage)
   */
  async getLatestPosts(limit: number = 10): Promise<{ posts: WPPost[]; totalPages: number; totalPosts: number }> {
    return this.getPosts({ perPage: limit });
  }

  // ============ CATEGORIES ============

  /**
   * Get all categories
   */
  async getCategories(): Promise<WPCategory[]> {
    return this.fetch<WPCategory[]>('/categories', { per_page: '100' });
  }

  /**
   * Get a single category by slug
   */
  async getCategoryBySlug(slug: string): Promise<WPCategory | null> {
    try {
      const categories = await this.fetch<WPCategory[]>('/categories', { slug });
      return categories[0] || null;
    } catch {
      return null;
    }
  }

  // ============ TAGS ============

  /**
   * Get all tags
   */
  async getTags(): Promise<WPTag[]> {
    return this.fetch<WPTag[]>('/tags', { per_page: '100' });
  }

  // ============ MEDIA ============

  /**
   * Get media by ID
   */
  async getMedia(id: number): Promise<WPMedia | null> {
    try {
      return await this.fetch<WPMedia>(`/media/${id}`);
    } catch {
      return null;
    }
  }

  // ============ PAGES ============

  /**
   * Get a page by slug
   */
  async getPageBySlug(slug: string): Promise<WPPage | null> {
    try {
      const pages = await this.fetch<WPPage[]>('/pages', { slug });
      return pages[0] || null;
    } catch {
      return null;
    }
  }

  // ============ SEARCH ============

  /**
   * Search posts
   */
  async searchPosts(query: string, limit: number = 10): Promise<WPPost[]> {
    const { posts } = await this.getPosts({ search: query, perPage: limit });
    return posts;
  }
}

// Export singleton instance
export const wpAPI = new WordPressAPI();

// Export class for custom instances
export { WordPressAPI };

// Helper function to extract featured image from post
export function getFeaturedImage(post: WPPost, size: 'thumbnail' | 'medium' | 'medium_large' | 'large' | 'full' = 'medium_large'): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  return media.media_details?.sizes?.[size]?.source_url || media.source_url || null;
}

// Helper function to get category from post
export function getPostCategory(post: WPPost): WPTerm | null {
  return post._embedded?.['wp:term']?.[0]?.[0] || null;
}

// Helper function to get author from post
export function getPostAuthor(post: WPPost): WPAuthor | null {
  return post._embedded?.author?.[0] || null;
}

// Helper function to format date
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
      month: 'long',
      year: 'numeric',
    });
  }
}

// Helper function to strip HTML tags
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

// Helper function to truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}