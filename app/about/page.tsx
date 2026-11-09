import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import StoryStage from '@/components/about/StoryStage'
import ExperienceTimeline from '@/components/about/ExperienceTimeline'
import Toolbox from '@/components/about/Toolbox'
import ReptileRoom from '@/components/about/ReptileRoom'
import BigStats from '@/components/cs/BigStats'
import Testimonials from '@/components/about/Testimonials'
import { STORY, ROLES, TOOLS, REPTILE_ROOM, REPTILE_STATS, QUOTES } from '@/lib/about'
import { SITE } from '@/lib/site'

/*
 * My story, as a page you scroll through rather than read.
 *
 * The 2026-09-20 version was an essay: the one story the case studies
 * tell together — at all three internships the project that shipped was
 * not the project he was handed — as prose, with a photo strip at the
 * end. It said true things and it read like a résumé.
 *
 * This version is the visual story instead: you meet the person, the
 * deck of things about them sits in a grid under the heading,
 * the experience is a rail you travel down, the tools sit along the way
 * Luke works, and the ending is two words at the size they deserve. Every
 * section is a designed component with one job and one interaction —
 * none of them is a paragraph wearing a border.
 *
 * A prose section called "the pattern" used to sit between the deck and
 * the rail: three beats, one per internship, each restating what its
 * case study already says at length. It was cut (2026-09-21) because it
 * was the essay growing back — the claim belongs to the work pages, and
 * the rail already carries you to them.
 *
 * The quotes were scaffolding until 2026-09-22 — three `placeholder:
 * true` blocks under a loud yellow tag, because a made-up quote with a
 * real name on it is the one thing this site can never publish. They
 * are now five real LinkedIn recommendations with their writers’
 * headshots, quoted verbatim in lib/about.ts. The reptile section was
 * scaffolding too until 2026-09-22, when Luke sent the photos and then
 * the story behind them: it was a business he ran through high school,
 * not a shelf of pets, so it became section 04 with real numbers over
 * it. Three story cards are still dashed slots — Lucid, Awardco,
 * Pattern — waiting on work imagery, and a dashed slot is the canvas
 * saying so out loud.
 *
 * Everything else is traceable: the rail mirrors ENGAGEMENTS and
 * BACKGROUND in lib/lukeAiFacts.ts, the toolbox is BACKGROUND.tools. Nothing here asserts a fact that isn't
 * already on the site — if a claim needs adding, add it there first.
 *
 * Visually it's still `cs-surface` — the dot grid, Geist, the mono
 * labels, the one hairline — so the story reads as the same world as the
 * work, just with the volume up.
 */

const TITLE = 'My story'
const DESCRIPTION =
  'Luke Woods, a product designer who finds the real problem behind the assigned one. BYU computer science and HCI, three internships, and the work that came out of them.'

/*
 * The `twitter` block is spelled out rather than left to inherit. Without it
 * the page took the root layout's card — "Luke Woods · Product Designer" and
 * the site blurb — while its og:title said "My story", so the two halves of
 * the same preview disagreed depending on which one a platform read.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
    url: '/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
  },
}

/* A section heading in this page's voice: big and centred. */
function Title({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 className="ab-h2" id={id}>
      {children}
    </h2>
  )
}

export default function AboutPage() {
  return (
    <div className="cs cs-surface about-pg min-h-screen text-white">
      <SiteNav />

      {/* The landmark holds the story, not the chrome: SiteNav sits outside
          it so "skip to content" actually skips the nav. */}
      <main id="main">

        {/* ── 01 Nice to meet you ──
            The heading, one short paragraph, then two rows of photos. The copy lives in STORY (lib/about.ts). */}
        <StoryStage
          beats={STORY}
          intro={
            <header className="ab-hero sitenav-offset">
              <h1 className="ab-hero__title">Nice to meet you.</h1>
            </header>
          }
        />

        {/* ── 02 The reptile business ──
            Straight after the intro on purpose (2026-11-09): this is where
            Luke's love of building things and entrepreneurship started, so
            it leads into the experience rather than trailing after it. */}
        <section className="ab-sec" aria-labelledby="reptiles">
          <div className="ab-wide">
            <Title id="reptiles">The reptile business</Title>
            <p className="ab-sec__lede">
              Through high school I bred snakes and lizards at my parents&rsquo; house and sold
              them across the country on MorphMarket. Starting that business is what made me
              love building things, and it&rsquo;s where I caught the entrepreneurship bug.
            </p>
            <BigStats stats={[...REPTILE_STATS]} small />
            <ReptileRoom blocks={REPTILE_ROOM} />
          </div>
        </section>

        {/* ── 03 My experience ── */}
        <section className="ab-sec ab-sec--grid" aria-labelledby="experience">
          <div className="ab-wide">
            <Title id="experience">My experience</Title>
            <ExperienceTimeline roles={ROLES} />
          </div>
        </section>

        {/* ── 04 My process ── */}
        <section className="ab-sec" aria-labelledby="process">
          <div className="ab-wide">
            <Title id="process">My process</Title>
            <Toolbox tools={TOOLS} />
          </div>
        </section>

        {/* ── 05 In their words ── */}
        <section className="ab-sec" aria-labelledby="in-their-words">
          <div className="ab-wide">
            {/* The heading is visible now. The section used to be a single
                card with a huge quote mark on it, which was label enough;
                a wall of five cards with nothing over it is just text. */}
            <Title id="in-their-words">In their words</Title>
            <Testimonials quotes={QUOTES} />
          </div>
        </section>

      </main>

      <Footer width="article" />
    </div>
  )
}
