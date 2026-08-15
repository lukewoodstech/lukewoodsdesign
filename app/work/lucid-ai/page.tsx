import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import Reveal from '@/components/lucid/Reveal'
import CompareStage from '@/components/lucid/CompareStage'
import ShipTimeline from '@/components/lucid/ShipTimeline'
import LayoutContest from '@/components/lucid/LayoutContest'
import ResultsCount from '@/components/lucid/ResultsCount'
import FailureTabs from '@/components/lucid/FailureTabs'
import { SITE } from '@/lib/site'

/*
 * Custom-built case study — this static route intentionally shadows the
 * generic /work/[slug] template. The tile on the home grid still reads from
 * lib/caseStudies.ts; everything below is bespoke to the Lucid story.
 *
 * Copy and structure follow the case study brief: shipped work only, no
 * internal project or team names, masked metrics, honest credit split.
 */

const TITLE = 'Bringing Lucid AI out of the canvas'
const DESCRIPTION =
  'Lucid AI lived inside the editor. I designed the chat panel that brought it to the docs list, so you can find a doc you cannot name. Shipped GA to every tier twelve weeks from zero.'

export const metadata: Metadata = {
  title: `${TITLE} · Lucid`,
  description: DESCRIPTION,
  alternates: { canonical: '/work/lucid-ai' },
  openGraph: {
    type: 'article',
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
    url: '/work/lucid-ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
  },
}

const IMG = '/case-studies/lucid'

function Section({
  eyebrow,
  headline,
  children,
}: {
  eyebrow: string
  headline: string
  children: React.ReactNode
}) {
  return (
    <Reveal as="section" className="mt-20">
      <span className="lcs-eyebrow">{eyebrow}</span>
      <h2 className="lcs-headline">{headline}</h2>
      {children}
    </Reveal>
  )
}

export default function LucidCaseStudy() {
  return (
    <div className="lcs min-h-screen bg-black text-white font-medium">
      <SiteNav
        width="article"
        contact={false}
        next={{ href: '/work/awardco-login-flow-redesign', title: 'Awardco Login Flow Redesign' }}
      />

      <div className="max-w-[860px] mx-auto px-8 pb-32 sitenav-offset">
        {/* ── Hero ── */}
        <header className="pt-10 pb-12">
          <p className="lcs-eyebrow">Lucid · Product Design Internship</p>
          <h1 className="text-5xl sm:text-6xl font-medium leading-tight tracking-tight">
            {TITLE}
          </h1>
          <p className="mt-4 text-xl leading-snug text-white/85">
            So you can find a doc you can&rsquo;t name.
          </p>

          <dl className="mt-8 border-y border-white/10 py-6 flex flex-wrap gap-x-12 gap-y-5">
            {[
              ['Role', 'Product Design Intern'],
              ['Team', 'Two scrum teams: search + AI'],
              ['Timeline', 'May to August 2026'],
              ['Shipped', 'GA, all tiers, August 5'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="lcs-eyebrow !mb-1.5 !text-[0.7rem]">{label}</dt>
                <dd className="text-base">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <Reveal as="figure" className="m-0">
          <Image
            src={`${IMG}/full-page-zero.png`}
            alt="The shipped Lucid AI experience on the docs list: a full page chat asking what are you looking for today, with Find docs, Summarize, and Build a diagram skills beneath the input"
            width={2880}
            height={1800}
            priority
            sizes="(min-width: 860px) 860px, 100vw"
            className="lcs-shot"
          />
          <figcaption className="lcs-cap">
            The shipped experience. Lucid AI on the docs list, one click from anywhere.
          </figcaption>
        </Reveal>

        <Reveal className="mt-12">
          <p className="lcs-prose text-lg">
            Lucid AI could already help you inside a diagram. It could not help you find
            one. I designed the AI chat panel for the docs list: the entry point, the
            layout system, the response patterns, and the failure states that every
            future docs list skill now inherits. It shipped to general availability on
            every tier, free through enterprise, twelve weeks after the project started.
          </p>
        </Reveal>

        {/* ── Context ── */}
        <Section eyebrow="Context" headline="The AI lived in the editor. Your docs live everywhere else.">
          <div className="lcs-prose">
            <p>
              Lucid is a visual workspace: Lucidchart for diagramming, Lucidspark for
              whiteboarding. The docs list is home base. It is where every document
              lives and where every session starts.
            </p>
            <p>
              Lucid AI existed before this project, but only inside the editor canvas,
              working on one open doc at a time. The docs list, where you decide what to
              open in the first place, had no intelligence at all.
            </p>
          </div>
        </Section>

        {/* ── Challenge ── */}
        <Section eyebrow="The challenge" headline="Search only matched titles. Titles are the first thing people forget.">
          <div className="lcs-prose">
            <p>
              Docs list search ran your keywords against document titles. If you
              remembered the exact name, you found your doc. If you remembered anything
              else about it, who worked on it with you, roughly when, what was inside,
              you were out of luck. Advanced filters existed but were hidden, slow to
              fill out, and still could not see inside a doc.
            </p>
            <p>
              The team defined the metric before any design work: search-to-open
              success rate. A search works if you open something it surfaced.
            </p>
          </div>
          <ul className="lcs-bullets mt-5">
            <li>Prior research: analytics plus 39 external interviews, run by my PM before I joined</li>
            <li>Heavy users with 60+ docs found the right doc in the top 5 results 48% of the time. Lighter users, 35%</li>
            <li>When search failed, people asked a colleague, kept link lists in other tools, or rebuilt the doc from scratch</li>
          </ul>
        </Section>

        {/* ── The before / after ── */}
        <Section eyebrow="The before" headline="Feel the jump.">
          <CompareStage
            ariaLabel="Before and after: old title search versus the shipped AI panel"
            layers={[
              {
                src: `${IMG}/before-old-search.png`,
                alt: 'The old Lucid docs list homepage: a search bar that only matches keywords against document titles, with no AI entry point',
                label: 'Before',
                caption:
                  'The old docs list. The search bar matched titles and nothing else.',
                width: 2880,
                height: 1800,
              },
              {
                src: `${IMG}/side-panel-zero.png`,
                alt: 'The shipped Lucid AI side panel docked beside the docs list, offering Find docs, Summarize, and Build a diagram skills',
                label: 'After',
                caption:
                  'The shipped panel. Describe the doc by collaborator, timeframe, or content, and keep the page usable while you ask.',
                width: 2880,
                height: 1800,
              },
            ]}
          />
        </Section>

        {/* ── What shipped ── */}
        <Section eyebrow="What shipped" headline="One panel, three skills, every tier.">
          <div className="lcs-prose">
            <p>
              Two things went to general availability on August 5. The AI chat panel
              was my design end to end: a docked side panel that expands to a full
              page, carrying three skills at launch. Find docs, Summarize, and Build a
              diagram.
            </p>
            <p>
              The second piece is the AI summary section inside the regular search
              bar: direct answers above the keyword results, triggered when a query
              runs four words or longer. My manager led that design. I contributed
              ideation and some of the UI.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <figure className="m-0">
              <Image
                src={`${IMG}/find-docs-flow.png`}
                alt="The Find docs skill explaining it can search by collaborators, timeframe, canvas content, and connected project views, with quick view chips"
                width={2400}
                height={1600}
                sizes="(min-width: 860px) 430px, 100vw"
                className="lcs-shot"
              />
              <figcaption className="lcs-cap">Find docs: search by what you actually remember.</figcaption>
            </figure>
            <figure className="m-0">
              <Image
                src={`${IMG}/summarize-flow.png`}
                alt="The Summarize skill explaining project syncs, catch-up reports, thematic reviews, and single file deep dives, with cross-file prompt chips"
                width={2400}
                height={1600}
                sizes="(min-width: 860px) 430px, 100vw"
                className="lcs-shot"
              />
              <figcaption className="lcs-cap">Summarize: the gist of a doc or a group of them.</figcaption>
            </figure>
          </div>
        </Section>

        {/* ── Timeline ── */}
        <Section eyebrow="Timeline" headline="Zero to general release in twelve weeks.">
          <ShipTimeline />
        </Section>

        {/* ── Research ── */}
        <Section eyebrow="Research" headline="I inherited the problem. I tested the answer.">
          <div className="lcs-prose">
            <p>
              The problem was already validated when I joined, so my research was
              evaluative, not generative. I ran 12 interviews with external users
              across the US, UK, Chile, India, and New Zealand, putting concepts and
              iterations in front of them to answer two questions. Are we building the
              right thing. Can people use it.
            </p>
            <p>
              Every design round went back in front of users. The loops stayed short
              because the questions stayed small.
            </p>
          </div>
          <Reveal as="figure" className="my-10 m-0">
            <Image
              src={`${IMG}/skills-ideation.png`}
              alt="An ideation grid of twenty candidate skills for the docs list AI, from Find docs and Summarize to catch up, dormant files, and project status"
              width={1680}
              height={1956}
              sizes="(min-width: 860px) 860px, 100vw"
              className="lcs-shot"
            />
            <figcaption className="lcs-cap">
              The possibility space: twenty candidate skills, mapped before cutting to
              the three that shipped.
            </figcaption>
          </Reveal>
        </Section>

        {/* ── Reframe pull quote ── */}
        <Reveal className="mt-20">
          <figure className="lcs-quote m-0">
            <blockquote>
              The AI could already create. What people wanted was for it to find,
              explain, and catch them up.
            </blockquote>
            <figcaption>The reframe that came out of design testing</figcaption>
          </figure>
          <p className="lcs-prose mt-6">
            Generation alone was not enough. Build a diagram stayed, and shipped. But
            the testing kept surfacing the same additive finding: the assistant people
            described was one that knew their workspace, not just one that could draw.
          </p>
        </Reveal>

        {/* ── Design walkthrough ── */}
        <Section eyebrow="Design decisions" headline="The upgrade lives where the old behavior lived.">
          <div className="lcs-prose">
            <p>
              The entry point is an AI icon directly beside global search. People
              already look there when they are looking for something, so the new
              capability sits exactly where the old habit points. No new surface to
              discover, no education campaign. A one-time callout introduces it, then
              gets out of the way.
            </p>
          </div>
          <Reveal as="figure" className="my-10 m-0">
            <Image
              src={`${IMG}/entry-point-callout.png`}
              alt="The docs list with a one-time callout anchored to the AI icon beside the global search bar, reading Find Lucid AI anytime"
              width={2880}
              height={1800}
              sizes="(min-width: 860px) 860px, 100vw"
              className="lcs-shot"
            />
            <figcaption className="lcs-cap">
              The AI icon docks beside search. The upgrade lives where the old
              behavior lived.
            </figcaption>
          </Reveal>
        </Section>

        <Section eyebrow="Layout" headline="Four layouts went in front of users. One kept the page usable.">
          <div className="lcs-prose">
            <p>
              I prototyped four layouts in code and tested them: side panel, modal,
              floating panel, inline bar. The side panel won because it kept the docs
              list usable while you asked. You could see the results it referenced
              without the answer covering them.
            </p>
          </div>
          <div className="mt-8">
            <LayoutContest />
          </div>
          <div className="lcs-prose mt-8">
            <p>
              Continued testing showed power users felt cramped at 400px, so the full
              page became the panel&rsquo;s expand state, one click apart via the
              expand and collapse icons. Which one should be the default is a real
              question, so I designed an A/B test to settle it: side panel default
              versus full page default, measuring discovery, toggle rates, and layout
              persistence.
            </p>
          </div>
          <div className="mt-8">
            <CompareStage
              ariaLabel="The shipped expand interaction: side panel versus full page"
              layers={[
                {
                  src: `${IMG}/side-panel-zero.png`,
                  alt: 'Lucid AI docked as a side panel beside the docs list',
                  label: 'Side panel',
                  caption: 'Docked: ask without leaving the docs list.',
                  width: 2880,
                  height: 1800,
                },
                {
                  src: `${IMG}/full-page-zero.png`,
                  alt: 'Lucid AI expanded to a full page over the docs list',
                  label: 'Full page',
                  caption: 'Expanded: room to work for the heavy sessions. One click back.',
                  width: 2880,
                  height: 1800,
                },
              ]}
            />
            <p className="lcs-cap">
              This toggle mirrors the shipped interaction: the expand icon in the
              panel header flips between these two states.
            </p>
          </div>
        </Section>

        <Section eyebrow="Teaching" headline="The first click teaches. Every click after does.">
          <div className="lcs-prose">
            <p>
              Clicking a skill tile in the zero state does not run the skill. It
              returns a hardcoded explanation of what the skill can do, with concrete
              examples and quick-start chips. These are brand-new capabilities, and
              the first click is the best teaching moment you will ever get. I
              accepted a slower first turn so people learn what each skill can do and
              get more from every turn after.
            </p>
            <p>
              Find docs is the clearest case: it searches by content, date, and
              collaborator. None of that is guessable from an empty text box.
            </p>
          </div>
        </Section>

        <Section eyebrow="The results component" headline="Seven results in a 400px panel.">
          <div className="mt-2 mb-8">
            <ResultsCount />
          </div>
          <div className="lcs-prose">
            <p>
              Testing pushed the result count from a fixed 3 to up to 7, chosen by the
              AI on confidence. The existing 24px button component bloated at that
              count, especially in the 400px side panel. So I designed a 16px inline
              component: a doc chip plus a one-line description, keeping a full result
              set scannable in one glance.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <figure className="m-0">
              <Image
                src={`${IMG}/results-v1-24px.png`}
                alt="Version one of doc search results: three large 24px bordered result buttons with a see last two results chip"
                width={2400}
                height={2026}
                sizes="(min-width: 860px) 430px, 100vw"
                className="lcs-shot"
              />
              <figcaption className="lcs-cap">V1: three results in the 24px component, rest behind a click.</figcaption>
            </figure>
            <figure className="m-0">
              <Image
                src={`${IMG}/results-final-16px.png`}
                alt="The shipped doc search results: seven compact 16px doc chips, each with a one-line description, ranked strongest match first"
                width={2400}
                height={1312}
                sizes="(min-width: 860px) 430px, 100vw"
                className="lcs-shot"
              />
              <figcaption className="lcs-cap">Shipped: up to seven results in the 16px component, all visible.</figcaption>
            </figure>
          </div>
        </Section>

        <Section eyebrow="The mention tool" headline="Free text can't tell one Sam from three others.">
          <div className="lcs-prose">
            <p>
              Collaborator was the detail people remembered most, and the one free
              text handled worst. I designed an @-mention that resolves the person
              before the search runs: autocomplete mid-type, a resolved chip in the
              query. It removes a whole class of failed searches instead of improving
              their error message.
            </p>
          </div>
          <p className="lcs-mention mt-6" aria-label="Example query using a resolved mention chip">
            <span>Boards</span>
            <span className="lcs-mention__chip">@Sam T.</span>
            <span>and I worked on in May</span>
          </p>
        </Section>

        <Section eyebrow="Trust" headline="Every response shows its work.">
          <div className="lcs-prose">
            <p>
              Research kept surfacing the same anxiety: what is this thing reading?
              So every response names the skill that ran, as a pill on the message,
              and shows what it searched in an expandable chip. Searched users, plus
              two more. Tap to see the full list. Trust came from receipts, not
              reassurance.
            </p>
            <p>
              Generated work follows the same principle of staying in your control.
              Build a diagram creates in a new tab and returns a clickable chip. The
              canvas never ambushes you; you choose when to enter it.
            </p>
          </div>
        </Section>

        <Section eyebrow="Failure states" headline="Every dead end converts to a next step.">
          <div className="mt-2">
            <FailureTabs
              tabs={[
                {
                  label: 'Wrong results',
                  content: (
                    <div className="lcs-statecard lcs-prose">
                      <p>
                        When the results miss, the response admits it, asks for one
                        more clue, and offers refinement chips scoped to what it
                        already knows. The user refines instead of retyping from
                        zero.
                      </p>
                      <p className="lcs-cap !mt-3">
                        Demo capture pending re-shoot. Described here rather than
                        shown.
                      </p>
                    </div>
                  ),
                },
                {
                  label: 'Out of scope',
                  content: (
                    <figure className="m-0">
                      <Image
                        src={`${IMG}/out-of-scope.png`}
                        alt="Asked to write a full PRD, the assistant names its limit, offers to find product roadmaps or generate a feature flowchart as buttons instead"
                        width={2400}
                        height={1100}
                        sizes="(min-width: 860px) 860px, 100vw"
                        className="lcs-shot"
                      />
                      <figcaption className="lcs-cap">
                        Asked for something it cannot do, it names the limit and
                        offers two things it can do as buttons.
                      </figcaption>
                    </figure>
                  ),
                },
                {
                  label: 'Working',
                  content: (
                    <figure className="m-0 max-w-[420px]">
                      <Image
                        src={`${IMG}/working-state.png`}
                        alt="The working state: a spinner labeled generating diagram, under a scanned canvas step, naming what the assistant is doing"
                        width={810}
                        height={1800}
                        sizes="420px"
                        className="lcs-shot"
                      />
                      <figcaption className="lcs-cap">
                        The spinner names what it is doing. Reused from the editor
                        assistant on purpose: saved engineering effort, kept the two
                        assistants consistent.
                      </figcaption>
                    </figure>
                  ),
                },
              ]}
            />
          </div>
        </Section>

        {/* ── Impact ── */}
        <Section eyebrow="Impact" headline="A ship, a harness, and the next iteration's data.">
          <ul className="lcs-bullets mt-2">
            <li>
              Shipped to general availability on every tier, free through enterprise,
              twelve weeks from zero
            </li>
            <li>
              Every future docs list AI skill inherits the panel, the entry point,
              the response patterns, and the failure states
            </li>
            <li>
              The A/B test I designed settles the layout default with data and drives
              the next iteration after my internship ends
            </li>
          </ul>
        </Section>

        {/* ── Reflection ── */}
        <Section eyebrow="Reflection" headline="The model can do anything. The product is choosing what it should.">
          <div className="lcs-prose">
            <p>
              Every decision on this project traded off speed, cost, and usability.
              Being technical enough to hold those conversations with engineers
              changed what I could design: the working-state reuse, the
              confidence-based result count, and the teaching turn all came out of those
              trade-off discussions, not from a spec.
            </p>
            <p>
              We shipped fast because feedback was constant. Users saw every round,
              engineering saw designs days after they existed, and nothing waited for
              a big reveal. The speed came from communication, not from skipping
              steps.
            </p>
            <p>
              The honest limitation: the editor assistant and the docs list assistant
              do not share context yet. Closing that gap is the obvious next chapter.
            </p>
          </div>
        </Section>

        {/* ── Prev / next ── */}
        <nav
          className="mt-24 pt-8 border-t border-white/10 flex items-center justify-end gap-4"
          aria-label="More work"
        >
          <Link href="/work/awardco-login-flow-redesign" className="footer-link -mr-4 text-right">
            Awardco Login Flow Redesign →
          </Link>
        </nav>
      </div>

      <Footer />
    </div>
  )
}
