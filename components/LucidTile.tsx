'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// Pyramid vertices
// Apex: (175, 40)  Front-left: (112, 192)  Front-right: (238, 192)
// Back vertex (3D depth): (175, 158)
// Centroid (scale origin): (175, 141)

const WAVE_START = 3000  // ms — wave begins after beams are drawn

export default function LucidTile() {
  const router = useRouter()
  const [hovered, setHovered]   = useState(false)
  const [t, setT]               = useState(0)
  const [isInView, setIsInView] = useState(false)
  const tileRef  = useRef<HTMLDivElement>(null)
  const startRef = useRef<number | null>(null)
  const rafRef   = useRef<number>(0)

  useEffect(() => {
    const el = tileRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        } else {
          setIsInView(false)
          setT(0)
          startRef.current = null
        }
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // RAF runs continuously while in view (wave never stops)
  useEffect(() => {
    if (!isInView) return
    const frame = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      setT(ts - startRef.current)
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isInView])

  // Prism: scales in 0–900ms
  const prismProg  = Math.min(1, t / 900)
  const prismScale = 0.82 + 0.18 * prismProg

  // Entry beam: 900–1700ms
  const entryProg = t < 900 ? 0 : Math.min(1, (t - 900) / 800)

  // Orange exit: 1700–2800ms
  const orangeProg = t < 1700 ? 0 : Math.min(1, (t - 1700) / 1100)

  // Blue exit: 2000–3000ms (slight stagger)
  const blueProg = t < 2000 ? 0 : Math.min(1, (t - 2000) / 1000)

  // Gentle wave on exit bezier control points after WAVE_START
  const waveT = Math.max(0, t - WAVE_START)
  const wave  = Math.sin((waveT / 2400) * 2 * Math.PI)

  // Orange bezier: (222,143) → CP1 → CP2 → (385,68)
  const oCP1y = 108 + (t >= WAVE_START ? wave * 9  : 0)
  const oCP2y = 80  + (t >= WAVE_START ? wave * 6  : 0)

  // Blue bezier: (222,165) → CP1 → CP2 → (385,198)
  const bCP1y = 192 - (t >= WAVE_START ? wave * 9  : 0)
  const bCP2y = 202 - (t >= WAVE_START ? wave * 6  : 0)

  const orangePath = `M 222,143 C 275,${oCP1y} 332,${oCP2y} 385,68`
  const bluePath   = `M 222,165 C 275,${bCP1y} 332,${bCP2y} 385,198`

  // Freeze dashoffset at 0 once fully drawn (avoid recalc fighting the wave)
  const oDash = orangeProg < 1 ? 1 - orangeProg : 0
  const bDash = blueProg   < 1 ? 1 - blueProg   : 0

  return (
    <div
      ref={tileRef}
      className="workgrid__item"
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push('/work/lucid-ai')}
    >
      {/* Dark hover overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(0,0,0,0.72)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      <div className="workgrid__item__content">
        <svg
          className="tile-svg"
          viewBox="-25 -20 410 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ opacity: isInView ? 1 : 0, transition: 'opacity 0.4s ease' }}
        >
          <defs>
            <filter id="lg-prism-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="lg-beam-glow" x="-30%" y="-120%" width="160%" height="340%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* ── 3D Glass Pyramid ── */}
          <g
            style={{
              transform: `translate(175px, 141px) scale(${prismScale}) translate(-175px, -141px)`,
              opacity: prismProg,
            }}
          >
            {/* Outer glow halo */}
            <polygon
              points="175,40 112,192 238,192"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="12"
              strokeLinejoin="round"
              filter="url(#lg-prism-glow)"
            />
            {/* Left face — lighter (catches more light) */}
            <polygon
              points="175,40 112,192 175,158"
              fill="rgba(255,255,255,0.07)"
            />
            {/* Right face — slightly darker */}
            <polygon
              points="175,40 238,192 175,158"
              fill="rgba(255,255,255,0.03)"
            />
            {/* Inner highlight — specular on left face */}
            <polygon
              points="175,40 148,165 175,158"
              fill="rgba(255,255,255,0.06)"
            />
            {/* Outer edges */}
            <line x1="175" y1="40"  x2="112" y2="192" stroke="rgba(255,255,255,0.80)" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="175" y1="40"  x2="238" y2="192" stroke="rgba(255,255,255,0.60)" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="112" y1="192" x2="238" y2="192" stroke="rgba(255,255,255,0.38)" strokeWidth="1.2" strokeLinecap="round"/>
            {/* Internal 3D structure edges */}
            <line x1="175" y1="40"  x2="175" y2="158" stroke="rgba(255,255,255,0.28)" strokeWidth="0.9" strokeLinecap="round"/>
            <line x1="112" y1="192" x2="175" y2="158" stroke="rgba(255,255,255,0.22)" strokeWidth="0.9" strokeLinecap="round" strokeDasharray="4 3"/>
            <line x1="238" y1="192" x2="175" y2="158" stroke="rgba(255,255,255,0.16)" strokeWidth="0.9" strokeLinecap="round" strokeDasharray="4 3"/>
          </g>

          {/* ── Entry beam (warm amber, angled into left face) ── */}
          {/* Glow layer */}
          <path
            d="M -25,112 L 130,152"
            stroke="#c87828"
            strokeWidth="10"
            strokeLinecap="round"
            style={{ opacity: entryProg * 0.32 }}
            filter="url(#lg-beam-glow)"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - entryProg}
          />
          {/* Core */}
          <path
            d="M -25,112 L 130,152"
            stroke="#ecc070"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ opacity: entryProg * 0.92 }}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - entryProg}
          />

          {/* ── Orange exit beam ── */}
          {/* Glow */}
          <path
            d={orangePath}
            stroke="#b86820"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            style={{ opacity: orangeProg * 0.28 }}
            filter="url(#lg-beam-glow)"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={oDash}
          />
          {/* Core */}
          <path
            d={orangePath}
            stroke="#e8a848"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            style={{ opacity: orangeProg * 0.90 }}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={oDash}
          />

          {/* ── Blue exit beam ── */}
          {/* Glow */}
          <path
            d={bluePath}
            stroke="#1840a0"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            style={{ opacity: blueProg * 0.28 }}
            filter="url(#lg-beam-glow)"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={bDash}
          />
          {/* Core */}
          <path
            d={bluePath}
            stroke="#4898e8"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            style={{ opacity: blueProg * 0.90 }}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={bDash}
          />
        </svg>
      </div>

      {/* Hover title */}
      <div
        className="absolute inset-x-0 top-4 flex justify-center pointer-events-none"
        style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s ease' }}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
          Lucid AI
        </span>
      </div>
    </div>
  )
}
