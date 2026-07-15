import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { supabase } from '../../config/supabase';
import { ApiError } from '../middleware/errorHandler';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { autoCategorize, reportStatuses } from '../utils/categories';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all reports (public with filters)
router.get(
  '/',
  [
    query('type').optional().isString(),
    query('status').optional().isIn(['pending', 'verified', 'processing', 'resolved', 'rejected']),
    query('kecamatan').optional().isString(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const {
        type,
        status,
        kecamatan,
        page = 1,
        limit = 20
      } = req.query as {
        type?: string;
        status?: string;
        kecamatan?: string;
        page?: number;
        limit?: number;
      };

      let queryBuilder = supabase
        .from('reports')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (type) {
        queryBuilder = queryBuilder.eq('type', type);
      }

      if (status) {
        queryBuilder = queryBuilder.eq('status', status);
      }

      if (kecamatan) {
        queryBuilder = queryBuilder.ilike('location_name', `%${kecamatan}%`);
      }

      // Pagination
      const start = (page - 1) * limit;
      queryBuilder = queryBuilder.range(start, start + limit - 1);

      const { data, error, count } = await queryBuilder;

      if (error) {
        throw ApiError.internal('Gagal mengambil data laporan');
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
      console.error('Get reports error:', error);
      throw error;
    }
  }
);

// Get single report by ID
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('ID tidak valid'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        throw ApiError.notFound('Laporan tidak ditemukan');
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error('Get report error:', error);
      throw error;
    }
  }
);

// Create new report (public)
router.post(
  '/',
  [
    body('type').isString().notEmpty().withMessage('Kategori harus diisi'),
    body('description').isString().notEmpty().isLength({ min: 10, max: 2000 }).withMessage('Deskripsi minimal 10 karakter'),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('kecamatan').optional().isString(),
    body('kelurahan').optional().isString(),
    body('reporter_name').optional().isString(),
    body('reporter_phone').optional().isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
    body('reporter_email').optional().isEmail().withMessage('Email tidak valid'),
    body('is_anonymous').optional().isBoolean().toBoolean(),
    body('media_url').optional().isURL().withMessage('URL media tidak valid'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const {
        type,
        description,
        latitude,
        longitude,
        kecamatan,
        kelurahan,
        reporter_name,
        reporter_phone,
        reporter_email,
        is_anonymous = false,
        media_url,
      } = req.body;

      // Auto-categorize based on description
      const autoCategory = autoCategorize(description);

      // Build location name
      const location_name = [
        kelurahan,
        kecamatan,
        'Jakarta Selatan'
      ].filter(Boolean).join(', ');

      const id = uuidv4();

      const { data, error } = await supabase
        .from('reports')
        .insert({
          id,
          type,
          description,
          latitude: latitude || null,
          longitude: longitude || null,
          location_name: location_name || null,
          media_url: media_url || null,
          status: 'pending',
          verified: false,
          auto_category: autoCategory,
          priority: autoCategory !== 'lainnya' ? 'normal' : 'low',
          reporter_name: is_anonymous ? null : (reporter_name || null),
          reporter_phone: is_anonymous ? null : (reporter_phone || null),
          reporter_email: is_anonymous ? null : (reporter_email || null),
          is_anonymous,
        })
        .select()
        .single();

      if (error) {
        console.error('Insert report error:', error);
        throw ApiError.internal('Gagal menyimpan laporan');
      }

      res.status(201).json({
        success: true,
        message: 'Laporan berhasil dikirim. Terima kasih atas kontribusi Anda!',
        data,
      });
    } catch (error) {
      console.error('Create report error:', error);
      throw error;
    }
  }
);

// Get report statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('type, status, location_name');

    if (error) {
      throw ApiError.internal('Gagal mengambil statistik');
    }

    const stats = {
      total: data.length,
      byStatus: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      byKecamatan: {} as Record<string, number>,
    };

    data.forEach((report) => {
      stats.byStatus[report.status] = (stats.byStatus[report.status] || 0) + 1;
      stats.byType[report.type] = (stats.byType[report.type] || 0) + 1;
      if (report.location_name) {
        const kec = report.location_name.split(',')[0]?.trim();
        if (kec) {
          stats.byKecamatan[kec] = (stats.byKecamatan[kec] || 0) + 1;
        }
      }
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get stats error:', error);
    throw error;
  }
});

// Get status labels for frontend
router.get('/statuses', (req, res) => {
  res.json({ success: true, data: reportStatuses });
});

export default router;
