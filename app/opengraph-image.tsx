import { ImageResponse } from 'next/og'
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, ogFonts } from '@/lib/og'
import { INTRO_LINES, INTRO_SENTENCE } from '@/lib/site'

export const alt = INTRO_SENTENCE
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/*
 * The preview shows what the first screen shows: the hero sentence, in the
 * same serif. No eyebrow — the byline underneath already says who and what,
 * and a label above the sentence would say it a third time.
 */
export default async function Image() {
  return new ImageResponse(<OgCard title={INTRO_LINES} />, {
    ...size,
    fonts: await ogFonts(),
  })
}
