'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

/*
 * The big numbers under "The impact": silver-gradient figures that count
 * up once when the strip enters view, each rising in on a stagger, with an
 * italic caption beneath. Numeric values tween from zero; string values
 * ("All") just rise with their tile. Every number carries a visually-hidden
 * static value so the count-up is decoration, not content.
 *
 * Same count-up as ImpactStats, different clothes — this is the story
 * edition's version of the same hook.
 */
export type BigStat = {
  value: number | string
  /** Rendered after the number, outside the count-up: '+' for "20+". */
  suffix?: string
  caption: ReactNode
}

export default function BigStats({
  stats,
  small = false,
}: {
  stats: BigStat[]
  /** The smaller cut, for long figures like "45.9M" or "+4.5%". */
  small?: boolean
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
              const t = Math.min(Math.max((now - start - i * 110) / 1100, 0), 1)
              if (t < 1) done = false
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
    <div
      ref={ref}
      className={`cs-bigstats ${small ? 'cs-bigstats--sm' : ''} ${inView ? 'is-inview' : ''}`}
      style={{ '--n': stats.length } as React.CSSProperties}
    >
      {stats.map((stat, i) => (
        <div key={i} className="cs-bigstat" style={{ '--i': i } as React.CSSProperties}>
          <span className="cs-bigstat__num">
            <span aria-hidden="true">
              {typeof stat.value === 'number' ? counts[i] : stat.value}
              {stat.suffix && <small>{stat.suffix}</small>}
            </span>
            <span className="visually-hidden">
              {stat.value}
              {stat.suffix}
            </span>
          </span>
          <span className="cs-bigstat__cap">{stat.caption}</span>
        </div>
      ))}
    </div>
  )
}
