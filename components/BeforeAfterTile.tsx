'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import TileFooter from './TileFooter'
import { useEnterToOpen } from '@/lib/useEnterToOpen'
import { useReducedMotion } from '@/lib/useReducedMotion'

type Props = {
  slug: string
  href: string
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  /** Passed straight through to TileFooter — this tile is company-agnostic. */
  logoSrc?: string
  companyHref?: string
}

// Tile is half the viewport on the desktop 2×2 grid, full width on mobile.
const TILE_SIZES = '(min-width: 768px) 50vw, 100vw'

/*
 * The scroll-in pass: one slow wipe left, one right, settle back at center.
 * Piecewise cosine-eased between these keyframes.
 */
const WIPE_MS = 4200
const WIPE_KEYS: Array<[number, number]> = [
  [0, 50],
  [0.34, 14],
  [0.74, 86],
  [1, 50],
]

function wipeAt(p: number) {
  for (let i = 1; i < WIPE_KEYS.length; i++) {
    const [t1, v1] = WIPE_KEYS[i]
    const [t0, v0] = WIPE_KEYS[i - 1]
    if (p <= t1) {
      const local = (p - t0) / (t1 - t0)
      const eased = 0.5 - 0.5 * Math.cos(local * Math.PI)
      return v0 + (v1 - v0) * eased
    }
  }
  return WIPE_KEYS[WIPE_KEYS.length - 1][1]
}

export default function BeforeAfterTile({
  slug,
  href,
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  logoSrc,
  companyHref,
}: Props) {
  const router = useRouter()
  const reducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [auto, setAuto] = useState(false)
  const [pct, setPct] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const hoveredRef = useRef(false)
  const rafRef = useRef(0)

  useEnterToOpen(hovered, href)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { left, width } = ref.current.getBoundingClientRect()
    setPct(Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100)))
  }, [])

  /*
   * The wipe used to exist only under a desktop cursor: at rest the tile
   * showed a mockup too small to read, and touch visitors never saw the
   * comparison at all. Now scroll-in plays one slow automatic pass (labels
   * up), then hover takes over on desktop; scrolling away re-arms it, same
   * as the Pattern tile's chart. Hovering mid-pass hands control straight
   * to the cursor. Reduced motion keeps the static after-image.
   */
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAuto(true)
        } else {
          setAuto(false)
          setPct(50)
        }
      },
      /*
       * 0.6, not lower: the tile's top sliver peeks above the fold on the
       * home hero, and a low threshold let the pass play while the tile was
       * still mostly off-screen — spent before anyone scrolled to it.
       */
      { threshold: 0.6 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    hoveredRef.current = hovered
    if (!auto) return
    // The first frame's hoveredRef check retires the pass when the cursor
    // takes over — no synchronous setState needed here.
    let start: number | null = null
    const frame = (ts: number) => {
      if (hoveredRef.current) { setAuto(false); return }
      if (start === null) start = ts
      const p = (ts - start) / WIPE_MS
      if (p >= 1) { setPct(50); setAuto(false); return }
      setPct(wipeAt(p))
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [auto, hovered])

  // Divider, labels and the before-layer show during the auto pass or under
  // the cursor; `hovered` alone can't cover mobile, where hover never fires.
  const revealed = auto || hovered

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
        {/* Dark overlay — behind images */}
        <div className="tile-scrim" style={{ opacity: hovered ? 1 : 0 }} />

        {/* After — base layer. Centered on mobile, where the full-height tile
            left the bottom-anchored art under a large empty region. */}
        <div className="absolute inset-x-0 bottom-4 top-8">
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            sizes={TILE_SIZES}
            className="object-contain object-center md:object-bottom"
          />
        </div>

        {/* Before — revealed right of the divider. The handle reads as a
            timeline scrubber between the label endpoints (before ← → after),
            so sliding right must land on the after screen, not grow the
            before region the way classic comparison sliders do. */}
        <div
          className="absolute inset-x-0 bottom-4 top-8"
          style={{
            clipPath: `inset(0 0 0 ${pct}%)`,
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            sizes={TILE_SIZES}
            className="object-contain object-center md:object-bottom"
          />
        </div>

        {/* Divider line + handle */}
        <div
          className="absolute inset-y-0 pointer-events-none"
          style={{
            left: `${pct}%`,
            opacity: revealed ? 1 : 0,
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
          style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.2s ease' }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">before</span>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">after</span>
        </div>
      </div>

      <TileFooter
        slug={slug}
        logoSrc={logoSrc}
        companyHref={companyHref}
        hovered={hovered}
      />
    </div>
  )
}
