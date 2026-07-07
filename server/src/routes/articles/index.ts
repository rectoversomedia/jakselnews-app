import { Router } from 'express';
import { query } from 'express-validator';
import { supabase } from '../../config/supabase';
import { ApiError } from '../../middleware/errorHandler';
import { validateRequest } from '../../middleware/validate';

const router = Router();

// Get articles from local database (synced from WordPress)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('category').optional().isString(),
    query('search').optional().isString(),
    query('breaking').optional().isBoolean().toBoolean(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        search,
        breaking,
      } = req.query as {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
        breaking?: boolean;
      };

      let queryBuilder = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (category) {
        queryBuilder = queryBuilder.eq('category', category);
      }

      if (search) {
        queryBuilder = queryBuilder.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      if (breaking) {
        queryBuilder = queryBuilder.eq('is_breaking_news', true);
      }

      const start = (page - 1) * limit;
      queryBuilder = queryBuilder.range(start, start + limit - 1);

      const { data, error, count } = await queryBuilder;

      if (error) {
        throw ApiError.internal('Gagal mengambil artikel');
      }

      res.json({
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
    } catch (error) {
      console.error('Get articles error:', error);
      throw error;
    }
  }
);

// Get single article by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      throw ApiError.notFound('Artikel tidak ditemukan');
    }

    // Increment views
    await supabase
      .from('articles')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id);

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get article error:', error);
    throw error;
  }
});

export default router;
