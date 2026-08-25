import type { MetadataRoute } from 'next'
import { caseStudies } from '@/lib/caseStudies'
import { PROTECTED_SLUGS } from '@/lib/gate'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      changeFrequency: 'monthly',
      priority: 1,
    },
    /*
     * Password-gated studies stay out: crawlers would only ever see the
     * lock screen, and a sitemap entry is an invitation to index it.
     */
    ...caseStudies
      .filter((cs) => !PROTECTED_SLUGS.has(cs.slug))
      .map((cs) => ({
        url: `${SITE.url}/work/${cs.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
  ]
}
