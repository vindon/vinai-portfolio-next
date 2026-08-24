import { solutions } from '@/lib/solutions';
import SolutionCard from './SolutionCard';
import GrainOverlay from './GrainOverlay';

export default function Solutions() {
  return (
    <section id="solutions" className="section-deco">
      <GrainOverlay id="grain-solutions" />
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
