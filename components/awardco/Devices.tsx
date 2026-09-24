import type { CSSProperties, ReactNode } from 'react'

/*
 * Device frames for the Awardco study, drawn in CSS.
 *
 * Deliberately separate from `components/cs/Laptop` and the shared
 * `.cs-phone`: those are minimal rectangles that the Lucid and Pattern
 * studies already rely on, and restyling them here would silently change
 * two other pages. These are the same idea with real hardware detail, and
 * nothing outside this study uses them.
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
    <div className={`acs-iphone ${className}`.trim()} style={style}>
      <span className="acs-iphone__btn acs-iphone__btn--action" aria-hidden="true" />
      <span className="acs-iphone__btn acs-iphone__btn--vol-up" aria-hidden="true" />
      <span className="acs-iphone__btn acs-iphone__btn--vol-down" aria-hidden="true" />
      <span className="acs-iphone__btn acs-iphone__btn--power" aria-hidden="true" />
      <div className="acs-iphone__screen">
        {children}
        <span className="acs-iphone__island" aria-hidden="true" />
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
      className={`acs-macbook ${className}`.trim()}
      style={ratio ? ({ ...style, '--screen-ar': ratio } as CSSProperties) : style}
    >
      <div className="acs-macbook__lid">
        <div className="acs-macbook__bezel">
          <div className="acs-macbook__screen">
            {children}
            <span className="acs-macbook__notch" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="acs-macbook__base" aria-hidden="true">
        <span className="acs-macbook__lip" />
      </div>
    </div>
  )
}
