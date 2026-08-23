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
