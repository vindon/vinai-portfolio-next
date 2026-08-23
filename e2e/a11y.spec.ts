import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home page has no automatically-detectable accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.locator('#about').scrollIntoViewIfNeeded();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
