import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const url = 'https://abdullahbinzubairhashmi.me';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'], // Disallow crawling of internal or admin routes
      },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
