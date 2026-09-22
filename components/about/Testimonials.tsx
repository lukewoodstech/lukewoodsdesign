'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Quote } from '@/lib/about'

/*
 * Kind words as a carousel: one recommendation at a time, the person
 * who wrote it on the left, the quote on the right.
 *
 * The left panel used to be a 3×5 mosaic where fourteen of the fifteen
 * tiles were empty and one held the avatar. It was chrome pretending to
 * be content, so it's gone (2026-09-22); the panel is now one portrait
 * that changes with the quote, or the writer's initials when there's no
 * headshot to use. Headshots live in public/about/quotes/ and are
 * pointed at by `avatar` in lib/about.ts — anything without one falls
 * back to the monogram, so a missing file never breaks the section.
 *
 * Every control here does something: the arrows move and wrap, the
 * counter is real position, left/right keys work once focus is in the
 * carousel, and with only one quote the nav doesn't render at all
 * rather than shipping two buttons that return you to where you are.
 *
 * Placeholders render a visible tag and a "?" monogram. Real quotes
 * with real names only land here by Luke editing lib/about.ts.
 */

/** Up to two initials — "Dan Littlewood" → "DL", "Cher" → "C". */
function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '')).toUpperCase()
}

export default function Testimonials({ quotes }: { quotes: ReadonlyArray<Quote> }) {
  const [i, setI] = useState(0)
  const q = quotes[i]
  const n = quotes.length
  const go = (d: number) => setI((v) => (v + d + n) % n)

  return (
    <div
      className="kw"
      aria-roledescription="carousel"
      aria-label="What people I've worked with have said"
      onKeyDown={(e) => {
        if (n < 2) return
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          go(-1)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          go(1)
        }
      }}
    >
      {/* The face is decoration for the caption beside it — the name and
          title are already text, so this carries no alt of its own. */}
      <div className="kw__portrait" aria-hidden="true">
        <span key={q.id} className={`kw__face ${q.avatar ? '' : 'kw__face--mono'}`}>
          {q.avatar ? (
            <Image src={q.avatar} alt="" fill sizes="(max-width: 60em) 9rem, 15rem" className="kw__img" />
          ) : (
            <span className="kw__initials">{q.placeholder ? '?' : initials(q.name)}</span>
          )}
        </span>
      </div>

      <div className="kw__body">
        <span className="kw__mark" aria-hidden="true">
          “
        </span>
        {/* All of them are in the DOM, stacked in one grid cell, and only
            the current one is opaque. Two reasons: the card is always as
            tall as the longest quote, so clicking through doesn't resize
            the page under you, and that height is measured rather than
            guessed — add a longer recommendation and it still holds. */}
        <div className="kw__slides" aria-live="polite">
          {quotes.map((item, k) => (
            <figure
              key={item.id}
              className={`kw__slide ${k === i ? 'is-on' : ''}`}
              aria-hidden={k === i ? undefined : true}
            >
              <blockquote className="kw__quote">
                <p>{item.quote}</p>
              </blockquote>
              <figcaption className="kw__who">
                <span className="kw__name">
                  {item.name}
                  {item.placeholder && (
                    <span className="ph-tag" aria-label="placeholder">
                      placeholder
                    </span>
                  )}
                </span>
                <span className="kw__title">
                  {item.title} @ {item.org}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {n > 1 && (
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
        )}
      </div>
    </div>
  )
}
