import { OG_SIZE, OG_CONTENT_TYPE, caseStudyOgImage } from '@/lib/og'
import { caseStudies, BESPOKE_SLUGS } from '@/lib/caseStudies'
import { SITE } from '@/lib/site'

export const alt = `Case study by ${SITE.name}, ${SITE.role}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  // The bespoke studies ship their own card from their own segment; generating
  // them here too would render the same image twice at build time.
  return caseStudies
    .filter((cs) => !BESPOKE_SLUGS.has(cs.slug))
    .map((cs) => ({ slug: cs.slug }))
}

/*
 * The card itself lives in lib/og (caseStudyOgImage) because the three
 * written studies shadow this template with their own route segments, and a
 * metadata file convention only attaches to the segment it sits in. Each of
 * those segments has its own opengraph-image.tsx calling the same helper.
 */
// params is a Promise as of Next 16.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return caseStudyOgImage(slug)
}
