import { Router } from 'express';
import { supabase } from '../../config/supabase';
import { ApiError } from '../middleware/errorHandler';
import { reportCategories } from '../utils/categories';

const router = Router();

// Get all categories (for report types)
router.get('/', async (req, res) => {
  try {
    // First try to get from database
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      // Fallback to static categories if DB fails
      console.warn('Using static categories:', error.message);
      res.json({
        success: true,
        data: reportCategories,
        source: 'static',
      });
      return;
    }

    if (data && data.length > 0) {
      res.json({
        success: true,
        data,
        source: 'database',
      });
      return;
    }

    // Use static categories as fallback
    res.json({
      success: true,
      data: reportCategories,
      source: 'static',
    });
  } catch (error) {
    console.error('Get categories error:', error);
    // Return static categories on any error
    res.json({
      success: true,
      data: reportCategories,
      source: 'static',
    });
  }
});

// Get single category by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      // Fallback to static category
      const staticCat = reportCategories.find((c) => c.id === slug);
      if (staticCat) {
        res.json({ success: true, data: staticCat, source: 'static' });
        return;
      }
      throw ApiError.notFound('Kategori tidak ditemukan');
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get category error:', error);
    throw error;
  }
});

export default router;
