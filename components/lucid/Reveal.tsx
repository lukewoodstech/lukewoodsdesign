'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/*
 * Scroll-linked reveal used across the Lucid case study. Adds .is-inview once
 * ~20% of the element enters the viewport; CSS does the rest (and the
 * prefers-reduced-motion override in globals.css neutralises it entirely).
 * Fires once — a case study is read downward, re-hiding on scroll-up is noise.
 */
export default function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  ...rest
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'figure'
} & Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  const ref = useRef<HTMLElement | null>(null)
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
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`lcs-reveal ${inView ? 'is-inview' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
