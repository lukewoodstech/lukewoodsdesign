'use client'

import { useId, useState, type ReactNode } from 'react'

/*
 * Segmented control flipping between the three failure states. Proper tabs
 * semantics: roving tabindex, arrow-key navigation, panels labelled by their
 * tab. Panels stay mounted (hidden attr) so flipping is instant and images
 * stay warm.
 */
export default function FailureTabs({
  tabs,
}: {
  tabs: { label: string; content: ReactNode }[]
}) {
  const [active, setActive] = useState(0)
  const baseId = useId()

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next =
      e.key === 'ArrowRight'
        ? (active + 1) % tabs.length
        : (active - 1 + tabs.length) % tabs.length
    setActive(next)
    document.getElementById(`${baseId}-tab-${next}`)?.focus()
  }

  return (
    <div>
      <div className="lcs-seg" role="tablist" aria-label="Failure states" onKeyDown={onKeyDown}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${baseId}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            className="lcs-seg__btn"
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.label}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={active !== i}
          className="lcs-tab-panel mt-5"
        >
          {t.content}
        </div>
      ))}
    </div>
  )
}
