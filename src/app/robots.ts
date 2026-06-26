import { MetadataRoute } from 'next';

/** Canonical production domain */
const SITE_URL = 'https://abdullahbinzubairhashmi.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all legitimate crawlers to index the public site
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',        // Admin dashboard — not for public indexing
          '/admin/*',      // All admin sub-routes
          '/api/',         // Internal API endpoints
          '/_next/',       // Next.js build artefacts
        ],
      },
      {
        // Prevent AI training scrapers from indexing the site
        userAgent: [
          'GPTBot',
          'Google-Extended',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
