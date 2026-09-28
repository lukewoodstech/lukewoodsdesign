'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent } from 'react'
import Image from 'next/image'
import { useReducedMotion } from '@/lib/useReducedMotion'
import type { Quote } from '@/lib/about'

/*
 * Kind words as one quiet panel: the writers' faces in a row along the
 * top, one quote under them in the serif the section headings use, the
 * byline under that, and a hairline along the foot that fills over the
 * seconds before the panel moves on.
 *
 * The faces are the control. Each is a button that brings up its quote
 * and the one showing is ringed and in colour, so you can see how many
 * there are, who they are, and pick one, without arrows. This replaced
 * (2026-09-28, Luke: "more intentional, and clean") a panel that put a
 * decorative wall of empty tiles beside the quote and a pair of arrows
 * under it: the wall was texture with no job, and the arrows could not
 * say which quote you were on or who else was there.
 *
 * One panel has to pick a height, so the quote area reserves a fixed
 * number of lines (--kw-lines, per breakpoint in globals.css) and the
 * quotes in lib/about.ts are cut to fit it; the byline and the timer
 * never hop when it advances.
 *
 * It advances itself every ADVANCE_MS, and holds whenever advancing
 * would be rude: while the pointer is over it, while anything inside it
 * has keyboard focus, while the tab is in the background, while it is
 * scrolled out of view, and entirely under prefers-reduced-motion, where
 * the faces still work and nothing moves on its own. The timer line
 * pauses with it and starts over when it resumes, so the line never
 * promises a change it isn't going to make.
 */

/** How long each quote holds before the panel moves on. */
const ADVANCE_MS = 8000

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
  const barRef = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()

  const many = quotes.length > 1
  const paused = reduce || !many || hover || keyed || hidden || !seen

  /* Hold while the tab is in the background: come back after lunch and
     the panel should be where you left it, not four quotes along. */
  useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  /* And hold until it has been scrolled to. */
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setSeen(entry.isIntersecting), {
      threshold: 0.35,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused) return
    /* The timer line restarts in step with the timeout: a hold froze it
       part-way, and resuming from there would promise a change sooner
       than the fresh timeout below will deliver. */
    barRef.current?.getAnimations().forEach((a) => {
      a.currentTime = 0
    })
    const t = window.setTimeout(() => setI((prev) => (prev + 1) % quotes.length), ADVANCE_MS)
    return () => window.clearTimeout(t)
    /* `i` is the point: every change, face or timer, restarts the clock. */
  }, [i, paused, quotes.length])

  const q = quotes[i]

  /* Keyboard focus holds the panel; a mouse click on a face does not,
     or the panel would stop for good the moment someone used it and
     then looked away. :focus-visible is exactly that distinction. */
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (e.target.matches(':focus-visible')) setKeyed(true)
  }

  return (
    <div
      ref={rootRef}
      className="kw"
      role="group"
      aria-roledescription="carousel"
      aria-label="Recommendations"
      style={{ '--kw-ms': `${ADVANCE_MS}ms` } as CSSProperties}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={onFocus}
      onBlurCapture={() => setKeyed(false)}
    >
      {/* One quote needs no picker, and a row of one face is a badge. */}
      {many && (
        <ol className="kw__faces" aria-label="Who wrote them">
          {quotes.map((p, k) => (
            <li key={p.id}>
              <button
                type="button"
                className={`kw__face${k === i ? ' is-on' : ''}${p.avatar ? '' : ' kw__face--mono'}`}
                aria-pressed={k === i}
                aria-label={`${p.name}, ${p.title} at ${p.org}`}
                onClick={() => setI(k)}
              >
                {p.avatar ? (
                  <Image src={p.avatar} alt="" fill sizes="96px" />
                ) : (
                  <span className="kw__initials">{p.placeholder ? '?' : initials(p.name)}</span>
                )}
              </button>
            </li>
          ))}
        </ol>
      )}

      <figure className="kw__panel">
        {/* Keyed on the quote so React remounts them and the fade plays
            on every change. */}
        <blockquote key={q.id} className="kw__quote">
          <p>{q.quote}</p>
        </blockquote>
        <figcaption key={`${q.id}-who`} className="kw__who">
          {q.logo && (
            /* 20px marks, one of them an SVG, which the image optimizer
               won't serve without dangerouslyAllowSVG. */
            // eslint-disable-next-line @next/next/no-img-element
            <img className="kw__logo" src={q.logo} alt="" width={20} height={20} />
          )}
          <span className="kw__name">
            {q.name}
            {q.placeholder && (
              <span className="ph-tag" aria-label="placeholder">
                placeholder
              </span>
            )}
          </span>
          <span className="kw__role">
            {q.title}, {q.org}
          </span>
        </figcaption>
      </figure>

      {/* The timer: not a control, a reason. It says the change that is
          about to happen is on a clock, and how far along the clock is.
          Gone entirely when nothing advances on its own. */}
      {many && !reduce && (
        <span className="kw__timer" aria-hidden="true">
          <i ref={barRef} key={i} className={paused ? 'is-paused' : undefined} />
        </span>
      )}
    </div>
  )
}
