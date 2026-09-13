/*
 * The bits that make the luke-ai window read as a VS Code terminal panel,
 * shared by the homepage card and the maximized /chat page so they stay
 * the same object. Deliberately sparse: a title, the zsh prompt, and the
 * codicon-style glyphs for the few controls that actually do something.
 * Nothing decorative that could be mistaken for a control.
 */

/* The visitor is the one typing, so the prompt is theirs, not Luke's
   machine. The host part hides at narrow widths so the prompt still
   leaves room to type on a phone. */
export const HOST = 'guest@portfolio'
export const CWD = '~'

/* `guest@portfolio ~ %` */
export const Ps1 = () => (
  <span className="ps1" aria-hidden="true">
    <span className="ps1__host">{HOST} </span>
    <span className="ps1__cwd">{CWD}</span> %{' '}
  </span>
)

export const TermTitle = () => (
  <span className="ai-card__title" aria-hidden="true">
    terminal
  </span>
)

const svgProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const IconPlus = () => (
  <svg {...svgProps}>
    <path d="M8 3v10M3 8h10" />
  </svg>
)

export const IconMaximize = () => (
  <svg {...svgProps}>
    <path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" />
  </svg>
)

export const IconRestore = () => (
  <svg {...svgProps}>
    <path d="M7 2.5v4H3M7 6.5 2.5 2M9 13.5v-4h4M9 9.5l4.5 4.5" />
  </svg>
)

export const IconPanel = () => (
  <svg {...svgProps}>
    <rect x="1.5" y="2.5" width="13" height="11" rx="1" />
    <path d="M6 2.5v11" />
  </svg>
)

export const IconArrowUp = () => (
  <svg {...svgProps} strokeWidth={1.6}>
    <path d="M8 13V3m0 0L4 7m4-4 4 4" />
  </svg>
)
