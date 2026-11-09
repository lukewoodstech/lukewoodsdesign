'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * The design process, as a bar under the nav (LUK-203; one bar for every
 * width since 2026-11-09, when the desktop left-gutter list became a
 * wider version of the phone bar). It slides in once the reader scrolls
 * past the hero band and leaves after the last stage, so the hero and the
 * read-next cards stay clean.
 *
 * Wide screens list every stage, so the bar is a contents list: the stage
 * being read is white with an accent underline, the ones behind it a
 * lighter grey, each a click away. Narrow screens have no room for the
 * list and show only the current stage's name. Both carry a progress line.
 *
 * "Overview" covers the stretch between the hero and the first stage (the
 * problem, the impact) so the bar never names a stage the reader hasn't
 * reached.
 *
 * Which stage is current: the last whose top has passed the middle of the
 * viewport, so a heading read near the top already counts. A
 * rAF-throttled scroll read, cheap at eight sections.
 */
export type RailStage = { id: string; label: string }

/* The hero is the first band on every study page. */
const heroEl = () => document.querySelector<HTMLElement>('main .cs-band')

export default function StageRail({ stages }: { stages: RailStage[] }) {
  const [current, setCurrent] = useState(-1)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const els = stages.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
      if (els.length === 0) return
      const vh = window.innerHeight
      const line = vh * 0.5
      let idx = -1
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) idx = i
      })
      setCurrent(idx)

      const hero = heroEl()
      const start = hero ? hero.getBoundingClientRect().bottom : els[0].getBoundingClientRect().top
      const last = els[els.length - 1].getBoundingClientRect()
      // In from the moment the hero's bottom edge leaves under the nav,
      // out once the last stage has scrolled away.
      setVisible(start <= 64 && last.bottom >= vh * 0.3)
      const span = last.bottom - start
      setProgress(span > 0 ? Math.min(1, Math.max(0, (line - start) / span)) : 0)
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

  // Mark a list that outruns the screen so its edges can fade.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const mark = () => {
      const over = list.scrollWidth > list.clientWidth + 1
      const atStart = list.scrollLeft < 4
      const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4
      if (!over) delete list.dataset.overflow
      else list.dataset.overflow = atStart ? 'start' : atEnd ? 'end' : 'middle'
    }
    mark()
    const ro = new ResizeObserver(mark)
    ro.observe(list)
    list.addEventListener('scroll', mark, { passive: true })
    return () => {
      ro.disconnect()
      list.removeEventListener('scroll', mark)
    }
  }, [])

  // When the list is wider than the screen, keep the current stage in view
  // by scrolling the list sideways (never the page).
  useEffect(() => {
    const list = listRef.current
    if (!list || list.scrollWidth <= list.clientWidth) return
    const item = list.children[current + 1] as HTMLElement | undefined
    if (!item) return
    const target = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2
    list.scrollTo({ left: target, behavior: 'smooth' })
  }, [current])

  const toOverview = () => {
    const hero = heroEl()
    if (!hero) return
    window.scrollTo({ top: hero.getBoundingClientRect().bottom + window.scrollY - 48, behavior: 'smooth' })
  }

  const stateOf = (i: number) =>
    i === current ? 'is-current' : i < current ? 'is-done' : undefined

  return (
    <nav className={`cs-railbar${visible ? ' is-visible' : ''}`} aria-label="Case study sections">
      {/* Phone: just where you are. */}
      <span className="cs-railbar__label" aria-hidden="true">
        {current < 0 ? 'Overview' : stages[current].label}
      </span>

      {/* Wide: the whole list. */}
      <ol className="cs-railbar__list" ref={listRef}>
        <li className={current < 0 ? 'is-current' : 'is-done'}>
          <button
            type="button"
            className="cs-railbar__link"
            onClick={toOverview}
            aria-current={current < 0 ? 'step' : undefined}
          >
            Overview
          </button>
        </li>
        {stages.map((s, i) => (
          <li key={s.id} className={stateOf(i)}>
            <a
              href={`#${s.id}`}
              className="cs-railbar__link"
              aria-current={i === current ? 'step' : undefined}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ol>

      <span className="cs-railbar__track" aria-hidden="true">
        <span className="cs-railbar__fill" style={{ transform: `scaleX(${progress})` }} />
      </span>
    </nav>
  )
}
