import type { ReactNode } from 'react'
import { Col } from './Story'

/*
 * One stage of a hand-built study, matching the stages the [slug]
 * template renders for Pitch (LUK-203): a plain heading and its body in
 * the reading column, then the stage's pictures. The section wraps the
 * pictures too, full-width bands included, so StageRail lights this stage
 * for as long as any of it is on screen.
 *
 * Heading and body only (Luke, 2026-11-03): no eyebrow, no act number,
 * no subheads.
 */
export default function Stage({
  id,
  title,
  body,
  children,
}: {
  id: string
  title: string
  body?: ReactNode
  children?: ReactNode
}) {
  return (
    <section id={id} className="cs-stage" aria-labelledby={`${id}-title`}>
      <Col>
        <h2 id={`${id}-title`} className="cs-stage__title">
          {title}
        </h2>
        {body && <div className="cs-prose cs-stage__body">{body}</div>}
      </Col>
      {children}
    </section>
  )
}
