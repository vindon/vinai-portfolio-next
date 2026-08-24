# Testing Framework, Quality Checks, and CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add automated component tests (Vitest + RTL), end-to-end/visual/accessibility tests (Playwright), linting (ESLint), and a GitHub Actions CI pipeline to the vinai-portfolio-next app.

**Architecture:** Vitest + React Testing Library test files sit next to the components they cover (`Component.test.tsx`). Playwright e2e/visual/a11y specs live in a top-level `e2e/` directory and run against a production build. A `verify` npm script chains lint → unit tests → build → e2e tests; a GitHub Actions workflow runs the same chain on every push and PR.

**Tech Stack:** Vitest, @testing-library/react, jsdom, Playwright, @axe-core/playwright, ESLint (eslint-config-next), GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-23-testing-framework-design.md`

## Global Constraints

- No branch protection / required status checks — not part of this work.
- No coverage-percentage enforcement.
- Playwright runs Chromium only (no cross-browser matrix).
- This lands as more commits on the existing branch `worktree-react-carousel-plan` (PR #1) — do not create a new branch.
- `ProductsCarousel` is not unit-tested (jsdom can't meaningfully simulate its scroll/IntersectionObserver behavior) — it's covered by Playwright e2e instead.
- Visual-regression baseline screenshots are generated once and committed to the repo.
- CI must not require any secrets or external services.

---

### Task 1: Vitest + React Testing Library scaffolding, first component test

**Files:**
- Modify: `package.json` (add devDependencies, add `test`/`test:watch` scripts)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `components/Nav.test.tsx`

**Interfaces:**
- Produces: `npm run test` (runs Vitest once) and `npm run test:watch` — later tasks (2, 3, 9) rely on `npm run test` existing and passing.

- [ ] **Step 1: Install test dependencies**

Run: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
Expected: installs cleanly, adds entries to `package.json`'s `devDependencies` and updates `package-lock.json`.

- [ ] **Step 2: Add test scripts to `package.json`**

Add these two entries to the existing `"scripts"` object (alongside `dev`/`build`/`start`):

```json
"test": "vitest run",
"test:watch": "vitest",
```

- [ ] **Step 3: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: ['node_modules', 'e2e', '.next'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

- [ ] **Step 4: Write `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Write `components/Nav.test.tsx`**

`Nav` already exists and is already reviewed/working code — this test characterizes its current, correct behavior (there is no "red" phase to chase here; the component isn't being built, it's being covered).

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Nav from './Nav';

describe('Nav', () => {
  it('renders the brand and nav links', () => {
    render(<Nav />);
    expect(screen.getByText('vinai')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Solutions' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: "Let's talk" })).toBeInTheDocument();
  });

  it('toggles the mobile menu open and closed when the hamburger is clicked', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const nav = screen.getByRole('link', { name: 'About' }).closest('nav');
    expect(nav).not.toHaveClass('open');

    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    await user.click(toggle);
    expect(nav).toHaveClass('open');

    await user.click(toggle);
    expect(nav).not.toHaveClass('open');
  });

  it('closes the mobile menu when a nav link is clicked', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    await user.click(toggle);

    const nav = screen.getByRole('link', { name: 'About' }).closest('nav');
    expect(nav).toHaveClass('open');

    await user.click(screen.getByRole('link', { name: 'About' }));
    expect(nav).not.toHaveClass('open');
  });
});
```

- [ ] **Step 6: Run the test and verify it passes**

Run: `npx vitest run components/Nav.test.tsx`
Expected: 3 passed, 0 failed.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts components/Nav.test.tsx
git commit -m "Add Vitest + RTL scaffolding and Nav component test"
```

---

### Task 2: ProductCard and WorkflowGraph tests

**Files:**
- Create: `components/WorkflowGraph.test.tsx`
- Create: `components/ProductCard.test.tsx`

**Interfaces:**
- Consumes: `WorkflowGraph({ nodes: string[]; color: string })` and `ProductCard({ product: Product })` (both already implemented). `Product` type and `products` array from `lib/products.tsx` (fields: `id`, `title`, `stageTag`, `isExploration?`, `problem`, `description`, `techTags`, `color`, `tint`, `icon`, `pipeline`).

- [ ] **Step 1: Write `components/WorkflowGraph.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import WorkflowGraph from './WorkflowGraph';

describe('WorkflowGraph', () => {
  it('renders one node circle per entry in the nodes array', () => {
    const { container } = render(<WorkflowGraph nodes={['A', 'B', 'C', 'D']} color="#FF4800" />);
    expect(container.querySelectorAll('.wf-node')).toHaveLength(4);
  });

  it('renders one fewer connecting line than there are nodes', () => {
    const { container } = render(<WorkflowGraph nodes={['A', 'B', 'C', 'D']} color="#FF4800" />);
    expect(container.querySelectorAll('.wf-line')).toHaveLength(3);
  });

  it('handles a single node without crashing and renders no connecting lines', () => {
    const { container } = render(<WorkflowGraph nodes={['Only']} color="#2F5D7C" />);
    expect(container.querySelectorAll('.wf-node')).toHaveLength(1);
    expect(container.querySelectorAll('.wf-line')).toHaveLength(0);
  });

  it('applies the given color to nodes and lines', () => {
    const { container } = render(<WorkflowGraph nodes={['A', 'B']} color="#3E6B45" />);
    expect(container.querySelector('.wf-node')).toHaveAttribute('fill', '#3E6B45');
    expect(container.querySelector('.wf-line')).toHaveAttribute('stroke', '#3E6B45');
  });

  it('marks the svg as decorative for assistive tech', () => {
    const { container } = render(<WorkflowGraph nodes={['A', 'B']} color="#FF4800" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
```

- [ ] **Step 2: Run and verify it passes**

Run: `npx vitest run components/WorkflowGraph.test.tsx`
Expected: 5 passed, 0 failed.

- [ ] **Step 3: Write `components/ProductCard.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
import { products } from '@/lib/products';

describe('ProductCard', () => {
  it('renders the product title, problem, description, and tech tags', () => {
    const product = products.find((p) => p.id === 'pulseguard')!;
    render(<ProductCard product={product} />);

    expect(screen.getByRole('heading', { name: 'PulseGuard AI' })).toBeInTheDocument();
    expect(screen.getByText('The problem')).toBeInTheDocument();
    expect(screen.getByText(product.problem)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    product.techTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders the stage tag without the explore modifier for a shipped product', () => {
    const product = products.find((p) => p.id === 'pulseguard')!;
    render(<ProductCard product={product} />);
    expect(screen.getByText(product.stageTag)).not.toHaveClass('explore');
  });

  it('applies the explore modifier class for a product still in exploration', () => {
    const product = products.find((p) => p.id === 'founder-research')!;
    expect(product.isExploration).toBe(true);
    render(<ProductCard product={product} />);
    expect(screen.getByText(product.stageTag)).toHaveClass('explore');
  });

  it('renders a WorkflowGraph with one node per pipeline stage', () => {
    const product = products.find((p) => p.id === 'signalharvest')!;
    const { container } = render(<ProductCard product={product} />);
    expect(container.querySelectorAll('.wf-node')).toHaveLength(product.pipeline.length);
  });
});
```

- [ ] **Step 4: Run and verify it passes**

Run: `npx vitest run components/ProductCard.test.tsx`
Expected: 4 passed, 0 failed.

- [ ] **Step 5: Commit**

```bash
git add components/WorkflowGraph.test.tsx components/ProductCard.test.tsx
git commit -m "Add ProductCard and WorkflowGraph component tests"
```

---

### Task 3: SolutionCard test and smoke tests for the static sections

**Files:**
- Create: `components/SolutionCard.test.tsx`
- Create: `components/Solutions.test.tsx`
- Create: `components/Hero.test.tsx`
- Create: `components/About.test.tsx`
- Create: `components/Footer.test.tsx`

**Interfaces:**
- Consumes: `SolutionCard({ solution: Solution })`, `Solutions()`, `Hero()`, `About()`, `Footer()` (all already implemented, no props except SolutionCard). `Solution` type and `solutions` array from `lib/solutions.tsx` (fields: `id`, `iconClass`, `icon`, `title`, `description`, `items`).

- [ ] **Step 1: Write `components/SolutionCard.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SolutionCard from './SolutionCard';
import { solutions } from '@/lib/solutions';

describe('SolutionCard', () => {
  it('renders the title, description, and list items for a solution', () => {
    const solution = solutions.find((s) => s.id === 'contract')!;
    render(<SolutionCard solution={solution} />);

    expect(screen.getByRole('heading', { name: 'Contractual Employment' })).toBeInTheDocument();
    expect(screen.getByText(solution.description)).toBeInTheDocument();
    solution.items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders industry-agnostic copy for the Contractual Employment solution', () => {
    const solution = solutions.find((s) => s.id === 'contract')!;
    render(<SolutionCard solution={solution} />);
    expect(screen.getByText('Cross-industry engagements')).toBeInTheDocument();
    expect(screen.queryByText(/telecom.*financial services focus/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Write `components/Solutions.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Solutions from './Solutions';
import { solutions } from '@/lib/solutions';

describe('Solutions', () => {
  it('renders the section heading and one card per solution', () => {
    render(<Solutions />);
    expect(screen.getByRole('heading', { name: 'How to work with me.' })).toBeInTheDocument();
    solutions.forEach((solution) => {
      expect(screen.getByRole('heading', { name: solution.title })).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 3: Write `components/Hero.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero', () => {
  it('renders the headline and proof badge', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', { level: 1, name: /AI systems built for production/ })
    ).toBeInTheDocument();
    expect(screen.getByText('6 multi-agent, production-grade AI systems shipped')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Write `components/About.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the section heading and signature line', () => {
    render(<About />);
    expect(
      screen.getByRole('heading', { name: /AI Strategy, Analytics & CX Automation Leader/ })
    ).toBeInTheDocument();
    expect(screen.getByText('Thought by Vinoth. Built with Claude.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Write `components/Footer.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders navigate links and the copyright line', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Solutions' })).toBeInTheDocument();
    expect(screen.getByText('© 2026 Vinoth Nataraj.')).toBeInTheDocument();
  });

  it('opens the LinkedIn link in a new tab safely', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /linkedin\.com/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
```

- [ ] **Step 6: Run the full unit test suite and verify everything passes**

Run: `npm run test`
Expected: all test files pass (Nav, WorkflowGraph, ProductCard, SolutionCard, Solutions, Hero, About, Footer — 9 files, no failures).

- [ ] **Step 7: Commit**

```bash
git add components/SolutionCard.test.tsx components/Solutions.test.tsx components/Hero.test.tsx components/About.test.tsx components/Footer.test.tsx
git commit -m "Add SolutionCard test and smoke tests for Hero/About/Footer/Solutions"
```

---

### Task 4: ESLint setup

**Files:**
- Modify: `package.json` (add devDependencies, add `lint` script)
- Create: `eslint.config.mjs`

**Interfaces:**
- Produces: `npm run lint` — later tasks (9, 10) rely on this passing.

- [ ] **Step 1: Install ESLint dependencies**

Run: `npm install -D eslint eslint-config-next @eslint/eslintrc`
Expected: installs cleanly.

- [ ] **Step 2: Add the lint script to `package.json`**

Add to the existing `"scripts"` object:

```json
"lint": "next lint",
```

- [ ] **Step 3: Write `eslint.config.mjs`**

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["e2e/**", "playwright-report/**", "test-results/**", ".next/**"],
  },
];

export default eslintConfig;
```

- [ ] **Step 4: Run lint and fix anything it reports**

Run: `npm run lint`
Expected: passes with no errors. If it reports an error, fix it exactly per the message ESLint gives (e.g., an unescaped `'` or `"` in JSX text gets wrapped as `&apos;`/`&quot;` or moved into a `{}`-interpolated string) — do not add `eslint-disable` comments or loosen the config to make errors disappear. If a genuinely unfixable false positive shows up, stop and report it rather than suppressing it.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json eslint.config.mjs
git commit -m "Add ESLint with eslint-config-next"
```

---

### Task 5: Playwright scaffolding and first e2e test

**Files:**
- Modify: `package.json` (add `@playwright/test` devDependency, add `test:e2e` script)
- Create: `playwright.config.ts`
- Create: `e2e/home.spec.ts`

**Interfaces:**
- Produces: `npm run test:e2e` — later tasks (6, 7, 8, 9) rely on this existing.
- Produces: `playwright.config.ts`'s `webServer` config, which builds and starts the app automatically before tests run — later e2e tasks don't need to manage the server themselves.

- [ ] **Step 1: Install Playwright**

Run: `npm install -D @playwright/test`
Expected: installs cleanly.

Run: `npx playwright install --with-deps chromium`
Expected: downloads the Chromium browser Playwright needs to run tests locally.

- [ ] **Step 2: Add the e2e script to `package.json`**

Add to the existing `"scripts"` object:

```json
"test:e2e": "playwright test",
```

- [ ] **Step 3: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 4: Write `e2e/home.spec.ts`**

```ts
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
```

- [ ] **Step 5: Run the e2e test and verify it passes**

Run: `npm run test:e2e -- e2e/home.spec.ts`
Expected: Playwright builds the app, starts it, runs 2 tests, both pass. This may take 30-60s the first time (production build + browser startup).

- [ ] **Step 6: Add Playwright's generated output directories to `.gitignore`**

Add these lines to `.gitignore`:

```
/test-results/
/playwright-report/
/playwright/.cache/
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json playwright.config.ts e2e/home.spec.ts .gitignore
git commit -m "Add Playwright scaffolding and home page e2e test"
```

---

### Task 6: Carousel e2e tests

**Files:**
- Create: `e2e/carousel.spec.ts`

**Interfaces:**
- Consumes: the `ProductsCarousel` component's rendered output — specifically its `role="region"` `aria-label="Products carousel"` track, `.carousel-dot` buttons (with `aria-current` reflecting the active card), `Previous product`/`Next product` labeled arrow buttons, and `.carousel-track`'s `scroll-behavior` CSS property under `prefers-reduced-motion`.

- [ ] **Step 1: Write `e2e/carousel.spec.ts`**

```ts
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
      await nextArrow.click();
      await page.waitForTimeout(400);
    }

    await expect(nextArrow).toBeDisabled();
    await expect(prevArrow).toBeEnabled();
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
```

- [ ] **Step 2: Run and verify it passes**

Run: `npm run test:e2e -- e2e/carousel.spec.ts`
Expected: 4 passed, 0 failed.

- [ ] **Step 3: Commit**

```bash
git add e2e/carousel.spec.ts
git commit -m "Add Products carousel e2e tests"
```

---

### Task 7: Responsive layout and visual regression tests

**Files:**
- Create: `e2e/responsive.spec.ts`
- Create: `e2e/responsive.spec.ts-snapshots/` (committed baseline screenshots, generated by running the tests)

**Interfaces:**
- Consumes: `Nav`'s hamburger toggle behavior (`.nav-toggle` button, `nav.links` with an `.open` class) at the 760px breakpoint, and the full rendered page at three viewport widths.

- [ ] **Step 1: Write `e2e/responsive.spec.ts`**

```ts
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
```

- [ ] **Step 2: Run once to generate the visual-regression baseline screenshots**

Run: `npm run test:e2e -- e2e/responsive.spec.ts --update-snapshots`
Expected: the two nav tests pass; the three screenshot tests report "snapshot written" (there's nothing to compare against yet — this run creates the baseline files under `e2e/responsive.spec.ts-snapshots/`).

- [ ] **Step 3: Run again normally to confirm the baselines are stable**

Run: `npm run test:e2e -- e2e/responsive.spec.ts`
Expected: all 5 tests pass, including the 3 screenshot comparisons now matching the baselines just generated.

- [ ] **Step 4: Commit, including the generated baseline screenshots**

```bash
git add e2e/responsive.spec.ts e2e/responsive.spec.ts-snapshots/
git commit -m "Add responsive layout and visual regression e2e tests"
```

---

### Task 8: Accessibility tests

**Files:**
- Modify: `package.json` (add `@axe-core/playwright` devDependency)
- Create: `e2e/a11y.spec.ts`

**Interfaces:**
- Consumes: the full rendered home page (no component-level interface — this is a whole-page automated audit).

- [ ] **Step 1: Install the axe integration**

Run: `npm install -D @axe-core/playwright`
Expected: installs cleanly.

- [ ] **Step 2: Write `e2e/a11y.spec.ts`**

```ts
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
```

- [ ] **Step 3: Run the test**

Run: `npm run test:e2e -- e2e/a11y.spec.ts`
Expected: 1 passed, 0 violations. If axe reports violations, read each one's `description` and `nodes` in the failure output and fix the underlying markup (e.g., missing `aria-label`, insufficient color contrast, missing landmark) in the relevant component file — do not skip or filter out real violations to make the test pass. If a violation is a deliberate, justified exception (rare), document why in a comment above an explicit `axe.exclude()`/rule-disable rather than silently dropping it.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json e2e/a11y.spec.ts
git commit -m "Add accessibility e2e test with axe-core"
```

---

### Task 9: Consolidated verify script and GitHub Actions CI

**Files:**
- Modify: `package.json` (add `verify` script)
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `npm run lint` (Task 4), `npm run test` (Task 1), `npm run build` (already existing), `npm run test:e2e` (Task 5) — all must already pass individually before this task starts.

- [ ] **Step 1: Add the `verify` script to `package.json`**

Add to the existing `"scripts"` object:

```json
"verify": "npm run lint && npm run test && npm run build && npm run test:e2e",
```

The full `"scripts"` object should now read:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "verify": "npm run lint && npm run test && npm run build && npm run test:e2e"
}
```

- [ ] **Step 2: Run it end to end**

Run: `npm run verify`
Expected: lint, unit tests, build, and e2e tests all pass in sequence with no failures.

- [ ] **Step 3: Write `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
  pull_request:
    branches: [master]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type-check
        run: npx tsc --noEmit

      - name: Unit tests
        run: npm run test

      - name: Build
        run: npm run build

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: E2E, visual regression, and accessibility tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

- [ ] **Step 4: Commit**

```bash
git add package.json .github/workflows/ci.yml
git commit -m "Add consolidated verify script and GitHub Actions CI workflow"
```

---

### Task 10: Final verification, push, and launch

**Files:** none (verification and deployment-adjacent actions only)

- [ ] **Step 1: Run the full verify chain one final time from a clean install**

Run: `rm -rf node_modules && npm install && npm run verify`
Expected: everything passes from a completely clean dependency install, matching what CI will do.

- [ ] **Step 2: Push to the branch**

Run: `git push`
Expected: pushes all commits from Tasks 1-9 to `origin/worktree-react-carousel-plan`, updating PR #1.

- [ ] **Step 3: Confirm the GitHub Actions run is green**

Run: `gh pr checks --watch` (or check the PR's Checks tab in the browser: `gh pr view --web`)
Expected: the "CI / verify" check passes. If it fails, read the failure in the Actions log (or download the uploaded `playwright-report` artifact for e2e failures) and fix the underlying issue — a failure here that didn't reproduce locally usually means an environment difference (e.g., a viewport-dependent screenshot rendering slightly differently on Linux CI vs. local macOS); if that happens, regenerate the visual-regression baselines by running the Task 7 test with `--update-snapshots` inside the same environment CI uses (or accept a slightly higher `maxDiffPixelRatio` if the difference is font-rendering noise, not a real layout bug) and push the updated baseline.

- [ ] **Step 4: Launch the site locally and open it in the browser**

Run: `npm run dev` in the background (e.g. `run_in_background` if your tooling supports it, or a separate terminal), then:

Run: `open http://localhost:3000`
Expected: opens the running site in the default browser so it can be viewed directly, as requested. Leave the dev server running.
