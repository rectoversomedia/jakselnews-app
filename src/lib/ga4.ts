/**
 * GA4 Integration for Jakselnews
 * Measurement ID: G-FPGHXR7H16
 */

// GA4 gtag function types
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = 'G-FPGHXR7H16';

/**
 * Initialize GA4 - call this once in layout.tsx
 */
export function initGA() {
  if (typeof window === 'undefined') return;

  // Skip if already initialized
  if (window.dataLayer) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth(percentage: number) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'scroll_depth', {
    scroll_depth_percentage: percentage,
    scroll_depth_threshold: Math.floor(percentage / 25) * 25, // 0, 25, 50, 75, 100
  });
}

/**
 * Track time on page (when user leaves)
 */
export function trackTimeOnPage(seconds: number) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'time_on_page', {
    time_on_page_seconds: seconds,
    time_on_page_tier: seconds < 30 ? 'short' : seconds < 120 ? 'medium' : 'long',
  });
}

// ─── Custom Event Functions ────────────────────────────────────────────────

/**
 * Article/Content Events
 */
export function trackArticleView(params: {
  articleId: string | number;
  articleTitle: string;
  articleSlug: string;
  category?: string;
  author?: string;
  publishedDate?: string;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'article_view', {
    article_id: params.articleId,
    article_title: params.articleTitle,
    article_slug: params.articleSlug,
    article_category: params.category || 'uncategorized',
    article_author: params.author || 'unknown',
    article_published_date: params.publishedDate || '',
    content_type: 'article',
  });
}

export function trackArticleShare(params: {
  articleId: string | number;
  articleTitle: string;
  platform: 'whatsapp' | 'instagram' | 'tiktok' | 'facebook' | 'copy_link';
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'share', {
    content_type: 'article',
    item_id: String(params.articleId),
    article_title: params.articleTitle,
    share_platform: params.platform,
  });
}

export function trackArticleSave(articleId: string | number, articleTitle: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'save_content', {
    content_type: 'article',
    item_id: String(articleId),
    article_title: articleTitle,
  });
}

/**
 * Search Events
 */
export function trackSearch(params: {
  searchTerm: string;
  resultCount: number;
  searchType: 'articles' | 'reports' | 'all';
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'search', {
    search_term: params.searchTerm,
    search_result_count: params.resultCount,
    search_type: params.searchType,
    search_has_results: params.resultCount > 0,
  });
}

/**
 * Report/Info Terkini Events
 */
export function trackReportSubmit(params: {
  reportId: string | number;
  category: string;
  kecamatan?: string;
  hasMedia: boolean;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'report_submit', {
    report_id: String(params.reportId),
    report_category: params.category,
    report_kecamatan: params.kecamatan || '',
    report_has_media: params.hasMedia,
  });
}

export function trackReportUpvote(reportId: string | number, category: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'upvote', {
    item_id: String(reportId),
    content_type: 'report',
    report_category: category,
  });
}

export function trackReportShare(params: {
  reportId: string | number;
  platform: 'whatsapp' | 'instagram' | 'tiktok' | 'facebook' | 'copy_link';
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'share', {
    content_type: 'report',
    item_id: String(params.reportId),
    share_platform: params.platform,
  });
}

/**
 * Comment Events
 */
export function trackCommentSubmit(params: {
  contentType: 'article' | 'report';
  contentId: string | number;
  commentLength: number;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'submit_comment', {
    content_type: params.contentType,
    content_id: String(params.contentId),
    comment_length: params.commentLength,
    comment_length_tier: params.commentLength < 50 ? 'short' : params.commentLength < 200 ? 'medium' : 'long',
  });
}

export function trackCommentRead(params: {
  contentType: 'article' | 'report';
  contentId: string | number;
  commentCount: number;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'view_comments', {
    content_type: params.contentType,
    content_id: String(params.contentId),
    comment_count: params.commentCount,
  });
}

/**
 * Laporan Form Events
 */
export function trackLaporanFormStart() {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'form_start', {
    form_name: 'laporan_warga',
  });
}

export function trackLaporanSubmit(params: {
  category: string;
  kecamatan?: string;
  kelurahan?: string;
  hasMedia: boolean;
  mediaCount: number;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'form_submit', {
    form_name: 'laporan_warga',
    form_category: params.category,
    form_kecamatan: params.kecamatan || '',
    form_kelurahan: params.kelurahan || '',
    form_has_media: params.hasMedia,
    form_media_count: params.mediaCount,
  });
}

export function trackLaporanFormAbandon(fieldsCompleted: number, totalFields: number) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'form_abandon', {
    form_name: 'laporan_warga',
    form_fields_completed: fieldsCompleted,
    form_fields_total: totalFields,
    form_completion_rate: Math.round((fieldsCompleted / totalFields) * 100),
  });
}

/**
 * Navigation / Menu Events
 */
export function trackNavigationClick(params: {
  menuItem: string;
  pageFrom: string;
  pageTo: string;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'navigation_click', {
    menu_item: params.menuItem,
    page_from: params.pageFrom,
    page_to: params.pageTo,
  });
}

/**
 * Layanan / Service Events
 */
export function trackServiceClick(params: {
  serviceId: string | number;
  serviceName: string;
  serviceCategory?: string;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'service_click', {
    service_id: String(params.serviceId),
    service_name: params.serviceName,
    service_category: params.serviceCategory || '',
    content_type: 'service',
  });
}

export function trackExternalLinkClick(params: {
  linkName: string;
  linkUrl: string;
  linkCategory?: string;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  // Extract domain for privacy
  let domain = '';
  try {
    domain = new URL(params.linkUrl).hostname;
  } catch {
    domain = 'unknown';
  }
  window.gtag('event', 'external_link_click', {
    link_name: params.linkName,
    link_domain: domain,
    link_category: params.linkCategory || '',
  });
}

/**
 * Category Browse Events
 */
export function trackCategoryBrowse(params: {
  categorySlug: string;
  categoryName: string;
  itemCount: number;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'browse_category', {
    category_slug: params.categorySlug,
    category_name: params.categoryName,
    items_returned: params.itemCount,
  });
}

/**
 * Breaking News Events
 */
export function trackBreakingNewsView(params: {
  articleId: string | number;
  articleTitle: string;
  position: number;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'breaking_news_view', {
    article_id: String(params.articleId),
    article_title: params.articleTitle,
    carousel_position: params.position,
  });
}

export function trackBreakingNewsClick(params: {
  articleId: string | number;
  articleTitle: string;
  position: number;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'breaking_news_click', {
    article_id: String(params.articleId),
    article_title: params.articleTitle,
    carousel_position: params.position,
  });
}

/**
 * Like / Heart Events
 */
export function trackLike(params: {
  contentType: 'article' | 'report';
  contentId: string | number;
  action: 'like' | 'unlike';
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'like_toggle', {
    content_type: params.contentType,
    item_id: String(params.contentId),
    like_action: params.action,
  });
}
