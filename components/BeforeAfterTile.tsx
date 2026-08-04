'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import TileFooter from './TileFooter'

type Props = {
  slug: string
  href: string
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
}

// Tile is half the viewport on the desktop 2×2 grid, full width on mobile.
const TILE_SIZES = '(min-width: 768px) 50vw, 100vw'

export default function BeforeAfterTile({
  slug,
  href,
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: Props) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const [pct, setPct] = useState(50)
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { left, width } = ref.current.getBoundingClientRect()
    setPct(Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100)))
  }, [])

  return (
    <div
      ref={ref}
      className="workgrid__item"
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMove}
      onClick={() => router.push(href)}
    >
      <div className="tile-stage">
        {/* ── Mobile: static after image ── */}
        <div className="md:hidden absolute inset-x-0 bottom-4 top-8">
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            sizes={TILE_SIZES}
            className="object-contain object-bottom"
          />
        </div>

        {/* ── Desktop: full before/after slider ── */}
        <div className="hidden md:block">
          {/* Dark overlay — behind images */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'rgba(0, 0, 0, 0.72)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />

          {/* After — base layer */}
          <div className="absolute inset-x-0 bottom-4 top-8">
            <Image
              src={afterSrc}
              alt={afterAlt}
              fill
              sizes={TILE_SIZES}
              className="object-contain object-bottom"
            />
          </div>

          {/* Before — revealed left of cursor on hover */}
          <div
            className="absolute inset-x-0 bottom-4 top-8"
            style={{
              clipPath: `inset(0 ${100 - pct}% 0 0)`,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <Image
              src={beforeSrc}
              alt={beforeAlt}
              fill
              sizes={TILE_SIZES}
              className="object-contain object-bottom"
            />
          </div>

          {/* Divider line + handle */}
          <div
            className="absolute inset-y-0 pointer-events-none"
            style={{
              left: `${pct}%`,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <div className="absolute inset-y-0 w-px bg-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                <path d="M4 1L1 5L4 9" stroke="black" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 1L13 5L10 9" stroke="black" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Before / After labels */}
          <div
            className="absolute bottom-4 inset-x-0 flex justify-between px-5 pointer-events-none"
            style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s ease' }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white">before</span>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white">after</span>
          </div>
        </div>
      </div>

      <TileFooter slug={slug} hovered={hovered} />
    </div>
  )
}
