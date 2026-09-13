'use client'

import { useEffect, useRef, useState } from 'react'
import { SITE, MAILTO } from '@/lib/site'

/*
 * A bare `mailto:` only works for visitors with a desktop mail client set up.
 * Anyone living in webmail gets nothing at all — no error, no clue — which is
 * a bad failure mode for the site's primary contact path.
 *
 * So the click does both: it follows the mailto (for people who have a client)
 * and copies the address to the clipboard, confirming in a small toast. Either
 * way the visitor leaves with the address.
 */
export default function EmailLink({
  className = 'footer-link',
  children,
  copy = false,
}: {
  className?: string
  /** Link text; defaults to "email" ("copy email" with `copy`). */
  children?: React.ReactNode
  /**
   * Copy-first presentation: "copy email" label with a copy icon, and the
   * click copies without opening a mail client — the label is a promise,
   * and launching Mail.app would break it. The mailto stays as the href so
   * clipboard-less contexts still get a working link.
   */
  copy?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  function handleClick(e: React.MouseEvent) {
    // Kick the write off synchronously inside the gesture: the mailto handoff
    // can pull focus, and clipboard writes are rejected once the document
    // loses it. Not preventing default — the mailto should still fire.
    const write = navigator.clipboard?.writeText(SITE.email)
    if (!write) return // insecure context or no clipboard access — mailto fires
    if (copy) e.preventDefault()

    write.then(
      () => {
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), 2200)
      },
      () => {
        /* denied — the mailto still fires, so this stays silent */
      },
    )
  }

  return (
    <a
      href={MAILTO}
      className={`${className} email-link${copy ? ' email-link--copy' : ''}`}
      onClick={handleClick}
    >
      {copy && (
        // Sharp-cornered copy glyph: two squares, no rounding.
        <svg className="email-link__icon" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M1.6 8.4h-1v-8h8v1" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <rect x="4.2" y="4.2" width="7.2" height="7.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )}
      {children ?? (copy ? 'copy email' : 'email')}
      {/* Positioned absolutely so the nav and footer never reflow */}
      <span className={`email-link__toast${copied ? ' is-visible' : ''}`} aria-hidden="true">
        copied
      </span>
      <span className="visually-hidden" aria-live="polite">
        {copied ? `${SITE.email} copied to clipboard` : ''}
      </span>
    </a>
  )
}
