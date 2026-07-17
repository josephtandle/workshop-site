import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/illy',
    },
    sitemap: [
      'https://workshop.mastermindshq.business/sitemap.xml',
    ],
  }
}
