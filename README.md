# firstbloc portfolio

Next.js portfolio site for Vinoth Nataraj (firstbloc).

## Development

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # run the production build
```

## Testing

```bash
npm run test      # Vitest unit/component tests
npm run test:e2e  # Playwright e2e, visual-regression, and accessibility tests
npm run lint       # ESLint
npm run typecheck  # TypeScript --noEmit
npm run verify     # lint + typecheck + test + build + test:e2e, in order
```

### Visual regression baselines

`e2e/responsive.spec.ts-snapshots/` holds the screenshot baselines used by
Playwright's visual-regression assertions. Filenames are suffixed by
platform: `-darwin` for macOS (local dev) and `-linux` for the CI/Linux
environment. There are no Windows/win32 baselines — this project is a
macOS-dev, Linux-CI-only setup.

To regenerate the macOS baselines locally:

```bash
npm run test:e2e -- e2e/responsive.spec.ts --update-snapshots
```

To regenerate the Linux baselines (local dev is macOS but CI runs Linux),
use Docker with an image matching the installed `@playwright/test` version
(check `package.json` — currently `1.62.1`):

```bash
docker run --rm -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.62.1-noble npx playwright test e2e/responsive.spec.ts --update-snapshots
```

Any CSS or copy change that touches page layout will require regenerating
**both** platforms' baselines.
