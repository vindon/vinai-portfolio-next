import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero', () => {
  it('renders the headline and proof badge', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', { level: 1, name: /AI systems built for production/ })
    ).toBeInTheDocument();
    expect(screen.getByText('6 multi-agent, production-grade AI systems shipped')).toBeInTheDocument();
  });
});
