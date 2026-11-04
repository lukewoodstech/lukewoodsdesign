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
                  Lucid AI is an assistant on the Lucid homepage that helps people find,
                  understand, and create work. I designed it so users could search for a
                  document with whatever details they remembered, not just its title. In the
                  same experience, I designed AI skills for summarizing documents, synthesizing
                  information across multiple documents, and generating new ones. It went to
                  general availability on August 5, for every Lucid tier.
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
                When I joined Lucid, finding documents took a lot of work, especially for
                enterprise users who belonged to multiple teams and had years of document history.
              </p>
              <p>
                Search only matched keywords in document titles. If you couldn&rsquo;t remember the
                title, your options were to scroll through pages of recent documents or use
                advanced filters that many users found confusing.
              </p>
              <p>
                I started scheduling discovery calls as quickly as I could. Across conversations
                with users from around the world, the same pattern kept coming up: people
                remembered what a document was about, or something inside it, but rarely its exact
                title. That caused two problems. They couldn&rsquo;t turn what they remembered into a
                keyword search, and a title alone didn&rsquo;t tell them enough to be sure they had
                the right document.
              </p>
              <p>
                So success meant someone recognizing the right document from what they remembered,
                without ever knowing its title.
              </p>
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
              Lucid AI could already generate diagrams and flowcharts inside a document, but none of
              that natural-language help existed on the homepage. We saw a chance to bring Lucid AI
              there, so people could find existing work and get more done before opening a
              document.
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
                  I started with where people already went when they needed something. On the
                  homepage that was the search bar, so the entry point belonged right beside it:
                  close enough to read as a smarter way to find work, separate enough that keyword
                  search kept working the way people knew.
                </p>
                <p>
                  The space next to the bar was already empty, so adding Lucid AI moved nothing
                  else. Navigation, templates and recent documents all stayed where people expected
                  them.
                </p>
                <p>
                  The result was <strong>one new button and nothing to relearn</strong>. People
                  meet Lucid AI at the moment they are already looking for something, which is
                  exactly where its first skill, Find Docs, does its work.
                </p>
              </div>
              <Callouts
                src={`${IMG}/home-entry.png`}
                alt="The Lucid homepage with one addition: a Lucid AI sparkle button in the empty space beside the search bar"
                width={2880}
                height={1800}
                items={[
                  {
                    label: 'Lucid AI',
                    text: <>The new entry point, in the <strong>empty space beside search</strong>.</>,
                    x: 50.6,
                    y: 1.4,
                    w: 2.8,
                    h: 4.4,
                    ax: 51.95,
                    ay: 1.4,
                  },
                ]}
              />
            </Block>
          </Col>
        </Stage>

        <Stage
          id="narrowing"
          title="Narrowing to four skills"
          body={
            <>
              <p>
                The discovery calls showed that search was only one of the things people struggled
                with on the homepage. Managers wanted a faster way to understand their teams&rsquo;
                work. Product leaders wanted visibility across their organization and quick
                summaries of roadmaps and other planning documents. More broadly, people wanted the
                assistant to help them get started, not only find files.
              </p>
              <p>
                That widened the project. We rapidly prototyped and tested more than 20 possible
                capabilities, then narrowed them to four core skills. Find docs locates a doc by
                topic, person, or what is inside it. Summarize gives the gist of a doc or a group of
                them. Build a diagram creates flowcharts and visual layouts from a text prompt. Catch
                up shows what changed recently or what you missed.
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
              Find docs is the skill the whole project started from. Instead of a keyword that has
              to match the title, it takes whatever you remember: a collaborator, a timeframe, or
              what is written on the canvas.
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
                  A title alone still didn&rsquo;t tell people whether a result was the right one. So
                  I designed a compact document result with an AI-generated summary of what is
                  inside. Hovering a result shows when it was last modified, who owns it, and which
                  team it belongs to. That gave people enough context to recognize the right
                  document and check that the assistant had understood their search.
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
                  Summarize and Catch up answer in the same panel as Find docs. Each one opens by
                  saying what it can do and offering a prompt to start from.
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
                  Build a diagram is the one skill that leaves the panel. It runs as a conversation:
                  the assistant asks what kind of diagram you want, takes a prompt, and assembles the
                  board in its own tab while the panel reports progress.
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
                  I explored several layouts for the assistant. The side panel lets people keep
                  viewing and working with their documents while they chat. For longer
                  conversations that need more room, I also designed a full-page state you can open
                  from the panel.
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
                Find docs let people search by who they worked with, but testing with external
                users showed a gap we hadn&rsquo;t fully expected. When someone typed a name, the
                assistant sometimes guessed the wrong person.
              </p>
              <p>
                Instead of asking the AI to make that guess, I designed an @mention that lets you
                pick the exact teammate or team. That removed the ambiguity and gave people more
                control over the answer.
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
                  The mention tool shipped in both surfaces: the assistant panel and the keyword
                  search bar. Search kept its keyword bar, and past four words it also returns an AI
                  answer above the results, so a sentence gets an answer and a keyword still gets a
                  list.
                </p>
                <p>
                  My manager owned the design of that AI answer section, and I contributed to it.
                  Across both surfaces I owned the mention tool, the document search results, and
                  the interaction that opens the chat from inside the answer and leads into the full
                  Lucid AI experience.
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
              On August 5 we released the experience to general availability across every Lucid
              tier, free through enterprise. Over my 12-week internship, I helped take the project
              from a blank page through discovery, prototyping, testing with external users, and
              release.
            </p>
          }
        >
          <Band dust>
            <Col>
              <ShipTimeline />
            </Col>
          </Band>

          <Band tone="accent" className="cs-final">
            <p className="cs-final__word" aria-hidden="true">
              Final designs
            </p>
            <div className="cs-final__stage" style={{ paddingInline: 'var(--cs-pad)' }}>
              <Laptop style={{ '--r': '-2deg', '--y': '0' } as React.CSSProperties}>
                <Image
                  src={`${IMG}/panel-side.png`}
                  alt="Lucid AI docked as a side panel beside the homepage document list, offering Find docs, Summarize, Build a diagram, and Catch up"
                  fill
                  sizes="(min-width: 40em) 50vw, 100vw"
                />
              </Laptop>
              <Laptop style={{ '--r': '2deg', '--y': '0' } as React.CSSProperties}>
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
                My internship ended shortly after the release, so I don&rsquo;t have long-term
                adoption data. Before I left, I designed and implemented an A/B test comparing the
                side panel and the full page and measuring which capabilities performed best, so
                the team could use real behavior to guide the next version.
              </p>
              <p>
                I handed off the side panel and full-page experiences, the results component, the
                four core skills, the failure states that shipped with the release, that A/B test,
                and designs for memory controls and chat history.
              </p>
              <p>
                One limitation remained: the AI inside the editor and the Docs List AI
                couldn&rsquo;t share context. Closing that gap was the clear next step, and the
                memory and chat history designs were there so the team could keep building toward
                it.
              </p>
              <p>
                Every decision on this project was a tradeoff between speed, cost, and usability.
                Knowing enough about the technical side to work through those with engineers
                expanded what I could design. We shipped quickly because the feedback loop never
                stopped. Users saw each round, engineers saw designs within days, and nothing waited
                for a big reveal.
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
