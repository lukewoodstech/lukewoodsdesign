'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const TITLE = 'Organic + Paid + Insights'
const LOOP = 9000  // ms per full animation cycle

function fmt(n: number) {
  return Math.floor(n).toLocaleString('en-US')
}

export default function PatternTile() {
  const [t, setT] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const frame = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      setT((ts - startRef.current) % LOOP)
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // ─── Phase timing (ms within 9s loop) ───
  // 0–80:      blank
  // 80–1700:   title types in
  // 1700–2700: numbers count up
  // 2700–5000: lines sketch in (line 2 starts 400ms after line 1)
  // 5000–7200: hold steady
  // 7200–8200: fade out
  // 8200–9000: blank

  const isBlank  = t < 80 || t > 8200
  const isFading = t >= 7200 && t <= 8200
  const cardOpacity = isBlank ? 0 : isFading ? Math.max(0, 1 - (t - 7200) / 1000) : 1

  // Title
  const titleProg  = t < 80 ? 0 : t > 1700 ? 1 : (t - 80) / 1620
  const typedTitle = TITLE.slice(0, Math.floor(titleProg * TITLE.length))
  const showCursor = t >= 80 && t < 2000

  // Numbers
  const numProg  = t < 1700 ? 0 : t > 2700 ? 1 : (t - 1700) / 1000
  const clicksVal = fmt(numProg * 300510)
  const acosVal   = (numProg * 42.46).toFixed(2)

  // Lines
  const line1Prog   = t < 2700 ? 0 : t > 5000 ? 1 : (t - 2700) / 2300
  const line2Prog   = t < 3100 ? 0 : t > 5400 ? 1 : (t - 3100) / 2300
  const linesAppear = t < 2700 ? 0 : t < 3000 ? (t - 2700) / 300 : 1
  const line1Offset = 350 * (1 - line1Prog)
  const line2Offset = 350 * (1 - line2Prog)

  return (
    <div className="workgrid__item">
      <Link href="/work/pattern-custom-reports">
        <div className="workgrid__item__content">
          <svg
            className="tile-svg"
            viewBox="0 0 360 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ opacity: cardOpacity }}
          >
            {/* Card */}
            <rect x="16" y="8" width="328" height="224" rx="8"
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

            {/* Header — typing title */}
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

            {/* KPI — Ad Clicks */}
            <circle cx="28" cy="57" r="3.5" fill="#00b37d" />
            <text x="38" y="61" fontSize="8"
              fill="rgba(255,255,255,0.4)" fontFamily="'IBM Plex Mono', monospace">Ad Clicks</text>
            <text x="28" y="81" fontSize="19" fontWeight="400"
              fill="rgba(255,255,255,0.92)" fontFamily="'IBM Plex Mono', monospace">{clicksVal}</text>
            <text x="28"  y="95" fontSize="7.5" fill="rgba(255,255,255,0.3)"  fontFamily="'IBM Plex Mono', monospace">3,742</text>
            <text x="56"  y="95" fontSize="7.5" fill="#ff537a"               fontFamily="'IBM Plex Mono', monospace">1.23% ▽</text>

            {/* KPI column divider */}
            <line x1="181" y1="48" x2="181" y2="104" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* KPI — ACOS */}
            <circle cx="193" cy="57" r="3.5" fill="#008fff" />
            <text x="203" y="61" fontSize="8"
              fill="rgba(255,255,255,0.4)" fontFamily="'IBM Plex Mono', monospace">ACOS</text>
            <text x="193" y="81" fontSize="19" fontWeight="400"
              fill="rgba(255,255,255,0.92)" fontFamily="'IBM Plex Mono', monospace">{acosVal}%</text>
            <text x="193" y="95" fontSize="7.5" fill="rgba(255,255,255,0.3)"  fontFamily="'IBM Plex Mono', monospace">10.77</text>
            <text x="220" y="95" fontSize="7.5" fill="#ff537a"               fontFamily="'IBM Plex Mono', monospace">20.23% ▽</text>

            {/* KPI bottom divider */}
            <line x1="16" y1="104" x2="344" y2="104" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* Chart grid */}
            <line x1="44" y1="128" x2="340" y2="128" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" />
            <line x1="44" y1="152" x2="340" y2="152" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" />
            <line x1="44" y1="176" x2="340" y2="176" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" />
            <line x1="44" y1="200" x2="340" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" />
            <line x1="44" y1="203" x2="340" y2="203" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

            {/* X-axis labels */}
            <text x="44"  y="215" fontSize="7" textAnchor="middle"
              fill="rgba(255,255,255,0.2)" fontFamily="'IBM Plex Mono', monospace">Jan 11</text>
            <text x="192" y="215" fontSize="7" textAnchor="middle"
              fill="rgba(255,255,255,0.2)" fontFamily="'IBM Plex Mono', monospace">Jan 25</text>
            <text x="340" y="215" fontSize="7" textAnchor="middle"
              fill="rgba(255,255,255,0.2)" fontFamily="'IBM Plex Mono', monospace">Feb 7</text>

            {/* Legend */}
            <line x1="110" y1="227" x2="126" y2="227" stroke="#00b37d" strokeWidth="1.5" strokeLinecap="round" />
            <text x="130" y="230" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="'IBM Plex Mono', monospace">Ad Clicks</text>
            <line x1="196" y1="227" x2="212" y2="227" stroke="#008fff" strokeWidth="1.5" strokeLinecap="round" />
            <text x="216" y="230" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="'IBM Plex Mono', monospace">ACOS</text>

            {/* Sketching lines */}
            <g style={{ opacity: linesAppear }}>
              <path
                d="M 44,146 L 81,154 L 118,169 L 155,177 L 192,161 L 229,192 L 266,177 L 303,130 L 340,115"
                stroke="#00b37d" strokeWidth="1.75"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="350" strokeDashoffset={line1Offset}
              />
              <path
                d="M 44,152 L 81,146 L 118,161 L 155,152 L 192,140 L 229,155 L 266,130 L 303,140 L 340,124"
                stroke="#008fff" strokeWidth="1.75"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="350" strokeDashoffset={line2Offset}
              />
            </g>
          </svg>
        </div>
        <div className="workgrid__item__title">
          <span className="workgrid__item__title-name">Pattern Custom Reports</span>
        </div>
      </Link>
    </div>
  )
}
