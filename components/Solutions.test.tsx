import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Solutions from './Solutions';
import { solutions } from '@/lib/solutions';

describe('Solutions', () => {
  it('renders the section heading and one card per solution', () => {
    render(<Solutions />);
    expect(screen.getByRole('heading', { name: 'How to work with me.' })).toBeInTheDocument();
    solutions.forEach((solution) => {
      expect(screen.getByRole('heading', { name: solution.title })).toBeInTheDocument();
    });
  });
});
