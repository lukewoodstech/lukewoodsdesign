import type { ReactNode } from 'react'
import Image from 'next/image'
import { SITE } from '@/lib/site'
import EmailLink from './EmailLink'
import LucidTile from './LucidTile'
import AwardcoMobileTile from './AwardcoMobileTile'
import PatternTile from './PatternTile'
import HothTile from './HothTile'

/*
 * Pieces of the canvas visual language shared by the desktop canvas homepage
 * (CanvasHome) and its mobile counterpart (MobileHome): Figma-style selection
 * handles, the business card rendered as a selected object, and the ordered
 * list of work tiles with their canvas labels.
 */

/*
 * Studies not ready to show. A slug here drops the tile from both home
 * layouts and the strip shortens to match; the route itself stays (Hoth's
 * is password-gated). Delete the slug from this set to bring it back.
 */
export const HIDDEN_TILES: ReadonlySet<string> = new Set(['hoth'])

/*
 * `file` is the tile's name in the Explorer nav's work/ folder and `href`
 * is where opening that file goes — the case study itself, so the nav's
 * children are real links, not decoration.
 */
const ALL_TILES: ReadonlyArray<{
  slug: string
  label: string
  /** Plain-words name for the explorer row: what a visitor scans for. */
  title: string
  file: string
  href: string
  tile: ReactNode
}> = [
  {
    slug: 'lucid-ai',
    label: '01 · lucid ai',
    title: 'lucid ai search',
    file: 'lucid-ai.tsx',
    href: '/work/lucid-ai',
    tile: <LucidTile />,
  },
  {
    slug: 'awardco',
    label: '02 · awardco',
    title: 'awardco login',
    file: 'awardco.tsx',
    href: '/work/awardco-login-flow-redesign',
    tile: <AwardcoMobileTile />,
  },
  {
    slug: 'pattern',
    label: '03 · pattern',
    title: 'pattern custom reports',
    file: 'pattern.tsx',
    href: '/work/pattern-custom-reports',
    tile: <PatternTile />,
  },
  {
    slug: 'hoth',
    label: '04 · hoth',
    title: 'hoth',
    file: 'hoth.tsx',
    href: '/work/hoth',
    tile: <HothTile />,
  },
]

export const WORK_TILES = ALL_TILES.filter((t) => !HIDDEN_TILES.has(t.slug))

/*
 * README.md in rendered markdown preview — the classic "about this
 * project" file, except the project is Luke. One window carries the
 * whole about section in Luke's own words. The résumé lives elsewhere
 * on the site, so it isn't repeated here.
 */
export function AboutReadme() {
  return (
    <div className="code-card readme-card" aria-label="About Luke, the person">
      <div className="code-card__bar" aria-hidden="true">
        <span className="code-card__dot code-card__dot--r" />
        <span className="code-card__dot code-card__dot--y" />
        <span className="code-card__dot code-card__dot--g" />
        <span className="code-card__file">README.md — luke</span>
      </div>
      <div className="code-card__tabs" aria-hidden="true">
        <span className="code-card__tab">
          <span className="code-card__mdicon">M↓</span>
          README.md (Preview)
          <span className="code-card__tabclose">×</span>
        </span>
      </div>
      <div className="readme-card__body">
        <h2>
          hi, i&apos;m luke <span aria-hidden="true">👋</span>
        </h2>
        <div className="readme-card__badges" aria-hidden="true">
          <span className="readme-card__badge readme-card__badge--blue">design + code</span>
          <span className="readme-card__badge readme-card__badge--purple">byu cs</span>
          <span className="readme-card__badge readme-card__badge--green">business strategy</span>
        </div>
        <p>
          Thanks for stopping by. I built this site to show how I think, what I&apos;ve worked
          on, and how design, computer science, and business come together in my work.
        </p>
        <p>
          At BYU, I study computer science with an emphasis in HCI, along with business strategy.
          I enjoy working across the entire product process and understanding how design,
          technology, and business come together to create a great user experience and a
          successful product.
        </p>
        <p>
          I do my best work alongside other people, whether I&apos;m leading design workshops
          through BYU&apos;s UX Design Association or building late into the night at whatever
          local hackathon my friends and I can find. Right now, as part of Sandbox, BYU&apos;s
          startup incubator, I&apos;m building software for real estate and hotel operations.
        </p>
        <p>
          My philosophy is simple: put people first, and results follow. Whether I&apos;m
          researching at an internship, building at a hackathon, or starting a company, I begin
          by connecting with people and understanding what&apos;s making their lives harder.
        </p>
        <p>
          AI is an incredible tool, and I&apos;ve immersed myself in learning how to use it. But I
          don&apos;t believe it can replace the human connection and understanding at the heart of
          great design. The tools will keep changing, but my goal will stay the same: understand
          people deeply and build things that are genuinely useful to them.
        </p>
      </div>
    </div>
  )
}

/* Figma-style selection handles on the corners of a "selected" object. */
export function SelectionHandles() {
  return (
    <>
      <span className="sel-handle sel-handle--tl" aria-hidden="true" />
      <span className="sel-handle sel-handle--tr" aria-hidden="true" />
      <span className="sel-handle sel-handle--bl" aria-hidden="true" />
      <span className="sel-handle sel-handle--br" aria-hidden="true" />
    </>
  )
}

/*
 * The hero tagline: a line of code inside the blue selection highlight.
 * Mono type with softened keyword/operator shades that still read on the
 * blue — the syntax structure does the "builder" work, the highlight and
 * handles keep it a canvas object.
 */
export function CodeTagline() {
  return (
    <span className="canvas-intro__highlight canvas-intro__highlight--code">
      <span className="ct-dim">const</span> luke <span className="ct-dim">=</span> design{' '}
      <span className="ct-dim">+</span> code<span className="ct-dim">;</span>
      <SelectionHandles />
    </span>
  )
}

/*
 * The line under the tagline, set as the comment on the declaration.
 * This is the story in one sentence: one person holding the design, the
 * build, and the outcome. Plain and positive — no hedge, no comparison;
 * the site around it is the evidence. (Earlier drafts qualified the
 * claim — "real enough to user-test" — and Luke cut them for sounding
 * weak.)
 */
export function CredComment() {
  return (
    <p className="code-cred">
      <span>{"// I'm a product designer who builds and owns the outcome."}</span>
    </p>
  )
}

/*
 * The landing lede, shared by the desktop canvas and the mobile stack:
 * name, the code tagline, the one-line story, and three plain links.
 * Everything here that looks clickable is clickable — the contact.ts
 * editor window this replaced carried real links inside decorative
 * window chrome, which read as a thing to click and mostly wasn't.
 */
export function IntroLede() {
  return (
    <div className="intro-lede">
      <h1 className="intro-name">luke woods</h1>
      <p className="canvas-intro__highlight-wrap">
        <CodeTagline />
      </p>
      <CredComment />
      <nav className="intro-links" aria-label="Contact">
        <a className="footer-link" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
          linkedin
        </a>
        <a className="footer-link" href={SITE.resume} target="_blank" rel="noopener noreferrer">
          résumé
        </a>
        <EmailLink className="footer-link" copy />
      </nav>
    </div>
  )
}

/*
 * The contact finale as a Figma publish dialog: Luke as a component ready
 * to publish to the visitor's team library. Reads at two levels — designers
 * catch the bit, everyone else just sees a clear hire-me card with a big
 * blue button. The Publish button is the email CTA (EmailLink, so a click
 * copies the address even without a mail client). Shared by the desktop
 * canvas and MobileHome.
 */
export function ContactFinale() {
  return (
    <div className="pub-card">
      <div className="pub-card__bar">
        publish component
        <span className="pub-card__x" aria-hidden="true">
          ×
        </span>
      </div>
      <div className="pub-card__main">
        <div className="pub-card__thumb" aria-hidden="true">
          <Image src="/luke-woods.jpg" alt="" width={128} height={128} />
        </div>
        <div>
          <h2 className="pub-card__name">
            <span className="pub-card__compicon" aria-hidden="true">
              ❖
            </span>
            luke woods
          </h2>
          <p className="pub-card__meta">product designer · v5.0 · ready to ship</p>
        </div>
      </div>
      <ul className="pub-card__changes">
        <li>
          <span className="pub-card__plus" aria-hidden="true">
            +
          </span>
          design — end-to-end flows shipped at four companies
        </li>
        <li>
          <span className="pub-card__plus" aria-hidden="true">
            +
          </span>
          code — working prototypes, this site included
        </li>
        <li>
          <span className="pub-card__plus" aria-hidden="true">
            +
          </span>
          research — interviews and usability tests at every stop
        </li>
      </ul>
      <div className="pub-card__publishrow">
        <EmailLink className="pub-card__publish">publish to your library</EmailLink>
        <span className="pub-card__hint">opens an email to luke · copies the address</span>
      </div>
      <div className="pub-card__links">
        <a className="footer-link" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
          linkedin
        </a>
        <a className="footer-link" href={SITE.resume} target="_blank" rel="noopener noreferrer">
          résumé
        </a>
        <a className="footer-link" href="/chat">
          chat with luke ai
        </a>
      </div>
    </div>
  )
}
