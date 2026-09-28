/*
 * The data and the rules behind the coded Custom Reports mock.
 *
 * Every number the mock shows is derived from twelve monthly series below,
 * so headers, deltas, axis ticks and the chart always agree: ROAS really is
 * Ad Sales over Ad Spend, ACOS really is its inverse, and a delta is the
 * actual change against the previous year. The design file's placeholder
 * figures repeated one delta on every card; that is what Luke asked to fix.
 *
 * Totals sit near the real product's Traffic page from the design file
 * (Sales $40.2M, Ad Sales $18.0M, Ad Spend $7.2M, ROAS 2.5), so the mock
 * reads as Predict rather than as invented data.
 *
 * The axis rules are Luke's, confirmed 2026-09-27:
 * - every metric has a unit: dollars, count, percent, or ratio;
 * - the chart has two axes; metrics group by unit, the first family takes
 *   the left axis, the second the right; a third family is blocked;
 * - line versus bar is chosen per metric;
 * - "comparable metrics on a single axis" forces same-unit metrics to share
 *   one scale. Off, a lone family whose members differ by more than 4x in
 *   size is split across both axes so the smaller one stays readable.
 */

export type Unit = 'usd' | 'count' | 'pct' | 'ratio'
export type Kind = 'line' | 'bar'
export type Axis = 'L' | 'R'

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const UNIT_LABEL: Record<Unit, string> = {
  usd: 'dollars',
  count: 'counts',
  pct: 'percentages',
  ratio: 'ratios',
}

/* Predict's chart hues. Teal and lavender are deeper steps of the file's
   #00d5df and #d98cfd: the originals sit at 1.8:1 and 2.3:1 on white, so
   the coded charts use the nearest steps that pass contrast and colour-
   blind separation (validated 2026-09-27). Screenshots keep the originals. */
export const SERIES_COLORS = {
  royal: '#3e63dd',
  red: '#e54d2e',
  lavender: '#a955ea',
  teal: '#0b9aab',
  navy: '#2e1ecf',
  sky: '#009af0',
  pink: '#e5298a',
  green: '#1a6541',
} as const

/* A seasonal ecommerce year: soft Q1, Prime-Day lift in July, the Q4 climb.
   Multiplied into each metric's total so every series shares the rhythm. */
const SEASON = [0.070, 0.066, 0.074, 0.078, 0.082, 0.083, 0.097, 0.086, 0.084, 0.088, 0.096, 0.096]

/* Deterministic wobble so lines are not perfectly parallel. */
function wobble(seed: number, i: number, amp: number) {
  const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453
  return 1 + (x - Math.floor(x) - 0.5) * 2 * amp
}

function year(total: number, seed: number, amp = 0.08): number[] {
  const raw = SEASON.map((s, i) => total * s * wobble(seed, i, amp))
  const sum = raw.reduce((a, b) => a + b, 0)
  return raw.map((v) => (v / sum) * total)
}

function scaleSeries(s: number[], factor: number) {
  return s.map((v) => v * factor)
}

/* ── Base series (current year) and last year ─────────────────────── */
const sales = year(40_180_000, 1)
const adSales = year(18_030_000, 2)
const adSpend = year(7_190_000, 3, 0.05)
const incrementalAdSales = year(17_410_000, 4, 0.06)
const pageViews = year(7_080_000, 5)
const patternPageViews = year(3_080_000, 6)
const adClicks = year(2_260_000, 7)
const adOrders = year(79_000, 8)
const unitsPerOrder = MONTHS.map((_, i) => 1.38 * wobble(9, i, 0.03))
const buyBox = MONTHS.map((_, i) => 89.9 * wobble(10, i, 0.012))

/* Last year, per metric: a growth story for most, spend growing faster than
   ad sales (so ACOS worsens), page views slightly down. */
const prev = {
  sales: scaleSeries(year(40_180_000, 11), 1 / 1.0762),
  adSales: scaleSeries(year(18_030_000, 12), 1 / 1.0838),
  adSpend: scaleSeries(year(7_190_000, 13, 0.05), 1 / 1.209),
  incrementalAdSales: scaleSeries(year(17_410_000, 14, 0.06), 1 / 1.078),
  pageViews: scaleSeries(year(7_080_000, 15), 1 / 0.947),
  patternPageViews: scaleSeries(year(3_080_000, 16), 1 / 1.032),
  adClicks: scaleSeries(year(2_260_000, 17), 1 / 1.061),
  adOrders: scaleSeries(year(79_000, 18), 1 / 1.105),
  unitsPerOrder: unitsPerOrder.map((v, i) => (v / 1.01) * wobble(19, i, 0.02)),
  buyBox: buyBox.map((v, i) => (v / 0.996) * wobble(20, i, 0.01)),
}

/* Derived series, computed month by month so the ratios are honest. */
const div = (a: number[], b: number[]) => a.map((v, i) => v / b[i])
const pct = (a: number[], b: number[]) => a.map((v, i) => (v / b[i]) * 100)

export type Metric = {
  key: string
  label: string
  unit: Unit
  color: string
  /** Twelve monthly values, this year. */
  series: number[]
  /** Twelve monthly values, last year. */
  prev: number[]
  /** How the metric aggregates for a headline: sum the months, or average them. */
  agg: 'sum' | 'mean'
  /** Whether a rise is the good direction (ACOS, CPC and spend prefer down). */
  upIsGood: boolean
  /** Default mark. Volumes read as bars, money and rates as lines. */
  kind: Kind
}

export const METRICS: Metric[] = [
  { key: 'sales', label: 'Sales', unit: 'usd', color: SERIES_COLORS.royal, series: sales, prev: prev.sales, agg: 'sum', upIsGood: true, kind: 'line' },
  { key: 'adSales', label: 'Ad Sales', unit: 'usd', color: SERIES_COLORS.red, series: adSales, prev: prev.adSales, agg: 'sum', upIsGood: true, kind: 'line' },
  { key: 'patternPageViews', label: 'Pattern Page Views', unit: 'count', color: SERIES_COLORS.lavender, series: patternPageViews, prev: prev.patternPageViews, agg: 'sum', upIsGood: true, kind: 'bar' },
  { key: 'pageViews', label: 'Page Views', unit: 'count', color: SERIES_COLORS.teal, series: pageViews, prev: prev.pageViews, agg: 'sum', upIsGood: true, kind: 'bar' },
  { key: 'adSpend', label: 'Ad Spend', unit: 'usd', color: SERIES_COLORS.sky, series: adSpend, prev: prev.adSpend, agg: 'sum', upIsGood: false, kind: 'line' },
  { key: 'incrementalAdSales', label: 'Incremental Ad Sales', unit: 'usd', color: SERIES_COLORS.navy, series: incrementalAdSales, prev: prev.incrementalAdSales, agg: 'sum', upIsGood: true, kind: 'line' },
  { key: 'roas', label: 'ROAS', unit: 'ratio', color: SERIES_COLORS.pink, series: div(adSales, adSpend), prev: div(prev.adSales, prev.adSpend), agg: 'mean', upIsGood: true, kind: 'line' },
  { key: 'trueRoas', label: 'True ROAS', unit: 'ratio', color: SERIES_COLORS.green, series: div(incrementalAdSales, adSpend), prev: div(prev.incrementalAdSales, prev.adSpend), agg: 'mean', upIsGood: true, kind: 'line' },
  { key: 'acos', label: 'ACOS', unit: 'pct', color: SERIES_COLORS.navy, series: pct(adSpend, adSales), prev: pct(prev.adSpend, prev.adSales), agg: 'mean', upIsGood: false, kind: 'line' },
  { key: 'adClicks', label: 'Ad Clicks', unit: 'count', color: SERIES_COLORS.teal, series: adClicks, prev: prev.adClicks, agg: 'sum', upIsGood: true, kind: 'bar' },
  { key: 'adOrders', label: 'Ad Orders', unit: 'count', color: SERIES_COLORS.royal, series: adOrders, prev: prev.adOrders, agg: 'sum', upIsGood: true, kind: 'bar' },
  { key: 'cpc', label: 'CPC', unit: 'usd', color: SERIES_COLORS.pink, series: div(adSpend, adClicks), prev: div(prev.adSpend, prev.adClicks), agg: 'mean', upIsGood: false, kind: 'line' },
  { key: 'adConversion', label: 'Ad Conversion Rate', unit: 'pct', color: SERIES_COLORS.lavender, series: pct(adOrders, adClicks), prev: pct(prev.adOrders, prev.adClicks), agg: 'mean', upIsGood: true, kind: 'line' },
  { key: 'unitsPerOrder', label: 'Units Per Order', unit: 'ratio', color: SERIES_COLORS.sky, series: unitsPerOrder, prev: prev.unitsPerOrder, agg: 'mean', upIsGood: true, kind: 'line' },
  { key: 'buyBox', label: 'Buy Box', unit: 'pct', color: SERIES_COLORS.red, series: buyBox, prev: prev.buyBox, agg: 'mean', upIsGood: true, kind: 'line' },
]

export const METRIC = Object.fromEntries(METRICS.map((m) => [m.key, m])) as Record<string, Metric>

/* ── Headline numbers ─────────────────────────────────────────────── */
export function headline(m: Metric) {
  const agg = (s: number[]) => (m.agg === 'sum' ? s.reduce((a, b) => a + b, 0) : s.reduce((a, b) => a + b, 0) / s.length)
  const now = agg(m.series)
  const before = agg(m.prev)
  const change = now - before
  const pctChange = before === 0 ? 0 : (change / before) * 100
  const up = change >= 0
  return { now, before, change, pctChange, up, good: up === m.upIsGood }
}

/* ── Formatting, per unit ─────────────────────────────────────────── */
function compact(n: number, digits = 2) {
  const abs = Math.abs(n)
  if (abs >= 1e9) return `${(n / 1e9).toFixed(digits)}B`
  if (abs >= 1e6) return `${(n / 1e6).toFixed(digits)}M`
  if (abs >= 1e3) return `${(n / 1e3).toFixed(abs >= 1e5 ? 0 : 1)}K`
  return n.toFixed(abs < 10 ? 2 : 0)
}

/** Headline value: $40.18M, 2.26M, 42.46%, 2.51. */
export function fmt(n: number, unit: Unit): string {
  switch (unit) {
    case 'usd':
      return Math.abs(n) >= 1e3 ? `$${compact(n)}` : `$${n.toFixed(2)}`
    case 'count':
      return Math.abs(n) >= 1e6 ? compact(n) : Math.round(n).toLocaleString('en-US')
    case 'pct':
      return `${n.toFixed(2)}%`
    case 'ratio':
      return n.toFixed(2)
  }
}

/** The absolute change beside a headline, in the metric's own unit. */
export function fmtChange(n: number, unit: Unit): string {
  const v = Math.abs(n)
  switch (unit) {
    case 'usd':
      return v >= 1e3 ? `$${compact(v)}` : `$${v.toFixed(2)}`
    case 'count':
      return v >= 1e6 ? compact(v) : Math.round(v).toLocaleString('en-US')
    case 'pct':
      return `${v.toFixed(2)} pts`
    case 'ratio':
      return v.toFixed(2)
  }
}

/** Axis ticks: short and clean. $5M, $1.25M, 800K, 40%, 2.5, and a bare 0. */
const trim = (n: number, d: number) => String(+n.toFixed(d))
export function fmtTick(n: number, unit: Unit): string {
  if (n === 0) return unit === 'usd' ? '$0' : unit === 'pct' ? '0%' : '0'
  switch (unit) {
    case 'usd':
      return n >= 1e6 ? `$${trim(n / 1e6, 2)}M` : n >= 1e3 ? `$${trim(n / 1e3, 1)}K` : `$${trim(n, 2)}`
    case 'count':
      return n >= 1e6 ? `${trim(n / 1e6, 2)}M` : n >= 1e3 ? `${trim(n / 1e3, 1)}K` : trim(n, 0)
    case 'pct':
      return `${trim(n, 1)}%`
    case 'ratio':
      return trim(n, 2)
  }
}

/* ── The axis engine ──────────────────────────────────────────────── */
export type Placed = {
  metric: Metric
  kind: Kind
  axis: Axis
}

export type AxisSpec = {
  unit: Unit
  /** Top of the scale, rounded to a clean tick. */
  max: number
  metrics: Metric[]
}

export type Layout = {
  placed: Placed[]
  axes: Partial<Record<Axis, AxisSpec>>
  /** Units that cannot be added because both axes are taken. */
  blocked: Unit[]
  /** One sentence the drawer can show for why the axes look the way they do. */
  note: string
}

/* A clean ceiling for a scale: 1, 2, 2.5, 5 × 10^n steps above the max. */
function niceCeil(max: number) {
  if (max <= 0) return 1
  const exp = Math.floor(Math.log10(max))
  const base = Math.pow(10, exp)
  for (const step of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    if (max <= step * base) return step * base
  }
  return 10 * base
}

const maxOf = (ms: Metric[]) => Math.max(...ms.map((m) => Math.max(...m.series)))

export function layoutAxes(
  selection: { key: string; kind?: Kind }[],
  singleAxis: boolean,
): Layout {
  const metrics = selection.map((s) => ({ metric: METRIC[s.key], kind: s.kind ?? METRIC[s.key].kind }))
  const families: Unit[] = []
  for (const { metric } of metrics) if (!families.includes(metric.unit)) families.push(metric.unit)

  const blocked = families.slice(2)
  const usable = metrics.filter(({ metric }) => !blocked.includes(metric.unit))

  const axes: Partial<Record<Axis, AxisSpec>> = {}
  const placed: Placed[] = []
  let note = ''

  const byUnit = (u: Unit) => usable.filter(({ metric }) => metric.unit === u).map((x) => x.metric)

  if (families.length === 0) {
    note = 'Pick at least one metric.'
  } else if (families.length === 1 && !singleAxis && usable.length > 1) {
    /* One unit family, the switch off: split by magnitude when the biggest
       and smallest differ by more than 4x, so a $600K line is not flattened
       under a $4M one. Otherwise they share the left axis anyway. */
    const ms = byUnit(families[0]).sort((a, b) => maxOf([b]) - maxOf([a]))
    const big = maxOf([ms[0]])
    const small = maxOf([ms[ms.length - 1]])
    if (big / small > 4) {
      const left = ms.filter((m) => maxOf([m]) > big / 4)
      const right = ms.filter((m) => !left.includes(m))
      axes.L = { unit: families[0], max: niceCeil(maxOf(left)), metrics: left }
      axes.R = { unit: families[0], max: niceCeil(maxOf(right)), metrics: right }
      note = `${right.map((m) => m.label).join(' and ')} moved to the right axis so ${
        right.length > 1 ? 'they stay' : 'it stays'
      } readable next to ${left.map((m) => m.label).join(' and ')}.`
    } else {
      axes.L = { unit: families[0], max: niceCeil(maxOf(ms)), metrics: ms }
      note = `All ${UNIT_LABEL[families[0]]}, so one shared left axis.`
    }
  } else {
    const l = byUnit(families[0])
    axes.L = { unit: families[0], max: niceCeil(maxOf(l)), metrics: l }
    if (families[1]) {
      const r = byUnit(families[1])
      axes.R = { unit: families[1], max: niceCeil(maxOf(r)), metrics: r }
      note = `${UNIT_LABEL[families[0]]} on the left axis, ${UNIT_LABEL[families[1]]} on the right.`
    } else {
      note = singleAxis
        ? `All ${UNIT_LABEL[families[0]]} on one shared left axis.`
        : `All ${UNIT_LABEL[families[0]]}, so one shared left axis.`
    }
    if (blocked.length) {
      note += ` Both axes are taken, so ${blocked.map((u) => UNIT_LABEL[u]).join(' and ')} cannot be added.`
    }
  }

  for (const { metric, kind } of usable) {
    const axis: Axis = axes.L?.metrics.includes(metric) ? 'L' : 'R'
    placed.push({ metric, kind, axis })
  }

  return { placed, axes, blocked, note }
}

/** The metrics the drawer should refuse: a third unit family, once L and R are taken. */
export function canAdd(metric: Metric, layout: Layout): boolean {
  const units = Object.values(layout.axes).map((a) => a.unit)
  if (units.length < 2) return true
  return units.includes(metric.unit)
}

/* ── The preset states the study shows ────────────────────────────── */
export const PRESETS = {
  /** The widget as designed: two dollar lines, two count bars. */
  linesAndBars: [
    { key: 'sales' },
    { key: 'adSales' },
    { key: 'patternPageViews', kind: 'bar' as Kind },
    { key: 'pageViews', kind: 'bar' as Kind },
  ],
  /** Four lines in one family. */
  fourLines: [{ key: 'sales' }, { key: 'adSales' }, { key: 'incrementalAdSales' }, { key: 'adSpend' }],
  /** The old two-metric chart. */
  classic: [{ key: 'adClicks', kind: 'line' as Kind }, { key: 'acos' }],
}

/** The seven header cards in the designed widget: two primary, five secondary. */
export const HEADER_PRIMARY = ['sales', 'adSales']
export const HEADER_SECONDARY = ['patternPageViews', 'trueRoas', 'pageViews', 'incrementalAdSales', 'roas']
