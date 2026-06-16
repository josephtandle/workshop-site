import type { MetadataRoute } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const NOW = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Home
    { url: BASE, lastModified: NOW, changeFrequency: 'weekly', priority: 1 },
    { url: 'https://decks.mastermindshq.business/', lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },

    // Giveaways
    { url: `${BASE}/giveaways/cross-cli-compatibility-routing`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/giveaways/claude-md`,                   lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/giveaways/web-design-arsenal`,          lastModified: NOW, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/giveaways/anthropic-safety-checklist`,  lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/giveaways/lead-magnet`,                 lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/giveaways/benchmark`,                   lastModified: NOW, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/giveaways/maccleaner`,                 lastModified: NOW, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/giveaways/speak-human`,                 lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/giveaways/ray-dalio-council`,           lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/giveaways/cross-cli-compatibility-routing`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.8 },

    // Lead magnets
    { url: `${BASE}/lead-magnets/ultimate-claudemd`,        lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
