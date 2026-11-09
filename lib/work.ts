/*
 * The work list as plain data — slug, labels, route. Separated from
 * CanvasBits (which attaches the actual tile artwork) so the nav can name
 * the case studies without importing every tile component and its images.
 *
 * `label` is the canvas's floating caption, `title` the plain-words name a
 * visitor scans for, `nav` the short form the fixed bar has room for, and
 * `file` the old explorer filename kept for slugs.
 */
export type WorkItem = {
  slug: string
  label: string
  title: string
  nav: string
  file: string
  href: string
  /* Which home section the tile sits in: 'selected' is the client case
     studies, staggered large; 'lab' is ventures and side projects, a
     smaller grid under them (LUK-195). */
  section: 'selected' | 'lab'
}

export const ALL_WORK: ReadonlyArray<WorkItem> = [
  {
    slug: 'lucid-ai',
    label: '01 · lucid ai',
    title: 'lucid ai search',
    nav: 'lucid',
    file: 'lucid-ai.tsx',
    section: 'selected',
    href: '/work/lucid-ai',
  },
  {
    slug: 'awardco',
    label: '02 · awardco',
    title: 'awardco login',
    nav: 'awardco',
    file: 'awardco.tsx',
    section: 'selected',
    href: '/work/awardco-login-flow-redesign',
  },
  {
    slug: 'pattern',
    label: '03 · pattern',
    title: 'pattern custom reports',
    nav: 'pattern',
    file: 'pattern.tsx',
    section: 'selected',
    href: '/work/pattern-custom-reports',
  },
  /* Pitch led the canvas from 2026-10-14 (LUK-122), moved to the lab on
     2026-11-03 (LUK-195), and joined selected work as the last tile on
     2026-11-09 once Hoth's removal left it alone in the lab. It sits last
     because the client studies lead; it stays out of the nav bar while
     it is password-gated (SiteNav). */
  {
    slug: 'pitch',
    label: '04 · pitch',
    title: 'pitch',
    nav: 'pitch',
    file: 'pitch.tsx',
    href: '/work/pitch',
    section: 'selected',
  },
]

/*
 * Studies not ready to show. A slug here drops the tile from both home
 * layouts and the nav, and the canvas strip shortens to match; the route
 * itself stays (Pitch's is password-gated). Delete the slug to
 * bring it back.
 *
 * Pitch left this set on 2026-10-14 (LUK-122): it has a tile now, so the
 * canvas says Pitch exists, while the study behind it stays gated
 * (lib/gate.ts) until it is promoted (LUK-77). The labels are numbered by
 * what shows within each section: since 2026-11-03 selected work runs
 * Lucid 01 to Pattern 03 and the lab
 * numbers from its own 01.
 */
export const HIDDEN_WORK: ReadonlySet<string> = new Set([])

export const WORK: ReadonlyArray<WorkItem> = ALL_WORK.filter((w) => !HIDDEN_WORK.has(w.slug))

/* Which study a case-study route belongs to, for the nav's current state. */
export function workForPath(pathname: string): string | null {
  return ALL_WORK.find((w) => pathname === w.href)?.slug ?? null
}
