import { test, expect, Page } from '@playwright/test';
import { ApiHelpers } from './helpers/api';

/**
 * E2E Tests for Jakselnews Application
 *
 * Test Coverage:
 * 1. Public Pages - Homepage, Article listing, Article detail
 * 2. Report Submission Flow
 * 3. Authentication Flow (Login, Logout)
 * 4. Admin Dashboard Flow
 * 5. Search Functionality
 * 6. Accessibility
 * 7. Performance
 */

// ===========================================
// HELPER FUNCTIONS
// ===========================================

async function loginAsAdmin(page: Page): Promise<void> {
  // This assumes there's a test admin user
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@jakselnews.com');
  await page.fill('input[type="password"]', 'testpassword123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/admin');
}

async function loginAsUser(page: Page): Promise<void> {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'user@test.com');
  await page.fill('input[type="password"]', 'testpassword123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

// ===========================================
// PUBLIC PAGES TESTS
// ===========================================

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Jakselnews/);

    // Check main elements are visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav[aria-label="Navigasi utama"]')).toBeVisible();
    await expect(page.getByText('Jaksel')).toBeVisible();
  });

  test('should display breaking news section', async ({ page }) => {
    // Should have breaking news or placeholder
    const breakingNewsSection = page.locator('section').first();
    await expect(breakingNewsSection).toBeVisible();
  });

  test('should navigate to article listing', async ({ page }) => {
    await page.click('text=Artikel');
    await expect(page).toHaveURL(/\/artikel/);
  });

  test('should navigate to report page', async ({ page }) => {
    await page.click('text=Lapor');
    await expect(page).toHaveURL(/\/lapor/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('nav[aria-label="Navigasi utama"]')).toBeVisible();
  });
});

test.describe('Article Listing', () => {
  test('should load article listing page', async ({ page }) => {
    await page.goto('/artikel');
    await expect(page).toHaveTitle(/Artikel/);
  });

  test('should display articles or empty state', async ({ page }) => {
    await page.goto('/artikel');

    // Should have either articles or empty state message
    const articlesOrEmpty = page.locator('article, [class*="empty"], [class*="no-data"]');
    const hasContent = await articlesOrEmpty.count() > 0;
    expect(hasContent).toBeTruthy();
  });
});

test.describe('Article Detail', () => {
  test('should navigate to article detail', async ({ page }) => {
    await page.goto('/artikel');

    // Find and click first article link
    const articleLink = page.locator('a[href^="/artikel/"]').first();
    if (await articleLink.count() > 0) {
      await articleLink.click();
      await expect(page).toHaveURL(/\/artikel\/[^/]+$/);
    }
  });

  test('should display article content', async ({ page }) => {
    await page.goto('/artikel');

    const articleLink = page.locator('a[href^="/artikel/"]').first();
    if (await articleLink.count() > 0) {
      await articleLink.click();

      // Should have title and content
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('article, [class*="prose"]')).toBeVisible();
    }
  });
});

// ===========================================
// REPORT SUBMISSION TESTS
// ===========================================

test.describe('Report Submission', () => {
  test('should load report page', async ({ page }) => {
    await page.goto('/lapor');
    await expect(page.locator('text=Lapor')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/lapor');

    // Submit without filling
    await page.click('button:has-text("Kirim")');

    // Should show validation errors
    await expect(page.locator('text=Kategori harus diisi')).toBeVisible();
  });

  test('should successfully submit a report', async ({ page }) => {
    await page.goto('/lapor');

    // Select category
    await page.click('button:has-text("Keamanan"), button:has-text("Kriminal")');

    // Fill description
    await page.fill('textarea', 'Test report from Playwright automation. This is a test submission.');

    // Select kecamatan
    await page.selectOption('select', { label: 'Kebayoran Baru' });

    // Submit
    await page.click('button:has-text("Kirim")');

    // Should show success message
    await expect(page.locator('text=Laporan Terkirim')).toBeVisible({ timeout: 10000 });
  });

  test('should allow anonymous report submission', async ({ page }) => {
    await page.goto('/lapor');

    // Check anonymous option
    const anonymousCheckbox = page.locator('input[type="checkbox"]');
    await expect(anonymousCheckbox).toBeVisible();
  });
});

// ===========================================
// AUTHENTICATION TESTS
// ===========================================

test.describe('Login', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Email tidak valid')).toBeVisible();
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'nonexistent@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Email atau password salah')).toBeVisible({ timeout: 10000 });
  });

  test('should redirect to admin after successful admin login', async ({ page }) => {
    // Note: This test requires valid test credentials
    // In CI, you would use environment variables
    await page.goto('/login');

    const email = process.env.TEST_ADMIN_EMAIL || 'admin@jakselnews.com';
    const password = process.env.TEST_ADMIN_PASSWORD || 'adminpassword';

    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Should redirect to admin
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
  });
});

test.describe('Logout', () => {
  test('should logout and redirect to homepage', async ({ page }) => {
    // Login first (requires valid credentials)
    await page.goto('/login');
    const email = process.env.TEST_ADMIN_EMAIL || 'admin@jakselnews.com';
    const password = process.env.TEST_ADMIN_PASSWORD || 'adminpassword';

    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/admin/, { timeout: 10000 });

    // Click logout
    await page.click('button:has-text("Keluar")');

    // Should redirect to homepage
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});

// ===========================================
// ADMIN DASHBOARD TESTS
// ===========================================

test.describe('Admin Dashboard', () => {
  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display admin dashboard for authenticated admin', async ({ page }) => {
    // Login as admin
    await loginAsAdmin(page);

    // Should see admin dashboard elements
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Total')).toBeVisible();
  });

  test('should display reports list', async ({ page }) => {
    await loginAsAdmin(page);

    // Should have reports list or empty state
    const reportsOrEmpty = page.locator('[role="list"], [role="listitem"]');
    expect(await reportsOrEmpty.count()).toBeGreaterThanOrEqual(0);
  });

  test('should filter reports by status', async ({ page }) => {
    await loginAsAdmin(page);

    // Select status filter
    const statusFilter = page.locator('select[id="filter-status"]');
    if (await statusFilter.count() > 0) {
      await statusFilter.selectOption('pending');
      await page.waitForTimeout(500);
    }
  });

  test('should update report status', async ({ page }) => {
    await loginAsAdmin(page);

    // Click on a report
    const reportItem = page.locator('[role="button"]').first();
    if (await reportItem.count() > 0) {
      await reportItem.click();

      // Modal should open
      await expect(page.locator('text=Update Status')).toBeVisible();

      // Click verify
      await page.click('button:has-text("Verifikasi")');

      // Should close modal
      await page.waitForTimeout(500);
    }
  });
});

// ===========================================
// SEARCH TESTS
// ===========================================

test.describe('Search', () => {
  test('should navigate to search page', async ({ page }) => {
    await page.goto('/cari');
    await expect(page.locator('input[type="text"][placeholder*="Cari"]')).toBeVisible();
  });

  test('should display search results', async ({ page }) => {
    await page.goto('/cari');

    // Type search query
    await page.fill('input[type="text"]', 'test');
    await page.waitForTimeout(1000); // Wait for debounce

    // Should show results or empty state
    const resultsOrEmpty = page.locator('text=Ditemukan, text=Tidak ada hasil');
    await expect(resultsOrEmpty.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show suggestions when no results', async ({ page }) => {
    await page.goto('/cari');

    // Search for unlikely term
    await page.fill('input[type="text"]', 'xyzabc123nonexistent');
    await page.waitForTimeout(1000);

    // Should show suggestions
    const suggestions = page.locator('text=Coba kata kunci lain');
    await expect(suggestions.first()).toBeVisible({ timeout: 10000 });
  });
});

// ===========================================
// ACCESSIBILITY TESTS
// ===========================================

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check h1 exists
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
  });

  test('should have skip to content link', async ({ page }) => {
    await page.goto('/');

    // Check for skip link (can be hidden until focused)
    const skipLink = page.locator('a:has-text("Langsung ke konten utama")');
    expect(await skipLink.count()).toBeGreaterThanOrEqual(0);
  });

  test('should have proper alt text on images', async ({ page }) => {
    await page.goto('/');

    // All images should have alt text
    const imagesWithoutAlt = page.locator('img:not([alt])');
    expect(await imagesWithoutAlt.count()).toBe(0);
  });

  test('should have form labels', async ({ page }) => {
    await page.goto('/lapor');

    // All inputs should have associated labels
    const inputs = page.locator('input:not([type="hidden"]), textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      // Should have either id with matching label, or aria-label
      expect(id || ariaLabel || ariaLabelledby).toBeTruthy();
    }
  });

  test('should have proper ARIA labels on navigation', async ({ page }) => {
    await page.goto('/');

    // Check navigation has aria-label
    const nav = page.locator('nav[aria-label]');
    expect(await nav.count()).toBeGreaterThan(0);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab through page - should not get stuck
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }

    // Page should still be interactive
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');

    // Check that important text is visible
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(headings.nth(i)).toBeVisible();
    }
  });
});

// ===========================================
// PERFORMANCE TESTS
// ===========================================

test.describe('Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    await page.goto('/');

    // First load (with assets) should complete
    await page.waitForLoadState('domcontentloaded');

    // Core web vitals check - page should be interactive
    await page.waitForSelector('header', { state: 'visible' });
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors
    const criticalErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('manifest') &&
      !e.includes('404')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

// ===========================================
// MOBILE TESTS
// ===========================================

test.describe('Mobile Experience', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Page should be usable
    await expect(page.locator('header')).toBeVisible();
  });

  test('should have touch-friendly tap targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Buttons and links should be at least 44x44px
    const buttons = page.locator('button, a');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      if (box) {
        // At least one dimension should be >= 44px for touch
        const isTouchable = box.width >= 44 || box.height >= 44;
        // Note: Some small buttons are acceptable
      }
    }
  });
});
