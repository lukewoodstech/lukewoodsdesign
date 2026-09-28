'use client'

import { useState } from 'react'
import KindGlyph from '@/components/predict/KindGlyph'
import { METRICS, UNIT_LABEL, canAdd, type Kind, type Layout } from '@/lib/predict/metrics'

/*
 * The "Customize graph and header" drawer from the design file's Axes
 * Control section (15635:13522), wired to the real axis engine.
 *
 * Every control here does something: the checkboxes add and remove metrics,
 * the line/bar switch changes the mark, the single-axis toggle changes how
 * one unit family is scaled, and "Set to default" restores the preset. The
 * L and R badges are read-only on purpose: in Luke's rules the engine
 * assigns axes from units, the user does not drag metrics between them.
 *
 * A metric from a third unit family is disabled once both axes are taken,
 * with the reason written under the list, which is the "blocked with a
 * hint" behaviour Luke chose for the redesign.
 */

export type Selection = { key: string; kind?: Kind }[]

const MAX_ON_CHART = 6

export default function CustomizeDrawer({
  selection,
  singleAxis,
  layout,
  onChange,
  onSingleAxis,
  onReset,
}: {
  selection: Selection
  singleAxis: boolean
  layout: Layout
  onChange: (next: Selection) => void
  onSingleAxis: (on: boolean) => void
  onReset: () => void
}) {
  const [q, setQ] = useState('')
  const selectedKeys = selection.map((s) => s.key)
  const isOn = (key: string) => selectedKeys.includes(key)
  const kindOf = (key: string) => layout.placed.find((p) => p.metric.key === key)?.kind
  const axisOf = (key: string) => layout.placed.find((p) => p.metric.key === key)?.axis

  const toggle = (key: string) => {
    if (isOn(key)) onChange(selection.filter((s) => s.key !== key))
    else if (selection.length < MAX_ON_CHART) onChange([...selection, { key }])
  }
  const setKind = (key: string, kind: Kind) =>
    onChange(selection.map((s) => (s.key === key ? { ...s, kind } : s)))

  const match = (label: string) => label.toLowerCase().includes(q.trim().toLowerCase())
  const selected = METRICS.filter((m) => isOn(m.key) && match(m.label))
  const unselected = METRICS.filter((m) => !isOn(m.key) && match(m.label))
  const full = selection.length >= MAX_ON_CHART
  const bothAxes = !!layout.axes.L && !!layout.axes.R

  return (
    <aside className="pm-drawer" aria-label="Customize graph and header">
      <header className="pm-drawer__head">
        <h3>Customize graph and header</h3>
      </header>

      <label className="pm-switch">
        <span>Show comparable metrics on a single axis</span>
        <input
          type="checkbox"
          role="switch"
          checked={singleAxis}
          onChange={(e) => onSingleAxis(e.target.checked)}
        />
        <span className="pm-switch__track" aria-hidden="true" />
      </label>
      <p className="pm-drawer__note" aria-live="polite">
        {layout.note}
      </p>

      <p className="pm-drawer__label">Header metrics</p>
      <input
        type="search"
        className="pm-search"
        placeholder="Search metrics"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search metrics"
      />

      <div className="pm-drawer__group">
        <p className="pm-drawer__grouphead">
          <span>Selected ({selection.length})</span>
          <button type="button" onClick={() => onChange([])} disabled={!selection.length}>
            Clear
          </button>
        </p>
        <ul className="pm-drawer__list">
          {selected.map((m) => (
            <li key={m.key} className="pm-row">
              <label className="pm-row__main">
                <input type="checkbox" checked onChange={() => toggle(m.key)} />
                <span>{m.label}</span>
              </label>
              <span className="pm-row__ctl">
                <span className="pm-kindswitch" role="group" aria-label={`${m.label} mark`}>
                  <button
                    type="button"
                    aria-pressed={kindOf(m.key) === 'line'}
                    onClick={() => setKind(m.key, 'line')}
                    title="Line"
                  >
                    <KindGlyph kind="line" />
                  </button>
                  <button
                    type="button"
                    aria-pressed={kindOf(m.key) === 'bar'}
                    onClick={() => setKind(m.key, 'bar')}
                    title="Bar"
                  >
                    <KindGlyph kind="bar" />
                  </button>
                </span>
                {bothAxes && (
                  <span className="pm-axis" title={`${axisOf(m.key) === 'L' ? 'Left' : 'Right'} axis`}>
                    {axisOf(m.key)}
                  </span>
                )}
                <span className="pm-swatch" style={{ background: m.color }} aria-hidden="true" />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pm-drawer__group">
        <p className="pm-drawer__grouphead">
          <span>Unselected ({METRICS.length - selection.length})</span>
        </p>
        <ul className="pm-drawer__list">
          {unselected.map((m) => {
            const blocked = !canAdd(m, layout)
            const disabled = blocked || full
            return (
              <li key={m.key} className={`pm-row ${disabled ? 'pm-row--off' : ''}`}>
                <label className="pm-row__main">
                  <input type="checkbox" checked={false} disabled={disabled} onChange={() => toggle(m.key)} />
                  <span>{m.label}</span>
                </label>
                <span className="pm-row__unit">{UNIT_LABEL[m.unit]}</span>
              </li>
            )
          })}
        </ul>
        {layout.blocked.length === 0 && bothAxes && unselected.some((m) => !canAdd(m, layout)) && (
          <p className="pm-drawer__hint">
            Both axes are taken by {UNIT_LABEL[layout.axes.L!.unit]} and {UNIT_LABEL[layout.axes.R!.unit]}. Remove
            one family to add another.
          </p>
        )}
        {full && <p className="pm-drawer__hint">Up to {MAX_ON_CHART} metrics on one chart.</p>}
      </div>

      <footer className="pm-drawer__foot">
        <button type="button" className="pm-link" onClick={onReset}>
          Set to default
        </button>
      </footer>
    </aside>
  )
}
