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

  // "Hoth Landing Page" already names the company — an eyebrow would double it.
  const eyebrow =
    cs && !cs.title.toLowerCase().includes(cs.company.toLowerCase())
      ? cs.company
      : cs
        ? undefined
        : SITE.role

  return new ImageResponse(
    <OgCard title={cs?.title ?? SITE.name} eyebrow={eyebrow} accent={cs?.accent} />,
    { ...size, fonts: await ogFonts() },
  )
}
