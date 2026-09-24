'use client'

import ZoomShot from '@/components/lucid/ZoomShot'

/*
 * A login flow drawn as its own screens, numbered and linked. Used twice in
 * the Awardco study — once for the four-step flow users had, once for the
 * three-step flow they got — so the two read as the same kind of object and
 * the missing fourth step is the argument.
 *
 * This replaces a pair of exported deck slides whose step numbers, headings
 * and bullet lists were baked into the pixels at about 270px per screen.
 * Here the screens are real full-resolution frames (click to expand) and the
 * numbering, titles and annotations are text the page owns.
 *
 * Two annotation devices, both carrying meaning rather than decoration:
 * - `flag` marks a step that asks the user to authenticate. In the before
 *   flow two steps carry it, which is the whole problem.
 * - `carry` promotes the connector after a step from a plain arrow to a
 *   labelled one, for the token travelling from universal login into the
 *   company page.
 *
 * Narrow screens scroll the row horizontally with snap points instead of
 * shrinking four screens to thumbnails; the flow still reads as a flow.
 */

export type FlowStep = {
  src: string
  alt: string
  width: number
  height: number
  title: string
  note: string
  /** Chip over the screen: this step makes the user authenticate. */
  flag?: string
  /** Label the connector leaving this step, for the token handoff. */
  carry?: string
}

export default function FlowStrip({
  steps,
  label,
  tone = 'plain',
  tracks,
}: {
  steps: FlowStep[]
  /** Names the flow for assistive tech, e.g. "The login flow before the redesign". */
  label: string
  /** `problem` tints the flags amber; `plain` leaves them neutral. */
  tone?: 'plain' | 'problem'
  /**
   * Column count to lay out against, when it should exceed `steps.length`.
   * Both Awardco strips pass the longer flow's count, so a screen is the
   * same size in each and the shorter flow visibly stops early — which is
   * the comparison, rather than the after screens simply rendering bigger.
   */
  tracks?: number
}) {
  const cols = Math.max(tracks ?? steps.length, steps.length)

  return (
    <ol
      className={`acs-flow acs-flow--${tone}`}
      aria-label={label}
      style={{ '--cols': cols } as React.CSSProperties}
    >
      {steps.map((s, i) => (
        <li className="acs-flow__step" key={s.src}>
          <div className="acs-flow__head">
            <span className="acs-flow__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h4 className="acs-flow__title">{s.title}</h4>
          </div>

          {/* The connector lives inside the shot so it centres on the screen,
              whatever height the title above it wrapped to. */}
          <div className="acs-flow__shot">
            <ZoomShot
              src={s.src}
              alt={s.alt}
              width={s.width}
              height={s.height}
              sizes="(min-width: 60em) 20vw, 70vw"
            />
            {s.flag && <span className="acs-flow__flag">{s.flag}</span>}
            {i < steps.length - 1 && (
              <span
                className={`acs-flow__link${s.carry ? ' acs-flow__link--carry' : ''}`}
                aria-hidden="true"
              >
                {s.carry && <span className="acs-flow__carry">{s.carry}</span>}
              </span>
            )}
          </div>

          <p className="acs-flow__note">{s.note}</p>
        </li>
      ))}
    </ol>
  )
}
