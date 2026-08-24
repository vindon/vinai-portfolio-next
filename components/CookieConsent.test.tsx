import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const STORAGE_KEY = 'vinai-cookie-consent';

async function loadComponent(token: string | undefined) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_CF_BEACON_TOKEN', token ?? '');
  const mod = await import('./CookieConsent');
  return mod.default;
}

describe('CookieConsent', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllEnvs();
    // next/script injects <script> tags directly into the document outside
    // React's tree for the 'afterInteractive' strategy, so unmounting via
    // RTL's cleanup() doesn't remove them — clean up manually so one test's
    // accepted-consent script doesn't leak into the next test's assertions.
    document.querySelectorAll('script[src*="cloudflareinsights"]').forEach((el) => el.remove());
  });

  it('renders nothing when no analytics token is configured', async () => {
    const CookieConsent = await loadComponent(undefined);
    const { container } = render(<CookieConsent />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the banner on first visit when a token is configured', async () => {
    const CookieConsent = await loadComponent('test-token');
    render(<CookieConsent />);
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /cookie notice/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument();
  });

  it('hides the banner and stores the choice after accepting', async () => {
    const user = userEvent.setup();
    const CookieConsent = await loadComponent('test-token');
    render(<CookieConsent />);

    const acceptButton = await screen.findByRole('button', { name: 'Accept' });
    await user.click(acceptButton);

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('accepted');
    expect(screen.queryByRole('dialog', { name: /cookie notice/i })).not.toBeInTheDocument();
  });

  it('hides the banner and stores the choice after declining, without loading the beacon script', async () => {
    const user = userEvent.setup();
    const CookieConsent = await loadComponent('test-token');
    render(<CookieConsent />);

    const declineButton = await screen.findByRole('button', { name: 'Decline' });
    await user.click(declineButton);

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('declined');
    expect(screen.queryByRole('dialog', { name: /cookie notice/i })).not.toBeInTheDocument();
    expect(document.querySelector('script[src*="cloudflareinsights"]')).not.toBeInTheDocument();
  });

  it('does not show the banner again once a choice was already stored', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'accepted');
    const CookieConsent = await loadComponent('test-token');
    render(<CookieConsent />);

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /cookie notice/i })).not.toBeInTheDocument();
    });
  });
});
