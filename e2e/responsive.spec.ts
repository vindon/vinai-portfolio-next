import { test, expect } from '@playwright/test';

const breakpoints = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

test.describe('Responsive layout', () => {
  test('nav collapses to a hamburger menu below 760px and the toggle works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Toggle menu' });
    await expect(toggle).toBeVisible();

    const nav = page.locator('nav.links');
    await expect(nav).not.toHaveClass(/open/);

    await toggle.click();
    await expect(nav).toHaveClass(/open/);
  });

  test('nav does not show a hamburger above 760px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Toggle menu' })).not.toBeVisible();
  });

  for (const bp of breakpoints) {
    test(`visual regression: full page at ${bp.name} (${bp.width}px)`, async ({ page }) => {
      // Sections below the fold (including the entire Products carousel)
      // fade in via a .reveal -> .reveal.in opacity transition, triggered
      // by an IntersectionObserver against the page viewport — at a fixed
      // breakpoint height they never actually scroll into view during
      // capture, so without this they'd stay at opacity:0 and this
      // "full page" screenshot would silently never show most of the
      // page's real content. Reduced motion makes every .reveal element
      // render at opacity:1 from first paint instead (see globals.css).
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');
      await page.locator('.hero').waitFor();
      await expect(page).toHaveScreenshot(`home-${bp.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});
