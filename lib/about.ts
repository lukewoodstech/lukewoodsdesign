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

   Kinds: `photo` is a picture with a caption (src null = slot for now).
   The rest are designed tiles — no photo needed, they say the thing with
   type and colour, the way the reference site does with its map, its
   Wordle and its cereal box.

   The deck is deliberately PERSONAL (Luke, 2026-09-22): hobbies, skills,
   the person. The internships are the experience rail's job, so the
   company tiles that were going to fill the dashed slots were dropped —
   a deck that opens with three employer logos is a résumé again. Every
   tile traces to BACKGROUND / BACKGROUND.personal in lib/lukeAiFacts.ts. */

export type TileKind = 'byu' | 'code' | 'figma' | 'jazz' | 'map' | 'sandbox' | 'morphmarket'

export type StoryCard =
  | { kind: 'photo'; src: string | null; alt: string; caption: string; center?: boolean; focus?: string }
  | { kind: TileKind; caption: string }

export const STORY: ReadonlyArray<StoryCard> = [
  /* row 1 */
  { kind: 'morphmarket', caption: 'I bred and sold reptiles here' },
  { kind: 'byu', caption: 'Earning a CS degree at BYU, HCI emphasis' },
  { kind: 'photo', src: '/luke-fishing.jpg', alt: 'Luke waist-deep in the Kenai River in Alaska, grinning and holding up a large salmon', caption: 'Waist-deep in the Kenai River, Alaska' },
  { kind: 'code', caption: 'I designed and built this site, in code' },
  { kind: 'photo', src: '/about/dogwalk-first.jpg', alt: 'A small boy in an orange striped shirt walking a dog on a red retractable lead down a suburban sidewalk', caption: 'My first business was walking the neighbours\u2019 dogs' },
  /* row 2 */
  { kind: 'jazz', caption: 'Utah Jazz, win or lose' },
  { kind: 'photo', src: '/luke-snake.jpg', alt: 'Luke with a snake draped over his shoulders', caption: 'I keep an unreasonable number of reptiles' },
  { kind: 'photo', src: '/luke-woods.jpg', alt: 'Luke Woods standing on a stone balcony in a light blue suit', caption: 'Hi, I\u2019m Luke Woods', center: true },
  { kind: 'photo', src: '/about/obi-car.jpg', alt: 'Luke in a car holding his black cat Obi up against his shoulder', caption: 'Obi, who supervises' },
  { kind: 'figma', caption: 'I\u2019m a Figma Campus Leader' },
  /* row 3 */
  { kind: 'map', caption: 'Currently in Provo, Utah' },
  { kind: 'photo', src: '/about/ramp-bike.jpg', alt: 'Luke balanced on his bike at the top of the plywood ramp he built in the backyard', caption: 'I built the ramp, then rode it' },
  { kind: 'photo', src: '/luke-grand-canyon.jpg', alt: 'Luke smiling in a selfie on a Grand Canyon trail, canyon ridges stretching out behind him', caption: '26 miles across the Grand Canyon' },
  { kind: 'photo', src: '/about/optometry-exam.jpg', alt: 'Luke in black scrubs and a mask holding an eye-testing instrument up to an older patient seated in an exam chair', caption: 'Before design, I ran eye exams' },
  { kind: 'sandbox', caption: 'Building startup software through Sandbox' },
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
      'Designed the Lucid AI assistant on the homepage: find a document by what you remember, summarize it, catch up, or generate a new board. Blank page to general availability in twelve weeks, across every tier.',
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
  src: string
  alt: string
  caption: string
  /** Columns out of 12. */
  span: 4 | 6 | 12
  /** Aspect ratio, width over height. */
  ratio: '16 / 9' | '4 / 3' | '3 / 4'
  /** object-position, where the default centre crop cuts something that matters. */
  focus?: string
}

export type RoomBlock = {
  id: string
  /** A line that introduces the shots below it, where they need one. */
  lede?: string
  shots: ReadonlyArray<RoomShot>
}

export const REPTILE_ROOM: ReadonlyArray<RoomBlock> = [
  {
    id: 'business',
    shots: [
      {
        src: '/about/boa-babies.jpg',
        alt: 'Luke kneeling in black scrubs, giving a thumbs up over a plastic bin holding a litter of newborn boa constrictors',
        caption: 'A litter of boas, a few days old. This was the product.',
        span: 4,
        ratio: '3 / 4',
      },
      {
        src: '/about/python-ultrasound.jpg',
        alt: 'Luke holding a ball python steady on a towel while a vet runs an ultrasound probe along it, children watching from the floor',
        caption: 'Ultrasounding a gravid female. You learn veterinary skill fast when the animals are the inventory.',
        span: 4,
        ratio: '3 / 4',
      },
      {
        src: '/about/rodent-racks.jpg',
        alt: 'Luke standing arms-folded beside the shelved rodent-breeding racks he built in a shed',
        caption: 'Feed was the biggest running cost, so I bred the mice and rats myself and took it off the books.',
        span: 4,
        ratio: '3 / 4',
      },
    ],
  },
  {
    id: 'room',
    shots: [
      /* This opened as one full-width 16:9 lead. At 1100px it was an
         enormous close-up of Luke and it showed none of the room the
         caption was talking about, so it became a pair at the photos'
         own 4:3 — no crop at all, and the second one actually has the
         wall of enclosures in it. */
      {
        src: '/about/room-snake.jpg',
        alt: 'Luke in his reptile room holding a large snake across both hands, glass enclosures stacked along the wall behind him',
        caption: 'About a hundred animals at the peak.',
        span: 6,
        ratio: '4 / 3',
      },
      {
        src: '/about/teach-friend.jpg',
        alt: 'Luke sitting on the floor in front of a wall of lit enclosures, talking a friend through what lives in them',
        caption: 'Visitors got the tour whether they asked for it or not.',
        span: 6,
        ratio: '4 / 3',
      },
    ],
  },
  {
    id: 'keeping',
    shots: [
      {
        src: '/about/monitor-lizard.jpg',
        alt: 'A teenage Luke grinning on a porch with a savannah monitor lizard held against his chest',
        caption: 'Where it started. One lizard, no business plan.',
        span: 4,
        ratio: '3 / 4',
      },
      {
        src: '/about/cage-build.jpg',
        alt: 'Luke and his dad in ear protection, clamping and drilling a wooden enclosure frame on a patio table',
        caption: 'I built the enclosures instead of buying them.',
        span: 4,
        ratio: '3 / 4',
      },
      {
        src: '/about/burmese-python.jpg',
        alt: 'Luke standing in front of a hedge with a large albino Burmese python draped across his shoulders and both arms',
        caption: 'Some of them got big.',
        span: 4,
        ratio: '3 / 4',
      },
    ],
  },
  {
    id: 'teaching',
    lede: 'The best part was never the animals. It was handing one to someone who was sure they’d hate it.',
    shots: [
      {
        src: '/about/class-beardies.jpg',
        alt: 'Luke leaning over a classroom desk, offering a bearded dragon on each open hand to two seated students',
        caption: 'My mom’s elementary class, meeting a bearded dragon.',
        span: 4,
        ratio: '3 / 4',
      },
      {
        src: '/about/teach-kid-boa.jpg',
        alt: 'Luke steadying a boa constrictor draped across a child’s shoulders in the reptile room',
        caption: 'A boa is heavier than anyone expects.',
        span: 4,
        ratio: '3 / 4',
      },
      {
        src: '/about/rats-kid.jpg',
        alt: 'Luke laughing at the rodent racks while a child lifts a rat out of a bin',
        caption: 'Even the feeders made friends.',
        span: 4,
        ratio: '3 / 4',
      },
      {
        src: '/about/class-zoom-boa.jpg',
        alt: 'Luke holding a snake up to an iMac showing a grid of elementary students on a video call',
        caption: 'And over Zoom, the year school happened at home.',
        span: 6,
        ratio: '4 / 3',
      },
      {
        src: '/about/teach-corn-snake.jpg',
        alt: 'Luke passing a corn snake hand to hand with a child in front of a wall of enclosures',
        caption: 'Friends, family, anyone who’d hold still.',
        span: 6,
        ratio: '4 / 3',
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

   Two of these are excerpts: Jiaqi’s and Julie’s run longer on
   LinkedIn than the panel wants, so each stops at the last complete
   sentence Luke supplied. Jeenu’s has one typo fixed — “wok” →
   “work” — which is the whole list of changes made to anyone’s words.

   To add another: `avatar` is a headshot at
   /about/quotes/<first-last>.jpg. The tile is square and object-fit
   cover, so a LinkedIn photo drops straight in; 600px is plenty, since
   the panel never shows it wider than 15rem. No headshot is fine —
   leave `avatar: null` and the carousel draws their initials instead.
   Order here is the order they’re shown in.

   `placeholder: true` still works and still draws the loud yellow tag;
   nothing uses it now. One quote in this array means the carousel
   renders no arrows and no counter, by design — see
   components/about/Testimonials.tsx. */

export type Quote = {
  id: string
  quote: string
  name: string
  title: string
  org: string
  /** Path under /public, e.g. '/about/quotes/dan-littlewood.jpg'. */
  avatar: string | null
  placeholder?: boolean
}

export const QUOTES: ReadonlyArray<Quote> = [
  {
    id: 'jiaqi-zhuo',
    quote:
      'I had the pleasure of managing Luke as a UX intern at Lucid this summer, where he worked on our doclist AI hub \u2014 a fast-moving product area that pushed him from day one. What stood out right away was his execution instinct. He\u2019s the kind of designer who digs in and builds \u2014 strong technical chops, not afraid to prototype at fidelity. Over the course of the internship, I watched him grow into a sharper design thinker: more comfortable sitting in the divergent space, presenting multiple directions with real tradeoffs, and bringing a clear point of view instead of just a solution.',
    name: 'Jiaqi Zhuo',
    title: 'Senior UX Designer',
    org: 'Lucid',
    avatar: '/about/quotes/jiaqi-zhuo.jpg',
  },
  {
    id: 'julie-barnes-broadbent',
    quote:
      'Luke was a pleasure to manage during his internship at Pattern. He consistently brought enthusiasm and curiosity to his work, readily taking on new projects and putting in the effort to learn whatever he needed to succeed. I especially appreciated that he wasn\u2019t afraid to reach out to others, ask questions, and learn from the people around him. Even when expectations were stressful, Luke maintained a positive attitude and a willingness to keep moving forward.',
    name: 'Julie Barnes Broadbent',
    title: 'Senior UX Designer',
    org: 'Pattern',
    avatar: '/about/quotes/julie-barnes-broadbent.jpg',
  },
  {
    id: 'anirudh-muthukumar',
    quote:
      'Luke demonstrated a sharp eye for detail, a strong user-first mindset, and the ability to translate complex user problems into intuitive, elegant solutions. Beyond his design skills, he is a proactive collaborator and communicates his design decisions clearly.',
    name: 'Anirudh Muthukumar',
    title: 'Senior Software Engineer',
    org: 'Lucid',
    avatar: '/about/quotes/anirudh-muthukumar.jpg',
  },
  {
    id: 'jeenu-lee',
    quote:
      'Luke is an absolute go-getter. Willing to learn and do whatever it takes to make the team more successful. Incredible energy and teammate to work with. Learns new skills rapidly and is eager to provide value!',
    name: 'Jeenu Lee',
    title: 'Founder & CEO',
    org: 'Hoth',
    avatar: '/about/quotes/jeenu-lee.jpg',
  },
  {
    id: 'joshua-perkey',
    quote:
      'Talented, creative, a real go-getter. Luke is a pleasure to work with. He worked as a web developer and programmer on my team. Luke thrives on learning, quickly researching and finding solutions to problems, offering solutions, and enhancing the experience around him. A great asset to any team!',
    name: 'Joshua Perkey',
    title: 'Senior Communications Director',
    org: 'BYU College of Humanities',
    avatar: '/about/quotes/joshua-perkey.jpg',
  },
]
