import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

// Routes
import reportsRouter from './routes/reports';
import categoriesRouter from './routes/categories';
import articlesRouter from './routes/articles';
import wordpressRouter from './routes/wordpress';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';
import uploadRouter from './routes/upload';
import notificationsRouter from './routes/notifications';

const app = express();

// ===========================================
// SECURITY MIDDLEWARE
// ===========================================

// Helmet - Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Needed for WordPress content
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://jakselnews.com", "https://*.supabase.co"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Needed for WordPress images
}));

// CORS - Multiple origins support
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = config.getCorsOrigins();

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development, allow all origins
    if (config.isDevelopment) {
      return callback(null, true);
    }

    // Log potential CORS attack
    console.warn(`⚠️ Blocked CORS request from: ${origin}`);

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ===========================================
// RATE LIMITING - Per route configuration
// ===========================================

// Public endpoints (articles, categories, public reports)
const publicLimiter = rateLimit({
  windowMs: config.rateLimit.public.windowMs,
  max: config.rateLimit.public.max,
  message: { success: false, error: 'Terlalu banyak request, coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  message: { success: false, error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests
});

// Report creation rate limiting
const reportsLimiter = rateLimit({
  windowMs: config.rateLimit.reports.windowMs,
  max: config.rateLimit.reports.max,
  message: { success: false, error: 'Terlalu banyak laporan. Coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin endpoints - higher limit
const adminLimiter = rateLimit({
  windowMs: 60000,
  max: 200,
  message: { success: false, error: 'Terlalu banyak request admin.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters to routes
app.use('/api/articles', publicLimiter);
app.use('/api/categories', publicLimiter);
app.use('/api/wordpress', publicLimiter);
app.use('/api/reports/stats', publicLimiter);
app.use('/api/reports/statuses', publicLimiter);

// Auth routes - strictest
app.use('/api/auth', authLimiter);

// Reports - POST needs stricter limits
app.use('/api/reports', reportsLimiter);

// Admin routes
app.use('/api/admin', adminLimiter);

// ===========================================
// BODY PARSING
// ===========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ===========================================
// LOGGING
// ===========================================
if (config.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ===========================================
// HEALTH CHECK
// ===========================================
app.get('/api/health', async (req, res) => {
  const start = Date.now();

  try {
    // Check Supabase connection
    const { supabase } = await import('./config/supabase');
    const { error } = await supabase.from('profiles').select('id').limit(1);

    const latency = Date.now() - start;

    res.json({
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString(),
      latency: `${latency}ms`,
      environment: config.NODE_ENV,
      services: {
        database: error ? 'unhealthy' : 'healthy',
        api: 'healthy',
      },
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      status: 'degraded',
      timestamp: new Date().toISOString(),
      latency: `${Date.now() - start}ms`,
      services: {
        database: 'unhealthy',
        api: 'healthy',
      },
    });
  }
});

// Detailed health check
app.get('/api/health/detailed', async (req, res) => {
  const start = Date.now();
  const checks: Record<string, any> = {};

  // Database check
  try {
    const { supabase } = await import('./config/supabase');
    const { error } = await supabase.from('profiles').select('id').limit(1);
    checks.database = {
      status: error ? 'error' : 'ok',
      latency: `${Date.now() - start}ms`,
    };
  } catch (e: any) {
    checks.database = { status: 'error', error: e.message };
  }

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    checks,
  });
});

// ===========================================
// API ROUTES
// ===========================================
app.use('/api/reports', reportsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/wordpress', wordpressRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/notifications', notificationsRouter);

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint tidak ditemukan',
    path: req.path,
  });
});

// Global error handler
app.use(errorHandler);

// ===========================================
// GRACEFUL SHUTDOWN
// ===========================================
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// ===========================================
// START SERVER
// ===========================================
app.listen(config.PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Jakselnews API Server                               ║
║                                                           ║
║   Environment: ${(config.isProduction ? 'PRODUCTION 🔴' : 'DEVELOPMENT 🟢').padEnd(46)}║
║   Port: ${String(config.PORT).padEnd(52)}║
║   WordPress: ${config.WORDPRESS_URL.padEnd(46)}║
║   CORS Origins: ${config.getCorsOrigins().join(', ').substring(0, 46).padEnd(46)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
