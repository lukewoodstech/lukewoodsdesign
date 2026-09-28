import type { CSSProperties, ReactNode } from 'react'

/*
 * Device frames drawn in CSS, with real hardware detail.
 *
 * Separate from `components/cs/Laptop` and the shared `.cs-phone` rather
 * than replacing them: those are minimal rectangles that Lucid and Pattern
 * still rely on in their final-design bands, and restyling in place would
 * change those pages without anyone asking. Prefer these for new work; the
 * two can coexist until every study has moved over.
 *
 * Both size everything from their own width (`container-type: inline-size`),
 * so one component works at hero scale and again small in a comparison row.
 */

/* iPhone proportions follow a 15 Pro: a 393x852pt screen inside a titanium
   band, Dynamic Island, and the four side buttons in their real places. */
export function Iphone({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`cs-iphone ${className}`.trim()} style={style}>
      <span className="cs-iphone__btn cs-iphone__btn--action" aria-hidden="true" />
      <span className="cs-iphone__btn cs-iphone__btn--vol-up" aria-hidden="true" />
      <span className="cs-iphone__btn cs-iphone__btn--vol-down" aria-hidden="true" />
      <span className="cs-iphone__btn cs-iphone__btn--power" aria-hidden="true" />
      <div className="cs-iphone__screen">
        {children}
        <span className="cs-iphone__island" aria-hidden="true" />
      </div>
    </div>
  )
}

/* MacBook Pro: aluminium lid, black bezel, camera notch, and a tapered base
   with the thumb lip cut into its front edge. */
export function Macbook({
  children,
  ratio,
  className = '',
  style,
}: {
  children: ReactNode
  /** Screen aspect ratio, width / height. Defaults to the real 16:10. */
  ratio?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`cs-macbook ${className}`.trim()}
      style={ratio ? ({ ...style, '--screen-ar': ratio } as CSSProperties) : style}
    >
      <div className="cs-macbook__lid">
        <div className="cs-macbook__bezel">
          <div className="cs-macbook__screen">
            {children}
            <span className="cs-macbook__notch" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="cs-macbook__base" aria-hidden="true">
        <span className="cs-macbook__lip" />
      </div>
    </div>
  )
}
