import type { MetadataRoute } from 'next'
import { caseStudies } from '@/lib/caseStudies'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...caseStudies.map((cs) => ({
      url: `${SITE.url}/work/${cs.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
