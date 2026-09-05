import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
import { products } from '@/lib/products';

describe('ProductCard', () => {
  it('renders the product title, problem, description, and tech tags', () => {
    const product = products.find((p) => p.id === 'pulseguard')!;
    render(<ProductCard product={product} />);

    expect(screen.getByRole('heading', { name: 'PulseGuard AI' })).toBeInTheDocument();
    expect(screen.getByText('The problem')).toBeInTheDocument();
    expect(screen.getByText(product.problem)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    product.techTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders the stage tag without the explore modifier for a shipped product', () => {
    const product = products.find((p) => p.id === 'pulseguard')!;
    render(<ProductCard product={product} />);
    expect(screen.getByText(product.stageTag)).not.toHaveClass('explore');
  });

  it('applies the explore modifier class for a product still in exploration', () => {
    const product = products.find((p) => p.id === 'founder-research')!;
    expect(product.isExploration).toBe(true);
    render(<ProductCard product={product} />);
    expect(screen.getByText(product.stageTag)).toHaveClass('explore');
  });

  it('renders a disabled "coming soon" state when demoUrl is a placeholder', () => {
    const product = products.find((p) => p.id === 'cfpb')!;
    expect(product.demoUrl).toBe('#');
    render(<ProductCard product={product} />);
    const demo = screen.getByText('Demo coming soon');
    expect(demo.tagName).toBe('SPAN');
    expect(demo).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByRole('link', { name: /view demo/i })).not.toBeInTheDocument();
  });

  it('renders a real external link when demoUrl is set', () => {
    const product = { ...products[0], demoUrl: 'https://example.com/demo' };
    render(<ProductCard product={product} />);
    const link = screen.getByRole('link', { name: /view demo/i });
    expect(link).toHaveAttribute('href', 'https://example.com/demo');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
