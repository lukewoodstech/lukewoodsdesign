import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, ogFonts } from '@/lib/og'
import { getCaseStudy, caseStudies } from '@/lib/caseStudies'
import { SITE } from '@/lib/site'

export const alt = `Case study by ${SITE.name}, ${SITE.role}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

// params is a Promise as of Next 16.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudy(slug)

  /*
   * A study swaps the home page's sentence for its own title, and takes the
   * eyebrow slot for the company in its own accent — which is the one thing
   * the title can't always be counted on to say.
   */
  return new ImageResponse(
    <OgCard title={cs?.title ?? SITE.name} eyebrow={cs?.company} accent={cs?.accent} />,
    { ...size, fonts: await ogFonts() },
  )
}
