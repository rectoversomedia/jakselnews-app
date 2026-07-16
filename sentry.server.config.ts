import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',

  // Server-side sampling
  tracesSampler: (samplingContext) => {
    // Ignore health checks
    if (samplingContext.request?.url?.includes('/api/health')) {
      return 0;
    }
    return 0.1;
  },

  ignoreErrors: [
    'chrome-extension://',
    'safari-extension://',
    'TypeError: Failed to fetch',
    'TypeError: NetworkError',
  ],

  attachStacktrace: true,
  sendClientReports: true,
  sampleRate: 1,
});
