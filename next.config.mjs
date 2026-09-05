const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.firstbloc.in' }],
        destination: 'https://firstbloc.in/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    const headers = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        // interest-cohort=() opted out of the abandoned FLoC proposal
        // and is inert in every current browser; browsing-topics=() is
        // the actual opt-out for its Topics API successor.
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
      },
      {
        key: 'Content-Security-Policy',
        // Nonce-based CSP (dropping 'unsafe-inline') was considered and
        // rejected: per Next's own docs, nonces require every page to
        // render dynamically, which would drop this entire site out of
        // static generation/CDN caching. That cost isn't justified here
        // — there's no dangerouslySetInnerHTML, no eval of untrusted
        // input, and no unsanitized template injection anywhere in this
        // codebase, so 'unsafe-inline' isn't standing in for a real gap.
        value: [
          "default-src 'self'",
          // 'unsafe-eval' is dev-only: Next's dev server (Fast Refresh /
          // the error overlay) uses eval() to rebuild readable stack
          // traces. React never calls eval() in a production build, so
          // production keeps the strict policy without it.
          `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${isDev ? " 'unsafe-eval'" : ''}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self' data:",
          "connect-src 'self' https://cloudflareinsights.com https://*.cloudflareinsights.com",
          "object-src 'none'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          // HSTS and upgrade-insecure-requests both assume the origin is
          // actually served over HTTPS. `next dev` is plain HTTP on
          // localhost with no certificate — upgrade-insecure-requests there
          // makes WebKit/Safari rewrite every subresource request to
          // https://localhost, which then fails outright with a TLS error
          // (Chromium happens to exempt localhost from this; Safari does
          // not). Both are production-only.
          ...(isDev ? [] : ['upgrade-insecure-requests']),
        ].join('; '),
      },
      // Same reasoning as upgrade-insecure-requests above: meaningless (and
      // ignored per-spec over plain HTTP by compliant browsers, but not
      // worth sending at all) on the dev server.
      ...(isDev
        ? []
        : [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
          ]),
    ];

    return [{ source: '/:path*', headers }];
  },
};
export default nextConfig;
