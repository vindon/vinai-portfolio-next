import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders navigate links and the copyright line', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Solutions' })).toBeInTheDocument();
    expect(screen.getByText('© 2026 Vinoth Nataraj.')).toBeInTheDocument();
  });

  it('opens the LinkedIn link in a new tab safely', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /linkedin\.com/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
