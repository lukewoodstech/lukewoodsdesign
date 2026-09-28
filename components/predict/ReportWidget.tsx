/* eslint-disable @next/next/no-img-element -- the file's own 16px SVG glyphs; next/image adds nothing to a decorative inline icon */
import type { ReactNode } from 'react'
import ComboChart from '@/components/predict/ComboChart'
import KindGlyph from '@/components/predict/KindGlyph'
import { METRIC, fmt, fmtChange, headline, type Layout, type Metric } from '@/lib/predict/metrics'

/*
 * The redesigned report widget: title and brand, a caption that travels with
 * the chart, two primary and five secondary metric cards, then the
 * multi-metric chart. Layout and sizes follow the design file's "widget
 * redesign" frame (15635:17879): 88px primary row on #fbfbfb, 14px labels,
 * 22px semibold values, 12px deltas in the positive/destructive tokens.
 *
 * Every figure comes from lib/predict/metrics, so the cards, the deltas and
 * the chart never disagree. A card's swatch fills when its metric is on the
 * chart and stays hollow when it is header-only, which is how the design
 * tells the two apart.
 */

const M = '/work/pattern/mock'

function Delta({ metric }: { metric: Metric }) {
  const h = headline(metric)
  return (
    <span className={`pm-delta ${h.good ? 'pm-delta--good' : 'pm-delta--bad'}`}>
      <span>{fmtChange(h.change, metric.unit)}</span>
      <span className="pm-delta__sep" aria-hidden="true" />
      <span>{Math.abs(h.pctChange).toFixed(2)}%</span>
      <span className="pm-delta__arrow" aria-label={h.up ? 'up' : 'down'}>
        {h.up ? '▲' : '▽'}
      </span>
    </span>
  )
}

function MetricCard({
  metric,
  primary,
  onChart,
  kind,
}: {
  metric: Metric
  primary?: boolean
  onChart: boolean
  kind?: 'line' | 'bar'
}) {
  const h = headline(metric)
  return (
    <div className={`pm-card ${primary ? 'pm-card--primary' : ''}`}>
      <span
        className={`pm-card__dot ${onChart ? '' : 'pm-card__dot--off'}`}
        style={onChart ? { background: metric.color, borderColor: metric.color } : undefined}
        aria-hidden="true"
      />
      <div className="pm-card__body">
        <p className="pm-card__label">
          <span className="pm-card__name">{metric.label}</span>
          <img src={`${M}/icons-info.svg`} alt="" className="pm-icon pm-icon--sm" />
          {onChart && kind && <KindGlyph kind={kind} title={kind === 'bar' ? 'Shown as bars' : 'Shown as a line'} />}
        </p>
        <p className="pm-card__value">
          <strong>{fmt(h.now, metric.unit)}</strong>
          <Delta metric={metric} />
        </p>
      </div>
    </div>
  )
}

export default function ReportWidget({
  title,
  brand,
  caption,
  primary,
  secondary,
  layout,
  actions,
  chartHeight,
}: {
  title: string
  brand: string
  caption?: string
  primary: string[]
  secondary: string[]
  layout: Layout
  /** Real controls the host page wants in the widget's header (the lab's gear). */
  actions?: ReactNode
  chartHeight?: number
}) {
  const on = (key: string) => layout.placed.find((p) => p.metric.key === key)
  return (
    <section className="pm-widget" aria-label={title}>
      <header className="pm-widget__head">
        <div className="pm-widget__title">
          <h3>{title}</h3>
          <span className="pm-widget__brand">{brand}</span>
        </div>
        <div className="pm-widget__tools">
          <span className="pm-chip" aria-hidden="true">
            <img src={`${M}/icons-filter.svg`} alt="" className="pm-icon" />
            YEAR · BY MONTH | AMAZON US | ALL | $USD
          </span>
          {actions}
        </div>
      </header>

      {caption && <p className="pm-widget__caption">{caption}</p>}

      <div className="pm-widget__primary">
        {primary.map((k) => (
          <MetricCard key={k} metric={METRIC[k]} primary onChart={!!on(k)} kind={on(k)?.kind} />
        ))}
      </div>

      <div className="pm-widget__secondary">
        {secondary.map((k) => (
          <MetricCard key={k} metric={METRIC[k]} onChart={!!on(k)} kind={on(k)?.kind} />
        ))}
      </div>

      <ComboChart layout={layout} height={chartHeight} />
    </section>
  )
}
