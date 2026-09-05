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
