# firstbloc Portfolio React Rebuild + Products Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the firstbloc portfolio as a Next.js app and replace the static Products grid with a swipeable carousel where each card has an animated SVG "workflow" diagram behind it.

**Architecture:** Next.js 15 App Router + TypeScript, plain CSS (`app/globals.css`) porting the current site's exact design tokens. Each page section is one React component; `ProductsCarousel` is a client component using native CSS scroll-snap plus an `IntersectionObserver` to drive dot/arrow state. `WorkflowGraph` is a small pure-SVG component reused per product card.

**Tech Stack:** Next.js 15.0.5, React 18.3.1, TypeScript 5.6.3. No UI framework, no Tailwind, no animation library — CSS only. (Next.js pinned to 15.0.5, not 15.0.3 — 15.0.0–15.0.4 carry CVE-2025-66478, a CVSS 10.0 unauthenticated RCE in the App Router's React Server Components protocol; fixed starting 15.0.5. See ledger ruling under Task 1.)

**Spec:** `/Users/vinoth/project/firstbloc-portfolio-next/docs/superpowers/specs/2026-08-22-react-carousel-design.md`

## Global Constraints

- No automated test suite; verification is manual via `npm run dev` + browser checks, per the spec's Non-goals.
- No UI framework, no Tailwind, no animation library (GSAP/Lottie/canvas) — CSS only, per the spec's Stack section.
- Design tokens (colors, radii, shadows, spacing) must match the current static site's `:root` values exactly — visual parity is required.
- Page section order: Nav → Hero → Products (carousel) → Solutions → About → Footer.
- All WorkflowGraph animation (node pulse, flowing lines) must respect `prefers-reduced-motion: reduce`.
- The carousel must never hijack page scroll — horizontal movement only happens through user swipe/drag/arrow/dot/keyboard interaction inside the carousel's own scroll container.
- The old static site at `/Users/vinoth/project/vinai-portfolio/index.html` stays untouched as a fallback — never edit it as part of this plan.
- One deviation from the spec's file list: `lib/products.ts` and `lib/solutions.ts` are written as `lib/products.tsx` / `lib/solutions.tsx` because they contain JSX icon elements — a plain `.ts` file cannot contain JSX.

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `.gitignore`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`
- Create: `components/ScrollReveal.tsx`

**Interfaces:**
- Produces: `ScrollReveal` component (default export, no props) — mounted once in `app/page.tsx`, activates the `.reveal` → `.reveal.in` entrance-animation pattern used by every later section.
- Produces: CSS custom properties on `:root` (`--bg`, `--bg-soft`, `--card`, `--ink`, `--grey`, `--grey-light`, `--line`, `--line-soft`, `--accent`, `--accent-deep`, `--accent-ink`, `--radius-lg`, `--radius`, `--radius-pill`, `--max`, `--shadow-sm`, `--shadow-md`, `--shadow-card`) — every later task's CSS relies on these.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "firstbloc-portfolio-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "15.0.5",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "typescript": "5.6.3",
    "@types/node": "20.14.15",
    "@types/react": "18.3.5",
    "@types/react-dom": "18.3.0"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

- [ ] **Step 4: Write `.gitignore`**

```
node_modules
.next
next-env.d.ts
.DS_Store
*.local
```

- [ ] **Step 5: Write `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'firstbloc — Vinoth Nataraj | AI Strategy, Products & CX Automation',
  description:
    'AI strategy, agentic products, and CX automation by Vinoth Nataraj. Consulting, product builds, and fractional engagements.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Write `app/globals.css`** (design tokens + base styles, ported verbatim from the current static site)

```css
:root{
  --bg:#FFFFFF;
  --bg-soft:#FFF8F0;
  --card:#FFFFFF;
  --ink:#1F1F1F;
  --grey:#4A4642;
  --grey-light:#8C8880;
  --line:#1F1F1F;
  --line-soft:#F0E4D4;
  --accent:#FF4800;
  --accent-deep:#C93700;
  --accent-ink:#FFFFFF;
  --radius-lg:28px;
  --radius:14px;
  --radius-pill:9999px;
  --max:1120px;
  --shadow-sm:0 2px 8px rgba(31,31,31,0.06);
  --shadow-md:0 12px 32px rgba(31,31,31,0.12);
  --shadow-card:0 1px 2px rgba(31,31,31,0.04), 0 8px 24px rgba(31,31,31,0.08);
}

*{box-sizing:border-box;}
html{-webkit-text-size-adjust:100%;}

body{
  margin:0;
  background:var(--bg);
  color:var(--ink);
  font-family:'Inter',-apple-system,sans-serif;
  font-size:16px;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}

h1,h2,h3,h4{
  font-family:'Inter',-apple-system,sans-serif;
  font-weight:800;
  margin:0;
  color:var(--ink);
  letter-spacing:-0.02em;
}
h3,h4{ font-weight:700; }

a{ color:inherit; text-decoration:none; }

.wrap{max-width:var(--max); margin:0 auto; padding:0 32px;}
@media(max-width:640px){ .wrap{padding:0 20px;} }

.kicker{
  font-family:'IBM Plex Mono',monospace;
  font-size:12px;
  letter-spacing:0.12em;
  text-transform:uppercase;
  color:var(--accent-deep);
}

section{padding:88px 0;}
@media(max-width:768px){ section{padding:56px 0;} }

/* ===== SECTION DECORATION (shared blob background) ===== */
.section-deco{position:relative; overflow:hidden;}
.section-deco > .wrap{position:relative; z-index:1;}
.bg-blob{position:absolute; border-radius:50%; filter:blur(70px); z-index:0; pointer-events:none;}
.bg-blob.-hero-a{width:440px; height:440px; background:var(--accent); opacity:.16; top:-160px; right:-120px;}
.bg-blob.-hero-b{width:320px; height:320px; background:#9C6B12; opacity:.10; bottom:-140px; left:-100px;}
.bg-blob.-products-a{width:380px; height:380px; background:#5B4B8A; opacity:.08; top:-120px; left:-100px;}
.bg-blob.-products-b{width:320px; height:320px; background:var(--accent); opacity:.10; bottom:-120px; right:-100px;}
.bg-blob.-solutions-a{width:380px; height:380px; background:#2F5D7C; opacity:.08; top:-120px; right:-110px;}
.bg-blob.-solutions-b{width:300px; height:300px; background:#3E6B45; opacity:.08; bottom:-110px; left:-90px;}
.bg-blob.-about-a{width:400px; height:400px; background:var(--accent); opacity:.12; top:-140px; right:-110px;}
.bg-blob.-about-b{width:300px; height:300px; background:#9C6B12; opacity:.08; bottom:-120px; left:-90px;}

/* ===== SCROLL REVEAL ===== */
.reveal{opacity:0; transform:translateY(14px); transition:opacity .5s ease, transform .5s ease;}
.reveal.in{opacity:1; transform:translateY(0);}
@media (prefers-reduced-motion: reduce){
  .reveal{opacity:1; transform:none; transition:none;}
}

/* ===== SECTION HEADERS (shared by Products and Solutions) ===== */
.section-head{max-width:640px; margin:0 auto 44px; text-align:center;}
.section-head h2{font-size:clamp(26px,3.2vw,34px); margin-top:12px;}
.section-head p{color:var(--grey); margin:14px auto 0; font-size:17px;}
```

- [ ] **Step 7: Write `components/ScrollReveal.tsx`**

```tsx
'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
```

- [ ] **Step 8: Write `app/page.tsx`** (temporary placeholder, replaced incrementally in later tasks)

```tsx
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <main id="top">
      <ScrollReveal />
      <h1 style={{ padding: '40px' }}>firstbloc</h1>
    </main>
  );
}
```

- [ ] **Step 9: Install dependencies**

Run: `cd /Users/vinoth/project/firstbloc-portfolio-next && npm install`
Expected: installs without error, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 10: Run the dev server and verify**

Run: `npm run dev` (leave running, open `http://localhost:3000` in a browser)
Expected: page loads with no console errors, shows "firstbloc" heading in bold Inter font (weight 800), background is white. Stop the dev server after confirming (Ctrl+C).

- [ ] **Step 11: Commit**

```bash
git add package.json tsconfig.json next.config.mjs .gitignore app components package-lock.json
git commit -m "Scaffold Next.js app with ported design tokens and scroll-reveal utility"
```

---

### Task 2: Nav component

**Files:**
- Create: `components/Nav.tsx`
- Modify: `app/globals.css` (append nav styles)
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: nothing (no props).
- Produces: `Nav` component (default export, no props), rendered once at the top of `app/page.tsx`.

- [ ] **Step 1: Append nav styles to `app/globals.css`**

```css
/* ===== NAV ===== */
header.nav{
  position:sticky; top:0; z-index:100;
  background:var(--bg);
  border-bottom:1px solid var(--line-soft);
}
.nav-inner{
  max-width:var(--max); margin:0 auto; padding:22px 32px;
  display:flex; align-items:center; justify-content:space-between;
}
@media(max-width:640px){ .nav-inner{padding:18px 20px;} }

.brand-name{font-family:'Inter',sans-serif; font-weight:800; font-size:21px; color:var(--ink);}
.brand-tag{font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.08em; color:var(--grey-light); text-transform:uppercase; display:block; margin-top:2px;}

nav.links{display:flex; align-items:center; gap:36px;}
nav.links a{
  font-size:16px; font-weight:700; color:var(--ink);
  transition:color .15s; white-space:nowrap;
}
nav.links a:hover{color:var(--accent-deep);}
.nav-cta{
  color:#fff !important; background:var(--ink);
  padding:11px 22px; border-radius:var(--radius-pill);
  box-shadow:var(--shadow-sm);
  transition:background .15s, box-shadow .15s, transform .15s;
}
.nav-cta:hover{background:var(--accent-deep) !important; color:#fff !important; box-shadow:var(--shadow-md); transform:translateY(-1px);}

.nav-toggle{display:none; background:none; border:none; cursor:pointer; padding:6px;}
.nav-toggle span{display:block; width:22px; height:1.5px; background:var(--ink); margin:5px 0;}

@media(max-width:760px){
  nav.links{
    position:fixed; inset:60px 0 0 0; background:var(--bg);
    flex-direction:column; align-items:flex-start; gap:0;
    padding:8px 24px 24px; border-top:1px solid var(--line-soft);
    transform:translateY(-110%); transition:transform .2s ease;
    pointer-events:none;
  }
  nav.links.open{transform:translateY(0); pointer-events:auto;}
  nav.links a{width:100%; padding:15px 0; border-bottom:1px solid var(--line-soft);}
  .nav-toggle{display:block;}
}
```

- [ ] **Step 2: Write `components/Nav.tsx`**

```tsx
'use client';

import { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" style={{ display: 'block' }}>
          <span className="brand-name">firstbloc</span>
          <span className="brand-tag">AI Strategy &amp; Products</span>
        </a>
        <nav className={`links${open ? ' open' : ''}`}>
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#products" onClick={() => setOpen(false)}>Products</a>
          <a href="#solutions" onClick={() => setOpen(false)}>Solutions</a>
          <a href="#contact" className="nav-cta" onClick={() => setOpen(false)}>Let&apos;s talk</a>
        </nav>
        <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Wire `Nav` into `app/page.tsx`**

```tsx
import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <h1 style={{ padding: '40px' }}>firstbloc</h1>
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000`
Expected: sticky nav bar with "firstbloc" brand, About/Products/Solutions links, dark "Let's talk" pill button. Resize browser below 760px width — links collapse into hamburger menu; clicking the hamburger toggles the menu open/closed; clicking any link closes it.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/page.tsx components/Nav.tsx
git commit -m "Add Nav component with mobile menu toggle"
```

---

### Task 3: Hero component

**Files:**
- Create: `components/Hero.tsx`
- Modify: `app/globals.css` (append hero styles)
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `.section-deco` / `.bg-blob` classes from Task 1.
- Produces: `Hero` component (default export, no props).

- [ ] **Step 1: Append hero styles to `app/globals.css`**

```css
/* ===== HERO ===== */
.hero{
  padding:96px 0 80px; border-bottom:1px solid var(--line-soft); text-align:center;
}
.hero h1{
  font-size:clamp(34px,5.5vw,58px); line-height:1.06; letter-spacing:-0.02em;
  margin:0 auto 22px; max-width:16ch;
}
.hero-lede{font-size:18px; color:var(--grey); max-width:52ch; margin:0 auto 32px; line-height:1.6;}

.hero-ctas{display:flex; gap:14px; flex-wrap:wrap; margin-bottom:0; justify-content:center;}
.btn-primary, .btn-ghost{
  display:inline-flex; align-items:center; gap:8px;
  padding:12px 26px; border-radius:var(--radius-pill); font-size:14.5px; font-weight:600;
  cursor:pointer; transition:background .15s, border-color .15s, color .15s, box-shadow .15s, transform .15s;
  border:2px solid transparent;
}
.btn-primary{background:var(--accent); color:#fff; border-color:var(--accent); box-shadow:var(--shadow-sm);}
.btn-primary:hover{background:var(--accent-deep); border-color:var(--accent-deep); box-shadow:var(--shadow-md); transform:translateY(-1px);}
.btn-ghost{border-color:var(--ink); color:var(--ink); background:transparent;}
.btn-ghost:hover{background:var(--ink); color:var(--bg); box-shadow:var(--shadow-md); transform:translateY(-1px);}

.hero-proof{
  display:inline-flex; align-items:center; gap:8px;
  margin-top:28px; padding:10px 18px;
  background:var(--bg-soft); border-radius:var(--radius-pill);
  font-size:13.5px; font-weight:600; color:var(--ink);
  box-shadow:var(--shadow-sm);
}
.hero-proof svg{width:16px; height:16px; color:var(--accent-deep); flex-shrink:0;}
```

- [ ] **Step 2: Write `components/Hero.tsx`**

```tsx
export default function Hero() {
  return (
    <section className="hero section-deco">
      <div className="bg-blob -hero-a" aria-hidden="true"></div>
      <div className="bg-blob -hero-b" aria-hidden="true"></div>
      <div className="wrap">
        <p className="kicker">AI Strategy · Product Building · CX Automation</p>
        <h1>AI systems built for production — not for demos.</h1>
        <p className="hero-lede">I design and build agentic AI systems worth shipping.</p>
        <div className="hero-ctas">
          <a href="#products" className="btn-primary">See what I&apos;ve built</a>
          <a href="#contact" className="btn-ghost">Work with me</a>
        </div>
        <div className="hero-proof">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          6 multi-agent, production-grade AI systems shipped
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire `Hero` into `app/page.tsx`**

```tsx
import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000`
Expected: centered hero with headline, lede, orange primary button + dark ghost button, checkmark proof badge below the buttons, two soft blurred blob shapes visible in the background (orange top-right, gold bottom-left).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/page.tsx components/Hero.tsx
git commit -m "Add Hero component"
```

---

### Task 4: Products data

**Files:**
- Create: `lib/products.tsx`

**Interfaces:**
- Produces: `Product` type and `products: Product[]` array, consumed by Task 5 (`ProductCard`) and Task 6 (`ProductsCarousel`).

```ts
type Product = {
  id: string;
  title: string;
  stageTag: string;
  isExploration?: boolean;
  problem: string;
  description: string;
  techTags: string[];
  color: string;
  tint: string;
  icon: React.ReactNode;
  pipeline: string[];
};
```

- [ ] **Step 1: Write `lib/products.tsx`**

```tsx
export type Product = {
  id: string;
  title: string;
  stageTag: string;
  isExploration?: boolean;
  problem: string;
  description: string;
  techTags: string[];
  color: string;
  tint: string;
  icon: React.ReactNode;
  pipeline: string[];
};

export const products: Product[] = [
  {
    id: 'pulseguard',
    title: 'PulseGuard AI',
    stageTag: 'Production-grade build',
    problem: 'Social complaints escalate into PR crises before anyone on the CX team sees them.',
    description:
      'A 4-agent triage system (Sentinel → Triage → Resolver → Escalation) that watches X, Reddit, Trustpilot, and app stores for telecom CX, sanitizes PII, and routes what actually matters to a human through a clear escalation gate, keeping alert volume manageable for the team.',
    techTags: ['LangGraph', 'FastMCP', 'Redis Streams', 'FastAPI'],
    color: '#FF4800',
    tint: 'rgba(255,72,0,0.12)',
    pipeline: ['Sentinel', 'Triage', 'Resolver', 'Escalation'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4.5 6v5.2c0 5 3.2 8.6 7.5 9.8 4.3-1.2 7.5-4.8 7.5-9.8V6z" />
        <line x1="12" y1="10" x2="12" y2="13.5" />
        <circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'call-intelligence',
    title: 'Telecom Call Intelligence',
    stageTag: 'Production-grade build',
    problem: 'Thousands of support calls happen every day and almost none of them turn into structured, usable intelligence.',
    description:
      'A 7-node LangGraph pipeline that extracts 70+ structured fields per call using a six-phase call-anatomy framework, validated against 50,000+ real transcripts — giving CX leaders QA and insight data automatically, at full call volume.',
    techTags: ['Haiku 4.5', 'NVIDIA NIM Llama 3.3', 'Streamlit', '364 tests'],
    color: '#2F5D7C',
    tint: '#E7EFF6',
    pipeline: ['Ingest', 'Diarize', 'Extract', 'Classify', 'Validate', 'Score', 'Report'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4h3l2 5-2 1.5a11 11 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    id: 'signalharvest',
    title: 'SignalHarvest AI',
    stageTag: 'Multi-agent product build',
    problem: "Early market and complaint signals sit scattered across free public sources, unread until they're expensive.",
    description:
      'A 5-agent pipeline (Sentinel, Classifier, Scorer, Curator, Publisher) that harvests, scores, and curates signals from Reddit, Google Trends, and CFPB filings into a digest — so individuals and small teams get an early-warning system without paid monitoring tools.',
    techTags: ['LangGraph', 'PRAW', 'pytrends', 'CFPB API'],
    color: '#3E6B45',
    tint: '#EAF1E6',
    pipeline: ['Sentinel', 'Classifier', 'Scorer', 'Curator', 'Publisher'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12V6.5" />
        <path d="M8.5 12a3.5 3.5 0 0 1 7 0" />
        <path d="M5.5 12a6.5 6.5 0 0 1 13 0" />
        <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'cfpb',
    title: 'CFPB Credit Agreement Intelligence',
    stageTag: 'Production-grade demo',
    problem: 'Extracting terms from credit card agreements filed with regulators is still a manual, error-prone read-through.',
    description:
      'A Playwright-driven scraper feeding a two-pass extraction pipeline against a strict Pydantic schema, surfaced through a Streamlit UI — turning unstructured regulatory filings into clean, queryable data for compliance and fintech teams.',
    techTags: ['Playwright', 'Pydantic', 'Streamlit'],
    color: '#5B4B8A',
    tint: '#EDE9F5',
    pipeline: ['Scrape', 'Extract Pass 1', 'Extract Pass 2', 'Validate', 'Serve'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v4h4" />
        <line x1="9.5" y1="12.5" x2="15" y2="12.5" />
        <line x1="9.5" y1="16" x2="15" y2="16" />
      </svg>
    ),
  },
  {
    id: 'rag-portfolio',
    title: 'Enterprise RAG Portfolio',
    stageTag: 'Production-grade portfolio',
    problem: 'Most RAG demos fall apart the moment real enterprise document mess shows up.',
    description:
      'Five production-grade RAG builds — HR Q&A, contract review, marketing content hub, hybrid-search tech docs, and a multi-agent IT helpdesk — run on Groq inference and local Ollama embeddings, proving the pattern across genuinely different document types.',
    techTags: ['Groq', 'Ollama', 'Hybrid Search'],
    color: '#1F7A6C',
    tint: '#E3F2EF',
    pipeline: ['Ingest', 'Embed', 'Retrieve', 'Rerank', 'Generate'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 3.5 8l8.5 5 8.5-5z" />
        <path d="M3.5 12l8.5 5 8.5-5" />
        <path d="M3.5 16l8.5 5 8.5-5" />
      </svg>
    ),
  },
  {
    id: 'founder-research',
    title: 'Founder Research Intelligence Engine',
    stageTag: 'In exploration',
    isExploration: true,
    problem: "Founders and operators need deep, current research on people and markets, but good research doesn't scale on a human analyst's time.",
    description:
      'An agentic research pipeline being evaluated as a retainer or report-based product — currently being tested against real client use cases before I commit build time to it.',
    techTags: ['Agentic Research', 'Concept Stage'],
    color: '#9C6B12',
    tint: '#FAEFDD',
    pipeline: ['Query', 'Research', 'Synthesize', 'Report'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <line x1="15.2" y1="15.2" x2="20" y2="20" />
      </svg>
    ),
  },
];
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/products.tsx
git commit -m "Add products data with pipeline stages for workflow graphs"
```

---

### Task 5: ProductCard + WorkflowGraph components

**Files:**
- Create: `components/WorkflowGraph.tsx`
- Create: `components/ProductCard.tsx`
- Modify: `app/globals.css` (append product-card, problem-box, tech-chip, icon-chip, workflow-graph styles)
- Modify: `app/page.tsx` (temporary: render one `ProductCard` directly to verify visually)

**Interfaces:**
- Consumes: `Product` type from `lib/products.tsx` (Task 4).
- Produces: `WorkflowGraph({ nodes, color }: { nodes: string[]; color: string })` — consumed directly by `ProductCard`. `ProductCard({ product }: { product: Product })` — consumed by Task 6 (`ProductsCarousel`).

- [ ] **Step 1: Append card + workflow-graph styles to `app/globals.css`**

```css
/* ===== PRODUCT CARD ===== */
.product-card{
  position:relative; overflow:hidden;
  background:var(--card);
  border:none; border-radius:var(--radius-lg);
  box-shadow:var(--shadow-card);
  transition:transform .18s ease, box-shadow .18s ease;
}
.product-card::before{
  content:""; position:absolute; top:0; left:0; right:0; height:6px;
  background:var(--tcolor, var(--accent));
  border-radius:var(--radius-lg) var(--radius-lg) 0 0;
  z-index:2;
}
.product-card:hover{
  transform:translateY(-6px);
  box-shadow:0 20px 40px -14px var(--tcolor, var(--accent)), var(--shadow-card);
}
.product-card-content{
  position:relative; z-index:1;
  display:flex; flex-direction:column; align-items:center; text-align:center; gap:14px;
  padding:38px 30px 30px;
}
.stage-tag{
  font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase;
  color:var(--tcolor, var(--accent-deep)); background:var(--ttint, rgba(31,31,31,0.07));
  padding:5px 12px; border-radius:var(--radius-pill); font-weight:600;
}
.stage-tag.explore{color:var(--grey); background:rgba(31,31,31,0.06);}
.product-card h3{font-size:23px; line-height:1.2; font-weight:800; letter-spacing:-0.015em;}
.problem-box{
  align-self:stretch; text-align:left;
  background:var(--ttint, rgba(31,31,31,0.06)); border-radius:14px;
  padding:14px 16px; display:flex; flex-direction:column; gap:4px;
}
.problem-label{
  font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase;
  color:var(--tcolor, var(--accent-deep)); font-weight:700;
}
.problem-box p{font-size:13.5px; color:var(--ink); line-height:1.5; margin:0; font-weight:500;}
.product-desc{align-self:stretch; text-align:left; font-size:14.5px; color:var(--grey); line-height:1.6;}
.tech-tags{
  align-self:stretch; text-align:left;
  margin-top:auto; padding-top:14px; border-top:1px solid rgba(31,31,31,0.1);
  display:flex; flex-wrap:wrap; gap:6px;
}
.tech-chip{
  font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--grey);
  background:rgba(31,31,31,0.05); border-radius:var(--radius-pill); padding:4px 10px;
}

/* ===== ICON CHIPS ===== */
.icon-chip{
  width:52px; height:52px; border-radius:16px;
  display:flex; align-items:center; justify-content:center;
  margin-bottom:2px;
}
.icon-chip svg{width:26px; height:26px;}
.product-card .icon-chip{background:var(--ttint, rgba(31,31,31,0.07)); color:var(--tcolor, var(--ink));}
.icon-chip.-orange{background:rgba(255,72,0,0.12); color:var(--accent-deep);}
.icon-chip.-blue{background:#E7EFF6; color:#2F5D7C;}
.icon-chip.-sage{background:#EAF1E6; color:#3E6B45;}
.icon-chip.-lg{width:64px; height:64px; border-radius:20px;}
.icon-chip.-lg svg{width:32px; height:32px;}

/* ===== WORKFLOW GRAPH ===== */
.workflow-graph{position:absolute; inset:0; z-index:0; pointer-events:none; opacity:0.12;}
.workflow-graph .wf-node{animation:wf-pulse 2.4s ease-in-out infinite;}
.workflow-graph .wf-line{stroke-dasharray:6 6; animation:wf-flow 3s linear infinite;}
@keyframes wf-pulse{0%,100%{opacity:.5;} 50%{opacity:1;}}
@keyframes wf-flow{to{stroke-dashoffset:-24;}}
@media (prefers-reduced-motion: reduce){
  .workflow-graph .wf-node, .workflow-graph .wf-line{animation:none;}
}
```

- [ ] **Step 2: Write `components/WorkflowGraph.tsx`**

```tsx
type WorkflowGraphProps = {
  nodes: string[];
  color: string;
};

export default function WorkflowGraph({ nodes, color }: WorkflowGraphProps) {
  const width = 400;
  const height = 280;
  const marginX = 40;
  const usableWidth = width - marginX * 2;

  const points = nodes.map((_, i) => {
    const t = nodes.length === 1 ? 0.5 : i / (nodes.length - 1);
    const x = marginX + t * usableWidth;
    const y = height / 2 + Math.sin(t * Math.PI) * -50;
    return { x, y };
  });

  return (
    <svg
      className="workflow-graph"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {points.slice(1).map((p, i) => {
        const prev = points[i];
        return (
          <path
            key={`line-${i}`}
            className="wf-line"
            d={`M ${prev.x} ${prev.y} L ${p.x} ${p.y}`}
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        );
      })}
      {points.map((p, i) => (
        <circle
          key={`node-${i}`}
          className="wf-node"
          cx={p.x}
          cy={p.y}
          r={7}
          fill={color}
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 3: Write `components/ProductCard.tsx`**

```tsx
import type { Product } from '@/lib/products';
import WorkflowGraph from './WorkflowGraph';

export default function ProductCard({ product }: { product: Product }) {
  const cardStyle = {
    '--tcolor': product.color,
    '--ttint': product.tint,
  } as React.CSSProperties;

  return (
    <div className="product-card" style={cardStyle}>
      <WorkflowGraph nodes={product.pipeline} color={product.color} />
      <div className="product-card-content">
        <div className="icon-chip">{product.icon}</div>
        <span className={`stage-tag${product.isExploration ? ' explore' : ''}`}>{product.stageTag}</span>
        <h3>{product.title}</h3>
        <div className="problem-box">
          <span className="problem-label">The problem</span>
          <p>{product.problem}</p>
        </div>
        <p className="product-desc">{product.description}</p>
        <div className="tech-tags">
          {product.techTags.map((tag) => (
            <span className="tech-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Temporarily render one card in `app/page.tsx` to verify visually**

```tsx
import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <Hero />
        <div style={{ maxWidth: 520, margin: '40px auto' }}>
          <ProductCard product={products[0]} />
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 5: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000`, scroll to the temporary card below the hero.
Expected: rounded white card with a 6px orange top bar, orange-tinted icon chip, orange stage-tag pill, title "PulseGuard AI", an orange-tinted "The problem" box, description text, tech chips (LangGraph, FastMCP, Redis Streams, FastAPI). Behind the card content, four faint pulsing orange dots connected by faint animated dashed lines should be visible (the workflow graph). Open browser devtools, enable "prefers-reduced-motion: reduce" emulation, refresh — the dots/lines should stop animating (static).

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/page.tsx components/WorkflowGraph.tsx components/ProductCard.tsx
git commit -m "Add ProductCard and WorkflowGraph components"
```

---

### Task 6: ProductsCarousel component

**Files:**
- Create: `components/ProductsCarousel.tsx`
- Modify: `app/globals.css` (append carousel styles)
- Modify: `app/page.tsx` (replace temporary single-card render with the carousel)

**Interfaces:**
- Consumes: `products` from `lib/products.tsx` (Task 4), `ProductCard` from Task 5.
- Produces: `ProductsCarousel` component (default export, no props), rendered in `app/page.tsx` as the Products section (`id="products"`).

- [ ] **Step 1: Append carousel styles to `app/globals.css`**

```css
/* ===== PRODUCTS CAROUSEL ===== */
.carousel-outer{position:relative;}
.carousel-track{
  display:flex; gap:20px; overflow-x:auto;
  scroll-snap-type:x mandatory; scroll-behavior:smooth;
  padding:4px 4px 8px;
  -ms-overflow-style:none; scrollbar-width:none;
}
.carousel-track::-webkit-scrollbar{display:none;}
.carousel-card-wrap{flex:0 0 auto; width:min(520px, 85vw); scroll-snap-align:start;}
@media(max-width:640px){ .carousel-card-wrap{width:88vw;} }

.carousel-controls{display:flex; align-items:center; justify-content:center; gap:20px; margin-top:28px;}
.carousel-arrow{
  width:44px; height:44px; border-radius:50%; border:none;
  background:var(--card); box-shadow:var(--shadow-sm);
  display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--ink);
  transition:box-shadow .15s, transform .15s, opacity .15s;
}
.carousel-arrow:hover:not(:disabled){box-shadow:var(--shadow-md); transform:translateY(-1px);}
.carousel-arrow:disabled{opacity:.35; cursor:default;}
.carousel-arrow svg{width:18px; height:18px;}
.carousel-dots{display:flex; gap:8px;}
.carousel-dot{
  width:8px; height:8px; border-radius:50%; border:none;
  background:rgba(31,31,31,0.18); padding:0; cursor:pointer;
  transition:background .15s, transform .15s;
}
.carousel-dot.active{background:var(--accent); transform:scale(1.3);}
```

- [ ] **Step 2: Write `components/ProductsCarousel.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { products } from '@/lib/products';
import ProductCard from './ProductCard';

export default function ProductsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ratiosRef = useRef<number[]>(new Array(products.length).fill(0));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Multi-threshold + max-ratio-wins: at desktop widths, two cards can be
    // simultaneously visible, so a single threshold can fire on more than
    // one card in the same viewport. Tracking each card's latest ratio and
    // picking the highest keeps the active index correct regardless of how
    // many cards are visible at once.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.findIndex((el) => el === entry.target);
          if (index !== -1) {
            ratiosRef.current[index] = entry.intersectionRatio;
          }
        });
        let maxIndex = 0;
        let maxRatio = -1;
        ratiosRef.current.forEach((ratio, i) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxIndex = i;
          }
        });
        setActiveIndex(maxIndex);
      },
      { root: track, threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, products.length - 1));
    const card = cardRefs.current[clamped];
    const track = trackRef.current;
    if (card && track) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  };

  return (
    <section id="products" className="section-deco">
      <div className="bg-blob -products-a" aria-hidden="true"></div>
      <div className="bg-blob -products-b" aria-hidden="true"></div>
      <div className="wrap">
        <div className="section-head reveal">
          <p className="kicker">Products</p>
          <h2>Six systems. Six real problems. Built to ship.</h2>
          <p>Every product here started from a specific operational gap I saw firsthand in telecom CX or financial services.</p>
        </div>

        <div className="carousel-outer">
          <div
            className="carousel-track"
            ref={trackRef}
            role="region"
            aria-label="Products carousel"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {products.map((product, i) => (
              <div
                className="carousel-card-wrap reveal"
                key={product.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="carousel-controls">
            <button
              type="button"
              className="carousel-arrow"
              aria-label="Previous product"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="carousel-dots">
              {products.map((product, i) => (
                <button
                  type="button"
                  key={product.id}
                  className={`carousel-dot${i === activeIndex ? ' active' : ''}`}
                  aria-label={`Go to ${product.title}`}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="carousel-arrow"
              aria-label="Next product"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === products.length - 1}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Replace temporary card render in `app/page.tsx`**

```tsx
import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProductsCarousel from '@/components/ProductsCarousel';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <Hero />
        <ProductsCarousel />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000`, scroll to Products.
Expected:
- All 6 cards visible in a single horizontal row, each with its own workflow-graph animation and accent color; the next card peeks in at the right edge.
- Dragging/swiping the track moves between cards and snaps into place.
- Clicking the right arrow advances one card at a time; left arrow is disabled on the first card, right arrow disabled on the last.
- Dots below reflect which card is active as you scroll or click arrows; clicking a dot jumps to that card.
- Click inside the track to focus it, then press the right/left arrow keys — the carousel advances/retreats accordingly.
- Resize to a mobile width (~375px) — cards nearly fill the width with a smaller peek of the next card.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/page.tsx components/ProductsCarousel.tsx
git commit -m "Add ProductsCarousel with scroll-snap, arrow/dot nav, and keyboard support"
```

---

### Task 7: Solutions section

**Files:**
- Create: `lib/solutions.tsx`
- Create: `components/SolutionCard.tsx`
- Create: `components/Solutions.tsx`
- Modify: `app/globals.css` (append solutions styles)
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `Solution` type and `solutions: Solution[]` from `lib/solutions.tsx`, consumed by `SolutionCard` and `Solutions`.
- Produces: `Solutions` component (default export, no props), rendered in `app/page.tsx` after `ProductsCarousel`.

- [ ] **Step 1: Append solutions styles to `app/globals.css`**

```css
/* ===== SOLUTIONS ===== */
#solutions{background:var(--bg-soft);}
.solutions-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:20px;}
@media(max-width:860px){ .solutions-grid{grid-template-columns:1fr;} }

.solution-card{
  background:var(--card);
  border:none; border-radius:var(--radius-lg);
  padding:32px;
  display:flex; flex-direction:column; align-items:center; text-align:center; gap:12px;
  box-shadow:var(--shadow-card);
  transition:transform .18s ease, box-shadow .18s ease;
}
.solution-card:hover{
  transform:translateY(-6px);
  box-shadow:0 20px 40px -14px var(--accent), var(--shadow-card);
}
.solution-card h3{font-size:23px; font-weight:800; letter-spacing:-0.015em;}
.solution-card p{color:var(--grey); font-size:14.5px;}
.solution-list{
  align-self:stretch; text-align:left;
  list-style:none; margin:4px 0 0; padding:0; display:flex; flex-direction:column; gap:8px;
}
.solution-list li{
  font-size:13.5px; color:var(--grey); padding-left:16px; position:relative;
}
.solution-list li::before{
  content:"—"; position:absolute; left:0; color:var(--accent);
}
.solutions-grid .reveal:nth-child(2){transition-delay:.08s;}
.solutions-grid .reveal:nth-child(3){transition-delay:.16s;}
```

- [ ] **Step 2: Write `lib/solutions.tsx`**

```tsx
export type Solution = {
  id: string;
  iconClass: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
};

export const solutions: Solution[] = [
  {
    id: 'strategy',
    iconClass: '-orange -lg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M14.8 9.2 13 13l-3.8 1.8L11 11z" />
      </svg>
    ),
    title: 'AI Strategy Consulting',
    description:
      "A clear, practical read on your AI roadmap — where agentic AI and automation actually pay off in production, and where they're just this quarter's pilot.",
    items: ['CX automation strategy', 'Build-vs-buy assessments', 'AI roadmap & governance review'],
  },
  {
    id: 'product',
    iconClass: '-sage -lg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3.2" />
        <g>
          <line x1="12" y1="6.5" x2="12" y2="4.5" />
          <line x1="12" y1="19.5" x2="12" y2="17.5" />
          <line x1="6.5" y1="12" x2="4.5" y2="12" />
          <line x1="19.5" y1="12" x2="17.5" y2="12" />
          <line x1="8.4" y1="8.4" x2="7" y2="7" />
          <line x1="17" y1="17" x2="15.6" y2="15.6" />
          <line x1="15.6" y1="8.4" x2="17" y2="7" />
          <line x1="7" y1="17" x2="8.4" y2="15.6" />
        </g>
      </svg>
    ),
    title: 'Product Building',
    description:
      'Hands-on delivery of agentic AI systems — from a working prototype to a production-grade pipeline with tests, tracing, and human-in-the-loop controls.',
    items: ['Multi-agent & LangGraph systems', 'RAG architecture & document intelligence', 'CX automation pipelines'],
  },
  {
    id: 'contract',
    iconClass: '-blue -lg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="16" height="11.5" rx="1.6" />
        <path d="M9 8V6.2A2.2 2.2 0 0 1 11.2 4h1.6A2.2 2.2 0 0 1 15 6.2V8" />
        <line x1="4" y1="13.5" x2="20" y2="13.5" />
      </svg>
    ),
    title: 'Contractual Employment',
    description:
      'Senior Manager to Director-level fractional or contract engagements — embedded on your team for a defined scope in AI strategy, analytics, or CX transformation.',
    items: ['Fractional / embedded engagements', 'Cross-industry engagements', 'Defined-scope contract work'],
  },
];
```

- [ ] **Step 3: Write `components/SolutionCard.tsx`**

```tsx
import type { Solution } from '@/lib/solutions';

export default function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <div className="solution-card reveal">
      <div className={`icon-chip ${solution.iconClass}`}>{solution.icon}</div>
      <h3>{solution.title}</h3>
      <p>{solution.description}</p>
      <ul className="solution-list">
        {solution.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Write `components/Solutions.tsx`**

```tsx
import { solutions } from '@/lib/solutions';
import SolutionCard from './SolutionCard';

export default function Solutions() {
  return (
    <section id="solutions" className="section-deco">
      <div className="bg-blob -solutions-a" aria-hidden="true"></div>
      <div className="bg-blob -solutions-b" aria-hidden="true"></div>
      <div className="wrap">
        <div className="section-head reveal">
          <p className="kicker">Solutions</p>
          <h2>How to work with me.</h2>
          <p>Whether you need a second opinion on your AI roadmap or someone to actually build the thing, here&apos;s how engagements usually start.</p>
        </div>
        <div className="solutions-grid">
          {solutions.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Wire `Solutions` into `app/page.tsx`**

```tsx
import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProductsCarousel from '@/components/ProductsCarousel';
import Solutions from '@/components/Solutions';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <Hero />
        <ProductsCarousel />
        <Solutions />
      </main>
    </>
  );
}
```

- [ ] **Step 6: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000`, scroll to Solutions.
Expected: cream-background section with 3 centered cards (AI Strategy Consulting / Product Building / Contractual Employment), each with a large (64px) colored icon, no numbering, left-aligned bullet list inside each card, two soft blob shapes in the background. The "Contractual Employment" card's second bullet reads "Cross-industry engagements" (not "Telecom & financial services focus").

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/page.tsx lib/solutions.tsx components/SolutionCard.tsx components/Solutions.tsx
git commit -m "Add Solutions section with industry-agnostic copy"
```

---

### Task 8: About component

**Files:**
- Create: `components/About.tsx`
- Modify: `app/globals.css` (append about styles)
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `.section-deco` / `.bg-blob` classes from Task 1.
- Produces: `About` component (default export, no props), rendered in `app/page.tsx` after `Solutions`.

- [ ] **Step 1: Append about styles to `app/globals.css`**

```css
/* ===== ABOUT ===== */
.about-grid{max-width:640px; margin:0 auto; text-align:center;}
.about-copy p{font-size:16.5px; color:var(--ink); margin:0 0 18px;}
.about-copy p:last-child{margin-bottom:0;}
.signature-line{
  margin-top:26px; font-family:'IBM Plex Mono',monospace; font-size:12px;
  color:var(--grey-light);
}
```

- [ ] **Step 2: Write `components/About.tsx`**

```tsx
export default function About() {
  return (
    <section id="about" className="section-deco">
      <div className="bg-blob -about-a" aria-hidden="true"></div>
      <div className="bg-blob -about-b" aria-hidden="true"></div>
      <div className="wrap">
        <div className="about-grid">
          <p className="kicker">About</p>
          <h2 style={{ margin: '14px auto 22px', fontSize: 'clamp(28px, 4vw, 42px)', maxWidth: '16ch' }}>
            AI Strategy, Analytics &amp; CX Automation Leader
          </h2>
          <div className="about-copy">
            <p>
              I spent close to a decade in consumer credit analytics before leading AI and CX transformation at
              Verizon, which gives me a foundation most AI builders don&apos;t have: how telecom and financial
              services actually make decisions under regulation, scale, and cost pressure.
            </p>
            <p>
              Today I design and build agentic AI systems — multi-agent pipelines, RAG architectures, CX
              automation — and advise teams on where AI investment actually pays off. Everything I build or
              recommend has to clear one bar: it solves a real problem, runs in production, and justifies its own
              cost.
            </p>
            <p>Based in Chennai, India. MBA, University of Sheffield.</p>
          </div>
          <p className="signature-line">Thought by Vinoth. Built with Claude.</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire `About` into `app/page.tsx`**

```tsx
import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProductsCarousel from '@/components/ProductsCarousel';
import Solutions from '@/components/Solutions';
import About from '@/components/About';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <Hero />
        <ProductsCarousel />
        <Solutions />
        <About />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000`, scroll to About (now after Solutions).
Expected: centered section mirroring the hero's treatment — kicker, large centered heading, centered body copy, centered signature line, orange/gold blob shapes in the background, no boxed panel.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/page.tsx components/About.tsx
git commit -m "Add About component, positioned after Solutions"
```

---

### Task 9: Footer component and final page assembly

**Files:**
- Create: `components/Footer.tsx`
- Modify: `app/globals.css` (append footer styles)
- Modify: `app/page.tsx` (final section order)

**Interfaces:**
- Produces: `Footer` component (default export, no props), rendered last in `app/page.tsx`.

- [ ] **Step 1: Append footer styles to `app/globals.css`**

```css
/* ===== FOOTER / CONTACT ===== */
footer{
  border-top:1px solid var(--line-soft);
  padding:64px 0 32px;
}
.footer-top{display:grid; grid-template-columns:1.3fr 1fr 1fr; gap:48px; padding-bottom:44px; border-bottom:1px solid var(--line-soft);}
@media(max-width:760px){ .footer-top{grid-template-columns:1fr; gap:32px;} }
.footer-brand p{font-size:14px; color:var(--grey); margin-top:12px; max-width:34ch;}
footer h4{font-family:'IBM Plex Mono',monospace; font-size:11.5px; text-transform:uppercase; letter-spacing:0.1em; color:var(--grey-light); margin-bottom:14px; font-weight:500;}
footer .flinks{list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; font-size:14px; color:var(--grey);}
footer .flinks a{transition:color .15s;}
footer .flinks a:hover{color:var(--accent-deep);}
.footer-bottom{
  display:flex; justify-content:space-between; align-items:center; padding-top:24px;
  font-size:12.5px; color:var(--grey-light); flex-wrap:wrap; gap:12px;
}
.footer-bottom .sig{font-family:'IBM Plex Mono',monospace;}
```

- [ ] **Step 2: Write `components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-name">firstbloc</span>
            <p>AI strategy, agentic products, and CX automation — built and advised on by Vinoth Nataraj.</p>
          </div>
          <div>
            <h4>Navigate</h4>
            <ul className="flinks">
              <li><a href="#about">About</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#solutions">Solutions</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul className="flinks">
              <li><a href="mailto:vinoth.n@outlook.com">vinoth.n@outlook.com</a></li>
              <li>
                <a href="https://linkedin.com/in/vinothnataraj" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/vinothnataraj
                </a>
              </li>
              <li><span>Chennai, India</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Vinoth Nataraj.</span>
          <span className="sig">Thought by Vinoth. Built with Claude.</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Write final `app/page.tsx`**

```tsx
import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProductsCarousel from '@/components/ProductsCarousel';
import Solutions from '@/components/Solutions';
import About from '@/components/About';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <Hero />
        <ProductsCarousel />
        <Solutions />
        <About />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000`, scroll through the whole page.
Expected: full page renders top to bottom as Nav → Hero → Products carousel → Solutions → About → Footer, with no console errors. Footer shows brand blurb, Navigate links, Contact links, copyright line.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/page.tsx components/Footer.tsx
git commit -m "Add Footer component and finalize page section order"
```

---

### Task 10: Production build and full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build completes successfully with no errors.

- [ ] **Step 3: Run production server and do a full manual pass**

Run: `npm start`, open `http://localhost:3000`

Verify, per the spec's Testing section:
- Carousel: swipe/drag, arrow clicks, dot clicks, and keyboard arrows all move between the 6 product cards correctly; arrows disable at the first/last card.
- `prefers-reduced-motion: reduce` (via devtools emulation): WorkflowGraph animations freeze to static; page still fully usable.
- Responsive check at mobile (~375px), tablet (~768px), and desktop (~1440px) widths — nav collapses to hamburger below 760px, carousel card sizing adjusts, solutions/footer grids stack on mobile.
- Visual parity check against the current static site (`/Users/vinoth/project/vinai-portfolio/index.html`, opened side-by-side) for Hero, Solutions, About, Footer — colors, spacing, and copy should match.
- Confirm `/Users/vinoth/project/vinai-portfolio/index.html` was not modified during this plan (`git status` in that directory, if applicable, or a diff against its last known content).

- [ ] **Step 4: Stop the production server** (Ctrl+C)

- [ ] **Step 5: Final commit** (only if any fixes were made during verification; otherwise skip)

```bash
git add -A
git commit -m "Fix issues found in production verification pass"
```
