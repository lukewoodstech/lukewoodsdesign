import { useId } from 'react'
import Reveal from '@/components/lucid/Reveal'

/*
 * The emotion chart under a user journey: N stage headings across the top,
 * a line that falls (or climbs) through them, a dot at each stage. The
 * line draws on scroll and the dots pop as it reaches them, all in CSS off
 * `.is-inview`. Coordinates live in a 100×40 box; the stroke is non-scaling
 * so the curve can stretch to any width without fattening.
 */
export type Stage = { title: string; text: string; y: number }

const W = 100
const H = 40

/* Catmull-Rom through the points, emitted as cubic béziers. */
function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const c1: [number, number] = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: [number, number] = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`
  }
  return d
}

export default function JourneyChart({ stages, label }: { stages: Stage[]; label: string }) {
  const id = useId()
  const n = stages.length
  // The line starts at the left edge and ends at the right, passing through
  // each stage's column centre.
  const pts: [number, number][] = [
    [0, stages[0].y - 1],
    ...stages.map((s, i): [number, number] => [((i + 0.5) / n) * W, s.y]),
    [W, stages[n - 1].y + 1],
  ]
  const line = smoothPath(pts)
  const area = `${line} L${W} ${H} L0 ${H} Z`

  return (
    <Reveal className="cs-chart" role="figure" aria-label={label}>
      <div className="cs-chart__heads" style={{ '--n': n } as React.CSSProperties}>
        {stages.map((s) => (
          <div key={s.title}>
            <h4>{s.title}</h4>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
      <svg className="cs-chart__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[8, 16, 24, 32].map((y) => (
          <line key={y} className="cs-chart__grid" x1="0" x2={W} y1={y} y2={y} />
        ))}
        <path className="cs-chart__area" d={area} style={{ fill: `url(#${id}-fill)` }} />
        <path className="cs-chart__line" d={line} pathLength={1} />
        {stages.map((s, i) => (
          <circle
            key={s.title}
            className="cs-chart__dot"
            cx={((i + 0.5) / n) * W}
            cy={s.y}
            r="1.2"
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
      </svg>
    </Reveal>
  )
}
