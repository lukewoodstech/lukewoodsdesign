'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent } from 'react'
import Image from 'next/image'
import { useReducedMotion } from '@/lib/useReducedMotion'
import type { Quote } from '@/lib/about'

/*
 * Kind words as one panel: a wall of tiles on the left with the writer's
 * face set into it, their quote on the right, and two arrows under it.
 *
 * This shape replaced a two-column masonry wall on 2026-09-22, which had
 * itself replaced a carousel that morning. The carousel's problem was
 * real — one panel has to pick a height, and the old one picked the
 * tallest quote and left the short ones floating in an empty box — but
 * the fix is to cut the long quotes down to the same few lines, not to
 * put every word on the page at once. So the quotes in lib/about.ts are
 * trimmed to fit and the quote area reserves the same line count
 * whatever is in it (seven, eight on a narrow phone), which is what
 * keeps the byline and the arrows from hopping when it advances. The
 * quote sits at the bottom of that space, so a short one still lands
 * just above its byline.
 *
 * It advances itself every ADVANCE_MS, and stops whenever advancing
 * would be rude: while the pointer is over it, while anything inside it
 * has focus, while the tab is in the background, while it is scrolled
 * out of view, and entirely under prefers-reduced-motion — that reader
 * gets the arrows and nothing that moves on its own. Every quote is
 * reachable from the arrows, so nothing here is only available to
 * someone who waits.
 *
 * The tile wall is decoration and says so (aria-hidden): the name it
 * belongs to is in the byline. At phone width the tiles go away and the
 * face comes back as a 3rem tile above the quote, because three columns
 * of tiles on a 375px screen is three columns of nothing.
 */

/** How long each quote holds before the panel moves on. */
const ADVANCE_MS = 7000

/*
 * The wall, column by column: 'face' is the cell the headshot sits in,
 * and each column is nudged vertically so the grid reads as a wall that
 * carries on past the panel rather than a 3x4 table. The first column
 * is half off the left edge by design; .kwc clips it.
 */
const WALL: ReadonlyArray<{ cells: ReadonlyArray<'tile' | 'face'>; shift: string }> = [
  { cells: ['tile', 'tile', 'tile', 'tile'], shift: '-2.1rem' },
  { cells: ['tile', 'face', 'tile', 'tile'], shift: '1.4rem' },
  { cells: ['tile', 'tile', 'tile', 'tile'], shift: '-0.9rem' },
]

/** Up to two initials — "Dan Littlewood" → "DL", "Cher" → "C". */
function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '')).toUpperCase()
}

export default function Testimonials({ quotes }: { quotes: ReadonlyArray<Quote> }) {
  const [i, setI] = useState(0)
  const [hover, setHover] = useState(false)
  const [keyed, setKeyed] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [seen, setSeen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const reduce = useReducedMotion()

  const many = quotes.length > 1
  const go = useCallback(
    (step: number) => setI((prev) => (prev + step + quotes.length) % quotes.length),
    [quotes.length],
  )

  /* Hold while the tab is in the background: come back after lunch and
     the panel should be where you left it, not four quotes along. */
  useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  /* And hold until it has been scrolled to at least once. */
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setSeen(entry.isIntersecting),
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduce || !many || hover || keyed || hidden || !seen) return
    const t = window.setTimeout(() => go(1), ADVANCE_MS)
    return () => window.clearTimeout(t)
    /* `i` is the point: every change, arrow or timer, restarts the clock. */
  }, [i, reduce, many, hover, keyed, hidden, seen, go])

  const q = quotes[i]

  /* Keyboard focus holds the panel; a mouse click on an arrow does not,
     or the panel would stop for good the moment someone used it and
     then looked away. :focus-visible is exactly that distinction. */
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (e.target.matches(':focus-visible')) setKeyed(true)
  }

  return (
    <div
      ref={rootRef}
      className="kwc"
      role="group"
      aria-roledescription="carousel"
      aria-label="Recommendations"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={onFocus}
      onBlurCapture={() => setKeyed(false)}
    >
      <div className="kwc__wall" aria-hidden="true">
        <div className="kwc__cols">
          {WALL.map((col, c) => (
            <div key={c} className="kwc__col" style={{ '--kw-shift': col.shift } as CSSProperties}>
              {col.cells.map((cell, r) =>
                cell === 'face' ? (
                  <span key={r} className={`kwc__face ${q.avatar ? '' : 'kwc__face--mono'}`}>
                    {q.avatar ? (
                      /* Keyed on the quote so React remounts it and the
                         fade plays on every change. */
                      <Image
                        key={q.id}
                        src={q.avatar}
                        alt=""
                        fill
                        sizes="160px"
                        className="kwc__img"
                      />
                    ) : (
                      <span key={q.id} className="kwc__initials kwc__img">
                        {q.placeholder ? '?' : initials(q.name)}
                      </span>
                    )}
                  </span>
                ) : (
                  <span key={r} className="kwc__tile" />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <figure className="kwc__panel">
        <span className="kwc__mark" aria-hidden="true">
          &ldquo;
        </span>
        <blockquote key={q.id} className="kwc__quote">
          <p>{q.quote}</p>
        </blockquote>
        <figcaption key={`${q.id}-who`} className="kwc__who">
          <span className="kwc__name">
            {q.name}
            {q.placeholder && (
              <span className="ph-tag" aria-label="placeholder">
                placeholder
              </span>
            )}
          </span>
          <span className="kwc__dot" aria-hidden="true">
            &middot;
          </span>
          {/* Role and mark travel together: at phone width the byline
              breaks after the name, not between a company and its logo. */}
          <span className="kwc__org">
            <span className="kwc__role">
              {q.title} @ {q.org}
            </span>
            {q.logo && (
              /* 18px marks, one of them an SVG, which the image optimizer
                 won't serve without dangerouslyAllowSVG. */
              // eslint-disable-next-line @next/next/no-img-element
              <img className="kwc__logo" src={q.logo} alt="" width={18} height={18} />
            )}
          </span>
        </figcaption>

        {/* One quote needs no controls, and arrows that move nothing are
            the fake controls this site doesn't draw. */}
        {many && (
          <div className="kwc__nav">
            <button
              type="button"
              className="kwc__arrow"
              onClick={() => go(-1)}
              aria-label="Previous recommendation"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              className="kwc__arrow"
              onClick={() => go(1)}
              aria-label="Next recommendation"
            >
              <Chevron dir="right" />
            </button>
          </div>
        )}
      </figure>
    </div>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={dir === 'left' ? 'rotate(180 8 8)' : undefined}
      >
        <path d="M2.5 8h11" />
        <path d="M9.5 4l4 4-4 4" />
      </g>
    </svg>
  )
}
