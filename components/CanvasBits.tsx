import type { ReactNode } from 'react'
import Image from 'next/image'
import { SITE } from '@/lib/site'
import EmailLink from './EmailLink'
import LucidTile from './LucidTile'
import BeforeAfterTile from './BeforeAfterTile'
import PatternTile from './PatternTile'
import HothTile from './HothTile'

/*
 * Pieces of the canvas visual language shared by the desktop canvas homepage
 * (CanvasHome) and its mobile counterpart (MobileHome): Figma-style selection
 * handles, the business card rendered as a selected object, and the ordered
 * list of work tiles with their canvas labels.
 */

export const WORK_TILES: ReadonlyArray<{ slug: string; label: string; tile: ReactNode }> = [
  { slug: 'lucid-ai', label: '01 · lucid ai', tile: <LucidTile /> },
  {
    slug: 'awardco',
    label: '02 · awardco',
    tile: (
      <BeforeAfterTile
        slug="awardco-login-flow-redesign"
        href="/work/awardco-login-flow-redesign"
        beforeSrc="/before.png"
        afterSrc="/after.png"
        beforeAlt="Awardco's original login screen, showing every authentication method at once"
        afterAlt="The redesigned Awardco login screen, leading with single sign-on"
        logoSrc="/logos/awardco.png"
        companyHref="https://www.awardco.com"
      />
    ),
  },
  { slug: 'pattern', label: '03 · pattern', tile: <PatternTile /> },
  { slug: 'hoth', label: '04 · hoth', tile: <HothTile /> },
]

/*
 * A FigJam-style sticky note beside the polaroids: the personal blurb —
 * who Luke is off the clock — in handwriting on the one yellow object
 * on the canvas. Shared by CanvasHome and MobileHome.
 */
/* Résumé rows — dates follow public/resume.pdf, the single source of
   truth (same strings as lib/caseStudies.ts). */
const RESUME_ROWS = [
  { company: 'Lucid', period: 'May – Aug 2026' },
  { company: 'Awardco', period: 'Oct 2025 – Apr 2026' },
  { company: 'Pattern', period: 'Jan – Oct 2025' },
  { company: 'Hoth', period: 'Aug – Dec 2024' },
] as const

/*
 * README.md in rendered markdown preview — the classic "about this
 * project" file, except the project is Luke. One window carries the
 * whole about section: personal blurb (Luke's own words), then the
 * simplified résumé — experience, toolkit, download link.
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
          <span className="readme-card__badge readme-card__badge--green">open to work</span>
        </div>
        <p>
          I&apos;m Luke. I&apos;m curious, ambitious, and always building toward something. I love
          big ideas, good people, and challenges that push me beyond what I already know.
        </p>
        <p>
          Outside of work, I&apos;m usually lifting, playing basketball, watching anime, or
          taking care of an unreasonable number of tarantulas. And if it involves being
          outdoors — fishing, hiking, a good view — count me in. The polaroids are proof.
        </p>
        <blockquote>
          That same curiosity shapes how I design: stay open, dig deeper, and build things that
          genuinely improve people&apos;s lives.
        </blockquote>
        <h3>experience</h3>
        <ul className="resume-md__rows">
          {RESUME_ROWS.map((row) => (
            <li key={row.company}>
              <span className="resume-md__company">{row.company}</span>
              <span className="resume-md__role">Product Design Intern</span>
              <span className="resume-md__period">{row.period}</span>
            </li>
          ))}
        </ul>
        <h3>toolkit</h3>
        <p className="resume-md__tags">research · design systems · prototyping · motion · code</p>
        <a className="resume-md__dl" href={SITE.resume} target="_blank" rel="noopener noreferrer">
          ⤓ download the full résumé
        </a>
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
 * Deliberately plain and confident — no hedge, no comparison; the site
 * around it is the evidence. (Earlier drafts qualified the claim —
 * "real enough to user-test" — and Luke cut them for sounding weak.)
 */
export function CredComment() {
  return (
    <p className="code-cred">
      <span>{'// I design and build.'}</span>
    </p>
  )
}

/*
 * The contact card as a real VS Code editor window — contact.ts. macOS
 * title bar, tab strip with the TS icon, breadcrumbs, Dark+ syntax colors.
 * The string values are the real links (email keeps EmailLink's
 * copy-to-clipboard toast). No selection frame — it reads as an actual
 * window sitting on the canvas (Luke's call).
 */
export function ContactCard() {
  return (
    <div className="canvas-contact">
      <div className="code-card">
        <div className="code-card__bar" aria-hidden="true">
          <span className="code-card__dot code-card__dot--r" />
          <span className="code-card__dot code-card__dot--y" />
          <span className="code-card__dot code-card__dot--g" />
          <span className="code-card__file">contact.ts — portfolio</span>
        </div>
        <div className="code-card__tabs" aria-hidden="true">
          <span className="code-card__tab">
            <span className="code-card__tsicon">TS</span>
            contact.ts
            <span className="code-card__tabclose">×</span>
          </span>
        </div>
        <div className="code-card__crumbs" aria-hidden="true">
          src <span className="code-card__crumb-sep">›</span> contact.ts
        </div>
        <ol className="code-card__body">
          <li>
            <span className="cc-comment">{'// if you like my work, contact me!'}</span>
          </li>
          <li>
            <span className="cc-kw">export const</span> <span className="cc-id">luke</span>{' '}
            <span className="cc-op">= {'{'}</span>
          </li>
          <li className="cc-indent">
            <span className="cc-prop">role</span>
            <span className="cc-op">:</span> <span className="cc-str">&apos;product designer&apos;</span>
            <span className="cc-op">,</span>
          </li>
          <li className="cc-indent">
            <span className="cc-prop">email</span>
            <span className="cc-op">:</span>{' '}
            <EmailLink className="cc-str cc-link">&apos;{SITE.email}&apos;</EmailLink>
            <span className="cc-op">,</span>
          </li>
          <li className="cc-indent">
            <span className="cc-prop">linkedin</span>
            <span className="cc-op">:</span>{' '}
            <a
              className="cc-str cc-link"
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              &apos;/in/lukewoodstech&apos;
            </a>
            <span className="cc-op">,</span>
          </li>
          <li className="cc-indent">
            <span className="cc-prop">resume</span>
            <span className="cc-op">:</span>{' '}
            <a
              className="cc-str cc-link"
              href={SITE.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              &apos;{SITE.resume}&apos;
            </a>
            <span className="cc-op">,</span>
          </li>
          <li className="cc-indent">
            <span className="cc-prop">status</span>
            <span className="cc-op">:</span> <span className="cc-str">&apos;open to work&apos;</span>
            <span className="cc-op">,</span>
          </li>
          <li>
            <span className="cc-op">{'}'}</span>
          </li>
        </ol>
      </div>
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
