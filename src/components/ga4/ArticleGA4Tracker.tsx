'use client';

import { useEffect } from 'react';
import { useGA4 } from '@/hooks/useGA4';
import {
  trackArticleView,
  trackArticleShare,
  trackArticleSave,
  trackCommentRead,
  trackCommentSubmit,
} from '@/lib/ga4';

interface ArticleTrackerProps {
  articleId: string | number;
  articleTitle: string;
  articleSlug: string;
  category?: string;
  author?: string;
  publishedDate?: string;
  commentCount?: number;
}

export function ArticleGA4Tracker({
  articleId,
  articleTitle,
  articleSlug,
  category,
  author,
  publishedDate,
  commentCount = 0,
}: ArticleTrackerProps) {
  useGA4();

  useEffect(() => {
    // Track article view
    trackArticleView({
      articleId,
      articleTitle,
      articleSlug,
      category,
      author,
      publishedDate,
    });

    // Track comment read
    if (commentCount > 0) {
      trackCommentRead({
        contentType: 'article',
        contentId: articleId,
        commentCount,
      });
    }
  }, [articleId, articleTitle, articleSlug, category, author, publishedDate, commentCount]);

  return null;
}
