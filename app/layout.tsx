import type { Metadata, Viewport } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import { siteUrl, siteTitle, siteDescription } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  // .kicker (the PRODUCTS/SOLUTIONS/ABOUT labels) renders this at
  // font-weight:700 — must stay loaded here or the browser synthesizes a
  // faux-bold instead of the real weight.
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    'AI strategy',
    'agentic AI',
    'CX automation',
    'multi-agent systems',
    'Vinoth Nataraj',
    'AI consulting',
  ],
  authors: [{ name: 'Vinoth Nataraj' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'vinai',
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1F1F1F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <body>
        {/* Defined once and shared by every GrainOverlay instance (Hero,
            Solutions, About) via url(#site-grain), instead of each section
            computing its own independent feTurbulence pass. */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="site-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.045 0" />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}
