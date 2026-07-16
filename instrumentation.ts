// Sentry Instrumentation
// This file is loaded before any application code
export async function register() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Import Sentry only when DSN is configured
    const Sentry = await import('@sentry/nextjs');

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      enabled: process.env.NODE_ENV === 'production',
    });
  }
}
