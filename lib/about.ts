/*
 * Everything the /about page says about Luke that isn't prose, in one
 * editable place.
 *
 * The page is a server component that renders these arrays; the
 * interactive pieces (story stage, timeline, toolbox, quotes) are client
 * components that receive them as props. So this is the only file to open
 * when a role changes, a tool gets added, a photo lands, or a real quote
 * finally arrives.
 *
 * SOURCE OF TRUTH. Every dated role and every card caption below traces
 * to ENGAGEMENTS or BACKGROUND in lib/lukeAiFacts.ts. Nothing here may
 * assert something the truth layer doesn't already carry — if a new claim
 * is needed, add it there first, then mirror it here. Luke AI reads the
 * facts file, this page reads this file, and the two must not drift.
 *
 * Anything with `src: null` renders as a dashed photo slot; anything with
 * `placeholder: true` renders a visible PLACEHOLDER tag. Neither can be
 * mistaken for a real claim. Fill it in and the scaffolding disappears.
 */

/* ── The story cards ────────────────────────────────────────────────
   The deck that deals out from behind the portrait. Fifteen cards on a
   5×3 grid; the one marked `center` is the portrait and sits in the
   middle cell, everything else fans out from it. Order here is grid
   order, reading left to right, top to bottom.

   Kinds: `photo` is a picture with a caption (src null = slot for now);
   `byu`, `code`, `figma` are designed tiles — no photo needed, they say
   the thing with type and colour. */

export type StoryCard =
  | { kind: 'photo'; src: string | null; alt: string; caption: string; center?: boolean }
  | { kind: 'byu' | 'code' | 'figma'; caption: string }

export const STORY: ReadonlyArray<StoryCard> = [
  /* row 1 */
  { kind: 'photo', src: null, alt: '', caption: 'Product design intern @ Lucid — I designed Lucid AI' },
  { kind: 'byu', caption: 'Earning a CS degree at BYU, HCI emphasis' },
  { kind: 'photo', src: '/luke-fishing.jpg', alt: 'Luke waist-deep in the Kenai River in Alaska, grinning and holding up a large salmon', caption: 'Waist-deep in the Kenai River, Alaska' },
  { kind: 'code', caption: 'I designed and built this site, in code' },
  { kind: 'photo', src: null, alt: '', caption: 'Basketball, most days' },
  /* row 2 */
  { kind: 'photo', src: null, alt: '', caption: 'Before that, authentication @ Awardco' },
  { kind: 'photo', src: '/luke-snake.jpg', alt: 'Luke with a snake draped over his shoulders', caption: 'I keep an unreasonable number of reptiles' },
  { kind: 'photo', src: '/luke-woods.jpg', alt: 'Luke Woods standing on a stone balcony in a light blue suit', caption: 'Hi, I’m Luke Woods', center: true },
  { kind: 'photo', src: null, alt: '', caption: '…and a few tarantulas' },
  { kind: 'figma', caption: 'I’m a Figma Campus Leader' },
  /* row 3 */
  { kind: 'photo', src: null, alt: '', caption: 'And custom reports @ Pattern' },
  { kind: 'photo', src: null, alt: '', caption: 'Co-president of BYU’s UX Design Association' },
  { kind: 'photo', src: '/luke-grand-canyon.jpg', alt: 'Luke smiling in a selfie on a Grand Canyon trail, canyon ridges stretching out behind him', caption: '26 miles across the Grand Canyon' },
  { kind: 'photo', src: null, alt: '', caption: 'Hackathons whenever there’s one' },
  { kind: 'photo', src: null, alt: '', caption: 'Building startup software through Sandbox' },
]

/* ── The experience rail ────────────────────────────────────────────
   Newest first. `href` is only set where a published case study exists —
   Hoth's route is password-gated (HIDDEN_WORK in lib/work.ts), so that
   row has none. `logo` is a tile in public/logos; where there isn't one,
   `mark` is the letter the tile shows and `color` its ground. */

export type Role = {
  company: string
  role: string
  /** Display period. Traces to ENGAGEMENTS[].period in lib/lukeAiFacts.ts. */
  period: string
  /** The badge in the card's corner. */
  year: string
  summary: string
  href?: string
  logo?: string
  mark?: string
  color?: string
}

export const ROLES: ReadonlyArray<Role> = [
  {
    company: 'Lucid',
    role: 'Product Design Intern',
    period: 'May – August 2026',
    year: '2026',
    summary:
      'Designed the Lucid AI assistant on the homepage — find a document by what you remember, summarize it, catch up, or generate a new board. Blank page to general availability in twelve weeks, across every tier.',
    href: '/work/lucid-ai',
    logo: '/logos/lucid.png',
  },
  {
    company: 'Awardco',
    role: 'Product Design Intern',
    period: 'October 2025 – April 2026',
    year: '2025',
    summary:
      'Redesigned fragmented authentication — login, MFA, SSO, password recovery, mobile verification — into one guided system, and wrote the AI-prototyping guide the design team now uses.',
    href: '/work/awardco-login-flow-redesign',
    logo: '/logos/awardco.png',
  },
  {
    company: 'Pattern',
    role: 'Product Design Intern',
    period: 'January – October 2025',
    year: '2025',
    summary:
      'Redesigned the Custom Reports workflow inside the Predict platform over a nine-week project, after discovery interviews turned a duplicate-widget ticket into a reporting problem.',
    href: '/work/pattern-custom-reports',
    logo: '/logos/pattern.png',
  },
  {
    company: 'Hoth',
    role: 'Product Design Intern',
    period: 'December 2024 – April 2025',
    year: '2024',
    summary:
      'Product design at an early-stage encrypted work platform, formerly Mention. The case study is written but password-protected while it clears review.',
    logo: '/logos/hoth.png',
  },
  {
    company: 'BYU College of Humanities',
    role: 'Web UX/UI Designer',
    /* Luke's dates (2026-09-21). lib/lukeAiFacts.ts currently says
       "May 2024 to November 2024" for this role — reconcile the two. */
    period: 'May – December 2024',
    year: '2024',
    summary:
      'Designed and shipped updates to 10+ websites in the Brightspot CMS, running 20+ client meetings to get there. My first real lesson in designing for stakeholders who all want different things.',
    /* The block Y on BYU navy, drawn as an SVG tile so it sits in the
       same 48px square as the company logos instead of a bare letter. */
    logo: '/logos/byu.svg',
  },
]

/* The ongoing, undated things — kept off the dated rail so it stays a
   timeline. All four trace to BACKGROUND. */
export type Ongoing = { label: string; org: string; note: string }

export const ONGOING: ReadonlyArray<Ongoing> = [
  { label: 'Co-President', org: 'BYU UX Design Association', note: 'Workshops, and a lot of first critiques.' },
  { label: 'Campus Leader', org: 'Figma', note: 'The person on campus who gets people into the file.' },
  { label: 'UX Designer & Developer', org: 'Harold B. Lee Library', note: 'Information architecture for users with nothing in common.' },
  { label: 'Building', org: 'Sandbox, BYU’s incubator', note: 'Software for real estate and hotel operations.' },
]

/* ── The toolbox ────────────────────────────────────────────────────
   Drawn from BACKGROUND.tools. Icons are Simple Icons (CC0) in
   public/tools, painted white through a CSS mask; `color` is the tile's
   ground. */

export type Tool = { name: string; icon: string; color: string }

export const TOOLS: ReadonlyArray<Tool> = [
  { name: 'Figma', icon: '/tools/figma.svg', color: '#a259ff' },
  { name: 'React', icon: '/tools/react.svg', color: '#149eca' },
  { name: 'Next.js', icon: '/tools/nextdotjs.svg', color: '#111111' },
  { name: 'TypeScript', icon: '/tools/typescript.svg', color: '#3178c6' },
  { name: 'Tailwind', icon: '/tools/tailwindcss.svg', color: '#0ea5e9' },
  { name: 'Framer', icon: '/tools/framer.svg', color: '#0055ff' },
  { name: 'Vercel', icon: '/tools/vercel.svg', color: '#000000' },
  { name: 'Python', icon: '/tools/python.svg', color: '#3776ab' },
  { name: 'Git', icon: '/tools/git.svg', color: '#f05032' },
  { name: 'Node', icon: '/tools/nodedotjs.svg', color: '#3c873a' },
  { name: 'Cursor', icon: '/tools/cursor.svg', color: '#1a1a1a' },
]

/* ── The reptile room ───────────────────────────────────────────────
   BACKGROUND.interests names "unusual pets (reptiles and tarantulas)"
   and nothing more, so every animal is a PLACEHOLDER until Luke swaps
   in the real name/species/photo and deletes the flag. */

export type Critter = {
  id: string
  name: string
  species: string
  photo: string | null
  placeholder?: boolean
}

export const CRITTERS: ReadonlyArray<Critter> = [
  { id: 'c1', name: 'Name', species: 'Species', photo: null, placeholder: true },
  { id: 'c2', name: 'Name', species: 'Species', photo: null, placeholder: true },
  { id: 'c3', name: 'Name', species: 'Species', photo: null, placeholder: true },
  { id: 'c4', name: 'Name', species: 'Species', photo: null, placeholder: true },
  { id: 'c5', name: 'Name', species: 'Species', photo: null, placeholder: true },
  { id: 'c6', name: 'Name', species: 'Species', photo: null, placeholder: true },
]

/* ── Kind words ─────────────────────────────────────────────────────
   PLACEHOLDERS. Nothing here is attributed to a real person until Luke
   pastes a real quote in — a made-up endorsement with a real name on it
   is the one thing this site can never ship. */

export type Quote = {
  id: string
  quote: string
  name: string
  title: string
  org: string
  avatar: string | null
  placeholder?: boolean
}

export const QUOTES: ReadonlyArray<Quote> = [
  {
    id: 'q1',
    quote: 'Paste the quote here. Two or three sentences reads best — long enough to say something specific, short enough to scan.',
    name: 'Their name',
    title: 'Their title',
    org: 'Company',
    avatar: null,
    placeholder: true,
  },
  {
    id: 'q2',
    quote: 'Paste the quote here. Two or three sentences reads best — long enough to say something specific, short enough to scan.',
    name: 'Their name',
    title: 'Their title',
    org: 'Company',
    avatar: null,
    placeholder: true,
  },
  {
    id: 'q3',
    quote: 'Paste the quote here. Two or three sentences reads best — long enough to say something specific, short enough to scan.',
    name: 'Their name',
    title: 'Their title',
    org: 'Company',
    avatar: null,
    placeholder: true,
  },
]
