# vinai portfolio — React/Next.js rebuild with animated Products carousel

## Overview

Rebuild the vinai portfolio site (currently a single static HTML file at
`/Users/vinoth/project/vinai-portfolio/index.html`) as a Next.js
application, and replace the static 2-column Products grid with a
polished, swipeable carousel. Each product card gets an animated SVG
"workflow" diagram behind it, tracing that product's actual pipeline
stages, rendered in the card's existing accent color.

The old static site is left untouched as a fallback until the new one
is approved and deployed.

## Goals

- Visual and content parity with the current approved design for Hero,
  About, Solutions, and Footer — these are ported as React components,
  not redesigned.
- Products section becomes a horizontal scroll-snap carousel: arrow +
  dot navigation, next-card peek, native swipe/trackpad/drag, keyboard
  arrow support. No page-scroll hijacking — swiping is discoverable,
  not forced.
- Each product card has an animated SVG node-graph background themed
  to that product's pipeline, sitting at low opacity behind the
  existing card content (icon, stage pill, title, problem box,
  description, tech chips).
- Respects `prefers-reduced-motion`.

## Non-goals

- No CMS, no blog, no backend/API routes.
- No automated test suite — this is a small portfolio site; manual
  browser verification (desktop + mobile widths, keyboard nav, reduced
  motion) is the verification method.
- No deployment automation in this spec — deployment to Vercel happens
  as a separate step once the app is verified locally.

## Stack

- Next.js 15, App Router, TypeScript.
- Plain CSS (`app/globals.css`) carrying over the existing design
  tokens (colors, radii, shadow values, spacing) from the current
  site's `:root` custom properties, so visual output matches exactly.
- No UI framework/component library, no Tailwind — the current site's
  design system is already token-based CSS, so porting it directly is
  the lowest-risk path to parity.
- No animation library — carousel uses native CSS scroll-snap;
  WorkflowGraph animation uses CSS (`@keyframes`) on SVG elements, no
  GSAP/Lottie/canvas.

## Project structure

```
vinai-portfolio-next/
  app/
    layout.tsx        # fonts, metadata, globals.css import
    page.tsx           # assembles <Nav/><Hero/><ProductsCarousel/><Solutions/><About/><Footer/>
    globals.css         # ported design tokens + base styles
  components/
    Nav.tsx
    Hero.tsx
    ProductsCarousel.tsx   # client component
    ProductCard.tsx
    WorkflowGraph.tsx       # client component (CSS animation)
    Solutions.tsx
    SolutionCard.tsx
    About.tsx
    Footer.tsx
  lib/
    products.ts        # typed product data incl. `pipeline: string[]`
    solutions.ts        # typed solutions data
  docs/superpowers/specs/   # this file
```

## Data model

`lib/products.ts` exports an array of:

```ts
type Product = {
  id: string;
  title: string;
  stageTag: string;         // e.g. "Production-grade build"
  isExploration?: boolean;  // controls muted stage-tag styling
  problem: string;
  description: string;
  techTags: string[];
  color: string;             // --tcolor equivalent, hex
  tint: string;               // --ttint equivalent
  icon: React.ReactNode;      // existing inline SVG icon, ported as-is
  pipeline: string[];         // node labels for WorkflowGraph
};
```

Pipeline labels per product (illustrative/decorative — background
visual texture, not a literal technical diagram):

| Product | Pipeline nodes |
|---|---|
| PulseGuard AI | Sentinel → Triage → Resolver → Escalation |
| Telecom Call Intelligence | Ingest → Diarize → Extract → Classify → Validate → Score → Report |
| SignalHarvest AI | Sentinel → Classifier → Scorer → Curator → Publisher |
| CFPB Credit Agreement Intelligence | Scrape → Extract Pass 1 → Extract Pass 2 → Validate → Serve |
| Enterprise RAG Portfolio | Ingest → Embed → Retrieve → Rerank → Generate |
| Founder Research Intelligence Engine | Query → Research → Synthesize → Report |

All other copy (titles, problem statements, descriptions, tech tags,
stage tags) is carried over verbatim from the current site.

## ProductsCarousel mechanics

- Track: `overflow-x: auto; scroll-snap-type: x mandatory;` with
  scrollbar hidden via CSS. Each `ProductCard` has
  `scroll-snap-align: start` and is sized so the next card peeks in
  (~10-15% visible) on desktop, near-full-width on mobile — signals
  "there's more" without needing an explicit hint.
- Circular prev/next arrow buttons, disabled at the first/last card.
- Dot indicators below the track, one per product, reflecting the
  currently-active card.
- Active card tracked via `IntersectionObserver` on each card (threshold
  ~0.6); observer callback updates the active index used by dots/arrow
  disabled-state.
- Arrow/dot clicks call `scrollTo({ left, behavior: 'smooth' })` on the
  track ref, computed from the target card's offset.
- Keyboard: when the track (or a card) has focus, left/right arrow keys
  move to the previous/next card (same scrollTo path).
- Entrance animation: cards fade/slide up into view on first scroll
  into the section, matching the existing site's `.reveal` pattern
  (IntersectionObserver + CSS transition, not re-triggered per swipe).

## WorkflowGraph component

`<WorkflowGraph nodes={string[]} color={string} />`, absolutely
positioned behind the card's content (`z-index: 0; pointer-events:
none;`), opacity ~10-14%.

- Lays out `nodes.length` circles along a gentle arc within the SVG
  viewBox, sized to the card's dimensions.
- Circles: pulsing glow animation (`@keyframes pulse` on `opacity`/
  `r`), staggered per node via `animation-delay`.
- Connecting paths between consecutive nodes: `stroke-dasharray` +
  animated `stroke-dashoffset` for a "flowing" effect.
- All animation wrapped in `@media (prefers-reduced-motion: no-preference)`
  — under reduced motion, nodes/lines render static (no animation).
- Color driven entirely by the `color` prop (matches each card's
  existing accent), no per-product hardcoding inside the component.

## Visual design

Hero, About, Solutions, Footer are ported as React components with the
same markup/CSS already approved on the current static site (centered
hero, blob decorations, stat/proof badge, centered section heads,
problem-box/tech-chip product card styling reused inside
`ProductCard`, enlarged un-numbered Solutions icons). No redesign of
these sections in this pass — only their implementation moves from
static HTML to React components.

`ProductCard` internals (icon, stage-tag pill, title, problem box,
description, tech chips) are unchanged from the current design; only
the outer layout changes from a 2-column CSS grid to a single-row
scroll-snap track, with `WorkflowGraph` added as a background layer.

## Testing / verification

Manual browser verification only (`npm run dev`):

- Carousel: swipe/drag, arrow clicks, dot clicks, keyboard arrows —
  all move between cards correctly; arrows disable at the ends.
- `prefers-reduced-motion` respected (WorkflowGraph static, no
  scroll-snap smooth-scroll override needed since that's a discrete
  jump either way).
- Responsive check at mobile (~375px), tablet (~768px), desktop
  (~1440px) widths.
- Visual parity check against the current static site for Hero, About,
  Solutions, Footer.

## Deployment

Out of scope for this spec. Once verified locally, deploy to Vercel as
a separate step (new Vercel project, domain decision deferred to the
user). The current static site at
`/Users/vinoth/project/vinai-portfolio/index.html` remains live/usable
as a fallback until the user is satisfied with the new site.
