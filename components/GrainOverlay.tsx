// Renders the single shared `site-grain` filter (see app/layout.tsx) as a
// full-bleed rect. All three call sites (Hero, Solutions, About) reference
// the same filter definition instead of each computing their own
// feTurbulence/feColorMatrix pass.
export default function GrainOverlay() {
  return (
    <svg className="grain-overlay" aria-hidden="true" preserveAspectRatio="none">
      <rect width="100%" height="100%" filter="url(#site-grain)" />
    </svg>
  );
}
