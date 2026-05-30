import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Dalam aplikasi nyata, ini biasanya akan fetch data dari database
  // untuk menghasilkan daftar URL secara dinamis.
  
  const baseUrl = 'https://simple-next.example.com';
  
  // Contoh rute statis
  const staticRoutes = [
    '',
    '/seo',
    '/rsc',
    '/streaming',
    '/caching',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Contoh rute dinamis (di-hardcode untuk contoh ini, aslinya di-fetch)
  const dynamicProducts = [1, 2, 3].map((id) => ({
    url: `${baseUrl}/seo/${id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicProducts]
}
