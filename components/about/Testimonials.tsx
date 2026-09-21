'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Quote } from '@/lib/about'

/*
 * Kind words as a carousel: one quote at a time on the right, and on the
 * left a mosaic of tiles where the middle one is whoever's talking.
 *
 * The arrows are real controls — they move to the previous and next
 * quote and wrap at the ends — and the counter between them is real
 * information, not decoration. The quote block is keyed on the index so
 * each change remounts it and the CSS entrance animation runs again.
 *
 * Placeholders render a visible tag and an initials tile in place of
 * the avatar. Real quotes with real names only land here by Luke
 * editing lib/about.ts.
 */
export default function Testimonials({ quotes }: { quotes: ReadonlyArray<Quote> }) {
  const [i, setI] = useState(0)
  const q = quotes[i]
  const n = quotes.length
  const go = (d: number) => setI((v) => (v + d + n) % n)

  /* 3×5 mosaic; the avatar lives in cell 7, the middle. */
  const cells = Array.from({ length: 15 }, (_, k) => k)

  return (
    <div className="kw" aria-roledescription="carousel" aria-label="What people I've worked with have said">
      <div className="kw__mosaic" aria-hidden="true">
        {cells.map((k) => (
          <span key={k} className={`kw__cell ${k === 7 ? 'is-face' : ''}`}>
            {k === 7 && (
              <span key={q.id} className="kw__face">
                {q.avatar ? (
                  <Image src={q.avatar} alt="" fill sizes="140px" />
                ) : (
                  <span className="kw__initials">{q.placeholder ? '?' : q.name.slice(0, 1)}</span>
                )}
              </span>
            )}
          </span>
        ))}
      </div>

      <div className="kw__body">
        <span className="kw__mark" aria-hidden="true">
          “
        </span>
        <figure key={q.id} className="kw__slide" aria-live="polite">
          <blockquote className="kw__quote">
            <p>{q.quote}</p>
          </blockquote>
          <figcaption className="kw__who">
            <span className="kw__name">
              {q.name}
              {q.placeholder && (
                <span className="ph-tag" aria-label="placeholder">
                  placeholder
                </span>
              )}
            </span>
            <span className="kw__title">
              {q.title} @ {q.org}
            </span>
          </figcaption>
        </figure>

        <div className="kw__nav">
          <button type="button" className="kw__btn" onClick={() => go(-1)} aria-label="Previous quote">
            ←
          </button>
          <span className="kw__count">
            {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
          <button type="button" className="kw__btn" onClick={() => go(1)} aria-label="Next quote">
            →
          </button>
        </div>
      </div>
    </div>
  )
}
