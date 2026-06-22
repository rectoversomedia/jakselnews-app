/**
 * Image Resizer Utility for Jakselnews
 *
 * Provides optimized image URLs and loading strategies
 * to reduce page weight and improve loading performance.
 */

export type ImageSize = 'thumbnail' | 'medium' | 'medium_large' | 'large' | 'full';

export interface ImageOptions {
  /** Target width in pixels */
  width?: number;
  /** Target height in pixels */
  height?: number;
  /** Quality (1-100) for lossy compression */
  quality?: number;
  /** Enable lazy loading */
  lazy?: boolean;
  /** Add blur placeholder */
  blur?: boolean;
  /** Image fit mode */
  fit?: 'cover' | 'contain' | 'fill' | 'scale-down';
}

export interface ResizedImage {
  url: string;
  width: number;
  height: number;
  alt?: string;
  blurDataUrl?: string;
}

// WordPress image size configurations
const WP_IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  medium: { width: 300, height: 300 },
  medium_large: { width: 768, height: 0 }, // 0 means auto
  large: { width: 1024, height: 1024 },
  full: { width: 0, height: 0 },
} as const;

// Base64 blur placeholder (1x1 transparent pixel)
const BLUR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjwvc3ZnPg==';

/**
 * Get the best WordPress image size based on container width
 */
export function getBestImageSize(containerWidth: number): ImageSize {
  if (containerWidth <= 150) return 'thumbnail';
  if (containerWidth <= 300) return 'medium';
  if (containerWidth <= 768) return 'medium_large';
  if (containerWidth <= 1024) return 'large';
  return 'full';
}

/**
 * Extract image URL from WordPress media object
 */
export function getWordPressImageUrl(
  media: any,
  size: ImageSize | 'full' = 'medium_large'
): string | null {
  if (!media) return null;

  // Try to get specific size
  if (size !== 'full' && media.media_details?.sizes?.[size]?.source_url) {
    return media.media_details.sizes[size].source_url;
  }

  // Fallback to full size
  return media.source_url || null;
}

/**
 * Build optimized image URL with size parameters
 * Supports various image CDN/services
 */
export function buildOptimizedImageUrl(
  url: string,
  options: ImageOptions = {}
): string {
  if (!url) return '';

  const { width, height, quality = 80 } = options;

  // WordPress.com image optimization
  if (url.includes('files.wordpress.com') || url.includes('jetpack.wordpress.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality !== 80) params.set('q', quality.toString());
    params.set('fit', options.fit || 'cover');

    return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
  }

  // Cloudflare Images
  if (url.includes('cloudflare.com')) {
    const params = new URLSearchParams();
    if (width) params.set('width', width.toString());
    if (height) params.set('height', height.toString());
    if (quality !== 80) params.set('quality', quality.toString());

    return `${url}?${params.toString()}`;
  }

  // imgix
  if (url.includes('imgix.net')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality !== 80) params.set('q', quality.toString());
    params.set('fit', options.fit || 'crop');
    params.set('auto', 'compress,format');

    return `${url}?${params.toString()}`;
  }

  // Self-hosted WordPress with common image plugins
  // Add .resize suffix for Imagick-based setups
  if (url.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
    // Simple query param fallback for basic resizing
    const separator = url.includes('?') ? '&' : '?';
    if (width) {
      return `${url}${separator}w=${width}`;
    }
  }

  return url;
}

/**
 * Generate responsive srcset string
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 960, 1280, 1920],
  options: ImageOptions = {}
): string {
  if (!baseUrl) return '';

  return sizes
    .map((size) => {
      const optimizedUrl = buildOptimizedImageUrl(baseUrl, { ...options, width: size });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(
  breakpoints: { size: string; width: number }[] = [
    { size: '(max-width: 640px) 100vw', width: 640 },
    { size: '(max-width: 1024px) 50vw', width: 1024 },
    { size: '33vw', width: 1920 },
  ]
): string {
  return breakpoints.map((bp) => `${bp.size}`).join(', ');
}

/**
 * Get WordPress featured image with optimal sizing
 */
export function getOptimizedFeaturedImage(
  post: any,
  containerWidth: number = 768,
  options: Partial<ImageOptions> = {}
): ResizedImage {
  const media = post?._embedded?.['wp:featuredmedia']?.[0];

  if (!media) {
    return {
      url: '',
      width: 0,
      height: 0,
    };
  }

  // Determine best size based on container width
  const bestSize = getBestImageSize(containerWidth);
  const sizeConfig = WP_IMAGE_SIZES[bestSize as keyof typeof WP_IMAGE_SIZES];

  const sourceUrl = media.source_url || '';
  const sizes = media.media_details?.sizes || {};
  const sizeData = sizes[bestSize] || sizes.medium_large || sizes.large || {
    source_url: sourceUrl,
    width: containerWidth,
    height: Math.round(containerWidth * 0.625),
  };

  // Calculate responsive dimensions
  const aspectRatio = media.media_details?.width
    ? media.media_details.height / media.media_details.width
    : 0.625; // Default 16:10

  const width = options.width || sizeConfig.width || containerWidth;
  const height = options.height || (sizeConfig.height === 0 ? Math.round(width * aspectRatio) : sizeConfig.height);

  // Build optimized URL
  const optimizedUrl = buildOptimizedImageUrl(sizeData.source_url || sourceUrl, {
    width,
    height,
    quality: options.quality || 80,
    fit: options.fit || 'cover',
  });

  return {
    url: optimizedUrl,
    width,
    height,
    alt: media.alt_text || post.title?.rendered || '',
    blurDataUrl: options.blur ? BLUR_PLACEHOLDER : undefined,
  };
}

/**
 * Preload critical images
 */
export function preloadImage(url: string): void {
  if (typeof window === 'undefined' || !url) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 */
export function setupLazyImages(): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );

  // Observe images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach((img) => {
    observer.observe(img);
  });

  // Return cleanup function
  return () => observer.disconnect();
}

/**
 * Calculate optimal image dimensions for different viewports
 */
export function getResponsiveImageDimensions(
  baseWidth: number,
  baseHeight: number,
  viewport: 'mobile' | 'tablet' | 'desktop' = 'mobile'
): { width: number; height: number } {
  const multipliers = {
    mobile: 1,
    tablet: 1.5,
    desktop: 2,
  };

  const multiplier = multipliers[viewport];
  const width = Math.round(baseWidth * multiplier);
  const height = Math.round(baseHeight * multiplier);

  return { width, height };
}

/**
 * Create blur hash placeholder from image URL (placeholder)
 */
export function createBlurPlaceholder(): string {
  return BLUR_PLACEHOLDER;
}

// Export default config
export const imageConfig = {
  defaultQuality: 80,
  defaultFormat: 'webp' as const,
  breakpoints: [320, 640, 768, 1024, 1280, 1920],
  sizes: WP_IMAGE_SIZES,
};
