const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
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
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
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
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
    ];
  },
};
export default nextConfig;
