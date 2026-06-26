import { MetadataRoute } from 'next';

/** Canonical production domain */
const SITE_URL = 'https://abdullahbinzubairhashmi.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      // Canonical URL with trailing slash variant (helps some crawlers)
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ];
}
