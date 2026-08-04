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
export default function EmailLink({ className = 'footer-link' }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  function handleClick() {
    // Kick the write off synchronously inside the gesture: the mailto handoff
    // can pull focus, and clipboard writes are rejected once the document
    // loses it. Not preventing default — the mailto should still fire.
    const write = navigator.clipboard?.writeText(SITE.email)
    if (!write) return // insecure context or no clipboard access

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
    <a href={MAILTO} className={`${className} email-link`} onClick={handleClick}>
      email
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
