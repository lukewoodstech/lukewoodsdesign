'use client'

import EmailLink from './EmailLink'
import LukeAiCard from './luke-ai/LukeAiCard'
import { AboutReadme, IntroLede, SelectionHandles, WORK_TILES } from './CanvasBits'
import PolaroidStack from './PolaroidStack'
import { SITE } from '@/lib/site'

/*
 * The mobile homepage: the desktop canvas with the glide removed, laid out as
 * a plain queenie.works-style vertical stack. Same dressing — dot grid,
 * highlight tagline, numbered work cards — but everything scrolls normally
 * under a fixed bar. Luke AI is the hero here too: it sits directly under
 * the lede, before any case study.
 *
 * The bar is the whole nav: the name goes home, and the two section links
 * sit right beside it. No menu to open — a plain nav, the same as desktop.
 */

const NAV_LINKS = [
  { label: 'work', href: '#work' },
  { label: 'about', href: '#about' },
] as const

export default function MobileHome() {
  return (
    <div className="mhome" id="top">
      <header className="mhome-nav">
        <a className="mhome-nav__name" href="#top">
          {SITE.name}
        </a>
        <nav className="mhome-nav__links" aria-label="Site">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="mhome__inner">
        {/* ── Hero: name, tagline, links, then the live Luke AI window ── */}
        <section className="mhome-hero">
          <IntroLede />

          {/* Same card as the desktop landing. The menu's "luke ai" scrolls
              here; the card's expand button opens the full /chat page. */}
          <div className="mhome-work__item mhome-hero__ai" id="luke-ai">
            <span className="mhome-label" aria-hidden="true">
              luke ai · ask it anything
            </span>
            <div className="mhome-card mhome-card--ai">
              <LukeAiCard />
            </div>
          </div>
        </section>

        {/* ── Work: the canvas cards as a plain stack ── */}
        <section className="mhome-work" id="work" aria-labelledby="mhome-work-heading">
          <h2 id="mhome-work-heading" className="mhome-label">
            work
          </h2>

          {WORK_TILES.map((item) => (
            <div key={item.slug} className="mhome-work__item">
              <span className="mhome-label" aria-hidden="true">
                {item.label}
              </span>
              <div className="mhome-card">
                {item.tile}
                <SelectionHandles />
              </div>
            </div>
          ))}
        </section>

        {/* ── About: the photos as a swipeable pile, then the README ── */}
        <section className="mhome-about" id="about" aria-label="About Luke">
          <h2 className="mhome-label">
            {String(WORK_TILES.length + 1).padStart(2, '0')} · about me
          </h2>
          <div className="mhome-polaroids">
            <PolaroidStack />
            <AboutReadme />
          </div>
        </section>

        <footer className="mhome-footer">
          <p className="mhome-footer__name">{SITE.name}</p>
          <nav className="mhome-footer__nav" aria-label="Contact and social">
            <a href="#work" className="footer-link">
              work
            </a>
            <EmailLink />
            <a href={SITE.linkedin} className="footer-link" target="_blank" rel="noopener noreferrer">
              linkedin
            </a>
            <a href={SITE.resume} className="footer-link" target="_blank" rel="noopener noreferrer">
              résumé
            </a>
          </nav>
          <p className="mhome-footer__meta">designed &amp; built by luke woods</p>
        </footer>
      </div>
    </div>
  )
}
