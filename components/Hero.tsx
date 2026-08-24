import GrainOverlay from './GrainOverlay';

export default function Hero() {
  return (
    <section className="hero section-deco">
      <GrainOverlay id="grain-hero" />
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
