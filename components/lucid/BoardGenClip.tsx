'use client'

import { useReducedMotion } from '@/lib/useReducedMotion'

/*
 * Looping capture of Build a diagram generating a board in a new tab:
 * containers and sticky notes materialize while "Generating board" runs.
 * Cropped to the canvas so only generated template content is in frame.
 * Reduced motion gets the still poster instead of the video.
 */

const POSTER = '/lucid-ai-tile-poster.jpg'

export default function BoardGenClip() {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={POSTER} alt="" className="lcs-shot w-full" />
    )
  }
  return (
    <video
      className="lcs-shot w-full"
      autoPlay
      muted
      loop
      playsInline
      poster={POSTER}
      aria-label="Screen capture: Lucid AI generating a whiteboard template, sections and sticky notes appearing one by one"
    >
      <source src="/lucid-ai-tile.webm" type="video/webm" />
      <source src="/lucid-ai-tile.mp4" type="video/mp4" />
    </video>
  )
}
