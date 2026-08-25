'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import TileFooter from './TileFooter'
import { useEnterToOpen } from '@/lib/useEnterToOpen'
import { useReducedMotion } from '@/lib/useReducedMotion'

const TITLE = 'Organic + Paid + Insights'
const ANIM_END = 6600

function fmt(n: number) {
  return Math.floor(n).toLocaleString('en-US')
}

export default function PatternTile() {
  const router  = useRouter()
  const reducedMotion = useReducedMotion()
  const [hovered, setHovered]   = useState(false)
  const [t, setT]               = useState(0)
  const [isInView, setIsInView] = useState(false)
  const tileRef  = useRef<HTMLDivElement>(null)
  const startRef = useRef<number | null>(null)
  const rafRef   = useRef<number>(0)

  useEnterToOpen(hovered, '/work/pattern-custom-reports')

  // Trigger on scroll-in; reset on scroll-out
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

  // Play once; freeze at ANIM_END
  useEffect(() => {
    if (!isInView) return
    // Reduced motion: jump straight to the finished frame, skip the loop.
    if (reducedMotion) { setT(ANIM_END); return }
    const frame = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      if (elapsed >= ANIM_END) { setT(ANIM_END); return }
      setT(elapsed)
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isInView, reducedMotion])

  // Derived animation state
  const titleProg  = t > 1700 ? 1 : t / 1700
  const typedTitle = TITLE.slice(0, Math.floor(titleProg * TITLE.length))
  const showCursor = t < 2000

  const numProg   = t < 1700 ? 0 : t > 2700 ? 1 : (t - 1700) / 1000
  const clicksVal = fmt(numProg * 300510)
  const acosVal   = (numProg * 42.46).toFixed(2)

  const line1Prog   = t < 2700 ? 0 : t > 5500 ? 1 : (t - 2700) / 2800
  const line2Prog   = t < 3200 ? 0 : t > 6000 ? 1 : (t - 3200) / 2800
  const linesAppear = t < 2700 ? 0 : t < 3100 ? (t - 2700) / 400 : 1

  return (
    <div
      ref={tileRef}
      className="workgrid__item"
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push('/work/pattern-custom-reports')}
    >
      <div className="tile-stage">
        {/* Dark overlay — behind SVG, darkens the tile background on hover */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(0,0,0,0.72)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* SVG — rendered on top of overlay, stays fully visible */}
        <div className="workgrid__item__content">
          <svg
            className="tile-svg"
            viewBox="-25 -20 410 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ opacity: isInView ? 1 : 0, transition: 'opacity 0.3s ease' }}
          >
            <rect x="16" y="8" width="328" height="224" rx="8"
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

            <text x="28" y="28" fontSize="9.5" fontWeight="600"
              fill="rgba(255,255,255,0.85)" fontFamily="'IBM Plex Mono', monospace">
              {typedTitle}
              {showCursor && <tspan className="tile-cursor" fill="rgba(255,255,255,0.5)">|</tspan>}
            </text>
            <rect x="290" y="16" width="42" height="18" rx="4"
              stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="rgba(255,255,255,0.04)" />
            <text x="311" y="27.5" fontSize="7.5" textAnchor="middle"
              fill="rgba(255,255,255,0.4)" fontFamily="'IBM Plex Mono', monospace">EDIT</text>
            <line x1="16" y1="41" x2="344" y2="41" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            <circle cx="28" cy="57" r="3.5" fill="#00b37d" />
            <text x="38" y="61" fontSize="8"
              fill="rgba(255,255,255,0.4)" fontFamily="'IBM Plex Mono', monospace">Ad Clicks</text>
            <text x="28" y="81" fontSize="19" fontWeight="400"
              fill="rgba(255,255,255,0.92)" fontFamily="'IBM Plex Mono', monospace">{clicksVal}</text>
            <text x="28"  y="95" fontSize="7.5" fill="rgba(255,255,255,0.3)"  fontFamily="'IBM Plex Mono', monospace">3,742</text>
            <text x="56"  y="95" fontSize="7.5" fill="#ff537a"               fontFamily="'IBM Plex Mono', monospace">1.23% ▽</text>

            <line x1="181" y1="48" x2="181" y2="104" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            <circle cx="193" cy="57" r="3.5" fill="#008fff" />
            <text x="203" y="61" fontSize="8"
              fill="rgba(255,255,255,0.4)" fontFamily="'IBM Plex Mono', monospace">ACOS</text>
            <text x="193" y="81" fontSize="19" fontWeight="400"
              fill="rgba(255,255,255,0.92)" fontFamily="'IBM Plex Mono', monospace">{acosVal}%</text>
            <text x="193" y="95" fontSize="7.5" fill="rgba(255,255,255,0.3)"  fontFamily="'IBM Plex Mono', monospace">10.77</text>
            <text x="220" y="95" fontSize="7.5" fill="#ff537a"               fontFamily="'IBM Plex Mono', monospace">20.23% ▽</text>

            <line x1="16" y1="104" x2="344" y2="104" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            <line x1="44" y1="128" x2="340" y2="128" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" />
            <line x1="44" y1="152" x2="340" y2="152" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" />
            <line x1="44" y1="176" x2="340" y2="176" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" />
            <line x1="44" y1="200" x2="340" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" />
            <line x1="44" y1="203" x2="340" y2="203" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

            <text x="44"  y="215" fontSize="7" textAnchor="middle"
              fill="rgba(255,255,255,0.2)" fontFamily="'IBM Plex Mono', monospace">Jan 11</text>
            <text x="192" y="215" fontSize="7" textAnchor="middle"
              fill="rgba(255,255,255,0.2)" fontFamily="'IBM Plex Mono', monospace">Jan 25</text>
            {/* End-anchored — centred on the last point would overhang the card edge at x=344 */}
            <text x="340" y="215" fontSize="7" textAnchor="end"
              fill="rgba(255,255,255,0.2)" fontFamily="'IBM Plex Mono', monospace">Feb 7</text>

            <line x1="110" y1="227" x2="126" y2="227" stroke="#00b37d" strokeWidth="1.5" strokeLinecap="round" />
            <text x="130" y="230" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="'IBM Plex Mono', monospace">Ad Clicks</text>
            <line x1="196" y1="227" x2="212" y2="227" stroke="#008fff" strokeWidth="1.5" strokeLinecap="round" />
            <text x="216" y="230" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="'IBM Plex Mono', monospace">ACOS</text>

            <g style={{ opacity: linesAppear }}>
              <path
                d="M 44,146 L 81,154 L 118,169 L 155,177 L 192,161 L 229,192 L 266,177 L 303,130 L 340,115"
                stroke="#00b37d" strokeWidth="1.75"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="350" strokeDashoffset={350 * (1 - line1Prog)}
              />
              <path
                d="M 44,152 L 81,146 L 118,161 L 155,152 L 192,140 L 229,155 L 266,130 L 303,140 L 340,124"
                stroke="#008fff" strokeWidth="1.75"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="350" strokeDashoffset={350 * (1 - line2Prog)}
              />
            </g>
          </svg>
        </div>
      </div>

      <TileFooter
        slug="pattern-custom-reports"
        logoSrc="/logos/pattern.png"
        companyHref="https://www.pattern.com"
        hovered={hovered}
      />
    </div>
  )
}
