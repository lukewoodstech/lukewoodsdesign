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

/* ── The story ──────────────────────────────────────────────────────
   The top of /about: three short paragraphs, each followed by a row of
   cards that shows what it just said (Luke, 2026-11-05). Row one is the
   kid with a new hobby every week, row two is the road from wanting to
   be a doctor to building software, row three is the people person.

   Kinds: `photo` is a picture with a caption. `src: null` is a photo
   Luke still has to send: it renders as a dashed slot, and its caption
   says what goes there. The rest are designed tiles (type, colour, a
   real logo) that say the thing without a photo.

   Every paragraph and caption traces to BACKGROUND /
   BACKGROUND.personal in lib/lukeAiFacts.ts. */

export type TileKind = 'byu' | 'code' | 'figma' | 'jazz' | 'map' | 'sandbox' | 'morphmarket'

export type StoryCard =
  | { kind: 'photo'; src: string | null; alt: string; caption: string; center?: boolean; focus?: string }
  | { kind: TileKind; caption: string }

export type StoryBeat = { text: string; cards: ReadonlyArray<StoryCard> }

export const STORY: ReadonlyArray<StoryBeat> = [
  {
    text: 'Hey, I\u2019m Luke. I grew up wanting to be a doctor like my dad so I could help people. Then I found software, where one thing you build can help thousands at once. I\u2019m a people person first, so I design from the user out.',
    cards: [
      { kind: 'photo', src: '/luke-woods.jpg', alt: 'Luke Woods standing on a stone balcony in a light blue suit', caption: 'Hi, I\u2019m Luke Woods', center: true },
      { kind: 'photo', src: '/about/football-kid.jpg', alt: 'Luke as a little boy in a navy Cougars jersey, grinning and holding a football up by his ear', caption: 'Playing every sport I could', focus: '50% 35%' },
      { kind: 'photo', src: '/about/basketball-game.jpg', alt: 'Luke as a kid in a white number 11 jersey, passing the ball during a youth basketball game', caption: 'Basketball most of all' },
      { kind: 'photo', src: '/luke-snake.jpg', alt: 'Luke with a snake draped over his shoulders', caption: 'One of about 100 animals I kept as a teenager' },
      { kind: 'photo', src: '/luke-fishing.jpg', alt: 'Luke waist-deep in the Kenai River in Alaska, grinning and holding up a large salmon', caption: 'Salmon on the Kenai River, Alaska' },
      { kind: 'photo', src: '/about/luke-and-dad.jpg', alt: 'Luke and his dad in wet rain jackets, grinning in a selfie above a harbour full of fishing boats', caption: 'My dad, the doctor I wanted to be' },
      { kind: 'photo', src: '/about/optometry-exam.jpg', alt: 'Luke in black scrubs and a mask holding an eye-testing instrument up to an older patient seated in an exam chair', caption: 'Running eye exams as an optometric tech' },
      { kind: 'byu', caption: 'Then I found computer science at BYU' },
      { kind: 'photo', src: '/about/lucid-ai-card.jpg', alt: 'The Lucid AI panel Luke designed: a prompt box reading Find or summarize a document, above four skills: Find docs, Summarize, Build a diagram and Catch up', caption: 'Lucid AI, built once and shipped to every Lucid plan' },
      { kind: 'sandbox', caption: 'Now I build software for startups through Sandbox' },
    ],
  },
]

/* ── The experience rail ────────────────────────────────────────────
   Newest first. `href` is a published case study, or with `external`
   the company's own site: Hoth has no case study (Luke dropped it on
   2026-11-09), so its card goes to hoth.com instead. `logo` is a tile in public/logos; where there isn't one,
   `mark` is the letter the tile shows and `color` its ground. */

export type Role = {
  company: string
  role: string
  /** Display period. Traces to ENGAGEMENTS[].period in lib/lukeAiFacts.ts. */
  period: string
  /** The badge in the card's corner. */
  year: string
  summary: string
  /*
   * The phone's version of `summary`: one line, cut from the same
   * facts, because a full card on a 393px screen ran to six lines of
   * body text and five of those cards made the section a third of the
   * page. Every clause here appears in `summary` above — this is a
   * compression, not a second claim. (Written 2026-09-22; Luke's to
   * rewrite, like all the copy.)
   */
  short: string
  href?: string
  /** `href` leaves the site: opens in a new tab and says where it goes. */
  external?: boolean
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
      'Designed the Lucid AI assistant on the homepage: find a document by what you remember, summarize it, catch up, or generate a new board. Blank page to general availability in twelve weeks, across every tier.',
    short: 'The AI assistant on Lucid\u2019s homepage. Blank page to general availability in twelve weeks.',
    href: '/work/lucid-ai',
    logo: '/logos/lucid.png',
  },
  {
    company: 'Awardco',
    role: 'Product Design Intern',
    period: 'October 2025 – April 2026',
    year: '2025',
    summary:
      'Redesigned fragmented authentication (login, MFA, SSO, password recovery, mobile verification) into one guided system, and wrote the AI-prototyping guide the design team now uses.',
    short: 'Login, MFA, SSO and recovery, redesigned into one guided system.',
    href: '/work/awardco-login-flow-redesign',
    logo: '/logos/awardco.png',
  },
  {
    company: 'Pattern',
    role: 'Product Design Intern',
    period: 'January – October 2025',
    year: '2025',
    summary:
      'Redesigned the Custom Reports workflow inside the Predict platform, after discovery interviews turned a duplicate-widget ticket into a reporting problem.',
    short: 'Rebuilt the Custom Reports workflow in Predict, after discovery reframed the ticket.',
    href: '/work/pattern-custom-reports',
    logo: '/logos/pattern.png',
  },
  {
    company: 'Hoth',
    role: 'Product Design Intern',
    period: 'December 2024 – April 2025',
    year: '2024',
    summary:
      'Product design at an early-stage encrypted work platform, formerly Mention.',
    short: 'Product design at an early-stage encrypted work platform, formerly Mention.',
    href: 'https://hoth.com',
    external: true,
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
    short: 'Updates to 10+ websites in the Brightspot CMS, and the 20+ client meetings to get there.',
    /* The block Y on BYU navy, drawn as an SVG tile so it sits in the
       same 48px square as the company logos instead of a bare letter. */
    logo: '/logos/byu.svg',
  },
]

/* ── The toolbox ────────────────────────────────────────────────────
   Drawn from BACKGROUND.tools. Icons are Simple Icons (CC0) in
   public/tools, painted white through a CSS mask; `color` is the tile's
   ground. */

/* The toolbox is laid out along how Luke works (2026-11-05, replacing
   the Matter.js tray): the four steps of the about lede, finding the
   problem, designing it, building it, and shipping it. */
export const TOOL_STAGES = [
  { id: 'find', title: 'Find the problem' },
  { id: 'design', title: 'Design it' },
  { id: 'build', title: 'Build it' },
  { id: 'ship', title: 'Ship it' },
] as const

export type ToolStage = (typeof TOOL_STAGES)[number]['id']

export type Tool = {
  name: string
  /** Which step of the process the tool sits under. */
  stage: ToolStage
  /** Simple Icons glyph, masked white. `null` for a wordmark tile. */
  icon: string | null
  color: string
  /** No glyph exists for this one, so the tile sets its name in type. */
  wordmark?: boolean
  /** Where Luke actually used it. Only tools with a sourceable story get
      one. Every tile is interactive either way; one without provenance
      just names itself. `cta` overrides the link label, which otherwise
      assumes the href is a case study. */
  provenance?: { line: string; href?: string; cta?: string }
}

/* `provenance` is the one line that says where Luke actually used the
   tool. Nothing here may be invented — every line below traces to a case
   study's own copy or to BACKGROUND.site in lib/lukeAiFacts.ts. Tools
   with no sourceable story (Cursor, Framer, TypeScript, Python, Git,
   Node, Notion) deliberately carry none rather than a generic sentence.

   On the rail those sit as plain name chips under their stage.

   `wordmark: true` is for a tool with no Simple Icons glyph; the tile
   sets its name in type instead of masking an SVG. */
export const TOOLS: ReadonlyArray<Tool> = [
  {
    name: 'Figma',
    stage: 'design',
    icon: '/tools/figma.svg',
    color: '#a259ff',
    /* Named in the Tools row of all three case studies, so it points at
       no single one. */
    provenance: { line: 'Where every project on this site started. Lucid, Awardco and Pattern.' },
  },
  {
    name: 'Pendo',
    stage: 'find',
    icon: null,
    wordmark: true,
    color: '#2a2333',
    provenance: {
      line: 'High trial, poor retention. That told me Pattern had a usability problem, not a demand problem.',
      href: '/work/pattern-custom-reports',
    },
  },
  {
    name: 'ClickUp',
    stage: 'find',
    icon: '/tools/clickup.svg',
    color: '#7b68ee',
    provenance: {
      line: 'The whole Pattern project started as one ticket: let users duplicate a widget.',
      href: '/work/pattern-custom-reports',
    },
  },
  /* Jira added 2026-11-09 on Luke's say-so: the ticket tracker at
     Awardco and Lucid. It shares the ClickUp row in My process. */
  {
    name: 'Jira',
    stage: 'find',
    icon: '/tools/jira.svg',
    color: '#0052cc',
    provenance: { line: 'The ticket tracker for my work at Awardco and Lucid.' },
  },
  {
    name: 'Claude',
    stage: 'build',
    icon: '/tools/claude.svg',
    color: '#d97757',
    provenance: {
      line: 'Luke AI on this site streams from Claude. Your conversation stays in your browser.',
      href: '/chat',
      cta: 'Ask Luke AI something',
    },
  },
  {
    name: 'React',
    stage: 'build',
    icon: '/tools/react.svg',
    color: '#149eca',
    provenance: { line: 'This site is hand-built in it, not assembled in a site builder.' },
  },
  {
    name: 'Next.js',
    stage: 'build',
    icon: '/tools/nextdotjs.svg',
    color: '#111111',
    provenance: { line: 'Every page here, including the route Luke AI answers from.' },
  },
  { name: 'TypeScript', stage: 'build', icon: '/tools/typescript.svg', color: '#3178c6' },
  {
    name: 'Tailwind',
    stage: 'build',
    icon: '/tools/tailwindcss.svg',
    color: '#0ea5e9',
    provenance: { line: 'The styling layer under this whole site.' },
  },
  { name: 'Framer', stage: 'design', icon: '/tools/framer.svg', color: '#0055ff' },
  {
    name: 'Vercel',
    stage: 'ship',
    icon: '/tools/vercel.svg',
    color: '#000000',
    provenance: { line: 'Where this site is deployed.' },
  },
  { name: 'Python', stage: 'build', icon: '/tools/python.svg', color: '#3776ab' },
  { name: 'Git', stage: 'ship', icon: '/tools/git.svg', color: '#f05032' },
  {
    name: 'GitHub',
    stage: 'ship',
    icon: '/tools/github.svg',
    color: '#181717',
    provenance: {
      line: 'Awardco prototypes were iterated on a real branch with the frontend engineers, not handed over as mocks.',
      href: '/work/awardco-login-flow-redesign',
    },
  },
  /* No provenance: Notion is a tool Luke names, and no project on this
     site points at it. It shows as a name chip, which is all the truth
     layer supports. */
  { name: 'Notion', stage: 'find', icon: '/tools/notion.svg', color: '#000000' },
  { name: 'Node', stage: 'build', icon: '/tools/nodedotjs.svg', color: '#3c873a' },
  { name: 'Cursor', stage: 'build', icon: '/tools/cursor.svg', color: '#1a1a1a' },
]

/* ── The reptile business ───────────────────────────────────────────
   Until 2026-09-22 this was six PLACEHOLDER cards waiting on portraits
   of six named animals — "Name / Species / enclosure 01" — because
   BACKGROUND.interests said "unusual pets (reptiles and tarantulas)"
   and nothing more.

   Then Luke sent the photos, and then the actual story: it wasn't a
   collection, it was a company he ran through high school — he bred
   snakes and lizards and sold them nationally on MorphMarket at about
   $30,000 a year in sales. So the section stopped being "here is my
   unusual hobby" and became what it is: a teenager who found a market,
   built the production line, cut his own biggest cost, and shipped.
   That belongs on a portfolio whose whole argument is that he finds the
   real problem and builds the thing.

   Every caption traces to BACKGROUND.personal in lib/lukeAiFacts.ts.
   The $30,000 is SALES, not profit — PROHIBITED_PATTERNS guards it.

   Shots are laid out on a 12-column grid. `span` is how many of those
   columns a shot takes and `ratio` is its aspect (w/h) — rows group
   shots of the same ratio so their heights agree without cropping a
   landscape photo into a portrait frame and cutting someone in half. */

/* The numbers over the photos, rendered by the case studies' own
   BigStats. Strings don't count up; 100 does. */
export type RoomStat = { value: number | string; suffix?: string; caption: string }

export const REPTILE_STATS: ReadonlyArray<RoomStat> = [
  { value: 100, suffix: '', caption: 'animals at the peak, in one room' },
  { value: '$30k', caption: 'a year in sales, while in high school' },
  { value: 'Nationwide', caption: 'shipped to buyers across the country' },
]

export type RoomShot = {
  /** `null` renders the dashed slot until the photo lands (unused now;
      the retic shots arrived 2026-09-28). */
  src: string | null
  /** With `src: null`: the file the slot is waiting for, under public/about. */
  slot?: string
  alt: string
  caption: string
  /** Columns out of 12. */
  span: 3 | 4 | 5 | 6 | 7 | 12
  /** Aspect ratio, width over height. */
  ratio: '16 / 9' | '3 / 2' | '4 / 3' | '3 / 4'
  /** object-position, where the default centre crop cuts something that matters. */
  focus?: string
}

/* A chapter break inside the room: the section's own hierarchy at a
   smaller scale (mono label, serif line, centred lede, mono facts), so
   a story beat between two rows of photographs reads as designed rather
   than as a paragraph dropped above a picture. */
export type RoomChapter = {
  label?: string
  title: string
  body?: string
  /** Short mono facts under the lede, e.g. '18 eggs'. */
  facts?: ReadonlyArray<string>
}

export type RoomBlock = {
  id: string
  /** Chapter text beside the photos (desktop) instead of over them. */
  split?: boolean
  chapter?: RoomChapter
  shots: ReadonlyArray<RoomShot>
}

/* 2026-11-03: cut from 17 photos in five rows to 11 in three (Luke: the
   section was too long to scan). Dropped the shots that repeated a beat
   another photo already made: the second room shot, the monitor lizard,
   the cage build, the Burmese, the second egg tub, the rat tub and the
   corn snake. Tiles are four across at the photos' own 4:3 now instead
   of three across at 3:4, so each row is well under half its old height.
   Then the incubator went from three photos to two, beside its text,
   and the teaching block (a chapter and four photos) became one shot
   with its line as the caption, closing the top row. */
export const REPTILE_ROOM: ReadonlyArray<RoomBlock> = [
  {
    id: 'business',
    shots: [
      {
        src: '/about/boa-babies.jpg',
        alt: 'Luke kneeling in black scrubs, giving a thumbs up over a plastic bin holding a litter of newborn boa constrictors',
        caption: 'A litter of newborn boas. This was the product.',
        span: 3,
        ratio: '4 / 3',
        focus: '50% 46%',
      },
      {
        src: '/about/python-ultrasound.jpg',
        alt: 'Luke holding a ball python steady on a towel while a vet runs an ultrasound probe along it, children watching from the floor',
        caption: 'Ultrasounding a gravid female. The animals were the inventory.',
        span: 3,
        ratio: '4 / 3',
      },
      {
        src: '/about/rodent-racks.jpg',
        alt: 'Luke standing arms-folded beside the shelved rodent-breeding racks he built in a shed',
        caption: 'Feed was the biggest cost, so I bred it myself.',
        span: 3,
        ratio: '4 / 3',
      },
      {
        src: '/about/teach-kid-boa.jpg',
        alt: 'Luke steadying a boa constrictor draped across a child’s shoulders in the reptile room',
        caption: 'The best part: handing one to someone sure they’d hate it.',
        span: 3,
        ratio: '4 / 3',
      },
    ],
  },
  /* Big Bertha's clutch (Luke, 2026-09-28). Every number is his: a
     15-foot reticulated python, 18 eggs, around $10,000 of animals
     riding on an incubator he built from a drinks fridge. The point is
     the last sentence: it is where "design around the failure modes
     first" comes from, and the case studies lean on that. Mirrored in
     BACKGROUND.personal in lib/lukeAiFacts.ts.
     2026-11-03: a split block (text beside two photos, one row) instead
     of a centred chapter over three; the numbers live in the facts so
     the body doesn't repeat them. */
  {
    id: 'eggs',
    split: true,
    chapter: {
      label: 'The incubator',
      title: 'Eighteen eggs, and no margin for a silent failure.',
      body:
        'Big Bertha laid a clutch, so I built an incubator from a drinks fridge, with sensors and alerts the moment anything drifted. A missed reading was not a bug ticket. It was a dead animal. I have designed around the failure modes first ever since.',
      facts: ['15 ft of snake', '18 eggs', '$10k on the line'],
    },
    shots: [
      {
        src: '/about/big-bertha.jpg',
        alt: 'Big Bertha, a pale albino reticulated python, coiled in a long enclosure with her head raised',
        caption: 'Big Bertha, all fifteen feet.',
        span: 7,
        ratio: '4 / 3',
      },
      {
        src: '/about/incubator-fridge.jpg',
        alt: 'A glass-fronted Rockstar Energy Drink fridge repurposed as an incubator, with four clear tubs of eggs on perlite stacked inside',
        caption: 'The incubator: a rewired drinks fridge.',
        span: 5,
        ratio: '3 / 4',
      },
    ],
  },
]

/* ── Kind words ─────────────────────────────────────────────────────
   Real recommendations, written by real people, copied from Luke’s
   LinkedIn on 2026-09-22 with their headshots. Nothing here may be
   paraphrased, tightened or improved — an endorsement is the writer’s
   words or it is a forgery. The only permitted edits are cutting from
   the end and joining the writer’s own paragraphs; if a cut would
   change what they meant, it’s the wrong cut.

   The panel shows one quote at a time (see
   components/about/Testimonials.tsx), which means it has to pick a
   height, which means these have to be roughly the same length. Three
   of them are therefore excerpts — Jiaqi’s, Julie’s and Joshua’s stop
   at a complete sentence short of where LinkedIn ends — and everything
   here runs five to seven lines in the panel, which is the seven the
   panel reserves. If you add a longer one, cut it from the end rather
   than letting the panel grow an eighth line for one quote and leave
   it empty for the other five. Jeenu’s has one typo fixed — “wok” →
   “work” — which is the whole list of changes made to anyone’s
   words.

   To add another: `avatar` is a headshot at
   /about/quotes/<first-last>.jpg. The tile is square and object-fit
   cover, so a LinkedIn photo drops straight in; 600px is plenty, since
   the wall never shows it wider than about 8rem. No headshot is fine —
   leave `avatar: null` and the wall draws their initials instead.
   `logo` is the company mark in public/logos, the same file the
   experience timeline uses; null just drops the mark from the byline.
   Order here is the order they’re shown in, and the panel loops.

   `placeholder: true` still works and still draws the loud yellow tag;
   nothing uses it now. One quote in this array means no arrows and no
   auto-advance, by design — see components/about/Testimonials.tsx. */

export type Quote = {
  id: string
  quote: string
  name: string
  title: string
  org: string
  /** Path under /public, e.g. '/about/quotes/dan-littlewood.jpg'. */
  avatar: string | null
  /** Company mark under /public/logos, or null for no mark. */
  logo?: string | null
  placeholder?: boolean
}

export const QUOTES: ReadonlyArray<Quote> = [
  {
    id: 'jiaqi-zhuo',
    quote:
      'I had the pleasure of managing Luke as a UX intern at Lucid this summer, where he worked on our doclist AI hub — a fast-moving product area that pushed him from day one. What stood out right away was his execution instinct.',
    name: 'Jiaqi Zhuo',
    title: 'Senior UX Designer',
    org: 'Lucid',
    avatar: '/about/quotes/jiaqi-zhuo.jpg',
    logo: '/logos/lucid.png',
  },
  {
    id: 'julie-barnes-broadbent',
    quote:
      'Luke was a pleasure to manage during his internship at Pattern. He consistently brought enthusiasm and curiosity to his work, readily taking on new projects and putting in the effort to learn whatever he needed to succeed.',
    name: 'Julie Barnes Broadbent',
    title: 'Senior UX Designer',
    org: 'Pattern',
    avatar: '/about/quotes/julie-barnes-broadbent.jpg',
    logo: '/logos/pattern.png',
  },
  {
    id: 'anirudh-muthukumar',
    quote:
      'Luke demonstrated a sharp eye for detail, a strong user-first mindset, and the ability to translate complex user problems into intuitive, elegant solutions. Beyond his design skills, he is a proactive collaborator and communicates his design decisions clearly.',
    name: 'Anirudh Muthukumar',
    title: 'Senior Software Engineer',
    org: 'Lucid',
    avatar: '/about/quotes/anirudh-muthukumar.jpg',
    logo: '/logos/lucid.png',
  },
  {
    id: 'jeenu-lee',
    quote:
      'Luke is an absolute go-getter. Willing to learn and do whatever it takes to make the team more successful. Incredible energy and teammate to work with. Learns new skills rapidly and is eager to provide value!',
    name: 'Jeenu Lee',
    title: 'Founder & CEO',
    org: 'Hoth',
    avatar: '/about/quotes/jeenu-lee.jpg',
    logo: '/logos/hoth.png',
  },
  {
    id: 'joshua-perkey',
    quote:
      'Talented, creative, a real go-getter. Luke is a pleasure to work with. He worked as a web developer and programmer on my team. Luke thrives on learning, quickly researching and finding solutions to problems, offering solutions, and enhancing the experience around him.',
    name: 'Joshua Perkey',
    title: 'Senior Communications Director',
    org: 'BYU College of Humanities',
    avatar: '/about/quotes/joshua-perkey.jpg',
    logo: '/logos/byu.svg',
  },
]
