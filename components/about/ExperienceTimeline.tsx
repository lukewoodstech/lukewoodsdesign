'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Role, Ongoing } from '@/lib/about'

/*
 * The experience rail: a dot per role down the middle of the page, a
 * line between each pair of dots, and a card hung off each dot — left,
 * right, left — with the company's mark, the role, the year in the
 * corner, and what the job actually was.
 *
 * The timeline draws itself as you scroll. It used to be a static
 * hairline with an accent-coloured fill running down it like a progress
 * bar, which said "here is how far through you are" — a scrollbar, not
 * a timeline. Now there is no line until the scroll draws it: each
 * segment scales from its upper dot toward the next as the middle of
 * the viewport crosses it (a --seg custom property, scaleY in CSS), and
 * each dot pops when the line arrives. Dots and lines share one colour
 * and are sized against each other rather than one dominating, and the
 * segments stop short at both ends so a dot is a dot and not a bead on
 * a wire.
 *
 * Cards fade in from their own side once a quarter of the card is on
 * screen — one IntersectionObserver for all of them.
 *
 * On a phone the rail moves to the left edge and every card hangs
 * right; the same DOM, only CSS changes.
 */

/* Must match --tl-node-top and --tl-sep in globals.css: where a dot sits
   inside its row, and the gap the line leaves around each dot. */
const NODE_TOP = 29.6 /* 1.85rem */
const SEP = 13

export default function ExperienceTimeline({
  roles,
  ongoing,
}: {
  roles: ReadonlyArray<Role>
  ongoing: ReadonlyArray<Ongoing>
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLLIElement>('.tl-item'))
    if (!items.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.25 },
    )
    items.forEach((el) => io.observe(el))

    /* Reduced motion gets the finished timeline, drawn, immediately. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((el) => {
        el.style.setProperty('--seg', '1')
        el.classList.add('is-passed')
      })
      return () => io.disconnect()
    }

    let raf = 0
    const paint = () => {
      raf = 0
      const mid = window.innerHeight * 0.5
      /* One read pass, then one write pass — measuring after a write
         would lay out the list again on every frame. */
      const tops = items.map((el) => el.getBoundingClientRect().top + NODE_TOP)
      items.forEach((el, i) => {
        el.classList.toggle('is-passed', tops[i] <= mid)
        const next = tops[i + 1]
        if (next === undefined) return
        const from = tops[i] + SEP
        const to = next - SEP
        const t = to <= from ? 1 : Math.min(1, Math.max(0, (mid - from) / (to - from)))
        el.style.setProperty('--seg', t.toFixed(3))
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={rootRef} className="tl">
      {/* The rail lives with the dated list only — "now" is not a year,
          so the line stops before the ongoing cards. */}
      <ol className="tl__list" aria-label="Experience, newest first">
        {roles.map((r, i) => (
          <li
            key={`${r.company}-${r.period}`}
            className={`tl-item ${i % 2 ? 'is-right' : 'is-left'}`}
          >
            <span className="tl-node" aria-hidden="true" />
            <article className={`tl-card${r.href ? ' tl-card--link' : ''}`}>
              <header className="tl-card__head">
                <span
                  className="tl-card__logo"
                  style={r.color ? { background: r.color } : undefined}
                  aria-hidden="true"
                >
                  {r.logo ? (
                    /* A plain <img>: these marks are 48px and one of them
                       is an SVG, which the image optimizer won't serve
                       without dangerouslyAllowSVG. */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.logo} alt="" width={48} height={48} />
                  ) : (
                    r.mark
                  )}
                </span>
                <span className="tl-card__title">
                  <span className="tl-card__role">
                    {r.href ? (
                      /* The whole card is this one link — its ::after
                         stretches over the card (see .tl-card__go). */
                      <Link
                        href={r.href}
                        className="tl-card__go"
                        aria-label={`${r.role} at ${r.company}: read the case study`}
                      >
                        {r.role}
                      </Link>
                    ) : (
                      r.role
                    )}
                  </span>
                  <span className="tl-card__co">@ {r.company}</span>
                </span>
                <span className="tl-card__year">{r.year}</span>
              </header>
              {/* Two summaries, one shown: CSS picks by width, and the
                  hidden one is `display: none`, so it is out of the
                  accessibility tree rather than read twice. */}
              <p className="tl-card__summary">{r.summary}</p>
              <p className="tl-card__summary tl-card__summary--short">{r.short}</p>
              <p className="tl-card__period">{r.period}</p>
              {/* The open badge, same as the work tiles: the only thing
                  that says "this opens", instead of a line of link text.
                  Decorative — the stretched link names the destination. */}
              {r.href && (
                <span className="tile-open" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17 17 7 M7 7h10v10" />
                  </svg>
                </span>
              )}
            </article>
          </li>
        ))}
      </ol>

      <ul className="tl__ongoing" aria-label="Alongside all of it">
        {ongoing.map((o) => (
          <li key={`${o.label}-${o.org}`} className="tl-ongoing">
            <span className="tl-ongoing__label">{o.label}</span>
            <span className="tl-ongoing__org">{o.org}</span>
            <span className="tl-ongoing__note">{o.note}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
