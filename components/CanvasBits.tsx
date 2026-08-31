import type { ReactNode } from 'react'
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
 * The contact finale as a GitHub-style pull request: Luke asking to be
 * merged into your team. The green Merge button is the email CTA; the
 * checks row is the pitch. Shared by the desktop canvas and MobileHome.
 */
export function ContactFinale() {
  return (
    <div className="pr-card">
      <div className="pr-card__head">
        <span className="pr-card__state" aria-hidden="true">
          ⎇ open
        </span>
        <div className="pr-card__headtext">
          <h2 className="pr-card__title">
            add luke to your team <span className="pr-card__num">#001</span>
          </h2>
          <p className="pr-card__meta">
            <b>luke</b> wants to merge 4 internships into <code>your-team/main</code>
          </p>
        </div>
      </div>
      <ul className="pr-card__checks">
        <li>
          <span className="pr-card__check" aria-hidden="true">
            ✓
          </span>
          design — end-to-end flows shipped at four companies
        </li>
        <li>
          <span className="pr-card__check" aria-hidden="true">
            ✓
          </span>
          code — prototypes real enough to user-test
        </li>
        <li>
          <span className="pr-card__check" aria-hidden="true">
            ✓
          </span>
          research — interviews and usability tests at every stop
        </li>
      </ul>
      <div className="pr-card__mergebox">
        <EmailLink className="pr-card__merge">merge pull request</EmailLink>
        <span className="pr-card__mergehint">opens an email to luke · click also copies the address</span>
      </div>
      <div className="pr-card__links">
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
