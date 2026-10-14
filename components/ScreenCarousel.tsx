'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Screen } from '@/lib/caseStudies'

/*
 * Three (or so) full phone screens, side by side where there is room and
 * one at a time on a phone, in a scroll-snap row the reader can drag or
 * step through. The row is plain overflow scrolling, so it works with no
 * JS at all; the arrows and the dots are a convenience layered on top,
 * and the dots double as the screen names. Every screen is a real
 * capture at the device's own aspect (393 × 852 points), framed with the
 * same thin bezel the home tiles use.
 */
export default function ScreenCarousel({ screens }: { screens: Screen[] }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  // Which screen is nearest the row's left edge, for the dots.
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const onScroll = () => {
      const items = Array.from(row.children) as HTMLElement[]
      const left = row.scrollLeft
      let best = 0
      let bestDist = Infinity
      items.forEach((el, i) => {
        const d = Math.abs(el.offsetLeft - left)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setIndex(best)
    }
    row.addEventListener('scroll', onScroll, { passive: true })
    return () => row.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (i: number) => {
    const row = rowRef.current
    const el = row?.children[i] as HTMLElement | undefined
    if (!row || !el) return
    row.scrollTo({ left: el.offsetLeft, behavior: 'smooth' })
  }

  return (
    <div className="cs-screens">
      <div ref={rowRef} className="cs-screens__row" role="group" aria-label="App screens">
        {screens.map((s) => (
          <figure key={s.src} className="cs-screens__item">
            <div className="cs-screens__phone">
              <Image
                src={s.src}
                alt={s.alt}
                width={1206}
                height={2622}
                sizes="(min-width: 860px) 280px, 70vw"
              />
            </div>
            <figcaption className="cs-screens__name">{s.label}</figcaption>
          </figure>
        ))}
      </div>
      <div className="cs-screens__nav">
        <button
          type="button"
          className="cs-screens__arrow"
          aria-label="Previous screen"
          onClick={() => goTo(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          ←
        </button>
        <ol className="cs-screens__dots">
          {screens.map((s, i) => (
            <li key={s.src}>
              <button
                type="button"
                className={`cs-screens__dot${i === index ? ' is-current' : ''}`}
                aria-label={`Show ${s.label}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => goTo(i)}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="cs-screens__arrow"
          aria-label="Next screen"
          onClick={() => goTo(Math.min(screens.length - 1, index + 1))}
          disabled={index === screens.length - 1}
        >
          →
        </button>
      </div>
    </div>
  )
}
