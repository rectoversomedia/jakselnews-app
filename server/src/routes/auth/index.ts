import { Router } from 'express';
import { body } from 'express-validator';
import { supabase } from '../config/supabase';
import { config } from '../config';
import { ApiError } from '../middleware/errorHandler';
import { validateRequest } from '../middleware/validate';
import { authenticate, AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

// Register new admin/user (for initial setup)
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

      // Check if user already exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        throw ApiError.badRequest('Email sudah terdaftar');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: hashedPassword,
        email_confirm: true,
        user_metadata: {
          name,
          phone,
        },
      });

      if (authError) {
        throw ApiError.badRequest('Gagal membuat akun');
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

      // Get user from auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        throw ApiError.unauthorized('Email atau password salah');
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      // Create JWT token
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
  ],
  validateRequest,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { name, phone } = req.body;

      const { data, error } = await supabase
        .from('profiles')
        .update({
          name,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
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

// Logout (client-side token removal, but we can invalidate if needed)
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Logout berhasil',
  });
});

export default router;
