/*
 * The bits shared by the homepage Luke AI window and the maximized /chat
 * page so they stay the same object: the window title, the identity tag
 * over every answer, and the glyphs for the few controls that actually do
 * something. Nothing decorative that could be mistaken for a control.
 *
 * 2026-09-16: the terminal dressing (zsh prompt, boot line, LUKE_AI tag)
 * came out. It read as unfriendly and confusing to first-time visitors;
 * the window now reads like a chat assistant, the way an editor
 * extension's chat panel does. `Ps1` stays exported for the case-study
 * "ask Luke AI" footer, which still uses the shell arrow.
 *
 * The name is "Luke AI" everywhere a visitor can read it — the window
 * title (set in caps by its style), the wordmark, the tag over answers.
 * No `luke-ai` / `LUKE-AI` variants.
 */

/* The visitor is the one typing, so the prompt is theirs, not Luke's
   machine. The host part hides at narrow widths so the prompt still
   leaves room to type on a phone. */
export const HOST = 'guest@portfolio'
export const CWD = '~'

/* `guest@portfolio ~ %` — always aria-hidden: the surrounding element
   says who is speaking in words a screen reader can use. */
export const Ps1 = () => (
  <span className="ps1" aria-hidden="true">
    <span className="ps1__host">{HOST} </span>
    <span className="ps1__cwd">{CWD}</span> %{' '}
  </span>
)

/* `✱ Luke AI` — the identity above every answer. */
export const AiTag = () => (
  <span className="lai__who">
    <span className="lai__star" aria-hidden="true">
      ✱
    </span>{' '}
    <span aria-hidden="true">Luke AI</span>
    <span className="sr-only">Luke AI</span>
  </span>
)

/* The window title, small and quiet like a panel title (rendered in
   caps: LUKE AI). */
export const TermTitle = ({ label = 'Luke AI' }: { label?: string }) => (
  <span className="ai-card__title" aria-hidden="true">
    {label}
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

/* Window minimize — the dock's collapse control. A single rule, the way
   every OS has drawn "put this away" for thirty years. */
export const IconMinimize = () => (
  <svg {...svgProps}>
    <path d="M3 11h10" />
  </svg>
)
