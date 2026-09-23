import { OG_SIZE, OG_CONTENT_TYPE, caseStudyOgImage } from '@/lib/og'
import { SITE } from '@/lib/site'

/*
 * This study's link-preview card. It exists as its own file because this
 * folder shadows app/work/[slug]/page.tsx, and a metadata file convention is
 * resolved per route segment: without this, the page shipped
 * `twitter:card: summary_large_image` and no image to go with it. See
 * caseStudyOgImage in lib/og for the whole story.
 */
export const alt = `Case study by ${SITE.name}, ${SITE.role}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return caseStudyOgImage('pattern-custom-reports')
}
