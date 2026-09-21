'use client'

import { useEffect, useRef, useState } from 'react'
import TileFooter from './TileFooter'
import SearchMock from './lucid/SearchMock'
import { useEnterToOpen } from '@/lib/useEnterToOpen'

/*
 * The Lucid AI Find docs panel, rebuilt Figma-faithful in SearchMock and
 * run in compact tile mode: the loop opens on the zero-state screen, the
 * query types there, then the panel crossfades into the chat with results.
 * SearchMock owns its own scroll-in trigger and reduced-motion handling.
 *
 * The stage behind it is Lucid orange (#F96B13, the brand orange carried by
 * the product marks in their own design file) rather than the grey every
 * other tile uses, and the panel rises from the bottom edge instead of
 * floating in the middle — the whole interface still reads, but it reads as
 * a product emerging from the card rather than a screenshot pinned to it.
 */

/*
 * The mock's native layout box — it scales as one unit, never reflows.
 * 700 wide, not the side panel's 820: the tile is width-bound on every
 * screen, so a narrower native box lands at a larger scale (0.67 → 0.8 on
 * a 1440px canvas) and the interface reads without zooming. Compact mode
 * already truncates the result descriptions, so nothing is clipped.
 */
const PANEL_W = 700
const PANEL_H = 400
const MAX_SCALE = 0.92
/* Orange showing down each side of the panel. */
const SIDE_GUTTER = 16
/* And a deeper band of it above — the headroom that makes the panel read as
   bottom-anchored. Proportional so a short stage doesn't crush the panel. */
const TOP_BAND = 0.17
const TOP_BAND_MIN = 18
/*
 * The panel is pushed this far past the stage's bottom edge. Only its
 * rounded bottom corners and border cross the line, so the interface is
 * whole — it just sits in the edge rather than on a shelf above it.
 */
const OVERHANG = 10

export default function LucidTile() {
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
      const topBand = Math.max(TOP_BAND_MIN, height * TOP_BAND)
      setScale(
        Math.max(
          0.25,
          Math.min(
            MAX_SCALE,
            (width - SIDE_GUTTER * 2) / PANEL_W,
            (height - topBand + OVERHANG) / PANEL_H,
          ),
        ),
      )
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      className="workgrid__item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="tile-stage tile-stage--lucid" ref={stageRef}>
        {/* Dark overlay — behind the panel, darkens the orange on hover */}
        <div className="tile-scrim" style={{ opacity: hovered ? 1 : 0 }} />

        <div className="workgrid__item__content">
          {/* Fixed-size panel, hung from the stage's bottom edge. The scale
              pulls from `bottom center`, so however far the panel shrinks
              its bottom edge stays on that line. */}
          <div className="lucid-riser" style={{ height: PANEL_H, bottom: -OVERHANG }}>
            <SearchMock
              height={PANEL_H}
              width={PANEL_W}
              compact
              scale={scale}
              origin="bottom center"
              zeroState
            />
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
