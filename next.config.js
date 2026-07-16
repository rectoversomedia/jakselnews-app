/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jakselnews.com',
      },
      {
        protocol: 'https',
        hostname: '**.jakselnews.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
    ],
  },
};

// Sentry configuration - disable in development
const shouldEnableSentry = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only wrap with Sentry if DSN is configured
let finalConfig = nextConfig;

if (shouldEnableSentry) {
  const withSentryConfig = require('@sentry/nextjs').withSentryConfig;
  finalConfig = withSentryConfig(nextConfig, {
    silent: false,
  });
}

module.exports = finalConfig;
