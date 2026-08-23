import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import WorkflowGraph from './WorkflowGraph';

describe('WorkflowGraph', () => {
  it('renders one node circle per entry in the nodes array', () => {
    const { container } = render(<WorkflowGraph nodes={['A', 'B', 'C', 'D']} color="#FF4800" />);
    expect(container.querySelectorAll('.wf-node')).toHaveLength(4);
  });

  it('renders one fewer connecting line than there are nodes', () => {
    const { container } = render(<WorkflowGraph nodes={['A', 'B', 'C', 'D']} color="#FF4800" />);
    expect(container.querySelectorAll('.wf-line')).toHaveLength(3);
  });

  it('handles a single node without crashing and renders no connecting lines', () => {
    const { container } = render(<WorkflowGraph nodes={['Only']} color="#2F5D7C" />);
    expect(container.querySelectorAll('.wf-node')).toHaveLength(1);
    expect(container.querySelectorAll('.wf-line')).toHaveLength(0);
  });

  it('applies the given color to nodes and lines', () => {
    const { container } = render(<WorkflowGraph nodes={['A', 'B']} color="#3E6B45" />);
    expect(container.querySelector('.wf-node')).toHaveAttribute('fill', '#3E6B45');
    expect(container.querySelector('.wf-line')).toHaveAttribute('stroke', '#3E6B45');
  });

  it('marks the svg as decorative for assistive tech', () => {
    const { container } = render(<WorkflowGraph nodes={['A', 'B']} color="#FF4800" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
