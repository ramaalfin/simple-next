import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Berlaku untuk semua bot (Googlebot, Bingbot, dll)
      allow: '/',     // Mengizinkan crawl ke seluruh situs
      disallow: '/api/', // Mencegah bot meng-crawl folder API
    },
    sitemap: 'https://simple-next.example.com/sitemap.xml',
  }
}
