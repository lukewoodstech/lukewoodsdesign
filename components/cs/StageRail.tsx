'use client'

import { useEffect, useState } from 'react'

/*
 * The design process, beside the page (LUK-203). On a wide screen a
 * vertical rail sits in the left gutter: every stage of the study, the
 * current one lit, the ones behind it filled, a click away from any of
 * them. On a narrow screen it is a thin bar under the nav naming the
 * current stage, with a progress line. Both show only while the reader is
 * inside the stages, so the hero and the read-next cards stay clean.
 *
 * Which stage is current: the last whose top has passed 35% of the
 * viewport. A rAF-throttled scroll read, cheap at six sections.
 */
export type RailStage = { id: string; label: string }

export default function StageRail({ stages }: { stages: RailStage[] }) {
  const [current, setCurrent] = useState(-1)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const els = stages.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
      if (els.length === 0) return
      const line = window.innerHeight * 0.35
      let idx = -1
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) idx = i
      })
      const first = els[0].getBoundingClientRect()
      const last = els[els.length - 1].getBoundingClientRect()
      setCurrent(idx)
      setVisible(first.top <= window.innerHeight * 0.6 && last.bottom >= window.innerHeight * 0.3)
      const span = last.bottom - first.top
      setProgress(span > 0 ? Math.min(1, Math.max(0, (line - first.top) / span)) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [stages])

  const here = stages[Math.max(0, current)]

  return (
    <>
      <nav
        className={`cs-rail${visible ? ' is-visible' : ''}`}
        aria-label="Design process"
      >
        <ol>
          {stages.map((s, i) => (
            <li
              key={s.id}
              className={i === current ? 'is-current' : i < current ? 'is-done' : undefined}
            >
              <a href={`#${s.id}`} aria-current={i === current ? 'step' : undefined}>
                <span className="cs-rail__dot" aria-hidden="true" />
                <span className="cs-rail__label">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className={`cs-railbar${visible ? ' is-visible' : ''}`} aria-hidden="true">
        <span className="cs-railbar__step">
          {String(Math.max(0, current) + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
        </span>
        <span className="cs-railbar__label">{here?.label}</span>
        <span className="cs-railbar__track">
          <span className="cs-railbar__fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
    </>
  )
}
