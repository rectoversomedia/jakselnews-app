import { Router } from 'express';
import { body } from 'express-validator';
import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../middleware/errorHandler';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';

const router = Router();

// ===========================================
// FCM PUSH NOTIFICATION SERVER
// ===========================================

interface FCMMessage {
  to?: string;
  notification: {
    title: string;
    body: string;
    icon?: string;
    click_action?: string;
  };
  data?: Record<string, string>;
}

const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;
const FCM_SEND_URL = 'https://fcm.googleapis.com/fcm/send';

/**
 * Send push notification via FCM
 */
async function sendFCMNotification(message: FCMMessage): Promise<boolean> {
  if (!FCM_SERVER_KEY) {
    console.warn('FCM_SERVER_KEY not configured');
    return false;
  }

  try {
    const response = await fetch(FCM_SEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FCM_SERVER_KEY}`,
      },
      body: JSON.stringify(message),
    });

    return response.ok;
  } catch (error) {
    console.error('FCM send error:', error);
    return false;
  }
}

// ===========================================
// ROUTES
// ===========================================

/**
 * Register FCM token for push notifications
 */
router.post(
  '/register-token',
  authenticate,
  [
    body('token').isString().notEmpty().withMessage('Token harus diisi'),
    body('platform').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res) => {
    try {
      const { token, platform = 'web' } = req.body;
      const userId = req.user!.id;

      // Store token in database (you may want to create a fcm_tokens table)
      // For now, we'll store it in user metadata via profiles
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          fcm_token: token,
          fcm_platform: platform,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('Error storing FCM token:', error);
        throw ApiError.internal('Gagal menyimpan token');
      }

      res.json({
        success: true,
        message: 'Token berhasil disimpan',
      });
    } catch (error) {
      console.error('Register token error:', error);
      throw error;
    }
  }
);

/**
 * Unregister FCM token
 */
router.delete(
  '/unregister-token',
  authenticate,
  [body('token').isString().notEmpty()],
  validateRequest,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;

      // Clear token from profile
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          fcm_token: null,
          fcm_platform: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        throw ApiError.internal('Gagal menghapus token');
      }

      res.json({
        success: true,
        message: 'Token berhasil dihapus',
      });
    } catch (error) {
      console.error('Unregister token error:', error);
      throw error;
    }
  }
);

/**
 * Send notification to specific user
 */
router.post(
  '/send',
  authenticate,
  [
    body('userId').optional().isUUID(),
    body('title').isString().notEmpty().withMessage('Title harus diisi'),
    body('body').isString().notEmpty().withMessage('Body harus diisi'),
    body('url').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res) => {
    try {
      const { userId, title, body: notificationBody, url } = req.body;
      const adminUserId = req.user!.id;

      // Verify admin role
      const { data: adminProfile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', adminUserId)
        .single();

      if (!adminProfile || !['admin', 'superadmin'].includes(adminProfile.role)) {
        throw ApiError.forbidden('Hanya admin yang dapat mengirim notifikasi');
      }

      // Get target user
      const targetUserId = userId || adminUserId;
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('fcm_token, name')
        .eq('id', targetUserId)
        .single();

      if (!profile?.fcm_token) {
        throw ApiError.notFound('User tidak memiliki token notifikasi');
      }

      // Send FCM notification
      const success = await sendFCMNotification({
        to: profile.fcm_token,
        notification: {
          title,
          body: notificationBody,
          icon: '/logo-button.png',
          click_action: url || '/',
        },
        data: {
          url: url || '/',
          type: 'push_notification',
        },
      });

      if (!success) {
        throw ApiError.internal('Gagal mengirim notifikasi');
      }

      res.json({
        success: true,
        message: 'Notifikasi berhasil dikirim',
      });
    } catch (error) {
      console.error('Send notification error:', error);
      throw error;
    }
  }
);

/**
 * Broadcast notification to all users (admin only)
 */
router.post(
  '/broadcast',
  authenticate,
  [
    body('title').isString().notEmpty().withMessage('Title harus diisi'),
    body('body').isString().notEmpty().withMessage('Body harus diisi'),
    body('url').optional().isString(),
  ],
  validateRequest,
  async (req: AuthRequest, res) => {
    try {
      const { title, body: notificationBody, url } = req.body;
      const adminUserId = req.user!.id;

      // Verify admin role
      const { data: adminProfile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', adminUserId)
        .single();

      if (!adminProfile || !['admin', 'superadmin'].includes(adminProfile.role)) {
        throw ApiError.forbidden('Hanya admin yang dapat broadcast notifikasi');
      }

      // Get all users with FCM tokens
      const { data: profiles, error } = await supabaseAdmin
        .from('profiles')
        .select('id, fcm_token, name')
        .not('fcm_token', 'is', null);

      if (error) {
        throw ApiError.internal('Gagal mengambil daftar user');
      }

      // Send to each user (in production, use FCM topic subscription instead)
      let successCount = 0;
      const results = await Promise.allSettled(
        (profiles || []).map(async (profile) => {
          const success = await sendFCMNotification({
            to: profile.fcm_token,
            notification: {
              title,
              body: notificationBody,
              icon: '/logo-button.png',
              click_action: url || '/',
            },
            data: {
              url: url || '/',
              type: 'broadcast',
            },
          });
          return success;
        })
      );

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          successCount++;
        }
      });

      res.json({
        success: true,
        message: `Notifikasi berhasil dikirim ke ${successCount} user`,
        data: {
          total: profiles?.length || 0,
          success: successCount,
          failed: (profiles?.length || 0) - successCount,
        },
      });
    } catch (error) {
      console.error('Broadcast notification error:', error);
      throw error;
    }
  }
);

export default router;
