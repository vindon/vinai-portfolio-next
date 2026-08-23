import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads with all sections present and no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    await expect(page.locator('header.nav')).toBeVisible();
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('#products')).toBeVisible();
    await expect(page.locator('#solutions')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('footer#contact')).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('has the expected page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/vinai/);
  });
});
