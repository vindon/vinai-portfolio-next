import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'firstbloc — Vinoth Nataraj',
    short_name: 'firstbloc',
    description: 'AI strategy, agentic products, and CX automation by Vinoth Nataraj.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#1F1F1F',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
