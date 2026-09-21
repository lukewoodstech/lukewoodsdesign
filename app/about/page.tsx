import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import StoryStage from '@/components/about/StoryStage'
import ExperienceTimeline from '@/components/about/ExperienceTimeline'
import Toolbox from '@/components/about/Toolbox'
import ReptileRoom from '@/components/about/ReptileRoom'
import Testimonials from '@/components/about/Testimonials'
import LetsTalk from '@/components/about/LetsTalk'
import { STORY, ROLES, ONGOING, TOOLS, CRITTERS, QUOTES } from '@/lib/about'
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
 * deck of things about them deals out from the portrait as you scroll,
 * the experience is a rail you travel down, the tools are things you can
 * pick up, and the ending is two words at the size they deserve. Every
 * section is a designed component with one job and one interaction —
 * none of them is a paragraph wearing a border.
 *
 * A prose section called "the pattern" used to sit between the deck and
 * the rail: three beats, one per internship, each restating what its
 * case study already says at length. It was cut (2026-09-21) because it
 * was the essay growing back — the claim belongs to the work pages, and
 * the rail already carries you to them.
 *
 * Two of them ship as scaffolding on purpose. The reptile room and the
 * quotes render from lib/about.ts with `placeholder: true`, which draws
 * a visible PLACEHOLDER tag — the truth layer says "reptiles and
 * tarantulas" and nothing more, and a made-up quote with a real name on
 * it is the one thing this site can never publish. Photos not yet shot
 * render as dashed slots in the canvas's own voice.
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
  'Luke Woods — a product designer who finds the real problem behind the assigned one. BYU computer science and HCI, three internships, and the work that came out of them.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
    url: '/about',
  },
}

/* A section heading in this page's voice: big, centred, with the
   trailing dash that says "and here it is". */
function Title({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 className="ab-h2" id={id}>
      {children}
      <span className="ab-h2__dash" aria-hidden="true">
        {' '}
        —
      </span>
    </h2>
  )
}

export default function AboutPage() {
  return (
    <main className="cs cs-surface about-pg min-h-screen text-white">
      <SiteNav />

      {/* ── 01 Nice to meet you ── */}
      <header className="ab-hero sitenav-offset">
        <p className="cs-eyebrow">Luke Woods · Product Designer</p>
        <h1 className="ab-hero__title">Nice to meet you.</h1>
        <p className="ab-hero__lede">
          I&rsquo;m Luke, a product designer who can also read the pull request. Every
          project I&rsquo;ve shipped started as something small — a ticket, a complaint, a
          vague ask — and the part I&rsquo;m good at is what comes next: finding the real
          problem underneath, proving it&rsquo;s worth solving, and building the thing.
        </p>
      </header>

      {/* The deck deals out from the portrait as you scroll. */}
      <StoryStage cards={STORY} />

      {/* ── 02 My experience ── */}
      <section className="ab-sec ab-sec--grid" aria-labelledby="experience">
        <div className="ab-wide">
          <Title id="experience">My experience</Title>
          <ExperienceTimeline roles={ROLES} ongoing={ONGOING} />
        </div>
      </section>

      {/* ── 03 My toolbox ── */}
      <section className="ab-sec" aria-labelledby="toolbox">
        <div className="ab-wide">
          <h2 className="visually-hidden" id="toolbox">
            My toolbox
          </h2>
          <Toolbox tools={TOOLS} />
        </div>
      </section>

      {/* ── 04 The reptile room ── */}
      <section className="ab-sec" aria-labelledby="reptiles">
        <div className="ab-wide">
          <Title id="reptiles">The reptile room</Title>
          <p className="ab-sec__lede">
            Everyone has a thing. Mine is cold-blooded, mostly nocturnal, and takes up more
            of my apartment than I&rsquo;d admit in an interview.
          </p>
          <ReptileRoom critters={CRITTERS} />
        </div>
      </section>

      {/* ── 05 Kind words ── */}
      <section className="ab-sec" aria-labelledby="kind-words">
        <div className="ab-wide">
          <h2 className="visually-hidden" id="kind-words">
            Kind words
          </h2>
          <Testimonials quotes={QUOTES} />
        </div>
      </section>

      {/* ── 06 Let's talk ── */}
      <section className="ab-sec ab-sec--talk" aria-labelledby="talk">
        <div className="ab-wide">
          <h2 className="visually-hidden" id="talk">
            Get in touch
          </h2>
          <LetsTalk />
        </div>
      </section>

      <Footer width="article" />
    </main>
  )
}
