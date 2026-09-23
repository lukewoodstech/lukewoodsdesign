import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, ogFonts } from '@/lib/og'

export const alt = 'Nice to meet you. Luke Woods, Product Designer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/*
 * /about had no preview image at all, so it shared as a bare link. The card
 * shows what the page opens with: the greeting, in the same serif the page
 * sets it in. No eyebrow — the byline underneath already says who this is,
 * and "My story" over "Nice to meet you." would be the same sentence twice.
 */
export default async function Image() {
  return new ImageResponse(<OgCard title="Nice to meet you." />, {
    ...size,
    fonts: await ogFonts(),
  })
}
