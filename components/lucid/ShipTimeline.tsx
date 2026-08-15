'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * Twelve weeks on one line. The fill draws left to right once the section
 * scrolls in; each release marker pops with a delay proportional to its
 * position, so the dots appear as the line reaches them. Below 40em the
 * horizontal form has no room for labels, so a vertical list (pure CSS swap
 * in globals) takes over — same data, no animation dependency.
 */
const STOPS = [
  { pct: 0, date: 'May 7', label: 'Research and design start' },
  { pct: 15, date: 'May 20', label: 'Development and design QA' },
  { pct: 82, date: 'Jul 20', label: 'Internal release' },
  { pct: 100, date: 'Aug 5', label: 'General release, all tiers' },
]

export default function ShipTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`lcs-tl ${inView ? 'is-inview' : ''}`}>
      {/* Horizontal (desktop / tablet) */}
      <div className="lcs-tl__horizontal" aria-hidden="true">
        <div className="lcs-tl__track mx-8 mt-24 mb-24">
          <div className="lcs-tl__fill" />
          {STOPS.map((s) => (
            <span
              key={s.date}
              className="lcs-tl__stop"
              style={{ left: `${s.pct}%`, animationDelay: `${0.15 + s.pct * 0.011}s` }}
            />
          ))}
          {STOPS.map((s, i) => (
            <span
              key={s.date}
              className="lcs-tl__label"
              style={{
                left: `${Math.min(Math.max(s.pct, 6), 94)}%`,
                top: i % 2 === 0 ? '1.4rem' : '-3.4rem',
              }}
            >
              <strong>{s.date}</strong>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/*
        Vertical form for phones. aria-hidden because the visually-hidden list
        below is the single accessible reading at every width — otherwise
        mobile screen readers would hear the milestones twice.
      */}
      <ul className="lcs-tl__vlist" aria-hidden="true">
        {STOPS.map((s) => (
          <li key={s.date}>
            <strong>{s.date}</strong>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
      <ul className="visually-hidden">
        {STOPS.map((s) => (
          <li key={s.date}>{`${s.date}: ${s.label}`}</li>
        ))}
      </ul>
    </div>
  )
}
