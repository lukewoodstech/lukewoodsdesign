'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * The 3 → 7 count-up for the results component section. Animates once when
 * scrolled into view; with prefers-reduced-motion it just renders 7. The
 * number is decorative emphasis — the copy beside it carries the fact — so
 * the animating span is aria-hidden with a static accessible label.
 */
export default function ResultsCount() {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(3)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        // Reduced motion: land on the final value, no tween
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setValue(7)
          return
        }
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / 900, 1)
          setValue(3 + Math.round(t * 4))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span ref={ref}>
      <span className="lcs-count" aria-hidden="true">
        3&nbsp;→&nbsp;{value}
      </span>
      <span className="visually-hidden">from 3 fixed results to up to 7</span>
    </span>
  )
}
