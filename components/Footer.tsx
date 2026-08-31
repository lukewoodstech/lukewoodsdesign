import Link from 'next/link'
import EmailLink from './EmailLink'
import HomeLink from './HomeLink'
import { SITE } from '@/lib/site'

/*
 * `width` mirrors SiteNav's prop: `page` sits on the 1280px `.section` grid,
 * `article` on the 860px case-study column — so the footer's links line up
 * with the nav name and article text above them instead of drifting ~200px
 * into the grid margin on wide screens.
 */
export default function Footer({ width = 'page' }: { width?: 'page' | 'article' }) {
  return (
    <footer className={`footer section${width === 'article' ? ' footer--article' : ''}`}>
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
