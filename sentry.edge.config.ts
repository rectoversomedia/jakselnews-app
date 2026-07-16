import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',

  // Minimal sampling for edge
  tracesSampler: () => 0.01,

  ignoreErrors: [
    'chrome-extension://',
    'safari-extension://',
  ],

  sampleRate: 1,
});
