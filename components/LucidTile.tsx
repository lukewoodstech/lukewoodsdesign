'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import TileFooter from './TileFooter'
import SearchMock from './lucid/SearchMock'
import { useEnterToOpen } from '@/lib/useEnterToOpen'

/*
 * The Lucid AI Find docs panel, rebuilt Figma-faithful in SearchMock and
 * run in compact tile mode: the loop opens on the zero-state screen, the
 * query types there, then the panel crossfades into the chat with results.
 * SearchMock owns its own scroll-in trigger and reduced-motion handling.
 */

// The mock's native layout box — it scales as one unit, never reflows.
const PANEL_W = 820
const PANEL_H = 400
const MAX_SCALE = 0.7

export default function LucidTile() {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  /*
   * 820px never fit a phone: the panel was clipped on both sides. Measure
   * the stage and shrink the whole panel to fit; on desktop the observer
   * settles at the original 0.7 so nothing changes there.
   */
  const [scale, setScale] = useState(MAX_SCALE)

  useEnterToOpen(hovered, '/work/lucid-ai')

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(
        Math.max(0.25, Math.min(MAX_SCALE, (width - 24) / PANEL_W, (height - 24) / PANEL_H)),
      )
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      className="workgrid__item"
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push('/work/lucid-ai')}
    >
      <div className="tile-stage" ref={stageRef}>
        {/* Dark overlay — behind the panel, darkens the tile margins on hover */}
        <div className="tile-scrim" style={{ opacity: hovered ? 1 : 0 }} />

        <div className="workgrid__item__content">
          {/* Fixed-size panel: one constant box through the whole loop,
              centered in the stage with dark margins on every side */}
          <div className="flex h-full w-full items-center justify-center">
            <SearchMock height={PANEL_H} width={PANEL_W} compact scale={scale} zeroState />
          </div>
        </div>
      </div>

      <TileFooter
        slug="lucid-ai"
        logoSrc="/logos/lucid.png"
        companyHref="https://lucid.co"
        hovered={hovered}
      />
    </div>
  )
}
