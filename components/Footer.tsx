import Link from 'next/link'
import EmailLink from './EmailLink'
import HomeLink from './HomeLink'
import { SITE } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="footer section">
      <div className="footer__inner">

        <nav className="footer__nav" aria-label="Contact and social">
          <HomeLink className="footer-link footer-link--home" aria-label="Home">⌂</HomeLink>
          <span className="footer__sep">·</span>
          <Link href="/#work" className="footer-link">work</Link>
          <span className="footer__sep">·</span>
          <EmailLink />
          <span className="footer__sep">·</span>
          <a href={SITE.linkedin} className="footer-link" target="_blank" rel="noopener noreferrer">linkedin</a>
          <span className="footer__sep">·</span>
          <a href={SITE.resume} className="footer-link" target="_blank" rel="noopener noreferrer">résumé</a>
        </nav>

      </div>
    </footer>
  )
}
