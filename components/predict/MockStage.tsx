'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/*
 * Fits a mock designed at a fixed width into whatever box it is given, by
 * measuring the box and zooming the mock out. The same trick HeroMock uses
 * for the Lucid panel: nothing reflows, type stays proportional, and one
 * mock serves the hero laptop, a wide column, and a phone.
 *
 * `native` is the width the mock was designed for. Below it the stage
 * scales down; above it the mock just widens.
 */
export default function MockStage({
  children,
  native = 1180,
  className = '',
}: {
  children: ReactNode
  native?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [w, setW] = useState<number | null>(null)
  const [h, setH] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    const box = inner.current
    if (!el || !box) return
    /* offsetHeight / clientWidth, never getBoundingClientRect: the inner box
       is scaled with a transform, and a client rect would report the scaled
       height, which then gets scaled again. */
    const obs = new ResizeObserver(() => {
      setW(el.clientWidth)
      setH(box.offsetHeight)
    })
    obs.observe(el)
    obs.observe(box)
    return () => obs.disconnect()
  }, [])

  const scale = w && w < native ? w / native : 1
  const width = scale < 1 ? native : '100%'

  return (
    <div ref={ref} className={`pm-stage ${className}`.trim()} style={{ height: h ? h * scale : undefined }}>
      <div
        ref={inner}
        style={{ width, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  )
}
