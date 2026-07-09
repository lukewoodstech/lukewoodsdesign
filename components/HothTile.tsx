'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Michroma } from 'next/font/google'

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
  const [hovered, setHovered]     = useState(false)
  const [glitching, setGlitching] = useState(false)
  const tileRef    = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const mouseRef   = useRef({ x: -9999, y: -9999 })
  const rafRef     = useRef(0)
  const fadeRef    = useRef(0)
  const hoveredRef = useRef(false)
  const runningRef = useRef(false)

  const trackMouse = (e: React.MouseEvent) => {
    const rect = tileRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  // Binary field around the cursor; keeps running after unhover to fade out
  useEffect(() => {
    hoveredRef.current = hovered
    if (!hovered || runningRef.current) return
    const tile   = tileRef.current
    const canvas = canvasRef.current
    const ctx    = canvas?.getContext('2d')
    if (!tile || !canvas || !ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = tile.clientWidth
    const h = tile.clientHeight
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
  }, [hovered])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  // Random short glitch bursts on the wordmark while hovered
  useEffect(() => {
    if (!hovered) { setGlitching(false); return }
    let alive = true
    let timer: ReturnType<typeof setTimeout>
    const burst = () => {
      if (!alive) return
      setGlitching(true)
      timer = setTimeout(() => {
        if (!alive) return
        setGlitching(false)
        timer = setTimeout(burst, 700 + Math.random() * 1600)
      }, 140 + Math.random() * 140)
    }
    burst()
    return () => { alive = false; clearTimeout(timer) }
  }, [hovered])

  return (
    <div
      ref={tileRef}
      className="workgrid__item"
      style={{ cursor: 'pointer' }}
      onMouseEnter={(e) => { trackMouse(e); setHovered(true) }}
      onMouseMove={trackMouse}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push('/work/hoth')}
    >
      {/* Dark overlay — behind everything, darkens the tile background on hover */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(0,0,0,0.72)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Binary field — revealed around the cursor on hover */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />

      {/* Brand lockup */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none ${michroma.className} ${glitching ? 'hoth-glitching' : ''}`}
      >
        <svg
          width="130"
          viewBox="0 0 64 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{
            overflow: 'visible',
            filter: hovered
              ? 'drop-shadow(0 0 9px rgba(56,189,248,0.8)) drop-shadow(0 0 24px rgba(56,189,248,0.4))'
              : 'none',
            transition: 'filter 0.45s ease',
          }}
        >
          <defs>
            <linearGradient id="hoth-iron" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7b7b84" />
              <stop offset="0.5" stopColor="#55555e" />
              <stop offset="1" stopColor="#393940" />
            </linearGradient>
            <radialGradient id="hoth-keyhole-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#8de0ff" stopOpacity="0.95" />
              <stop offset="0.55" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Shackle — heavy wrought iron, swings open on hover */}
          <g
            style={{
              transformBox: 'fill-box',
              transformOrigin: '100% 100%',
              transform: hovered ? 'translateY(-3px) rotate(28deg)' : 'none',
              transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <path d="M20 34 V22 a12 12 0 0 1 24 0 V34" stroke="#5d5d66" strokeWidth="7.5" strokeLinecap="round" />
            <path d="M20 34 V22 a12 12 0 0 1 24 0 V34" stroke="#9a9aa4" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
          </g>

          {/* Body — shield-shaped iron, faint rune-glow rim on hover */}
          <path
            d="M14 32 H50 Q53 32 53 35 V54 Q53 63 45.5 66.5 L34.5 71 Q32 72 29.5 71 L18.5 66.5 Q11 63 11 54 V35 Q11 32 14 32 Z"
            fill="url(#hoth-iron)"
            stroke={hovered ? 'rgba(125,218,255,0.75)' : 'rgba(0,0,0,0.45)'}
            strokeWidth="1.2"
            style={{ transition: 'stroke 0.4s ease' }}
          />

          {/* Shackle collars — bosses where the legs enter the body */}
          <rect x="16.25" y="29.5" width="7.5" height="5.5" rx="1" fill="#4b4b53" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" />
          <rect x="40.25" y="29.5" width="7.5" height="5.5" rx="1" fill="#4b4b53" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" />

          {/* Iron straps with rivets */}
          <rect x="11" y="38" width="42" height="4.6" fill="rgba(0,0,0,0.26)" />
          <rect x="11" y="38" width="42" height="1" fill="rgba(255,255,255,0.10)" />
          <rect x="11" y="48.6" width="42" height="4.6" fill="rgba(0,0,0,0.26)" />
          <rect x="11" y="48.6" width="42" height="1" fill="rgba(255,255,255,0.10)" />
          <g>
            <circle cx="15" cy="40.3" r="1.5" fill="#2e2e35" />
            <circle cx="14.6" cy="39.9" r="0.55" fill="rgba(255,255,255,0.35)" />
            <circle cx="22" cy="40.3" r="1.5" fill="#2e2e35" />
            <circle cx="21.6" cy="39.9" r="0.55" fill="rgba(255,255,255,0.35)" />
            <circle cx="42" cy="40.3" r="1.5" fill="#2e2e35" />
            <circle cx="41.6" cy="39.9" r="0.55" fill="rgba(255,255,255,0.35)" />
            <circle cx="49" cy="40.3" r="1.5" fill="#2e2e35" />
            <circle cx="48.6" cy="39.9" r="0.55" fill="rgba(255,255,255,0.35)" />
            <circle cx="15" cy="50.9" r="1.5" fill="#2e2e35" />
            <circle cx="14.6" cy="50.5" r="0.55" fill="rgba(255,255,255,0.35)" />
            <circle cx="22" cy="50.9" r="1.5" fill="#2e2e35" />
            <circle cx="21.6" cy="50.5" r="0.55" fill="rgba(255,255,255,0.35)" />
            <circle cx="42" cy="50.9" r="1.5" fill="#2e2e35" />
            <circle cx="41.6" cy="50.5" r="0.55" fill="rgba(255,255,255,0.35)" />
            <circle cx="49" cy="50.9" r="1.5" fill="#2e2e35" />
            <circle cx="48.6" cy="50.5" r="0.55" fill="rgba(255,255,255,0.35)" />
          </g>

          {/* Hammered texture and scratches */}
          <path d="M16.5 59 q3.5 -2.2 7 0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M40 60.5 q3 -1.8 6 0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M17 45.8 l4.5 -1.1" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
          <path d="M43.5 63 l3.5 2" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />

          {/* Blue glow radiating from the keyhole */}
          <g style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease' }}>
            <circle className="hoth-keyhole-pulse" cx="32" cy="51" r="17" fill="url(#hoth-keyhole-glow)" />
          </g>

          {/* Keyhole escutcheon — pointed-oval plate */}
          <path
            d="M32 38.5 Q45.5 51 32 64 Q18.5 51 32 38.5 Z"
            fill="#5f5f69"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />

          {/* Keyhole — circle with flared stem, lights up when unlocked */}
          <path
            d="M32 43 a4.5 4.5 0 1 0 0.01 0 Z M30.2 51.2 L28.2 60.2 Q32 62.4 35.8 60.2 L33.8 51.2 Z"
            fill={hovered ? '#cdf1ff' : '#0c0c10'}
            style={{
              transition: 'fill 0.35s ease, filter 0.35s ease',
              filter: hovered ? 'drop-shadow(0 0 5px #38bdf8) drop-shadow(0 0 12px rgba(56,189,248,0.6))' : 'none',
            }}
          />
        </svg>

        <div
          className="hoth-wordmark"
          data-text="HOTH"
          style={{
            marginTop: '2.1rem',
            fontSize: 'clamp(2.2rem, 4.2vw, 3rem)',
            letterSpacing: '0.14em',
            paddingLeft: '0.14em',
            lineHeight: 1,
            color: '#fff',
          }}
        >
          HOTH
        </div>

        <div
          className="hoth-tagline"
          style={{
            marginTop: '1.5rem',
            fontSize: 'clamp(0.62rem, 1vw, 0.78rem)',
            letterSpacing: '0.32em',
            paddingLeft: '0.32em',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          WORK, ENCRYPTED
        </div>
      </div>

      {/* Case study title — appears on hover */}
      <div
        className="absolute inset-x-0 top-4 flex justify-center pointer-events-none"
        style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s ease' }}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
          Hoth Landing Page
        </span>
      </div>
    </div>
  )
}
