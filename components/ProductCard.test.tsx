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

  it('renders a WorkflowGraph with one node per pipeline stage', () => {
    const product = products.find((p) => p.id === 'signalharvest')!;
    const { container } = render(<ProductCard product={product} />);
    expect(container.querySelectorAll('.wf-node')).toHaveLength(product.pipeline.length);
  });
});
