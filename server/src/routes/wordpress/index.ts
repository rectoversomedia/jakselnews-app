import { Router } from 'express';
import axios from 'axios';
import { config } from '../../config';

const router = Router();

const WP_BASE_URL = config.WORDPRESS_API_URL;
const CACHE = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper to get from cache or fetch
async function getWithCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const cached = CACHE.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const data = await fetchFn();
  CACHE.set(key, { data, timestamp: Date.now() });
  return data;
}

// Clear cache (for webhook triggers)
router.post('/cache/clear', (req, res) => {
  CACHE.clear();
  res.json({ success: true, message: 'Cache cleared' });
});

// Get posts with pagination
router.get('/posts', async (req, res) => {
  try {
    const {
      page = '1',
      per_page = '10',
      categories,
      tags,
      search,
      orderby = 'date',
      order = 'desc',
    } = req.query;

    const cacheKey = `posts_${JSON.stringify(req.query)}`;

    const data = await getWithCache(cacheKey, async () => {
      const params: Record<string, string> = {
        page: String(page),
        per_page: String(per_page),
        orderby: String(orderby),
        order: String(order),
        _embed: '1',
        status: 'publish',
      };

      if (categories) params.categories = String(categories);
      if (tags) params.tags = String(tags);
      if (search) params.search = String(search);

      const response = await axios.get(`${WP_BASE_URL}/posts`, {
        params,
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000,
      });

      return {
        posts: response.data,
        headers: {
          totalPages: response.headers['x-wp-totalpages'],
          totalPosts: response.headers['x-wp-total'],
        },
      };
    });

    res.json({
      success: true,
      data: data.posts,
      pagination: {
        page: parseInt(String(page)),
        perPage: parseInt(String(per_page)),
        totalPages: parseInt(data.headers.totalPages) || 1,
        totalPosts: parseInt(data.headers.totalPosts) || 0,
      },
    });
  } catch (error: any) {
    console.error('WordPress posts error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Gagal mengambil artikel dari WordPress',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Get single post by slug
router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const data = await getWithCache(`post_${slug}`, async () => {
      const response = await axios.get(`${WP_BASE_URL}/posts`, {
        params: {
          slug,
          _embed: '1',
          status: 'publish',
        },
        timeout: 10000,
      });
      return response.data[0] || null;
    });

    if (!data) {
      res.status(404).json({ success: false, error: 'Artikel tidak ditemukan' });
      return;
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('WordPress post error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Gagal mengambil artikel',
    });
  }
});

// Get categories from WordPress
router.get('/categories', async (req, res) => {
  try {
    const data = await getWithCache('wp_categories', async () => {
      const response = await axios.get(`${WP_BASE_URL}/categories`, {
        params: {
          per_page: 100,
          hide_empty: true,
        },
        timeout: 10000,
      });
      return response.data;
    });

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('WordPress categories error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Gagal mengambil kategori',
    });
  }
});

// Get tags from WordPress
router.get('/tags', async (req, res) => {
  try {
    const data = await getWithCache('wp_tags', async () => {
      const response = await axios.get(`${WP_BASE_URL}/tags`, {
        params: {
          per_page: 100,
          hide_empty: true,
        },
        timeout: 10000,
      });
      return response.data;
    });

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('WordPress tags error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Gagal mengambil tags',
    });
  }
});

// Get search results
router.get('/search', async (req, res) => {
  try {
    const { q, page = '1', per_page = '10' } = req.query;

    if (!q) {
      res.status(400).json({ success: false, error: 'Query required' });
      return;
    }

    const cacheKey = `search_${q}_${page}`;
    const data = await getWithCache(cacheKey, async () => {
      const response = await axios.get(`${WP_BASE_URL}/posts`, {
        params: {
          search: String(q),
          page: String(page),
          per_page: String(per_page),
          _embed: '1',
          status: 'publish',
        },
        timeout: 10000,
      });

      return {
        posts: response.data,
        headers: {
          totalPages: response.headers['x-wp-totalpages'],
          totalPosts: response.headers['x-wp-total'],
        },
      };
    });

    res.json({
      success: true,
      data: data.posts,
      pagination: {
        page: parseInt(String(page)),
        perPage: parseInt(String(per_page)),
        totalPages: parseInt(data.headers.totalPages) || 1,
        totalPosts: parseInt(data.headers.totalPosts) || 0,
      },
    });
  } catch (error: any) {
    console.error('WordPress search error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Gagal mencari artikel',
    });
  }
});

// Health check for WordPress connection
router.get('/health', async (req, res) => {
  try {
    const start = Date.now();
    await axios.get(`${WP_BASE_URL}/posts`, {
      params: { per_page: 1 },
      timeout: 5000,
    });
    const latency = Date.now() - start;

    res.json({
      success: true,
      status: 'connected',
      url: WP_BASE_URL,
      latency: `${latency}ms`,
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      status: 'disconnected',
      url: WP_BASE_URL,
      error: error.message,
    });
  }
});

export default router;
