import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = 'https://abdullahbinzubairhashmi.me';
  
  return [
    {
      url: url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Add other public routes if you have them, e.g., /blog
  ];
}
