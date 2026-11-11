import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import ReadNext from '@/components/ReadNext'
import Reveal from '@/components/lucid/Reveal'
import CompareStage from '@/components/lucid/CompareStage'
import ShipTimeline from '@/components/lucid/ShipTimeline'
import LayoutContest from '@/components/lucid/LayoutContest'
import BoardGenClip from '@/components/lucid/BoardGenClip'
import HeroMock from '@/components/cs/HeroMock'
import ZoomShot from '@/components/lucid/ZoomShot'
import MentionFlow from '@/components/lucid/MentionFlow'
import BigStats from '@/components/cs/BigStats'
import Stage from '@/components/cs/Stage'
import StageRail from '@/components/cs/StageRail'
import Callouts from '@/components/cs/Callouts'
import Laptop from '@/components/cs/Laptop'
import { Band, Block, Col, MetaGrid, Notes, Pill, Problem, StoryTitle } from '@/components/cs/Story'
import { SITE } from '@/lib/site'
import { companyAbout } from '@/lib/caseStudies'

/*
 * Custom-built case study — this static route intentionally shadows the
 * generic /work/[slug] template. The tile on the home grid still reads from
 * lib/caseStudies.ts; everything below is bespoke to the Lucid story.
 *
 * Story edition (2026-09-21): the page now runs the five-act structure —
 * title block, hero band, the problem, the impact, the journey, then the
 * acts — on the shared `components/cs` primitives. Copy is Luke's (rewrite
 * of 2026-09-14), reordered into acts and with key phrases bolded; nothing
 * has been added to the facts. Stages edition (2026-11-03, Luke): the acts
 * and the Journey strip gave way to design-process stages with the
 * StageRail, as on Pitch; each stage is a heading and plain body, and the
 * subheads, task/solution pairs, checklists and What next card were folded
 * into the body or cut. Rules that still bind: shipped work only,
 * no internal project or team names, no colleague names, no long-term
 * adoption numbers (the internship ended shortly after GA), no interview
 * count, no invented user quotes — the note cards in the first stage are labelled
 * illustrative. Captures from the design file predate the release and
 * The diagram skill's user-facing name is "Build a diagram" (per Luke,
 * 2026-09-22); "generate diagram tool" is the internal name and must not
 * appear on the page. Three skills shipped (Find docs, Summarize, Build a
 * diagram); Catch up was designed and is next on the list, never "shipped"
 * (Luke, 2026-11-11). The layout wireframes stand in for the four coded
 * prototypes until captures exist.
 */

const TITLE = 'Bringing Lucid AI to the homepage'
const DESCRIPTION =
  'An AI assistant on the Lucid homepage: find documents by whatever you remember, summarize them, or generate a new board. Shipped to every tier in 12 weeks.'

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

/* The design process, in the order it happened. Each label is also the
   stage's heading, as on Pitch. The visuals run in Luke's order
   (2026-11-11); the text rides along with them until the card rewrite. */
const STAGES = [
  { id: 'problem', label: 'Understanding the problem' },
  { id: 'entry', label: 'Choosing the entry point' },
  { id: 'layout', label: 'Prototyping the layout' },
  { id: 'panel', label: 'Side panel and full page' },
  { id: 'skills', label: 'Narrowing the skills' },
  { id: 'zero', label: 'Designing the skills' },
  { id: 'results', label: 'Showing the right doc' },
  { id: 'diagram', label: 'Building a diagram' },
  { id: 'mention', label: 'Pointing to the right person' },
  { id: 'search', label: 'Making search smarter' },
  { id: 'shipping', label: 'Shipping to every tier' },
  { id: 'handoff', label: 'Handing off' },
]

/* The zero-state answer each skill gives when you pick it. Three shipped;
   Catch up was designed and is next on the list (Luke, 2026-11-11). The
   Build a diagram frame is composed from the panel in skill-diagram.png,
   set at the same size and type scale as the other three. */
const SKILLS = [
  {
    name: 'Find docs',
    src: 'skill-find.png',
    width: 1760,
    height: 1312,
    alt: 'The Find docs skill in the panel: it explains it can search by collaborators, timeframe, canvas content, and connected project views, with three quick-view chips under the text',
  },
  {
    name: 'Summarize',
    src: 'skill-summarize.png',
    width: 1760,
    height: 1312,
    alt: 'The Summarize skill in the panel, explaining project syncs, catch-up reports, thematic reviews, and single file deep dives, with three cross-file prompt chips',
  },
  {
    name: 'Build a diagram',
    src: 'skill-diagram-zero.png',
    width: 1760,
    height: 1312,
    alt: 'The Build a diagram skill in the panel, asking what kind of diagram you want, with Flowchart, Mind map, ERD, AWS, and More chips',
  },
  {
    name: 'Catch up',
    next: true,
    src: 'skill-catchup.png',
    width: 1760,
    height: 1312,
    alt: 'The Catch up skill in the panel, offering key updates, decisions made, open questions, and next steps, with three timeframe chips',
  },
]

export default function LucidCaseStudy() {
  return (
    <div className="cs lcs cs-surface cs-story min-h-screen text-white">
      <SiteNav
        next={{
          href: '/work/awardco-login-flow-redesign',
          title: 'Reducing Authentication Friction',
        }}
      />

      <main id="main" className="sitenav-offset pb-24">
        {/* ══ Title block ══ */}
        <Col>
          <header className="pt-10">
            <p className="cs-eyebrow mb-5">Lucid · Product Design Internship</p>
            <StoryTitle dim="to the homepage">Bringing Lucid AI</StoryTitle>
            {/* Pitch's header (LUK-199): one summary paragraph across the
                column, then Company, Role, Timeline and Tools. Team, Skills
                used and Released came off; the release is in the summary. */}
            <MetaGrid
              stacked
              summary={
                <p>
                  Lucid AI is an assistant on the Lucid homepage. I designed it so you can find a
                  document by whatever you remember about it, not just its title, and then summarize
                  it or build something new. It shipped to every Lucid tier on August 5.
                </p>
              }
              facts={[
                {
                  label: 'Company',
                  value: companyAbout('lucid-ai'),
                  span: true,
                },
                { label: 'Role', value: 'Product Design Intern' },
                { label: 'Timeline', value: 'May to August 2026' },
                { label: 'Tools', value: 'Figma, Lucid, Claude Code' },
              ]}
            />
          </header>
        </Col>

        {/* ══ Hero band: the live Find docs loop, behind a laptop's glass ══ */}
        <Band tone="accent" crop className="cs-hero-band">
          <Laptop>
            {/* Opens on the design file's zero state — a designed frame at
                rest — then types the query and resolves the results. */}
            <HeroMock />
          </Laptop>
        </Band>

        {/* ══ The problem ══ */}
        <Band dust flush>
          <Col>
            <Problem iconSrc="/logos/lucid.png" iconAlt="Lucid">
              How might we help people <em>find and act on their work from the homepage</em> when
              they remember the document, not its title?
            </Problem>
          </Col>
        </Band>

        {/* ══ The impact ══ */}
        <Col wide>
          <Block className="cs-centered">
            <Pill>The impact</Pill>
            <BigStats
              stats={[
                {
                  value: 12,
                  caption: (
                    <>
                      weeks from a blank page to <strong>general availability</strong>
                    </>
                  ),
                },
                {
                  value: 3,
                  caption: (
                    <>
                      <strong>core skills</strong> shipped: find, summarize, build
                    </>
                  ),
                },
                {
                  value: 20,
                  suffix: '+',
                  caption: <>capabilities prototyped and tested before the cut</>,
                },
                {
                  value: 'All',
                  caption: (
                    <>
                      Lucid tiers at release, <strong>free through enterprise</strong>
                    </>
                  ),
                },
              ]}
            />
          </Block>
        </Col>

        {/* ══ The design process, stage by stage, with the rail (LUK-203) ══ */}
        <StageRail stages={STAGES} />

        {/* 1 · The home page as it was: the problem, and the open spots */}
        <Stage
          id="problem"
          title="Understanding the problem"
          body={
            <>
              <p>
                When I joined Lucid, finding a document was hard work, especially for enterprise
                users on multiple teams with years of history.
              </p>
              <p>
                Search only matched words in titles. Forget the title, and you were scrolling
                through pages of recent docs or fighting filters many people found confusing.
              </p>
              <p>
                I got on discovery calls with users around the world as fast as I could, and heard
                the same thing over and over. People remembered what a doc was about, or something
                inside it, but rarely its exact title. And even when they found a title, it
                didn&rsquo;t tell them if it was the right doc.
              </p>
              <p>So the goal was simple: find the right doc from what you remember.</p>
            </>
          }
        >
          <Col>
            <Notes
              quotes
              label="What people remembered instead of a title"
              notes={[
                'the pricing one with the big comparison table, finance made it I think',
                'our onboarding flowchart, the one with all the red decision diamonds',
                'the offsite retro from spring, three columns of sticky notes',
              ]}
            />
            <Block>
              <Callouts
                src={`${IMG}/home-before.png`}
                alt="The old Lucid homepage, annotated: a search bar that only matches keywords in titles, four open spots where an AI entry point could go (beside search, the left nav, the links at the bottom of it, and the top right), and a long grid of recent documents"
                width={2880}
                height={1800}
                items={[
                  {
                    label: 'Title keywords only',
                    text: (
                      <>
                        Search matched keywords in <strong>document titles</strong> and nothing
                        else.
                      </>
                    ),
                    x: 16.8,
                    y: 1.4,
                    w: 33.8,
                    h: 4.4,
                  },
                  {
                    label: 'Room for AI',
                    text: (
                      <>
                        Lucid AI lived <strong>only in the editor</strong>. Four open spots could
                        take it.
                      </>
                    ),
                    x: 50.9,
                    y: 1.4,
                    w: 5,
                    h: 4.4,
                    more: [
                      { x: 1.6, y: 22.1, w: 13.3, h: 11.6 },
                      { x: 1.4, y: 67.1, w: 13.8, h: 30.5 },
                      { x: 79.1, y: 1.5, w: 4.5, h: 4.4 },
                    ],
                  },
                  {
                    label: 'Scroll to find',
                    text: (
                      <>
                        Without the title, the fallback was <strong>recent documents</strong>, which
                        run for pages.
                      </>
                    ),
                    x: 20.3,
                    y: 61.5,
                    w: 76.3,
                    h: 38,
                  },
                ]}
              />
            </Block>
          </Col>
        </Stage>

        {/* 2 · The entry point it got */}
        <Stage
          id="entry"
          title="Choosing the entry point"
          body={
            <>
              <p>
                Lucid AI could already build diagrams inside a document, but the homepage had none
                of it. That&rsquo;s where people go to look for their work, so we brought Lucid AI
                there.
              </p>
              <p>
                In testing, the spot right next to search felt the most familiar. It&rsquo;s where
                people already go to find work, and most products put AI in the top nav, not the
                side. Close enough to feel like a smarter search, separate enough that regular
                search still works the way people know.
              </p>
              <p>
                That space was already empty, so the sparkle button moved nothing.{' '}
                <strong>One new button, nothing to relearn</strong>.
              </p>
            </>
          }
        >
          <Col>
            <Block tight>
              <figure className="m-0">
                <div className="cs-fig__frame">
                  <ZoomShot
                    src={`${IMG}/home-entry.png`}
                    alt="The Lucid homepage with one addition: a Lucid AI sparkle button in the empty space beside the search bar"
                    width={2880}
                    height={1800}
                    sizes="(min-width: 60em) 800px, 100vw"
                  />
                </div>
              </figure>
            </Block>
          </Col>
        </Stage>

        {/* 3 · The four coded layout prototypes. Wireframes stand in until
               captures of the real prototypes exist (Luke, 2026-11-11). */}
        <Stage
          id="layout"
          title="Prototyping the layout"
          body={
            <p>
              I built four coded prototypes of where the conversation should live and tested them
              with users.
            </p>
          }
        >
          <Col>
            <Block tight>
              <LayoutContest />
            </Block>
          </Col>
        </Stage>

        {/* 4 · Where it landed */}
        <Stage
          id="panel"
          title="Side panel and full page"
          body={
            <p>
              I landed on a side panel, so you can keep working with your docs while you chat, plus
              a full page for longer conversations.
            </p>
          }
        >
          <Col>
            <Block tight>
              <CompareStage
                ariaLabel="The shipped expand interaction: side panel versus full page"
                layers={[
                  {
                    src: `${IMG}/panel-side.png`,
                    alt: 'Lucid AI docked as a side panel beside the homepage document list, offering its skills',
                    label: 'Side panel',
                    caption:
                      'Docked: ask without leaving your documents. Every skill is one tap from the panel.',
                    width: 2880,
                    height: 1800,
                  },
                  {
                    src: `${IMG}/panel-full.png`,
                    alt: 'Lucid AI expanded to a full page over the homepage',
                    label: 'Full page',
                    caption:
                      'Expanded: room for longer conversations. One click back to the panel.',
                    width: 2880,
                    height: 1800,
                  },
                ]}
              />
            </Block>
          </Col>
        </Stage>

        {/* 5 · The ideas, before the cut */}
        <Stage
          id="skills"
          title="Narrowing the skills"
          body={
            <>
              <p>
                The calls showed search was only part of it. Managers wanted a faster read on what
                their teams were doing. Product leaders wanted quick summaries of roadmaps and
                planning docs. And people wanted help getting started, not just finding files.
              </p>
              <p>
                So we prototyped and tested more than 20 ideas and cut them to three for launch:{' '}
                <strong>Find docs</strong>, <strong>Summarize</strong>, and{' '}
                <strong>Build a diagram</strong>. <strong>Catch up</strong> was next on the list.
              </p>
            </>
          }
        >
          <Band>
            <Col>
              <Reveal>
                <div className="cs-paper cs-paper--flat">
                  <ZoomShot
                    src={`${IMG}/skills-ideation.png`}
                    alt="An ideation grid of twenty candidate capabilities for the homepage assistant, including Find docs, Summarize, Catch up, Build a diagram, dormant files, and project status"
                    width={1680}
                    height={1956}
                    sizes="(min-width: 40em) 520px, 100vw"
                  />
                </div>
                <p className="cs-cap cs-cap--mono">
                  Twenty of the candidate capabilities, from the design file, before the cut.
                </p>
              </Reveal>
            </Col>
          </Band>
        </Stage>

        {/* 6 · What each skill says when you pick it, side by side */}
        <Stage
          id="zero"
          title="Designing the skills"
          body={
            <p>
              Each skill opens by explaining what it does and offering a prompt to start with, so
              nobody faces a blank box.
            </p>
          }
        >
          <Col wide>
            <Block tight>
              <ul className="lcs-zero">
                {SKILLS.map((k) => (
                  <li key={k.name} className={k.next ? 'is-next' : undefined}>
                    <div className="cs-fig__frame">
                      <ZoomShot
                        src={`${IMG}/${k.src}`}
                        alt={k.alt}
                        width={k.width}
                        height={k.height}
                        sizes="(min-width: 60em) 520px, 100vw"
                      />
                    </div>
                    <p className="lcs-zero__name">
                      {k.name}
                      {k.next && <span className="lcs-zero__badge">Next up</span>}
                    </p>
                  </li>
                ))}
              </ul>
            </Block>
          </Col>
        </Stage>

        {/* 7 · The results Find docs returns */}
        <Stage
          id="results"
          title="Showing the right doc"
          body={
            <>
              <p>
                Find docs takes whatever you remember: who you worked with, roughly when, or
                what&rsquo;s on the canvas.
              </p>
              <p>
                But a title still didn&rsquo;t tell people if they&rsquo;d found the right one. So
                every result gets a one-line AI summary of what&rsquo;s inside, and hovering shows
                who owns it, which team it&rsquo;s in, and when it was last edited.
              </p>
            </>
          }
        >
          <Col>
            <Callouts
              src={`${IMG}/results-final-16px.png`}
              alt="The shipped document results, annotated: seven compact document chips, each followed by a one-line AI-generated summary, ranked strongest match first, ending with an offer to narrow or open"
              width={2400}
              height={1312}
              items={[
                {
                  label: 'Compact rows',
                  text: (
                    <>
                      Up to <strong>seven results in view</strong>, ranked strongest match first.
                    </>
                  ),
                  x: 16.5,
                  y: 25.5,
                  w: 65,
                  h: 30.5,
                },
                {
                  label: 'AI summary',
                  text: (
                    <>
                      One line on <strong>what is inside</strong>, so the title is not the only
                      clue.
                    </>
                  ),
                  x: 38,
                  y: 26.5,
                  w: 45,
                  h: 4.8,
                },
                {
                  label: 'Next step',
                  text: (
                    <>
                      Every answer ends with an offer to <strong>narrow or open</strong>.
                    </>
                  ),
                  x: 16.5,
                  y: 55.5,
                  w: 40,
                  h: 4.5,
                },
              ]}
            />
          </Col>
        </Stage>

        {/* 8 · Build a diagram, from the prompt to the board */}
        <Stage
          id="diagram"
          title="Building a diagram"
          body={
            <p>
              Build a diagram is the only skill that leaves the panel. It asks what kind of diagram
              you want, takes your prompt, and builds the board in a new tab while the panel shows
              its progress.
            </p>
          }
        >
          <Col>
            <Block>
              <figure className="m-0">
                <div className="cs-fig__frame">
                  <ZoomShot
                    src={`${IMG}/skill-diagram.png`}
                    alt="Build a diagram in progress: the homepage on the left, and in the panel a diagram-type chooser, a chosen flowchart, an example prompt, and a generating diagram status under a scanned canvas step"
                    width={2880}
                    height={1800}
                    sizes="(min-width: 60em) 800px, 100vw"
                  />
                </div>
                <figcaption className="cs-cap">
                  Diagram type first, then the prompt. The status line names each step so the wait
                  is never silent.
                </figcaption>
              </figure>
            </Block>
            <Block>
              <figure className="m-0">
                <div className="cs-fig__frame">
                  <BoardGenClip />
                </div>
                <figcaption className="cs-cap">
                  Then the board builds itself in a new tab, section by section.
                </figcaption>
              </figure>
            </Block>
          </Col>
        </Stage>

        {/* 9 · The @mention */}
        <Stage
          id="mention"
          title="Pointing to the right person"
          body={
            <>
              <p>
                Find docs let you search by who you worked with, but testing with external users
                turned up something we didn&rsquo;t expect: type a name, and the assistant sometimes
                picked the wrong person.
              </p>
              <p>
                So instead of making the AI guess, I designed an @mention that lets you pick the
                exact teammate or team.
              </p>
            </>
          }
        >
          <Col>
            <Block tight>
              <figure className="m-0">
                <div className="cs-fig__frame">
                  <MentionFlow />
                </div>
                <figcaption className="cs-cap">
                  People and teams resolve the same way, so the search never has to guess who you
                  meant.
                </figcaption>
              </figure>
            </Block>
          </Col>
        </Stage>

        {/* 10 · Regular search, made semantic, with the AI answer */}
        <Stage
          id="search"
          title="Making search smarter"
          body={
            <>
              <p>
                The @mention shipped in both the assistant panel and the regular search bar. Search
                still takes keywords, but past four words it also gives an AI answer above the
                results. A sentence gets an answer, a keyword still gets a list.
              </p>
              <p>
                My manager owned the AI answer and I helped with it. I owned the @mention, the
                document results, and the jump from that answer into the full Lucid AI chat.
              </p>
            </>
          }
        >
          <Col>
            <Callouts
              src={`${IMG}/search-ai-answer.png`}
              alt="The search results page, annotated: a resolved mention chip inside the keyword query, an AI answer listing documents with one-line summaries above the results table, and a chat input under the answer that continues into Lucid AI"
              width={2880}
              height={1800}
              items={[
                {
                  label: 'Mention, in search',
                  text: (
                    <>
                      The same resolver as the panel, <strong>inside the keyword bar</strong>.
                    </>
                  ),
                  x: 26.5,
                  y: 2,
                  w: 6.5,
                  h: 2.8,
                },
                {
                  label: 'Document results',
                  text: (
                    <>
                      One line per document, so a title is <strong>never the only clue</strong>.
                    </>
                  ),
                  x: 19,
                  y: 17,
                  w: 77.5,
                  h: 21,
                },
                {
                  label: 'Into the chat',
                  text: (
                    <>
                      Typing here <strong>opens the full assistant</strong>, carrying the answer
                      with it.
                    </>
                  ),
                  x: 19,
                  y: 42.5,
                  w: 78,
                  h: 10,
                },
              ]}
            />
          </Col>
        </Stage>

        <Stage
          id="shipping"
          title="Shipping to every tier"
          body={
            <p>
              On August 5 we shipped it to every Lucid tier, free through enterprise. In 12 weeks I
              helped take it from a blank page through discovery, prototyping and testing with
              external users, all the way to release.
            </p>
          }
        >
          <Band dust>
            <Col>
              <ShipTimeline />
            </Col>
          </Band>
        </Stage>

        <Stage
          id="handoff"
          title="Handing off"
          body={
            <>
              <p>
                My internship ended right after release, so I don&rsquo;t have long-term adoption
                numbers. Before I left, I designed and set up an A/B test of the side panel against
                the full page, tracking which skills did best, so real behavior could guide the next
                version.
              </p>
              <p>
                I handed off the panel and full page, the results component, the skills, Catch up as
                the next one to build, the failure states, the A/B test, and designs for memory
                controls and chat history.
              </p>
              <p>
                One gap was left: the AI in the editor and the AI on the homepage couldn&rsquo;t
                share context. The memory and chat history designs give the team a head start on
                closing it.
              </p>
              <p>
                Every call here was a tradeoff between speed, cost, and usability, and knowing the
                technical side helped me work through those with engineers. We moved fast because
                the feedback never stopped. Users saw every round, and engineers saw designs within
                days.
              </p>
            </>
          }
        />

        {/* ══ Read next ══ */}
        <ReadNext current="lucid-ai" />
      </main>

      <Footer width="article" />
    </div>
  )
}
