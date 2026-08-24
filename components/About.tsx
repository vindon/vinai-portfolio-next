import GrainOverlay from './GrainOverlay';

export default function About() {
  return (
    <section id="about" className="section-deco">
      <GrainOverlay />
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
        </div>
      </div>
    </section>
  );
}
