import Link from 'next/link'
import EmailLink from './EmailLink'
import { SITE } from '@/lib/site'

/*
 * Fixed top bar, mirroring the footer nav exactly — same `.footer__nav`
 * markup and `.footer-link` styling, with the name standing in for the
 * footer's home glyph.
 *
 * Fixed rather than sticky: the work grid is its own 100vh scroll container
 * on mobile, so a header in normal flow would scroll away behind it. The
 * links must keep `.footer-link` — the custom cursor in Cursor.tsx only
 * magnetizes to `.btn, .footer-link, .chat-pg__send, .chat-pg__contact-btn`.
 */
export default function SiteNav() {
  return (
    <header className="sitenav">
      <div className="sitenav__inner">
        <nav className="footer__nav" aria-label="Primary">
          <Link href="/" className="footer-link">{SITE.name}</Link>
          <span className="footer__sep">·</span>
          <EmailLink />
          <span className="footer__sep">·</span>
          <a
            href={SITE.linkedin}
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin
          </a>
          <span className="footer__sep">·</span>
          <a
            href={SITE.resume}
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            résumé
          </a>
        </nav>
      </div>
    </header>
  )
}
