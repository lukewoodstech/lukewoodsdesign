'use client'

import { useEffect, useRef, useState } from 'react'
import { MONTHS, fmt, fmtTick, type Layout } from '@/lib/predict/metrics'

/*
 * The multi-metric chart from the Custom Reports redesign, drawn as SVG.
 *
 * Two y-axes, lines and bars on the same plot, twelve months across. This
 * is a faithful reproduction of Luke's product design, dual axis included:
 * the study's argument is how he made two axes carry several unit families,
 * so the chart has to be the real thing rather than a re-charted version.
 * Everything else follows the usual craft rules: 2px lines, bars no wider
 * than 24px with a 4px rounded cap, a 2px gap between neighbours, hairline
 * grid, text in ink tokens and never in a series colour, a legend whenever
 * there is more than one series, and a crosshair tooltip on hover.
 *
 * Width is measured, not assumed, so labels stay at true pixel size at any
 * container width instead of scaling with a viewBox.
 */

const PAD = { top: 10, right: 52, bottom: 26, left: 52 }
const BAR_MAX = 24
const BAR_GAP = 2

export default function ComboChart({
  layout,
  height = 232,
  className = '',
}: {
  layout: Layout
  height?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(960)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new ResizeObserver(([e]) =>
      setWidth(Math.max(320, Math.round(e.contentRect.width))),
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const { placed, axes } = layout
  const plotL = PAD.left
  const plotR = width - PAD.right
  const plotT = PAD.top
  const plotB = height - PAD.bottom
  const plotW = plotR - plotL
  const plotH = plotB - plotT
  const slot = plotW / MONTHS.length
  const cx = (i: number) => plotL + slot * (i + 0.5)
  const y = (v: number, axis: 'L' | 'R') => {
    const max = axes[axis]?.max ?? 1
    return plotB - (v / max) * plotH
  }

  const bars = placed.filter((p) => p.kind === 'bar')
  const lines = placed.filter((p) => p.kind === 'line')
  const groupW = Math.min(bars.length * BAR_MAX + (bars.length - 1) * BAR_GAP, slot * 0.72)
  const barW = bars.length ? (groupW - (bars.length - 1) * BAR_GAP) / bars.length : 0

  const ticks = [0, 0.25, 0.5, 0.75, 1]

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < plotL || x > plotR) return setHover(null)
    setHover(Math.min(11, Math.max(0, Math.floor((x - plotL) / slot))))
  }

  const tipLeft = hover === null ? 0 : cx(hover)
  const tipFlip = hover !== null && hover > 8

  return (
    <div ref={ref} className={`pm-chart ${className}`.trim()}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${placed.map((p) => p.metric.label).join(', ')} by month`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {/* grid + ticks */}
        {ticks.map((t) => {
          const yy = plotB - t * plotH
          return (
            <g key={t}>
              <line x1={plotL} x2={plotR} y1={yy} y2={yy} className="pm-chart__grid" />
              {axes.L && (
                <text x={plotL - 8} y={yy + 4} textAnchor="end" className="pm-chart__tick">
                  {fmtTick(axes.L.max * t, axes.L.unit)}
                </text>
              )}
              {axes.R && (
                <text x={plotR + 8} y={yy + 4} textAnchor="start" className="pm-chart__tick">
                  {fmtTick(axes.R.max * t, axes.R.unit)}
                </text>
              )}
            </g>
          )
        })}

        {/* x labels: every month when there is room, every other when not */}
        {MONTHS.map((m, i) =>
          slot < 34 && i % 2 === 1 ? null : (
            <text key={m} x={cx(i)} y={height - 8} textAnchor="middle" className="pm-chart__tick">
              {m}
            </text>
          ),
        )}

        {/* crosshair, under the marks */}
        {hover !== null && (
          <line x1={cx(hover)} x2={cx(hover)} y1={plotT} y2={plotB} className="pm-chart__cross" />
        )}

        {/* bars: grouped per month, rounded cap, square at the baseline */}
        {bars.map((p, j) =>
          p.metric.series.map((v, i) => {
            const x0 = cx(i) - groupW / 2 + j * (barW + BAR_GAP)
            const top = y(v, p.axis)
            const h = Math.max(0, plotB - top)
            const r = Math.min(4, barW / 2, h)
            /* Two decimals: server and client float the last digits
               differently, and React reports the difference as a hydration
               mismatch on every polyline and bar. */
            const f = (v: number) => v.toFixed(2)
            const d = `M${f(x0)},${f(plotB)} V${f(top + r)} a${f(r)},${f(r)} 0 0 1 ${f(r)},-${f(r)} h${f(barW - 2 * r)} a${f(r)},${f(r)} 0 0 1 ${f(r)},${f(r)} V${f(plotB)} Z`
            return (
              <path
                key={`${p.metric.key}-${i}`}
                d={d}
                fill={p.metric.color}
                opacity={hover === null || hover === i ? 1 : 0.55}
              />
            )
          }),
        )}

        {/* lines */}
        {lines.map((p) => (
          <polyline
            key={p.metric.key}
            points={p.metric.series
              .map((v, i) => `${cx(i).toFixed(2)},${y(v, p.axis).toFixed(2)}`)
              .join(' ')}
            fill="none"
            stroke={p.metric.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* hover markers on the lines, ringed in the surface colour */}
        {hover !== null &&
          lines.map((p) => (
            <circle
              key={`${p.metric.key}-dot`}
              cx={cx(hover)}
              cy={y(p.metric.series[hover], p.axis)}
              r={4}
              fill={p.metric.color}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
      </svg>

      {hover !== null && placed.length > 0 && (
        <div
          className="pm-tip"
          style={{
            left: tipLeft,
            transform: tipFlip ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
          }}
          role="status"
        >
          <p className="pm-tip__month">{MONTHS[hover]}</p>
          {placed.map((p) => (
            <p key={p.metric.key} className="pm-tip__row">
              <span className="pm-swatch" style={{ background: p.metric.color }} />
              <span className="pm-tip__label">{p.metric.label}</span>
              <span className="pm-tip__val">{fmt(p.metric.series[hover], p.metric.unit)}</span>
            </p>
          ))}
        </div>
      )}

      {placed.length > 1 && (
        <ul className="pm-legend" aria-label="Series">
          {placed.map((p) => (
            <li key={p.metric.key}>
              {axes.L && axes.R && <span className="pm-legend__axis">{p.axis}</span>}
              <span
                className={p.kind === 'bar' ? 'pm-legend__bar' : 'pm-legend__line'}
                style={{ background: p.metric.color }}
              />
              {p.metric.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
