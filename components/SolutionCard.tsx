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
