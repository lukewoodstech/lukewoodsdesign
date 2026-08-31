import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, ogFonts } from '@/lib/og'
import { SITE } from '@/lib/site'

export const alt = `${SITE.name} · ${SITE.role}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return new ImageResponse(<OgCard title={SITE.name} eyebrow={SITE.role} />, {
    ...size,
    fonts: await ogFonts(),
  })
}
