# firstbloc portfolio — Testing framework, quality checks, and CI

## Overview

This project (the Next.js rebuild of the firstbloc portfolio, currently on
branch `worktree-react-carousel-plan` / PR #1) was deliberately built
without an automated test suite — verification throughout was manual
browser passes, `tsc --noEmit`, and `next build`. This spec adds real
automated coverage and wires it into CI, reversing that earlier
deliberate Non-goal at the user's explicit request.

This work lands as additional commits on the same branch/PR (#1) rather
than a new branch — the testing framework needs the already-built
components to test, and splitting it into a stacked PR against an
unmerged branch adds process overhead with no real benefit here.

## Goals

- Component/unit tests (Vitest + React Testing Library) for the
  project's React components.
- End-to-end tests (Playwright) covering the interactions that were
  previously verified only by hand — carousel navigation, responsive
  behavior, keyboard access.
- Visual regression tests (Playwright's built-in screenshot comparison)
  at the same three breakpoints used throughout manual verification.
- Accessibility tests (`@axe-core/playwright`) scanning the full page
  for automatically-detectable violations.
- ESLint (`eslint-config-next`) wired in as a real `lint` script — this
  closes a gap the final carousel review flagged (Minor #9: no lint
  script, so `next build`'s lint phase silently no-ops).
- A GitHub Actions workflow that runs all of the above on every push
  and every pull request, so this becomes true CI, not just local
  scripts someone has to remember to run.

## Non-goals

- No branch protection / required status checks — that's a repo
  settings change with real consequences for how the user merges their
  own future PRs; not part of this work unless asked for separately.
- No coverage-percentage thresholds or enforcement gates.
- No cross-browser test matrix — Chromium only, to keep CI fast; can
  expand later if it becomes worth the cost.
- Not replacing the manual-verification discipline used so far — this
  supplements it for the things that are practical to automate.

## Stack

- **Vitest** + `@testing-library/react` + `@testing-library/jest-dom` +
  `jsdom` — unit/component tests. Chosen over Jest: it's the
  Next.js-recommended pairing for App Router projects, faster, and
  needs less ESM/TS configuration.
- **Playwright** (already proven in this environment — every
  implementer used it ad hoc during manual verification) — formalized
  as a dev dependency, used for e2e, visual regression
  (`toHaveScreenshot()`), and accessibility
  (`@axe-core/playwright`). One tool for three concerns, rather than
  three separate tools.
- **ESLint** + `eslint-config-next` (includes the core-web-vitals
  ruleset).
- **GitHub Actions** for CI.

## File structure

```
firstbloc-portfolio-next/
  vitest.config.ts
  vitest.setup.ts          # jest-dom matchers, jsdom env
  playwright.config.ts
  eslint.config.mjs         # flat config (current ESLint convention)
  components/
    Nav.tsx
    Nav.test.tsx
    ProductCard.tsx
    ProductCard.test.tsx
    WorkflowGraph.tsx
    WorkflowGraph.test.tsx
    SolutionCard.tsx
    SolutionCard.test.tsx
    Hero.test.tsx           # smoke test
    About.test.tsx          # smoke test
    Footer.test.tsx         # smoke test
    Solutions.test.tsx      # smoke test
  e2e/
    home.spec.ts
    carousel.spec.ts
    responsive.spec.ts
    a11y.spec.ts
    *-snapshots/             # committed visual-regression baselines
  .github/
    workflows/
      ci.yml
```

## Test coverage

**Component tests (Vitest + RTL):**
- `Nav.test.tsx` — hamburger toggles the menu open/closed; clicking a
  link closes it.
- `ProductCard.test.tsx` — renders title/problem/description/tech
  chips from a `Product` prop; applies the `.explore` stage-tag
  modifier when `isExploration` is true.
- `WorkflowGraph.test.tsx` — renders one `.wf-node` circle and the
  right number of `.wf-line` paths for a given `nodes` array; the
  single-node case (`nodes.length === 1`) doesn't crash or divide by
  zero.
- `SolutionCard.test.tsx` — renders title/description/items from a
  `Solution` prop.
- `Hero.test.tsx` / `About.test.tsx` / `Footer.test.tsx` /
  `Solutions.test.tsx` — light smoke tests (renders without throwing,
  key copy present). These sections are static markup; heavy coverage
  isn't proportionate.
- `ProductsCarousel` is intentionally NOT unit-tested — its behavior is
  fundamentally about real scroll/IntersectionObserver mechanics that
  jsdom can't meaningfully simulate. It's covered by e2e instead.

**E2E / visual / a11y tests (Playwright), against a production build
served locally:**
- `home.spec.ts` — full page loads, every section present in the DOM,
  zero console errors.
- `carousel.spec.ts` — arrow clicks, dot clicks, keyboard
  left/right, drag/swipe all move between cards correctly; arrows
  disable at both ends; `prefers-reduced-motion` freezes the
  workflow-graph animation and disables smooth carousel scrolling.
- `responsive.spec.ts` — nav collapses to hamburger below 760px and the
  toggle works; `toHaveScreenshot()` visual-regression snapshots at
  375px / 768px / 1440px (the same three breakpoints used throughout
  manual verification).
- `a11y.spec.ts` — `@axe-core/playwright` scan of the full page,
  asserting zero violations (or explicitly documented, justified
  exceptions if something surfaces that isn't practical to fix here).

## package.json scripts

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

## CI workflow (`.github/workflows/ci.yml`)

- Triggers: `push` (all branches) and `pull_request` (against `master`).
- Node 20.x, `npm ci`.
- Steps: `next lint` → `tsc --noEmit` → `vitest run` → `next build` →
  `playwright install --with-deps chromium` → `playwright test`.
- On failure, upload the Playwright HTML report and any screenshot
  diffs as a workflow artifact, so failures are debuggable from the
  GitHub Actions UI without re-running locally.

## Testing this task itself

- Run `npm run verify` locally end-to-end and confirm every step
  passes before pushing.
- Push to the branch and confirm the GitHub Actions run is green on
  the actual PR (#1) — this is the real acceptance criterion, since
  the whole point is CI working, not just "it passed on my machine."

## After this is merged/verified

Launch the app locally (`npm run dev`) and open it in the browser
(`open http://localhost:3000`) so the user can see the running site,
per their explicit request — this happens after the testing framework
work is complete and verified, as the final step.
