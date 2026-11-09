'use client'

import Image from 'next/image'
import { useId, useState, type ReactNode } from 'react'
import { Iphone, Macbook } from '@/components/cs/Devices'

/*
 * The redesigned sign-in, one path at a time. Each path is a short list of
 * steps; each step shows the same screen on a phone and a laptop, the way
 * the hero does, so a reader can walk the whole flow without opening Figma.
 *
 * Paths are tabs (roving tabindex, arrow keys), steps are a numbered list
 * of buttons with previous/next. Every screen in the active path is mounted
 * and stacked, and only the current one is visible, so stepping is an
 * instant crossfade instead of a fresh image load.
 *
 * `extra` is for something that belongs to a step but isn't a screen, like
 * the code page's rate-limit alert.
 */

export type WalkStep = {
  title: string
  note: ReactNode
  /** File stem in /work/awardco/walk, without the desk-/phone- prefix. */
  shot: string
  alt: string
  extra?: ReactNode
}

export type WalkPath = { label: string; steps: WalkStep[] }

const DIR = '/work/awardco/walk'

export default function FlowWalkthrough({ paths }: { paths: WalkPath[] }) {
  const [p, setP] = useState(0)
  const [s, setS] = useState(0)
  const baseId = useId()
  const path = paths[p]
  const step = path.steps[s]

  const pickPath = (i: number) => {
    setP(i)
    setS(0)
  }

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next =
      e.key === 'ArrowRight' ? (p + 1) % paths.length : (p - 1 + paths.length) % paths.length
    pickPath(next)
    document.getElementById(`${baseId}-tab-${next}`)?.focus()
  }

  return (
    <div className="acs-walk">
      <div className="acs-walk__tabs">
        <div className="lcs-seg" role="tablist" aria-label="Sign-in paths" onKeyDown={onTabKey}>
          {paths.map((x, i) => (
            <button
              key={x.label}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={p === i}
              aria-controls={`${baseId}-panel`}
              tabIndex={p === i ? 0 : -1}
              className="lcs-seg__btn"
              onClick={() => pickPath(i)}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${p}`}
        className="acs-walk__panel"
      >
        <ol className="acs-walk__steps" aria-label={`${path.label}, step by step`}>
          {path.steps.map((x, i) => (
            <li key={x.shot}>
              <button
                type="button"
                className="acs-walk__step"
                aria-current={s === i ? 'step' : undefined}
                onClick={() => setS(i)}
              >
                <span className="acs-walk__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="acs-walk__steptitle">{x.title}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="acs-walk__stage">
          <div className="acs-walk__phone">
            <Iphone>
              {path.steps.map((x, i) => (
                <Image
                  key={x.shot}
                  src={`${DIR}/phone-${x.shot}.png`}
                  alt={i === s ? `${x.alt}, on a phone` : ''}
                  aria-hidden={i !== s}
                  fill
                  loading="eager"
                  className="acs-walk__img"
                  data-on={i === s}
                  sizes="(min-width: 60em) 240px, 34vw"
                />
              ))}
            </Iphone>
          </div>
          <div className="acs-walk__desk">
            <Macbook ratio={1440 / 1024}>
              {path.steps.map((x, i) => (
                <Image
                  key={x.shot}
                  src={`${DIR}/desk-${x.shot}.png`}
                  alt={i === s ? `${x.alt}, on desktop` : ''}
                  aria-hidden={i !== s}
                  fill
                  loading="eager"
                  className="acs-walk__img"
                  data-on={i === s}
                  sizes="(min-width: 60em) 56vw, 64vw"
                />
              ))}
            </Macbook>
          </div>
        </div>

        <div className="acs-walk__foot">
          <div className="acs-walk__caption" aria-live="polite">
            <p className="acs-walk__title">
              <span className="acs-walk__count">
                {s + 1} / {path.steps.length}
              </span>
              {step.title}
            </p>
            <p className="acs-walk__note">{step.note}</p>
            {step.extra}
          </div>
          <div className="acs-walk__nav">
            <button
              type="button"
              className="acs-walk__arrow"
              onClick={() => setS(s - 1)}
              disabled={s === 0}
              aria-label="Previous step"
            >
              ←
            </button>
            <button
              type="button"
              className="acs-walk__arrow"
              onClick={() => setS(s + 1)}
              disabled={s === path.steps.length - 1}
              aria-label="Next step"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* The code page's two alerts, rebuilt as markup from the design file
   (Inline Alert, 1102:33659 and 1102:33661) so they stay sharp at any size. */
export function CodeAlerts() {
  return (
    <div className="acs-alerts">
      <div className="acs-alert acs-alert--error">
        <span className="acs-alert__icon" aria-hidden="true">!</span>
        <div>
          <p className="acs-alert__title">You&rsquo;ve requested too many codes.</p>
          <p className="acs-alert__body">Please wait 2 minutes before trying again.</p>
        </div>
      </div>
      <div className="acs-alert acs-alert--ok">
        <span className="acs-alert__icon" aria-hidden="true">✓</span>
        <div>
          <p className="acs-alert__title">New code sent. Check your email.</p>
        </div>
      </div>
    </div>
  )
}
