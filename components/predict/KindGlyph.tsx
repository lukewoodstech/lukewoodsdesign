/*
 * The two mark glyphs from the design file's drawer: a short line and three
 * bars, drawn as SVG so they stay crisp at 12px in a card label, a drawer
 * row and a legend alike. currentColor, so the host sets the ink.
 */
export default function KindGlyph({ kind, title }: { kind: 'line' | 'bar'; title?: string }) {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      className="pm-kind"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {kind === 'line' ? (
        <polyline
          points="1,8 4.5,4 7.5,6 13,1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <g fill="currentColor">
          <rect x="1" y="4" width="3" height="6" rx="0.5" />
          <rect x="5.5" y="1" width="3" height="9" rx="0.5" />
          <rect x="10" y="6" width="3" height="4" rx="0.5" />
        </g>
      )}
    </svg>
  )
}
