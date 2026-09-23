import Link from 'next/link'
import LetsTalk from './about/LetsTalk'
import { SITE } from '@/lib/site'

/*
 * The end of the homepage.
 *
 * Until 2026-09-22 there wasn't one: the third card finished, and then
 * about a screen of empty black ran down to a small centred row of
 * LinkedIn and an email address, under a page that is left-aligned and
 * staggered everywhere else. The last screen of a portfolio homepage is
 * where someone decides whether to write to you, and this one was blank.
 *
 * It's the same close /about already uses — the mono label, one line, and
 * "Let's talk" at the size it deserves — so the two pages end the same way
 * rather than inventing a second ending. LetsTalk is an EmailLink
 * underneath: the click opens a mail client and copies the address either
 * way.
 *
 * The line is deliberately not an availability claim. Nothing on this site
 * says what Luke is looking for or when he's free, and the close is the
 * wrong place to start guessing — the truth layer exists precisely so the
 * site never asserts something it can't source. What it says instead is
 * the thesis the three case studies already share: at all three
 * internships, the project that shipped was not the project he was handed.
 *
 * Underneath, the two destinations the footer doesn't carry: the story and
 * the résumé. Email is the only thing that appears twice, once as the
 * biggest object on the page and once as an address in the footer, which
 * is the same arrangement /about ends with.
 */
export default function HomeClose() {
  return (
    <section className="home-close" aria-labelledby="home-close-heading">
      <h2 id="home-close-heading" className="home-close__heading">
        get in touch <span aria-hidden="true">—</span>
      </h2>

      <p className="home-close__line">
        If your team has a problem hiding behind the one you were handed, I&rsquo;d like to
        hear about it.
      </p>

      <LetsTalk />

      <p className="home-close__more">
        <Link href="/about" className="footer-link">
          read my story
        </Link>
        <a href={SITE.resume} className="footer-link" target="_blank" rel="noopener noreferrer">
          résumé
        </a>
      </p>
    </section>
  )
}
