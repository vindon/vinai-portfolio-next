import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the section heading and signature line', () => {
    render(<About />);
    expect(
      screen.getByRole('heading', { name: /AI Strategy, Analytics & CX Automation Leader/ })
    ).toBeInTheDocument();
    expect(screen.getByText('Thought by Vinoth. Built with Claude.')).toBeInTheDocument();
  });
});
