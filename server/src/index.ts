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

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: { success: false, error: 'Terlalu banyak request, coba lagi nanti.' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/reports', reportsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/wordpress', wordpressRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Jakselnews API Server                           ║
║                                                       ║
║   Environment: ${config.NODE_ENV.padEnd(40)}║
║   Port: ${String(config.PORT).padEnd(50)}║
║   WordPress: ${config.WORDPRESS_URL.padEnd(40)}║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
