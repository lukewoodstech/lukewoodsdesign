import type { ReactNode } from 'react'
import { SITE } from '@/lib/site'
import { WORK, type WorkItem } from '@/lib/work'
import EmailLink from './EmailLink'
import LucidTile from './LucidTile'
import AwardcoMobileTile from './AwardcoMobileTile'
import PatternTile from './PatternTile'
import HothTile from './HothTile'

/*
 * Pieces shared by the homepage (Home) and the about page: the ordered
 * list of work tiles with their layer labels, the README card, and the
 * Figma-style selection handles.
 */

/*
 * The work tiles: the shared metadata from lib/work plus each study's
 * artwork. The data lives there so the fixed nav bar can name the studies
 * without importing every tile component and its images.
 */
const TILE_ART: Record<string, ReactNode> = {
  'lucid-ai': <LucidTile />,
  awardco: <AwardcoMobileTile />,
  pattern: <PatternTile />,
  hoth: <HothTile />,
}

export const WORK_TILES: ReadonlyArray<WorkItem & { tile: ReactNode }> = WORK.map((item) => ({
  ...item,
  tile: TILE_ART[item.slug],
}))


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
          Thanks for stopping by. I&rsquo;m a product designer and BYU student studying computer
          science with an emphasis in HCI, along with business strategy. I built this site to
          show how I think, what I&rsquo;ve shipped, and how those disciplines come together in
          my work.
        </p>
        <p>
          I do my best work alongside other people, whether I&rsquo;m leading design workshops
          through BYU&rsquo;s UX Design Association, building late into the night at a hackathon,
          or exploring startup ideas through Sandbox, BYU&rsquo;s startup incubator.
        </p>
        <p>
          I start by listening. Understanding what people are trying to do, where they get stuck,
          and what actually matters to them is the foundation of my work. The goal is simple:
          solve the right problem and build something genuinely useful.
        </p>
        {/*
         * The sign-off, not a contact banner: one sentence in the README's own
         * voice with the address inline. Same EmailLink as the hero, so a click
         * opens the mail client and copies the address either way.
         */}
        <p className="readme-cta">
          Since you made it all the way to the end, clearly we should connect! Contact me at{' '}
          <EmailLink className="readme-cta__mail">{SITE.email}</EmailLink>.
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
