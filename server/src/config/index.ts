import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables in production
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);

if (process.env.NODE_ENV === 'production') {
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Additional security check for JWT secret
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long for security');
  }

  // Warn if using default CORS
  if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === 'http://localhost:3000') {
    console.warn('⚠️ WARNING: CORS_ORIGIN is not set properly for production!');
  }
}

export const config = {
  // Server
  PORT: parseInt(process.env.PORT || '5000'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || '',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // WordPress
  WORDPRESS_URL: process.env.WORDPRESS_URL || 'https://jakselnews.com',
  WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'https://jakselnews.com/wp-json/wp/v2',

  // CORS - Support multiple origins (comma separated)
  getCorsOrigins: (): string[] => {
    const origins = process.env.CORS_ORIGIN || 'http://localhost:3000';
    return origins.split(',').map(o => o.trim());
  },

  // Rate Limiting - Per route
  rateLimit: {
    public: {
      windowMs: parseInt(process.env.RATE_LIMIT_PUBLIC_WINDOW_MS || '60000'),
      max: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || '100'),
    },
    auth: {
      windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '900000'), // 15 min
      max: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '5'),
    },
    reports: {
      windowMs: parseInt(process.env.RATE_LIMIT_REPORTS_WINDOW_MS || '60000'),
      max: parseInt(process.env.RATE_LIMIT_REPORTS_MAX || '10'),
    },
  },

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

// Log startup info (without sensitive data)
console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Jakselnews API Server                               ║
║                                                           ║
║   Environment: ${(config.isProduction ? 'PRODUCTION 🔴' : 'DEVELOPMENT 🟢').padEnd(46)}║
║   Port: ${String(config.PORT).padEnd(52)}║
║   WordPress: ${config.WORDPRESS_URL.padEnd(46)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);

if (config.isProduction) {
  console.log('🔒 Production mode - running with enhanced security');
}
