import type { Metadata } from 'next'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import ReadNext from '@/components/ReadNext'
import Reveal from '@/components/lucid/Reveal'
import CompareStage from '@/components/lucid/CompareStage'
import ShipTimeline from '@/components/lucid/ShipTimeline'
import HeroMock from '@/components/cs/HeroMock'
import FailureTabs from '@/components/lucid/FailureTabs'
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
 * appear on the page.
 */

const TITLE = 'Bringing Lucid AI to the homepage'
const DESCRIPTION =
  'An AI assistant on the Lucid homepage: find documents by whatever you remember, summarize them, catch up, or generate a new board. Shipped to every tier in 12 weeks.'

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
   stage's heading, as on Pitch. */
const STAGES = [
  { id: 'problem', label: 'Understanding the problem' },
  { id: 'opportunity', label: 'Finding the opportunity' },
  { id: 'narrowing', label: 'Narrowing to four skills' },
  { id: 'designing', label: 'Designing the skills' },
  { id: 'mention', label: 'Pointing to the right person' },
  { id: 'shipping', label: 'Shipping to every tier' },
  { id: 'handoff', label: 'Handing off' },
]

export default function LucidCaseStudy() {
  return (
    <div className="cs lcs cs-surface cs-story min-h-screen text-white">
      <SiteNav
        next={{ href: '/work/awardco-login-flow-redesign', title: 'Reducing Authentication Friction' }}
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
                  Lucid AI is an assistant on the Lucid homepage. I designed it so you can
                  find a document by whatever you remember about it, not just its title, and
                  then summarize it, catch up on what changed, or build something new. It
                  shipped to every Lucid tier on August 5.
                </p>
              }
              facts={[
                { label: 'Company', value: companyAbout('lucid-ai'), span: true },
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
                { value: 12, caption: <>weeks from a blank page to <strong>general availability</strong></> },
                { value: 4, caption: <><strong>core skills</strong> shipped: find, summarize, build, catch up</> },
                { value: 20, suffix: '+', caption: <>capabilities prototyped and tested before the cut</> },
                { value: 'All', caption: <>Lucid tiers at release, <strong>free through enterprise</strong></> },
              ]}
            />
          </Block>
        </Col>

        {/* ══ The design process, stage by stage, with the rail (LUK-203) ══ */}
        <StageRail stages={STAGES} />

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
          </Col>
        </Stage>

        <Stage
          id="opportunity"
          title="Finding the opportunity"
          body={
            <p>
              Lucid AI could already build diagrams inside a document, but the homepage had none of
              it. That&rsquo;s where people go to look for their work, so we brought Lucid AI there.
            </p>
          }
        >
          <Col>
            <Block>
              <Callouts
                src={`${IMG}/home-before.png`}
                alt="The old Lucid homepage, annotated: a search bar that only matches keywords in titles, empty space beside it, and a long grid of recent documents"
                width={2880}
                height={1800}
                items={[
                  {
                    label: 'Title keywords only',
                    text: <>Search matched keywords in <strong>document titles</strong> and nothing else.</>,
                    x: 16.8,
                    y: 1.4,
                    w: 33.8,
                    h: 4.4,
                    ax: 33.7,
                    ay: 1.4,
                  },
                  {
                    label: 'Nothing here yet',
                    text: <>Lucid AI existed <strong>only inside the editor</strong>. The homepage had no natural-language entry point.</>,
                    x: 50.9,
                    y: 1.4,
                    w: 5,
                    h: 4.4,
                    ax: 53.4,
                    ay: 1.4,
                  },
                  {
                    label: 'Scroll to find',
                    text: <>Without the title, the fallback was <strong>recent documents</strong>, which run for pages.</>,
                    x: 20.3,
                    y: 61.5,
                    w: 76.3,
                    h: 38,
                    ax: 83.3,
                    ay: 61.5,
                  },
                ]}
              />
            </Block>

            <Block>
              <div className="cs-prose">
                <p>
                  I started where people already go when they need something: the search bar. But
                  there were other open spots too, like the left nav, the links at the bottom of
                  it, and the icons in the top right.
                </p>
              </div>
              <Callouts
                src={`${IMG}/home-before.png`}
                alt="The old Lucid homepage with three other places the entry point could have gone: the left navigation beside Home and Documents, the links at the bottom of the left navigation, and the icons in the top right"
                width={2880}
                height={1800}
                items={[
                  {
                    label: 'Left nav',
                    text: <>Beside <strong>Home and Documents</strong>, where people move between their own work.</>,
                    x: 1.6,
                    y: 22.1,
                    w: 13.3,
                    h: 11.6,
                    ax: 15.2,
                    ay: 27.9,
                  },
                  {
                    label: 'Bottom links',
                    text: <>With <strong>Discover, Templates and Integrations</strong>, the secondary destinations.</>,
                    x: 1.4,
                    y: 67.1,
                    w: 13.8,
                    h: 30.5,
                    ax: 16.6,
                    ay: 82.3,
                  },
                  {
                    label: 'Top right',
                    text: <>Next to <strong>help and notifications</strong>, by the plan switcher.</>,
                    x: 79.1,
                    y: 1.5,
                    w: 4.5,
                    h: 4.4,
                    ax: 77.4,
                    ay: 3.7,
                  },
                ]}
              />
              <div className="cs-prose mt-10">
                <p>
                  In testing, the spot right next to search felt the most familiar. It&rsquo;s
                  where people already go to find work, and most products put AI in the top nav,
                  not the side. Close enough to feel like a smarter search, separate enough that
                  regular search still works the way people know.
                </p>
                <p>
                  That space was already empty, so the sparkle button moved nothing.{' '}
                  <strong>One new button, nothing to relearn</strong>, right where Find docs does
                  its job.
                </p>
              </div>
              <figure className="m-0 mt-6">
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

        <Stage
          id="narrowing"
          title="Narrowing to four skills"
          body={
            <>
              <p>
                The calls showed search was only part of it. Managers wanted a faster read on what
                their teams were doing. Product leaders wanted quick summaries of roadmaps and
                planning docs. And people wanted help getting started, not just finding files.
              </p>
              <p>
                So we prototyped and tested more than 20 ideas and cut them to four.{' '}
                <strong>Find docs</strong> searches by topic, person, or what&rsquo;s inside.{' '}
                <strong>Summarize</strong> gives the gist of one doc or a bunch.{' '}
                <strong>Build a diagram</strong> turns a prompt into a flowchart.{' '}
                <strong>Catch up</strong> shows what you missed.
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
                  Twenty of the candidate capabilities, from the design file, before the cut to four.
                </p>
              </Reveal>
            </Col>
          </Band>
        </Stage>

        <Stage
          id="designing"
          title="Designing the skills"
          body={
            <p>
              Find docs is where the whole project started. Instead of a keyword that has to match
              the title, it takes whatever you remember: who you worked with, roughly when, or
              what&rsquo;s on the canvas.
            </p>
          }
        >
          <Col>
            <Block>
              <figure className="m-0">
                <div className="cs-fig__frame">
                  <ZoomShot
                    src={`${IMG}/skill-find.png`}
                    alt="The Find docs skill in the panel: it explains it can search by collaborators, timeframe, canvas content, and connected project views, with three quick-view chips under the text"
                    width={1760}
                    height={1312}
                    sizes="(min-width: 60em) 800px, 100vw"
                  />
                </div>
                <figcaption className="cs-cap">
                  Find docs takes a description instead of a title: who worked on it, roughly when,
                  or what is written on the canvas.
                </figcaption>
              </figure>
            </Block>

            <Block>
              <div className="cs-prose">
                <p>
                  But a title still didn&rsquo;t tell people if they&rsquo;d found the right one. So
                  every result gets a one-line AI summary of what&rsquo;s inside, and hovering shows
                  who owns it, which team it&rsquo;s in, and when it was last edited. Enough to
                  recognize the doc, and to see the assistant understood you.
                </p>
              </div>
              <Callouts
                src={`${IMG}/results-final-16px.png`}
                alt="The shipped document results, annotated: seven compact document chips, each followed by a one-line AI-generated summary, ranked strongest match first, ending with an offer to narrow or open"
                width={2400}
                height={1312}
                items={[
                  {
                    label: 'Compact rows',
                    text: <>Up to <strong>seven results in view</strong>, ranked strongest match first.</>,
                    x: 16.5,
                    y: 25.5,
                    w: 65,
                    h: 30.5,
                    ax: 16.5,
                    ay: 41,
                  },
                  {
                    label: 'AI summary',
                    text: <>One line on <strong>what is inside</strong>, so the title is not the only clue.</>,
                    x: 38,
                    y: 26.5,
                    w: 45,
                    h: 4.8,
                    ax: 83,
                    ay: 29,
                  },
                  {
                    label: 'Next step',
                    text: <>Every answer ends with an offer to <strong>narrow or open</strong>.</>,
                    x: 16.5,
                    y: 55.5,
                    w: 40,
                    h: 4.5,
                    ax: 57,
                    ay: 57.7,
                  },
                ]}
              />
            </Block>

            <Block>
              <div className="cs-prose">
                <p>
                  Summarize and Catch up live in the same panel. Each one opens by explaining what
                  it does and offering a prompt to start with.
                </p>
              </div>
              <div className="mt-6">
                <FailureTabs
                  tabs={[
                    {
                      label: 'Summarize',
                      content: (
                        <figure className="m-0">
                          <ZoomShot
                            src={`${IMG}/skill-summarize.png`}
                            alt="The Summarize skill in the panel, explaining project syncs, catch-up reports, thematic reviews, and single file deep dives, with three cross-file prompt chips"
                            width={1760}
                            height={1312}
                            eager
                            sizes="(min-width: 60em) 800px, 100vw"
                          />
                          <figcaption className="cs-cap">
                            Summarize: one document, or a group of them across teams and timeframes.
                          </figcaption>
                        </figure>
                      ),
                    },
                    {
                      label: 'Catch up',
                      content: (
                        <figure className="m-0">
                          <ZoomShot
                            src={`${IMG}/skill-catchup.png`}
                            alt="The Catch up skill in the panel, offering key updates, decisions made, open questions, and next steps, with three timeframe chips"
                            width={1760}
                            height={1312}
                            eager
                            sizes="(min-width: 60em) 800px, 100vw"
                          />
                          <figcaption className="cs-cap">
                            Catch up: what changed since you were last here, and what still needs a
                            decision.
                          </figcaption>
                        </figure>
                      ),
                    },
                  ]}
                />
              </div>
            </Block>

            <Block>
              <div className="cs-prose">
                <p>
                  Build a diagram is the only skill that leaves the panel. It asks what kind of
                  diagram you want, takes your prompt, and builds the board in a new tab while the
                  panel shows its progress.
                </p>
              </div>
              <figure className="m-0 mt-6">
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
                  Diagram type first, then the prompt. The status line names each step so the wait is
                  never silent.
                </figcaption>
              </figure>
            </Block>

            <Block>
              <div className="cs-prose">
                <p>
                  I tried a few layouts and landed on a side panel, so you can keep working with
                  your docs while you chat, plus a full page for longer conversations.
                </p>
              </div>
              <div className="mt-6">
                <CompareStage
                  ariaLabel="The shipped expand interaction: side panel versus full page"
                  layers={[
                    {
                      src: `${IMG}/panel-side.png`,
                      alt: 'Lucid AI docked as a side panel beside the homepage document list, offering the four skills',
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
                      caption: 'Expanded: room for longer conversations. One click back to the panel.',
                      width: 2880,
                      height: 1800,
                    },
                  ]}
                />
              </div>
            </Block>
          </Col>
        </Stage>

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
            <Block>
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

            <Block>
              <div className="cs-prose">
                <p>
                  The @mention shipped in both the assistant panel and the regular search bar.
                  Search still takes keywords, but past four words it also gives an AI answer above
                  the results. A sentence gets an answer, a keyword still gets a list.
                </p>
                <p>
                  My manager owned the AI answer and I helped with it. I owned the @mention, the
                  document results, and the jump from that answer into the full Lucid AI chat.
                </p>
              </div>
              <Callouts
                src={`${IMG}/search-ai-answer.png`}
                alt="The search results page, annotated: a resolved mention chip inside the keyword query, an AI answer listing documents with one-line summaries above the results table, and a chat input under the answer that continues into Lucid AI"
                width={2880}
                height={1800}
                items={[
                  {
                    label: 'Mention, in search',
                    text: <>The same resolver as the panel, <strong>inside the keyword bar</strong>.</>,
                    x: 26.5,
                    y: 2,
                    w: 6.5,
                    h: 2.8,
                    /* The pin lands on the chip's left corner, not its middle,
                       so the resolved name stays readable under it. */
                    ax: 26.5,
                    ay: 2,
                  },
                  {
                    label: 'Document results',
                    text: <>One line per document, so a title is <strong>never the only clue</strong>.</>,
                    x: 19,
                    y: 17,
                    w: 77.5,
                    h: 21,
                    ax: 50,
                    ay: 17,
                  },
                  {
                    label: 'Into the chat',
                    text: <>Typing here <strong>opens the full assistant</strong>, carrying the answer with it.</>,
                    x: 19,
                    y: 42.5,
                    w: 78,
                    h: 10,
                    ax: 83.3,
                    ay: 42.5,
                  },
                ]}
              />
            </Block>
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

          <Band tone="accent" className="cs-final cs-final--open">
            <p className="cs-final__word" aria-hidden="true">
              Final designs
            </p>
            <div className="cs-final__stage" style={{ paddingInline: 'var(--cs-pad)' }}>
              <Laptop style={{ '--r': '-1.5deg', '--y': '0' } as React.CSSProperties}>
                <Image
                  src={`${IMG}/panel-side.png`}
                  alt="Lucid AI docked as a side panel beside the homepage document list, offering Find docs, Summarize, Build a diagram, and Catch up"
                  fill
                  sizes="(min-width: 40em) 50vw, 100vw"
                />
              </Laptop>
              <Laptop style={{ '--r': '1.5deg', '--y': '0' } as React.CSSProperties}>
                <Image
                  src={`${IMG}/panel-full.png`}
                  alt="Lucid AI expanded to a full page over the homepage, asking what are you looking for today above the four skills"
                  fill
                  sizes="(min-width: 40em) 50vw, 100vw"
                />
              </Laptop>
            </div>
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
                the full page, tracking which skills did best, so real behavior could guide the
                next version.
              </p>
              <p>
                I handed off the panel and full page, the results component, the four skills, the
                failure states, the A/B test, and designs for memory controls and chat history.
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
