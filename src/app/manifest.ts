import { MetadataRoute } from 'next';

/**
 * Web App Manifest
 *
 * Enables PWA installability signals, improves search presence,
 * and provides browser-level branding (name, theme color, icons).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Abdullah Bin Zubair Hashmi — Portfolio',
    short_name: 'Abdullah BZH',
    description:
      'Professional portfolio of Abdullah Bin Zubair Hashmi — a Full Stack Developer specializing in Next.js, React, Three.js, and modern 3D web experiences.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050508',
    theme_color: '#050508',
    orientation: 'portrait-primary',
    lang: 'en',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['portfolio', 'developer', 'technology'],
  };
}
