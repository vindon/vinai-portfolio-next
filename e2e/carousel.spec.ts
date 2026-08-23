import { test, expect } from '@playwright/test';

test.describe('Products carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#products').scrollIntoViewIfNeeded();
  });

  test('next arrow advances and disables at the last card; prev arrow disables at the first card', async ({ page }) => {
    const prevArrow = page.getByRole('button', { name: 'Previous product' });
    const nextArrow = page.getByRole('button', { name: 'Next product' });

    await expect(prevArrow).toBeDisabled();
    await expect(nextArrow).toBeEnabled();

    for (let i = 0; i < 5; i++) {
      if (await nextArrow.isDisabled()) break;
      await nextArrow.click();
      await page.waitForTimeout(400);
    }
    await page.waitForTimeout(500);

    await expect(nextArrow).toBeDisabled();
    await expect(prevArrow).toBeEnabled();

    const dots = page.locator('.carousel-dot');
    await expect(dots.last()).toHaveClass(/active/);
    await expect(dots.last()).toHaveAttribute('aria-current', 'true');
  });

  test('dot navigation jumps directly to a card and marks it active', async ({ page }) => {
    const dots = page.locator('.carousel-dot');
    await expect(dots).toHaveCount(6);

    await dots.nth(3).click();
    await page.waitForTimeout(800);

    await expect(dots.nth(3)).toHaveClass(/active/);
    await expect(dots.nth(3)).toHaveAttribute('aria-current', 'true');
  });

  test('keyboard arrow keys move between cards when the track is focused', async ({ page }) => {
    const track = page.getByRole('region', { name: 'Products carousel' });
    await track.focus();

    const dots = page.locator('.carousel-dot');
    await expect(dots.nth(0)).toHaveClass(/active/);

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);
    await expect(dots.nth(1)).toHaveClass(/active/);

    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(400);
    await expect(dots.nth(0)).toHaveClass(/active/);
  });

  test('respects prefers-reduced-motion by disabling smooth scroll behavior', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.locator('#products').scrollIntoViewIfNeeded();

    const scrollBehavior = await page
      .locator('.carousel-track')
      .evaluate((el) => getComputedStyle(el).scrollBehavior);
    expect(scrollBehavior).toBe('auto');
  });
});
