import { Router } from 'express';
import { param, body, query } from 'express-validator';
import { supabase, supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../middleware/errorHandler';
import { authenticate, requireAdmin, AuthRequest } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { v4 as uuidv4 } from 'uuid';
import { sendReportStatusEmail } from '../../services/email';

const router = Router();

// Get all reports (admin view - full details)
router.get(
  '/reports',
  authenticate,
  requireAdmin,
  [
    query('type').optional().isString(),
    query('status').optional().isIn(['pending', 'verified', 'processing', 'resolved', 'rejected']),
    query('kecamatan').optional().isString(),
    query('priority').optional().isIn(['low', 'normal', 'high', 'urgent']),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('sort').optional().isIn(['created_at', 'priority', 'status']),
    query('order').optional().isIn(['asc', 'desc']),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const {
        type,
        status,
        kecamatan,
        priority,
        page = 1,
        limit = 20,
        sort = 'created_at',
        order = 'desc',
      } = req.query as any;

      let queryBuilder = supabaseAdmin
        .from('reports')
        .select('*', { count: 'exact' })
        .order(sort, { ascending: order === 'asc' });

      if (type) queryBuilder = queryBuilder.eq('type', type);
      if (status) queryBuilder = queryBuilder.eq('status', status);
      if (priority) queryBuilder = queryBuilder.eq('priority', priority);
      if (kecamatan) queryBuilder = queryBuilder.ilike('location_name', `%${kecamatan}%`);

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
      console.error('Admin get reports error:', error);
      throw error;
    }
  }
);

// Update report status
router.put(
  '/reports/:id',
  authenticate,
  requireAdmin,
  [
    param('id').isUUID().withMessage('ID tidak valid'),
    body('status').optional().isIn(['pending', 'verified', 'processing', 'resolved', 'rejected']),
    body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']),
    body('assigned_to').optional().isString(),
    body('admin_notes').optional().isString(),
    body('verified').optional().isBoolean().toBoolean(),
  ],
  validateRequest,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status, priority, assigned_to, admin_notes, verified } = req.body;

      // Validate status if provided
      const validStatuses = ['pending', 'verified', 'processing', 'resolved', 'rejected'];
      const validPriorities = ['low', 'normal', 'high', 'urgent'];

      if (status && !validStatuses.includes(status)) {
        throw ApiError.badRequest(`Status harus salah satu dari: ${validStatuses.join(', ')}`);
      }
      if (priority && !validPriorities.includes(priority)) {
        throw ApiError.badRequest(`Priority harus salah satu dari: ${validPriorities.join(', ')}`);
      }
      if (admin_notes && typeof admin_notes !== 'string') {
        throw ApiError.badRequest('admin_notes harus string');
      }
      if (admin_notes && admin_notes.length > 2000) {
        throw ApiError.badRequest('admin_notes maksimal 2000 karakter');
      }

      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (status) {
        updateData.status = status;
        if (status === 'resolved') {
          updateData.resolved_at = new Date().toISOString();
        }
      }
      if (priority) updateData.priority = priority;
      if (assigned_to !== undefined) updateData.assigned_to = assigned_to || null;
      if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
      if (verified !== undefined) updateData.verified = verified;

      // Get current report to check if status changed
      const { data: currentReport } = await supabaseAdmin
        .from('reports')
        .select('status, reporter_email, reporter_name, type, description')
        .eq('id', id)
        .single();

      const { data, error } = await supabaseAdmin
        .from('reports')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        throw ApiError.notFound('Laporan tidak ditemukan');
      }

      // Send email notification if status changed and reporter has email
      if (status && status !== currentReport?.status && currentReport?.reporter_email && !currentReport?.is_anonymous) {
        sendReportStatusEmail({
          recipientEmail: currentReport.reporter_email,
          recipientName: currentReport.reporter_name || 'Warga Jaksel',
          reportType: currentReport.type,
          reportDescription: currentReport.description,
          newStatus: status as 'pending' | 'verified' | 'processing' | 'resolved' | 'rejected',
          reportId: id,
          adminNotes: admin_notes,
        }).catch((err) => console.error('Failed to send status email:', err));
      }

      res.json({
        success: true,
        message: 'Laporan berhasil diupdate',
        data,
      });
    } catch (error) {
      console.error('Admin update report error:', error);
      throw error;
    }
  }
);

// Delete report
router.delete(
  '/reports/:id',
  authenticate,
  requireAdmin,
  [param('id').isUUID().withMessage('ID tidak valid')],
  validateRequest,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseAdmin
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) {
        throw ApiError.internal('Gagal menghapus laporan');
      }

      res.json({
        success: true,
        message: 'Laporan berhasil dihapus',
      });
    } catch (error) {
      console.error('Admin delete report error:', error);
      throw error;
    }
  }
);

// Get dashboard stats
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data: reports, error } = await supabaseAdmin
      .from('reports')
      .select('type, status, priority, location_name, created_at');

    if (error) {
      throw ApiError.internal('Gagal mengambil statistik');
    }

    const stats = {
      total: reports.length,
      byStatus: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      recentActivity: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      },
      resolutionRate: 0,
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let resolved = 0;

    reports.forEach((report: any) => {
      // Count by status
      stats.byStatus[report.status] = (stats.byStatus[report.status] || 0) + 1;

      // Count by type
      stats.byType[report.type] = (stats.byType[report.type] || 0) + 1;

      // Count by priority
      stats.byPriority[report.priority] = (stats.byPriority[report.priority] || 0) + 1;

      // Count by time
      const createdAt = new Date(report.created_at);
      if (createdAt >= startOfToday) stats.recentActivity.today++;
      if (createdAt >= startOfWeek) stats.recentActivity.thisWeek++;
      if (createdAt >= startOfMonth) stats.recentActivity.thisMonth++;

      // Resolution rate
      if (report.status === 'resolved') resolved++;
    });

    stats.resolutionRate = stats.total > 0
      ? Math.round((resolved / stats.total) * 100)
      : 0;

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Admin stats error:', error);
    throw error;
  }
});

// Create category
router.post(
  '/categories',
  authenticate,
  requireAdmin,
  [
    body('name').isString().notEmpty().withMessage('Nama harus diisi'),
    body('slug').isString().notEmpty().isLowercase().withMessage('Slug harus lowercase'),
    body('icon').optional().isString(),
    body('color').optional().isString(),
    body('bg_color').optional().isString(),
    body('keywords').optional().isArray(),
    body('sort_order').optional().isInt().toInt(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name, slug, icon, color, bg_color, keywords, sort_order } = req.body;

      const id = uuidv4();

      const { data, error } = await supabaseAdmin
        .from('categories')
        .insert({
          id,
          name,
          slug,
          icon,
          color: color || '#6B7280',
          bg_color: bg_color || 'rgba(107, 114, 128, 0.15)',
          keywords: keywords || [],
          sort_order: sort_order || 0,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw ApiError.badRequest('Slug sudah digunakan');
        }
        throw ApiError.internal('Gagal membuat kategori');
      }

      res.status(201).json({
        success: true,
        message: 'Kategori berhasil dibuat',
        data,
      });
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  }
);

// Update category
router.put(
  '/categories/:id',
  authenticate,
  requireAdmin,
  [
    param('id').isUUID().withMessage('ID tidak valid'),
    body('name').optional().isString(),
    body('icon').optional().isString(),
    body('color').optional().isString(),
    body('bg_color').optional().isString(),
    body('keywords').optional().isArray(),
    body('sort_order').optional().isInt().toInt(),
    body('is_active').optional().isBoolean().toBoolean(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data, error } = await supabaseAdmin
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        throw ApiError.notFound('Kategori tidak ditemukan');
      }

      res.json({
        success: true,
        message: 'Kategori berhasil diupdate',
        data,
      });
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  }
);

// Get all categories (admin - including inactive)
router.get('/categories', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      throw ApiError.internal('Gagal mengambil kategori');
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
});

export default router;
