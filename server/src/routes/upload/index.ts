import sanitizeHtml from 'sanitize-html';
import { Router } from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

// ===========================================
// SANITIZATION UTILITIES
// ===========================================

/**
 * Sanitize HTML content to prevent XSS attacks
 * Used for WordPress content and user-generated content
 */
export const sanitizeHtmlContent = (dirty: string): string => {
  return sanitizeHtml(dirty, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'strong', 'em', 'b', 'i', 'u', 's',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
      'figure', 'figcaption',
      'iframe' // For embedded content
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
      'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      '*': ['class', 'id', 'style'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      'a': (tagName, attribs) => {
        // Add noopener and noreferrer to external links
        if (attribs.href && attribs.href.startsWith('http')) {
          attribs.rel = 'noopener noreferrer';
          attribs.target = '_blank';
        }
        return { tagName, attribs };
      },
      'img': (tagName, attribs) => {
        // Only allow images from allowed domains
        if (attribs.src && !attribs.src.match(/^(https?:\/\/)?[\w.-]+\.?/)) {
          delete attribs.src;
        }
        // Add lazy loading
        attribs.loading = 'lazy';
        return { tagName, attribs };
      },
    },
  });
};

/**
 * Sanitize plain text input
 * Removes potentially dangerous characters while preserving Indonesian text
 */
export const sanitizeText = (text: string): string => {
  if (!text) return '';

  return text
    // Remove null bytes
    .replace(/\0/g, '')
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Trim whitespace
    .trim()
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Escape HTML entities for display
    .replace(/[<>]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
      };
      return entities[match] || match;
    });
};

/**
 * Sanitize search query
 * Allows alphanumerics, spaces, and common Indonesian characters
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (!query) return '';

  return query
    .replace(/[^\w\s'-]/g, '') // Remove special chars except hyphen, apostrophe
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200); // Limit length
};

/**
 * Sanitize filename for uploads
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename) return '';

  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/\.+/g, '.')
    .trim();
};

// ===========================================
// FILE UPLOAD ROUTES
// ===========================================

const router = Router();

// Configure multer for memory storage (upload to Supabase Storage)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Allowed MIME types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`) as any);
    }
  },
});

// Upload single file
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        throw ApiError.badRequest('Tidak ada file yang diupload');
      }

      const file = req.file;
      const userId = req.user!.id;

      // Generate unique filename
      const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${Date.now()}-${userId.substring(0, 8)}.${ext}`;

      // Upload to Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from('reports-media')
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Supabase Storage error:', error);
        throw ApiError.internal('Gagal mengupload file');
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('reports-media')
        .getPublicUrl(data.path);

      res.json({
        success: true,
        message: 'File berhasil diupload',
        data: {
          url: publicUrl,
          filename: data.path,
          size: file.size,
          mimetype: file.mimetype,
        },
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.message?.includes('File type')) {
        throw ApiError.badRequest(error.message);
      }
      throw error;
    }
  }
);

// Upload multiple files
router.post(
  '/upload/multiple',
  authenticate,
  upload.array('files', 5), // Max 5 files
  async (req: AuthRequest, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw ApiError.badRequest('Tidak ada file yang diupload');
      }

      const userId = req.user!.id;
      const uploadedFiles = [];

      for (const file of files) {
        const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
        const filename = `${Date.now()}-${userId.substring(0, 8)}-${Math.random().toString(36).substring(7)}.${ext}`;

        const { data, error } = await supabaseAdmin.storage
          .from('reports-media')
          .upload(filename, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.error('Supabase Storage error:', error);
          continue; // Skip failed uploads
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('reports-media')
          .getPublicUrl(data.path);

        uploadedFiles.push({
          url: publicUrl,
          filename: data.path,
          size: file.size,
          mimetype: file.mimetype,
        });
      }

      res.json({
        success: true,
        message: `${uploadedFiles.length} file berhasil diupload`,
        data: uploadedFiles,
      });
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }
);

// Delete uploaded file
router.delete(
  '/delete',
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { filename } = req.body;

      if (!filename) {
        throw ApiError.badRequest('Nama file diperlukan');
      }

      // Verify ownership (filename should contain user ID)
      const userId = req.user!.id;
      if (!filename.includes(userId.substring(0, 8))) {
        throw ApiError.forbidden('Tidak memiliki akses ke file ini');
      }

      const { error } = await supabaseAdmin.storage
        .from('reports-media')
        .remove([filename]);

      if (error) {
        throw ApiError.internal('Gagal menghapus file');
      }

      res.json({
        success: true,
        message: 'File berhasil dihapus',
      });
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }
);

export default router;
