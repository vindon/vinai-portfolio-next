function normalizedSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://firstbloc.in';
  try {
    // Throws on a malformed value (missing protocol, stray whitespace, etc.)
    // — fail safe to the placeholder rather than crashing every route that
    // imports this module.
    return new URL(raw).toString().replace(/\/$/, '');
  } catch {
    return 'https://firstbloc.in';
  }
}

export const siteUrl = normalizedSiteUrl();

export const siteTitle = 'firstbloc — Vinoth Nataraj | AI Strategy, Products & CX Automation';
export const siteDescription =
  'AI strategy, agentic products, and CX automation by Vinoth Nataraj. Consulting, product builds, and fractional engagements.';

// Case/whitespace-tolerant: this is set by hand in the Vercel dashboard
// (Project Settings > Environment Variables), not validated at write time,
// so a stray "True", "TRUE ", etc. shouldn't silently leave the real site
// live when the intent was to gate it.
export const isComingSoon = process.env.COMING_SOON?.trim().toLowerCase() === 'true';
