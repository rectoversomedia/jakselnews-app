import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Performance monitoring
  tracesSampler: (samplingContext) => {
    // Ignore health checks
    if (samplingContext.request?.url?.includes('/api/health')) {
      return 0;
    }
    return 0.1; // Sample 10% of transactions
  },

  // Set environment
  environment: process.env.NODE_ENV,

  // Don't send errors in development
  enabled: process.env.NODE_ENV === 'production',

  // Ignore errors from these paths/patterns
  ignoreErrors: [
    // Browser extensions
    'chrome-extension://',
    'safari-extension://',
    // Third party scripts
    'Intercom',
    // Ignore network errors (handled separately)
    'TypeError: Failed to fetch',
    'TypeError: NetworkError',
  ],

  // Attach stacktrace to messages
  attachStacktrace: true,

  // Send minified events
  sendClientReports: true,

  // Sample rate for errors (100% of errors, but sampled by tracesSampler)
  sampleRate: 1,

  // Replay settings for better debugging
  replaysOnErrorSampleRate: 1.0,
});
