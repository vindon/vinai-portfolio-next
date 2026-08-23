import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home page has no automatically-detectable accessibility violations', async ({ page }) => {
    // Sections normally fade in via a .reveal -> .reveal.in opacity
    // transition, driven by an IntersectionObserver against the page
    // viewport. Emulating reduced motion makes the CSS render every
    // .reveal element at opacity:1 from first paint (see globals.css's
    // `@media (prefers-reduced-motion: reduce)` rule) — this sidesteps two
    // real problems with scanning a page that fades content in: sampling
    // mid-fade gives inconsistent, timing-dependent contrast readings, and
    // the Products carousel's off-screen (horizontally-scrolled) cards
    // never intersect the viewport at all, so waiting for their reveal to
    // "complete" would hang forever.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // axe-core's color-contrast check relies on viewport-relative paint
    // sampling and silently skips content scrolled out of view (it doesn't
    // report those nodes as incomplete, it just omits them) — scanning at
    // the default viewport height left everything below the fold,
    // including most of the page, unchecked. Resizing to the full page
    // height puts every vertically-stacked section on-screen at once.
    const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({ width: 1280, height: fullHeight });

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
  });
});
