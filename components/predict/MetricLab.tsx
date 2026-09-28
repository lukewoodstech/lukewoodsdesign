'use client'

/* eslint-disable @next/next/no-img-element -- the file's own 16px SVG glyphs; next/image adds nothing to a decorative inline icon */

import { useState } from 'react'
import CustomizeDrawer, { type Selection } from '@/components/predict/CustomizeDrawer'
import ReportWidget from '@/components/predict/ReportWidget'
import { predictFont } from '@/components/predict/font'
import { HEADER_PRIMARY, HEADER_SECONDARY, PRESETS, layoutAxes } from '@/lib/predict/metrics'

/*
 * The interactive centrepiece of the Custom Reports study: the redesigned
 * widget beside its customize drawer, sharing one piece of state. Change a
 * metric, its mark, or the single-axis switch and the chart, the axis ticks,
 * the L/R badges and the header swatches all follow, because they all read
 * the same layoutAxes() result.
 *
 * Three presets sit above it so a reader can jump between the states the
 * design file documents without hunting through the list.
 */

const M = '/work/pattern/mock'

const PRESET_LIST = [
  { id: 'linesAndBars', label: '2 lines + 2 bars', selection: PRESETS.linesAndBars },
  { id: 'fourLines', label: '4 lines, one unit', selection: PRESETS.fourLines },
  { id: 'classic', label: 'The old 2-metric chart', selection: PRESETS.classic },
] as const

export default function MetricLab() {
  const [selection, setSelection] = useState<Selection>(PRESETS.linesAndBars)
  const [singleAxis, setSingleAxis] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const layout = layoutAxes(selection, singleAxis)

  const activePreset = PRESET_LIST.find(
    (p) => JSON.stringify(p.selection) === JSON.stringify(selection),
  )?.id

  return (
    <div className={`pm pm-lab ${predictFont.className}`}>
      <div className="pm-lab__presets" role="group" aria-label="Chart presets">
        <span className="pm-lab__try">Try</span>
        {PRESET_LIST.map((p) => (
          <button
            key={p.id}
            type="button"
            className="pm-preset"
            aria-pressed={activePreset === p.id}
            onClick={() => setSelection([...p.selection])}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={`pm-lab__stage ${drawerOpen ? 'pm-lab__stage--open' : ''}`}>
        <ReportWidget
          title="Organic + Paid + Insights"
          brand="MegaFoods"
          caption="Does expanding organic content move conversion efficiency? Sales and ad sales against page views, month by month, to find where more pages start to pay off, plateau, or dilute performance."
          primary={HEADER_PRIMARY}
          secondary={HEADER_SECONDARY}
          layout={layout}
          actions={
            <button
              type="button"
              className="pm-iconbtn"
              aria-expanded={drawerOpen}
              aria-controls="pm-lab-drawer"
              onClick={() => setDrawerOpen((o) => !o)}
              title="Customize graph and header"
            >
              <img src={`${M}/icons-settings.svg`} alt="" className="pm-icon" />
              <span className="sr-only">Customize graph and header</span>
            </button>
          }
        />
        <div id="pm-lab-drawer" hidden={!drawerOpen}>
          <CustomizeDrawer
            selection={selection}
            singleAxis={singleAxis}
            layout={layout}
            onChange={setSelection}
            onSingleAxis={setSingleAxis}
            onReset={() => {
              setSelection([...PRESETS.linesAndBars])
              setSingleAxis(false)
            }}
          />
        </div>
      </div>
    </div>
  )
}
