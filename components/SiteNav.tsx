'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import EmailLink from './EmailLink'
import HomeLink from './HomeLink'
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
 *
 * `width` picks which column the nav lines up with: `page` for the 1280px
 * `.section` grid the home page uses, `article` for the narrower 860px column
 * of a case study. Left-aligned either way — it reads as one group, and the
 * name should sit directly above the content it heads.
 *
 * `next` adds a right-aligned jump to the following case study. The label is
 * generic rather than the project's title: the bar is narrow, and the study's
 * own prev/next at the foot of the article already names both neighbours.
 *
 * `contact` drops email/linkedin/résumé, leaving just the name and `next`.
 * Case studies set it false: the footer carries the same three links at the
 * end of the article, which is where a reader who's just finished actually
 * wants them — and the emptier bar lets `next` survive on phones.
 */
export default function SiteNav({
  width = 'page',
  next,
  contact = true,
}: {
  width?: 'page' | 'article'
  next?: { href: string; title: string }
  contact?: boolean
}) {
  /*
   * The bar is 60% black so the hero shows through, but white tile art
   * (the Lucid mock) scrolling underneath turned it into two colliding
   * rows of text in a grey band. Once the visitor is past the first
   * viewport the transparency isn't buying anything — step it up to
   * near-opaque. scrollY keeps working here even on mobile, where the
   * work grid does its own internal scrolling, because reaching the grid
   * already puts the page past the threshold.
   */
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sitenav${scrolled ? ' sitenav--scrolled' : ''}`}>
      <div
        className={[
          'sitenav__inner',
          width === 'article' && 'sitenav__inner--article',
          !contact && 'sitenav__inner--minimal',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <nav className="footer__nav" aria-label="Primary">
          <HomeLink className="footer-link sitenav__name">{SITE.name}</HomeLink>
          {contact && (
            <>
              <span className="footer__sep">·</span>
              <Link href="/#work" className="footer-link">
                work
              </Link>
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
            </>
          )}
        </nav>

        {next && (
          <Link
            href={next.href}
            className="footer-link sitenav__next"
            aria-label={`Next case study: ${next.title}`}
          >
            next
            <span className="sitenav__next-arrow" aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </header>
  )
}
