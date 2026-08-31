'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'

/*
 * Article-column version of the home grid's before/after slider.
 * Unlike the tile (hover-gated, mouse only), the divider is always live:
 * it starts at center and follows any pointer — mouse or touch.
 */

type Props = {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  /** Intrinsic aspect ratio of the two images, e.g. 2016 / 1270 */
  aspect: number
}

export default function BeforeAfterHero({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  aspect,
}: Props) {
  const [pct, setPct] = useState(50)
  const ref = useRef<HTMLDivElement>(null)

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { left, width } = ref.current.getBoundingClientRect()
    setPct(Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100)))
  }, [])

  return (
    <div
      ref={ref}
      className="relative w-full touch-pan-y select-none overflow-hidden rounded-lg border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
      style={{ aspectRatio: aspect }}
      onPointerMove={onPointerMove}
      role="img"
      aria-label={`Interactive before and after comparison. Before: ${beforeAlt}. After: ${afterAlt}.`}
    >
      {/* After — base layer */}
      <Image
        src={afterSrc}
        alt=""
        fill
        priority
        sizes="(min-width: 860px) 860px, 100vw"
        className="object-cover"
      />

      {/* Before — revealed left of the divider */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        <Image
          src={beforeSrc}
          alt=""
          fill
          priority
          sizes="(min-width: 860px) 860px, 100vw"
          className="object-cover"
        />
      </div>

      {/* Divider line + handle */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pct}%` }}>
        <div className="absolute inset-y-0 w-px bg-white" />
        <div className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <path d="M4 1L1 5L4 9" stroke="black" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 1L13 5L10 9" stroke="black" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Before / After labels */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-between px-5">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
          before
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
          after
        </span>
      </div>
    </div>
  )
}
