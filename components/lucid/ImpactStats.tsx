'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

/*
 * The impact strip under the hero: big numbers count up once when the strip
 * enters view, each tile rising in with a stagger and an accent rule drawing
 * beneath the number. Numeric values tween from zero; string values (like
 * "All") just fade in with the tile. Reduced motion renders the final state.
 * Numbers are decorative emphasis — each carries a visually-hidden static
 * value, and the label is regular text.
 */
export type ImpactStat = {
  value: number | string
  /** Rendered after the number, outside the count-up — e.g. '+' for "50+". */
  suffix?: string
  label: string
}

export default function ImpactStats({
  stats,
  kicker,
}: {
  stats: ImpactStat[]
  kicker?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const reducedMotion = useReducedMotion()
  const [counts, setCounts] = useState<number[]>(() =>
    stats.map((s) => (typeof s.value === 'number' ? 0 : NaN)),
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        setInView(true)
        const finals = stats.map((s) => (typeof s.value === 'number' ? s.value : NaN))
        if (reducedMotion) {
          setCounts(finals)
          return
        }
        const start = performance.now()
        const tick = (now: number) => {
          let done = true
          setCounts(
            finals.map((final, i) => {
              if (Number.isNaN(final)) return NaN
              // Same stagger as the CSS tile rise, so number and tile move together
              const t = Math.min(Math.max((now - start - i * 120) / 900, 0), 1)
              if (t < 1) done = false
              // Ease-out so the last digits settle instead of snapping
              return Math.round(final * (1 - Math.pow(1 - t, 3)))
            }),
          )
          if (!done) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [stats, reducedMotion])

  return (
    <div ref={ref} className={`lcs-impact ${inView ? 'is-inview' : ''}`}>
      <span className="cs-eyebrow">Impact</span>
      <div className="lcs-impact__grid">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="lcs-impact__tile"
            style={{ '--i': i } as React.CSSProperties}
          >
            <span className="lcs-impact__num">
              <span aria-hidden="true">
                {typeof stat.value === 'number' ? counts[i] : stat.value}
                {stat.suffix}
              </span>
              <span className="visually-hidden">
                {stat.value}
                {stat.suffix}
              </span>
            </span>
            <span className="lcs-impact__bar" aria-hidden="true" />
            <span className="lcs-impact__label">{stat.label}</span>
          </div>
        ))}
      </div>
      {kicker && <p className="lcs-impact__kicker">{kicker}</p>}
    </div>
  )
}
