import type { Metadata, Viewport } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vinai.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'vinai — Vinoth Nataraj | AI Strategy, Products & CX Automation',
  description:
    'AI strategy, agentic products, and CX automation by Vinoth Nataraj. Consulting, product builds, and fractional engagements.',
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
    title: 'vinai — Vinoth Nataraj | AI Strategy, Products & CX Automation',
    description:
      'AI strategy, agentic products, and CX automation by Vinoth Nataraj. Consulting, product builds, and fractional engagements.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'vinai — Vinoth Nataraj | AI Strategy, Products & CX Automation',
    description:
      'AI strategy, agentic products, and CX automation by Vinoth Nataraj. Consulting, product builds, and fractional engagements.',
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
      <body>{children}</body>
    </html>
  );
}
