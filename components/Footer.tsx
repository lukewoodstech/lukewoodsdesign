import EmailLink from './EmailLink'
import { SITE } from '@/lib/site'

/*
 * The foot of every page: a LinkedIn profile and an email address,
 * centred, and nothing else. The nav already has the pages and the
 * résumé, so this is only the two things someone wants after reading.
 *
 * `width` mirrors SiteNav's prop for the callers that pass it; a centred
 * row lands in the same place on either column.
 */
export default function Footer({ width = 'page' }: { width?: 'page' | 'article' }) {
  return (
    <footer className={`footer section${width === 'article' ? ' footer--article' : ''}`}>
      <div className="footer__inner">
        <nav className="footer__nav" aria-label="Contact">
          <a href={SITE.linkedin} className="footer-link" target="_blank" rel="noopener noreferrer">
            <span className="footer-ico footer-ico--in" aria-hidden="true">
              in
            </span>
            LinkedIn
          </a>
          <EmailLink className="footer-link">
            {/* Sharp-cornered envelope, kin to EmailLink's copy glyph. */}
            <svg className="footer-ico footer-ico--mail" viewBox="0 0 16 16" aria-hidden="true">
              <rect x="1.5" y="3.5" width="13" height="9" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="M1.5 4l6.5 5 6.5-5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            {SITE.email}
          </EmailLink>
        </nav>
      </div>
    </footer>
  )
}
