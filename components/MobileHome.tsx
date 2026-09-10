'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import EmailLink from './EmailLink'
import LukeAiCard from './LukeAiCard'
import { AboutReadme, IntroLede, SelectionHandles, WORK_TILES } from './CanvasBits'
import { SITE } from '@/lib/site'

/*
 * The mobile homepage: the desktop canvas with the glide removed, laid out as
 * a plain queenie.works-style vertical stack. Same dressing — dot grid,
 * highlight tagline, numbered work cards — but everything scrolls normally
 * under a fixed name + hamburger bar. Luke AI is the hero here too: it sits
 * directly under the lede, before any case study.
 *
 * The hamburger opens a full-screen menu of oversized right-aligned links,
 * mirroring Queenie's mobile nav. It's the whole nav on this layout, so the
 * bar itself carries only the name.
 */

const MENU_LINKS = [
  { label: 'home', href: '#top' },
  { label: 'luke ai', href: '#luke-ai' },
  { label: 'work', href: '#work' },
  { label: 'about', href: '#about' },
] as const

export default function MobileHome() {
  const [menuOpen, setMenuOpen] = useState(false)

  /* The overlay is fixed; without this the page underneath keeps scrolling. */
  useEffect(() => {
    if (!menuOpen) return
    const { overflow } = document.documentElement.style
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = overflow
    }
  }, [menuOpen])

  return (
    <div className="mhome" id="top">
      <header className="mhome-nav">
        <a
          className="mhome-nav__name"
          href="#top"
          onClick={() => setMenuOpen(false)}
        >
          {SITE.name}
        </a>
        <button
          type="button"
          className={`mhome-nav__burger${menuOpen ? ' is-open' : ''}`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </header>

      {menuOpen && (
        <nav className="mhome-menu" aria-label="Primary">
          {MENU_LINKS.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      )}

      <div className="mhome__inner">
        {/* ── Hero: name, tagline, links, then the live Luke AI window ── */}
        <section className="mhome-hero">
          <IntroLede />

          {/* Same card as the desktop landing. The menu's "luke ai" scrolls
              here; the card's expand button opens the full /chat page. */}
          <div className="mhome-work__item mhome-hero__ai" id="luke-ai">
            <span className="mhome-label" aria-hidden="true">
              luke-ai · ask it anything
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

        {/* ── About: the polaroid pair, minus the desk clutter ── */}
        <section className="mhome-about" id="about" aria-label="About Luke">
          <h2 className="mhome-label">
            {String(WORK_TILES.length + 1).padStart(2, '0')} · about me
          </h2>
          <div className="mhome-polaroids">
            <figure className="polaroid polaroid--main mhome-polaroid">
              <Image
                src="/luke-woods.jpg"
                alt="Luke Woods standing on a stone balcony in a light blue suit"
                width={700}
                height={700}
                sizes="(max-width: 48em) 80vw, 20rem"
              />
              <figcaption>luke woods — hello!</figcaption>
            </figure>
            <figure className="polaroid polaroid--second mhome-polaroid">
              <Image
                src="/luke-fishing.jpg"
                alt="Luke waist-deep in the Kenai River in Alaska, grinning and holding up a large salmon"
                width={700}
                height={700}
                sizes="(max-width: 48em) 80vw, 20rem"
              />
              <figcaption>kenai river, alaska</figcaption>
            </figure>
            <figure className="polaroid polaroid--third mhome-polaroid">
              <Image
                src="/luke-grand-canyon.jpg"
                alt="Luke smiling in a selfie on a Grand Canyon trail, canyon ridges stretching out behind him"
                width={700}
                height={700}
                sizes="(max-width: 48em) 80vw, 20rem"
              />
              <figcaption>grand canyon, arizona</figcaption>
            </figure>
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
