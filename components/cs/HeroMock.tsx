'use client'

import { useEffect, useRef, useState } from 'react'
import SearchMock from '@/components/lucid/SearchMock'

/*
 * The live Find Docs mock behind the hero laptop's glass. The mock lays
 * itself out for a desktop-width panel, so on a phone-width screen the
 * zero state's heading and prompt tiles would clip. Measure the screen and
 * zoom the whole panel out to fit — the same trick the home tile uses —
 * so the same interface reads at every width and nothing reflows.
 *
 * The panel gets explicit pixel dimensions (the screen's, divided by the
 * zoom) rather than percentages: SearchMock centres a percentage-height
 * panel before scaling it from its top edge, which shows the wrong slice.
 */
const MIN_NATIVE_W = 960

export default function HeroMock() {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox({ w: Math.round(width), h: Math.round(height) })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const native = box ? Math.max(box.w, MIN_NATIVE_W) : MIN_NATIVE_W
  const scale = box ? box.w / native : 1

  return (
    <div ref={ref} className="h-full w-full">
      {box && (
        <SearchMock width={native} height={Math.round(box.h / scale)} scale={scale} zeroState />
      )}
    </div>
  )
}
