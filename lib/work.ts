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
}

export const ALL_WORK: ReadonlyArray<WorkItem> = [
  {
    slug: 'lucid-ai',
    label: '01 · lucid ai',
    title: 'lucid ai search',
    nav: 'lucid',
    file: 'lucid-ai.tsx',
    href: '/work/lucid-ai',
  },
  {
    slug: 'awardco',
    label: '02 · awardco',
    title: 'awardco login',
    nav: 'awardco',
    file: 'awardco.tsx',
    href: '/work/awardco-login-flow-redesign',
  },
  {
    slug: 'pattern',
    label: '03 · pattern',
    title: 'pattern custom reports',
    nav: 'pattern',
    file: 'pattern.tsx',
    href: '/work/pattern-custom-reports',
  },
  {
    slug: 'hoth',
    label: '04 · hoth',
    title: 'hoth',
    nav: 'hoth',
    file: 'hoth.tsx',
    href: '/work/hoth',
  },
]

/*
 * Studies not ready to show. A slug here drops the tile from both home
 * layouts and the nav, and the canvas strip shortens to match; the route
 * itself stays (Hoth's is password-gated). Delete the slug to bring it back.
 */
export const HIDDEN_WORK: ReadonlySet<string> = new Set(['hoth'])

export const WORK: ReadonlyArray<WorkItem> = ALL_WORK.filter((w) => !HIDDEN_WORK.has(w.slug))

/* Which study a case-study route belongs to, for the nav's current state. */
export function workForPath(pathname: string): string | null {
  return ALL_WORK.find((w) => pathname === w.href)?.slug ?? null
}
