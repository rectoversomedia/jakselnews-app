import { Router } from 'express';
import { body } from 'express-validator';
import { supabase, supabaseAdmin } from '../../config/supabase';
import { config } from '../../config';
import { ApiError } from '../../middleware/errorHandler';
import { validateRequest } from '../../middleware/validate';
import { authenticate, AuthRequest } from '../../middleware/auth';
import jwt from 'jsonwebtoken';

const router = Router();

// Register new user
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    body('name').isString().notEmpty().withMessage('Nama harus diisi'),
    body('phone').optional().isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password, name, phone } = req.body;

      // Check if user already exists in profiles
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        throw ApiError.badRequest('Email sudah terdaftar');
      }

      // Create user in Supabase Auth
      // IMPORTANT: Supabase Auth will hash the password automatically
      // DO NOT hash password before sending to Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password, // Send plain password - Supabase handles hashing
        email_confirm: true,
        user_metadata: {
          name,
          phone: phone || null,
        },
      });

      if (authError) {
        console.error('Supabase Auth error:', authError);
        throw ApiError.badRequest(authError.message === 'User already registered'
          ? 'Email sudah terdaftar'
          : 'Gagal membuat akun');
      }

      // Update profile with additional info
      if (authData.user) {
        await supabaseAdmin
          .from('profiles')
          .update({
            name,
            phone: phone || null,
            email: email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', authData.user.id);
      }

      res.status(201).json({
        success: true,
        message: 'Akun berhasil dibuat',
        data: {
          id: authData.user.id,
          email: authData.user.email,
        },
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').isString().notEmpty().withMessage('Password harus diisi'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Authenticate with Supabase
      // Supabase handles password verification internally
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        throw ApiError.unauthorized('Email atau password salah');
      }

      // Get user profile for role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      // Create JWT token for API authentication
      const token = jwt.sign(
        {
          id: authData.user.id,
          email: authData.user.email,
          role: profile?.role || 'user',
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: 'Login berhasil',
        data: {
          token,
          user: {
            id: authData.user.id,
            email: authData.user.email,
            name: profile?.name || authData.user.user_metadata?.name,
            role: profile?.role || 'user',
            avatar_url: profile?.avatar_url || null,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw ApiError.notFound('Profil tidak ditemukan');
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
});

// Update profile
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().isString(),
    body('phone').optional().isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
    body('avatar_url').optional().isURL().withMessage('URL avatar tidak valid'),
  ],
  validateRequest,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { name, phone, avatar_url } = req.body;

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update profile error:', error);
        throw ApiError.internal('Gagal mengupdate profil');
      }

      res.json({
        success: true,
        message: 'Profil berhasil diupdate',
        data,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
);

// Change password
router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').isString().notEmpty().withMessage('Password saat ini harus diisi'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
  ],
  validateRequest,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;

      // Get user email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (!profile?.email) {
        throw ApiError.notFound('Email tidak ditemukan');
      }

      // Re-authenticate to verify current password
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: currentPassword,
      });

      if (reauthError) {
        throw ApiError.unauthorized('Password saat ini salah');
      }

      // Update password via Supabase Admin (bypass MFA if any)
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      );

      if (updateError) {
        throw ApiError.internal('Gagal mengubah password');
      }

      res.json({
        success: true,
        message: 'Password berhasil diubah',
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
);

// Logout (client-side token removal)
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Logout berhasil',
  });
});

export default router;
