import type { CSSProperties, ReactNode } from 'react'

/*
 * A laptop drawn in CSS: a 16:10 screen with a bezel and a camera notch,
 * and optionally the thin base under it. Whatever goes inside fills the
 * screen — a still capture (`next/image` with `fill`) or a live mock. Built
 * in code rather than composited as a PNG so the hero can run the real
 * SearchMock behind the glass.
 */
export default function Laptop({
  children,
  base = false,
  glow = false,
  ratio,
  className = '',
  style,
}: {
  children: ReactNode
  base?: boolean
  glow?: boolean
  /** Screen aspect ratio, width / height. Defaults to 16:10. */
  ratio?: number
  className?: string
  style?: CSSProperties
}) {
  const cls = ['cs-laptop', base && 'cs-laptop--base', glow && 'cs-laptop--glow', className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls} style={ratio ? ({ ...style, '--screen-ar': ratio } as CSSProperties) : style}>
      <div className="cs-laptop__screen">{children}</div>
      {base && <div className="cs-laptop__base" aria-hidden="true" />}
    </div>
  )
}
