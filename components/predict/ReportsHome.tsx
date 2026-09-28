/* eslint-disable @next/next/no-img-element -- the file's own 16px SVG glyphs; next/image adds nothing to a decorative inline icon */
import PredictShell from '@/components/predict/PredictShell'
import { METRIC } from '@/lib/predict/metrics'

/*
 * The redesigned Custom Reports home from the design file (15635:17956):
 * a template row, the count-and-search bar, then report tiles with a live
 * chart preview each. The file's tiles repeated one placeholder chart and
 * the word "Template"; here every template and every report has its own
 * name, its own sharing state, and a preview drawn from the real metric
 * series in lib/predict/metrics, so the six previews are six different
 * shapes for a reason.
 */

const M = '/work/pattern/mock'

type Sharing = 'Shared with group' | 'Shared with me' | 'Private'

const TEMPLATES: { name: string; series: string[] }[] = [
  { name: 'Monthly Business Review', series: ['sales', 'adSales'] },
  { name: 'Advertising Deep Dive', series: ['adSpend', 'adSales'] },
  { name: 'Organic vs. Paid', series: ['pageViews', 'patternPageViews'] },
  { name: 'Buy Box & Pricing', series: ['buyBox'] },
  { name: 'Ad Efficiency', series: ['roas', 'trueRoas'] },
  { name: 'Traffic to Orders', series: ['adClicks', 'adOrders'] },
  { name: 'Peak Season Readiness', series: ['sales', 'pageViews'] },
]

const REPORTS: { name: string; sharing: Sharing; series: string[] }[] = [
  { name: 'Q1 Business Review · Aurora Wellness', sharing: 'Shared with group', series: ['sales', 'adSales'] },
  { name: 'Amazon US · Advertising Deep Dive', sharing: 'Shared with me', series: ['adSpend', 'adSales', 'acos'] },
  { name: 'Buy Box & Pricing Health', sharing: 'Private', series: ['buyBox', 'sales'] },
  { name: 'Organic vs. Paid · Weekly Tracker', sharing: 'Shared with group', series: ['pageViews', 'patternPageViews'] },
  { name: 'Peak Season Forecast Readiness', sharing: 'Private', series: ['sales', 'adOrders'] },
  { name: 'March Town Hall Report', sharing: 'Shared with me', series: ['roas', 'trueRoas', 'unitsPerOrder'] },
]

/* A small line chart with no axes: each series normalised to its own range,
   which is right for a thumbnail whose job is the shape, not the value. */
function Sparkline({ keys, height = 110 }: { keys: string[]; height?: number }) {
  const W = 300
  const pad = 8
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="pm-spark" aria-hidden="true" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={pad} x2={W - pad} y1={height * t} y2={height * t} className="pm-chart__grid" />
      ))}
      {keys.map((k) => {
        const m = METRIC[k]
        /* Normalise to the series' own range, but never to less than a third
           of its size: a metric that barely moves (Buy Box at 90%) should
           draw as a calm line, not as noise stretched to full height. */
        const lo = Math.min(...m.series)
        const hi = Math.max(...m.series)
        const span = Math.max(hi - lo, hi * 0.35)
        const base = hi - span
        const pts = m.series
          .map((v, i) => {
            const x = pad + (i / (m.series.length - 1)) * (W - 2 * pad)
            const y = height - pad - ((v - base) / span) * (height - 2 * pad)
            return `${x.toFixed(1)},${y.toFixed(1)}`
          })
          .join(' ')
        return (
          <polyline
            key={k}
            points={pts}
            fill="none"
            stroke={m.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )
      })}
    </svg>
  )
}

export default function ReportsHome() {
  return (
    <PredictShell title="Custom Reports" cta="Create new">
      <section className="pm-panel" aria-label="Create a new report">
        <div className="pm-panel__head">
          <h3>Create a New Report</h3>
          <span className="pm-link">More Templates</span>
        </div>
        <ul className="pm-templates">
          <li>
            <div className="pm-template pm-template--blank" />
            <span>Blank Report</span>
          </li>
          {TEMPLATES.map((t) => (
            <li key={t.name}>
              <div className="pm-template">
                <Sparkline keys={t.series} height={64} />
              </div>
              <span>{t.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="pm-panel pm-panel--bar" aria-hidden="true">
        <div className="pm-total">
          <span>Total Reports</span>
          <strong>52</strong>
        </div>
        <div className="pm-searchbox">
          <img src={`${M}/icons-search.svg`} alt="" className="pm-icon" />
          <span>Search</span>
        </div>
        <span className="pm-btn pm-btn--ghost">
          <img src={`${M}/icons-filter.svg`} alt="" className="pm-icon" />
          Filters
        </span>
      </section>

      <ul className="pm-tiles" aria-label="Your reports">
        {REPORTS.map((r) => (
          <li key={r.name} className="pm-tile">
            <div className="pm-tile__head">
              <span className="pm-tag">{r.sharing}</span>
              <img src={`${M}/icons-more.svg`} alt="" className="pm-icon" />
            </div>
            <div className="pm-tile__chart">
              <Sparkline keys={r.series} />
            </div>
            <div className="pm-tile__foot">
              <span>{r.name}</span>
              <img src={`${M}/icons-info.svg`} alt="" className="pm-icon" />
            </div>
          </li>
        ))}
      </ul>
    </PredictShell>
  )
}
