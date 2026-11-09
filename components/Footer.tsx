import EmailLink from './EmailLink'
import { LinkedInIcon, GitHubIcon, MailIcon } from './ContactIcons'
import { SITE } from '@/lib/site'

/*
 * The foot of every page: LinkedIn, GitHub and an email address,
 * centred, and nothing else. The nav already has the pages and the
 * résumé, so this is only what someone wants after reading.
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
            <LinkedInIcon />
            LinkedIn
          </a>
          <a href={SITE.github} className="footer-link" target="_blank" rel="noopener noreferrer">
            <GitHubIcon />
            GitHub
          </a>
          <EmailLink className="footer-link">
            <MailIcon />
            {SITE.email}
          </EmailLink>
        </nav>
      </div>
    </footer>
  )
}
