import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Nav from './Nav';

describe('Nav', () => {
  it('renders the brand and nav links', () => {
    render(<Nav />);
    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('Bloc')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Solutions' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: "Let's talk" })).toBeInTheDocument();
  });

  it('toggles the mobile menu open and closed when the hamburger is clicked', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const nav = screen.getByRole('link', { name: 'About' }).closest('nav');
    expect(nav).not.toHaveClass('open');

    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    await user.click(toggle);
    expect(nav).toHaveClass('open');

    await user.click(toggle);
    expect(nav).not.toHaveClass('open');
  });

  it('closes the mobile menu when a nav link is clicked', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    await user.click(toggle);

    const nav = screen.getByRole('link', { name: 'About' }).closest('nav');
    expect(nav).toHaveClass('open');

    await user.click(screen.getByRole('link', { name: 'About' }));
    expect(nav).not.toHaveClass('open');
  });
});
