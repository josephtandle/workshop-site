import type { MetadataRoute } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const NOW = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Home
    { url: BASE, lastModified: NOW, changeFrequency: 'weekly', priority: 1 },

    // Sessions
    { url: `${BASE}/session/1`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/session/2`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/session/3`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/session/4`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/session/5`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },

    // Session sub-pages
    { url: `${BASE}/session/1/bonus`,       lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/session/2/guide`,       lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/session/2/prep`,        lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/session/3/guide`,       lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/session/3/prep`,        lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/session/3/bonus`,       lastModified: NOW, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/session/4/prep`,        lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/session/4/wrapup`,      lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/session/5/guide`,       lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/session/5/guide-brain`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },

    // Giveaways
    { url: `${BASE}/giveaways/web-design-arsenal`,          lastModified: NOW, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/giveaways/anthropic-safety-checklist`,  lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/giveaways/lead-magnet`,                 lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/giveaways/benchmark`,                   lastModified: NOW, changeFrequency: 'monthly', priority: 0.6 },

    // Lead magnets
    { url: `${BASE}/lead-magnets/ultimate-claudemd`,        lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
