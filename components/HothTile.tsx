'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Michroma } from 'next/font/google'
import GateModal from './GateModal'
import TileFooter from './TileFooter'
import { unlockCaseStudy } from '@/app/work/[slug]/actions'
import { UNLOCK_HINT_COOKIE } from '@/lib/gate'
import { getCaseStudy } from '@/lib/caseStudies'
import { useEnterToOpen } from '@/lib/useEnterToOpen'
import { useReducedMotion } from '@/lib/useReducedMotion'

const michroma = Michroma({ weight: '400', subsets: ['latin'] })

/*
 * Hoth — black monolith brand lockup. Hovering "decrypts" the tile: a field
 * of flipping binary digits materializes around the cursor, and the wordmark
 * takes short RGB-split glitch bursts.
 */

const CELL_W = 14
const CELL_H = 17
const RADIUS = 140

// Deterministic per-cell hash so the binary field needs no stored state
function cellHash(cx: number, cy: number) {
  let h = (cx * 374761393 + cy * 668265263) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return (h ^ (h >>> 16)) >>> 0
}

export default function HothTile() {
  const router = useRouter()
  const reducedMotion = useReducedMotion()
  const [hovered, setHovered]     = useState(false)
  const [glitchOn, setGlitchOn] = useState(false)

  /*
   * Reduced motion means the wordmark never glitches. Derived rather than
   * forced into state from an effect: an effect whose only job is
   * setState(false) on mount renders twice and trips
   * react-hooks/set-state-in-effect, and the burst loop below simply never
   * starts under the preference, so nothing would ever set it back.
   */
  const glitching = !reducedMotion && glitchOn
  const tileRef    = useRef<HTMLDivElement>(null)
  const stageRef   = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const mouseRef   = useRef({ x: -9999, y: -9999 })
  const rafRef     = useRef(0)
  const fadeRef    = useRef(0)
  const hoveredRef = useRef(false)
  const runningRef = useRef(false)
  const [gateOpen, setGateOpen] = useState(false)

  /*
   * This study is password-gated. Instead of navigating to the gate page,
   * ask for the password right here in a modal; once the unlock cookie is
   * set (readable via its hint twin) the tile navigates like any other.
   */
  const openStudy = () => {
    if (document.cookie.split('; ').some((c) => c.startsWith(`${UNLOCK_HINT_COOKIE}=1`))) {
      router.push('/work/hoth')
    } else {
      setGateOpen(true)
    }
  }

  useEnterToOpen(hovered && !gateOpen, openStudy)

  // Coordinates are relative to the stage — the canvas only covers the artwork
  const trackMouse = (e: React.MouseEvent) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  // Binary field around the cursor; keeps running after unhover to fade out
  useEffect(() => {
    hoveredRef.current = hovered
    // Pure decoration, and hover-only — reduced motion just skips it.
    if (reducedMotion) return
    if (!hovered || runningRef.current) return
    const stage  = stageRef.current
    const canvas = canvasRef.current
    const ctx    = canvas?.getContext('2d')
    if (!stage || !canvas || !ctx) return

    // Clamped like LucidTile — a 3× retina backing store buys nothing here.
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = stage.clientWidth
    const h = stage.clientHeight
    canvas.width  = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.font = '11px ui-monospace, Menlo, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    runningRef.current = true
    const frame = (ts: number) => {
      const target = hoveredRef.current ? 1 : 0
      fadeRef.current += (target - fadeRef.current) * 0.1
      ctx.clearRect(0, 0, w, h)
      if (!hoveredRef.current && fadeRef.current < 0.02) {
        fadeRef.current = 0
        runningRef.current = false
        return
      }

      const { x, y } = mouseRef.current
      const c0 = Math.max(0, Math.floor((x - RADIUS) / CELL_W))
      const c1 = Math.min(Math.ceil(w / CELL_W), Math.ceil((x + RADIUS) / CELL_W))
      const r0 = Math.max(0, Math.floor((y - RADIUS) / CELL_H))
      const r1 = Math.min(Math.ceil(h / CELL_H), Math.ceil((y + RADIUS) / CELL_H))

      for (let cy = r0; cy < r1; cy++) {
        for (let cx = c0; cx < c1; cx++) {
          const px = cx * CELL_W + CELL_W / 2
          const py = cy * CELL_H + CELL_H / 2
          const d = Math.hypot(px - x, py - y)
          if (d > RADIUS) continue
          const hash = cellHash(cx, cy)
          // each cell flips 0/1 on its own clock, with per-cell shimmer
          const period  = 180 + (hash % 7) * 110
          const bit     = ((hash >>> 3) + Math.floor(ts / period)) & 1
          const flicker = 0.4 + 0.6 * ((cellHash(hash, Math.floor(ts / 130)) % 1000) / 1000)
          let a = Math.pow(1 - d / RADIUS, 1.7) * flicker * fadeRef.current
          if (hash % 11 === 0) a = Math.min(1, a * 1.8)
          ctx.fillStyle = `rgba(255,255,255,${(a * 0.8).toFixed(3)})`
          ctx.fillText(bit ? '1' : '0', px, py)
        }
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
  }, [hovered, reducedMotion])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  // Random short glitch bursts on the wordmark — always alive so the tile
  // reads as encrypted at rest, sparser when idle and more frequent under
  // the cursor (cadence reads hoveredRef so hovering doesn't reset the loop)
  useEffect(() => {
    // Nothing to schedule: `glitching` is already false above.
    if (reducedMotion) return
    let alive = true
    let timer: ReturnType<typeof setTimeout>
    const burst = () => {
      if (!alive) return
      setGlitchOn(true)
      timer = setTimeout(() => {
        if (!alive) return
        setGlitchOn(false)
        const lull = hoveredRef.current
          ? 700 + Math.random() * 1600
          : 2200 + Math.random() * 2800
        timer = setTimeout(burst, lull)
      }, 140 + Math.random() * 140)
    }
    timer = setTimeout(burst, 400 + Math.random() * 900)
    return () => { alive = false; clearTimeout(timer) }
  }, [reducedMotion])

  return (
    <div
      ref={tileRef}
      className="workgrid__item"
      style={{ cursor: 'pointer' }}
      onMouseEnter={(e) => { trackMouse(e); setHovered(true) }}
      onMouseMove={trackMouse}
      onMouseLeave={() => setHovered(false)}
      onClick={openStudy}
    >
      <div ref={stageRef} className="tile-stage">
        {/* Dark overlay — behind everything, darkens the tile background on hover */}
        <div className="tile-scrim" style={{ opacity: hovered ? 1 : 0 }} />

        {/* Binary field — revealed around the cursor on hover */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />

        {/* Brand lockup */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none ${michroma.className} ${glitching ? 'hoth-glitching' : ''}`}
        >
          <div
            className="hoth-wordmark"
            data-text="HOTH"
            style={{
              fontSize: 'clamp(2.6rem, 5.4vw, 4rem)',
              letterSpacing: '0.14em',
              paddingLeft: '0.14em',
              lineHeight: 1,
              color: '#fff',
              // Stands in for the glow the lock used to carry on hover
              textShadow: hovered
                ? '0 0 14px rgba(56,189,248,0.55), 0 0 36px rgba(56,189,248,0.25)'
                : 'none',
              transition: 'text-shadow 0.45s ease',
            }}
          >
            HOTH
          </div>

          <div
            className="hoth-tagline"
            style={{
              marginTop: '1.4rem',
              fontSize: 'clamp(0.66rem, 1.05vw, 0.86rem)',
              letterSpacing: '0.32em',
              paddingLeft: '0.32em',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            WORK, ENCRYPTED
          </div>
        </div>
      </div>

      <TileFooter
        slug="hoth"
        logoSrc="/logos/hoth.png"
        companyHref="https://hoth.com"
        hovered={hovered}
      />

      <GateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        slug="hoth"
        company={getCaseStudy('hoth')?.company ?? 'Hoth'}
        title={getCaseStudy('hoth')?.title ?? 'Hoth'}
        action={unlockCaseStudy}
      />
    </div>
  )
}
