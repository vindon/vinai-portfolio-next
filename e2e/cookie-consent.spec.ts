import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Cookie consent', () => {
  test.beforeEach(async ({ page }) => {
    // The banner has a .3s entrance animation; sampling color contrast
    // mid-fade gives a false low-contrast reading (both fg/bg blend toward
    // the page background as opacity ramps from 0->1). Reduced motion
    // renders it at its final opacity from first paint — see the matching
    // note in a11y.spec.ts for the same issue with .reveal elsewhere.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
  });

  test('shows the banner on first visit with no accessibility violations', async ({ page }) => {
    const banner = page.locator('.cookie-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('Cloudflare Web Analytics');

    const results = await new AxeBuilder({ page }).include('.cookie-banner').analyze();
    expect(results.violations).toEqual([]);
  });

  test('accepting hides the banner, persists the choice, and loads the beacon script', async ({ page }) => {
    await page.getByRole('button', { name: 'Accept' }).click();
    await expect(page.locator('.cookie-banner')).toBeHidden();

    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('firstbloc-cookie-consent')))
      .toBe('accepted');
    await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(1);

    // The choice persists across a reload — the banner doesn't reappear.
    await page.reload();
    await expect(page.locator('.cookie-banner')).toBeHidden();
  });

  test('declining hides the banner, persists the choice, and never loads the beacon script', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Decline' }).click();
    await expect(page.locator('.cookie-banner')).toBeHidden();

    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('firstbloc-cookie-consent')))
      .toBe('declined');
    await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);

    await page.reload();
    await expect(page.locator('.cookie-banner')).toBeHidden();
    await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);
  });
});
