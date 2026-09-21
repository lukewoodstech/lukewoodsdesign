import type { Metadata } from 'next'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import AwardcoMobileTile from '@/components/AwardcoMobileTile'
import PatternTile from '@/components/PatternTile'
import Reveal from '@/components/lucid/Reveal'
import CompareStage from '@/components/lucid/CompareStage'
import ShipTimeline from '@/components/lucid/ShipTimeline'
import HeroMock from '@/components/cs/HeroMock'
import BoardGenClip from '@/components/lucid/BoardGenClip'
import FailureTabs from '@/components/lucid/FailureTabs'
import ZoomShot from '@/components/lucid/ZoomShot'
import BigStats from '@/components/cs/BigStats'
import Journey from '@/components/cs/Journey'
import JourneyChart from '@/components/cs/JourneyChart'
import Callouts from '@/components/cs/Callouts'
import Laptop from '@/components/cs/Laptop'
import {
  Act,
  Band,
  Block,
  Checklist,
  Col,
  GhostCard,
  H3,
  Ico,
  KeyQuestion,
  MetaGrid,
  MonoLabel,
  Notes,
  Pair,
  People,
  Pill,
  Problem,
  StoryTitle,
  SuccessCard,
  Two,
} from '@/components/cs/Story'
import { SITE } from '@/lib/site'

/*
 * Custom-built case study — this static route intentionally shadows the
 * generic /work/[slug] template. The tile on the home grid still reads from
 * lib/caseStudies.ts; everything below is bespoke to the Lucid story.
 *
 * Story edition (2026-09-21): the page now runs the five-act structure —
 * title block, hero band, the problem, the impact, the journey, then the
 * acts — on the shared `components/cs` primitives. Copy is Luke's (rewrite
 * of 2026-09-14), reordered into acts and with key phrases bolded; nothing
 * has been added to the facts. Rules that still bind: shipped work only,
 * no internal project or team names, no colleague names, no long-term
 * adoption numbers (the internship ended shortly after GA), no interview
 * count, no invented user quotes — the note cards in Act 01 are labelled
 * illustrative. Captures from the design file predate the release and
 * carry the skill's earlier label, "Build a diagram"; captions say so
 * rather than the artifacts being altered.
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
const MOCK = `${IMG}/mock`

/* Names as shipped. Descriptions are the design file's own one-liners. */
const SKILLS: { name: string; desc: string; icon?: string }[] = [
  { name: 'Find Docs', desc: 'Locate a doc by topic, person, or what is inside it.', icon: `${MOCK}/intelligent-search-24.svg` },
  { name: 'Summarize', desc: 'Get the gist of a doc or a group of them.', icon: `${MOCK}/summarize-24.svg` },
  { name: 'Generate a New Board', desc: 'Create flowcharts and visual layouts from a text prompt.', icon: `${MOCK}/diagram-shapes-24.svg` },
  { name: 'Catch Up', desc: 'See what changed recently or what you missed.' },
]

export default function LucidCaseStudy() {
  return (
    <div className="cs lcs cs-surface cs-story min-h-screen text-white">
      <SiteNav
        next={{ href: '/work/awardco-login-flow-redesign', title: 'Reducing Authentication Friction' }}
      />

      <div className="sitenav-offset pb-24">
        {/* ══ Title block ══ */}
        <Col>
          <header className="pt-10">
            <p className="cs-eyebrow mb-5">Lucid · Product Design Internship</p>
            <StoryTitle dim="to the homepage">Bringing Lucid AI</StoryTitle>
            <MetaGrid
              summary={
                <>
                  <p>
                    An AI assistant that helps users <strong>find, understand, and create work</strong>{' '}
                    from the Lucid homepage.
                  </p>
                  <p>
                    I designed an assistant that allowed users to search for documents using{' '}
                    <strong>whatever details they could remember</strong>, not just the document
                    title. Within the same experience, I designed high-value AI skills for
                    summarizing documents, synthesizing information across multiple documents,
                    and generating new documents.
                  </p>
                </>
              }
              facts={[
                { label: 'Role', value: 'Product Design Intern', icon: 'user' },
                { label: 'Team', value: 'Two scrum teams, Search and AI', icon: 'users' },
                { label: 'Timeline', value: 'May to August 2026', icon: 'clock' },
                { label: 'Tools', value: 'Figma, Lucid', icon: 'tool' },
                {
                  label: 'Released',
                  value: 'General availability, August 5, every Lucid tier',
                  icon: 'flag',
                  span: true,
                },
                {
                  label: 'Skills used',
                  value:
                    'Discovery interviews, rapid prototyping, interaction design, failure-state design, internal testing, A/B test design, engineering handoff',
                  icon: 'sparkle',
                  span: true,
                },
              ]}
            />
          </header>
        </Col>

        {/* ══ Hero band: the live Find Docs loop, behind a laptop's glass ══ */}
        <Band tone="accent" crop className="cs-hero-band">
          <Laptop>
            {/* Opens on the design file's zero state — a designed frame at
                rest — then types the query and resolves the results. */}
            <HeroMock />
          </Laptop>
        </Band>

        {/* ══ The problem ══ */}
        <Band dust>
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
                { value: 4, caption: <><strong>core skills</strong> shipped, from 20+ prototyped</> },
                { value: 20, suffix: '+', caption: <>capabilities prototyped and tested before the cut</> },
                { value: 'All', caption: <>Lucid tiers at release, <strong>free through enterprise</strong></> },
              ]}
            />
          </Block>
        </Col>

        {/* ══ The journey ══ */}
        <Col>
          <Block className="cs-centered">
            <Pill>The journey</Pill>
            <Journey stops={['Discover', 'Scope', 'Prototype', 'Release', 'Handoff']} />
          </Block>
        </Col>

        {/* ══ Act 01 · Discover ══ */}
        <Col>
          <Act phase="Discover" num="01" title="People remembered the document, not its title">
            <div className="cs-prose">
              <p>
                When I joined Lucid, finding documents created a lot of friction, especially for{' '}
                <strong>enterprise users who belonged to multiple teams</strong> and had years of
                document history.
              </p>
              <p>
                The existing search relied on <strong>keywords from document titles</strong>. If
                someone could not remember the title, finding the right document became
                difficult. Their alternatives were to scroll endlessly through recent documents or
                use advanced filters that many users found confusing and cumbersome.
              </p>
            </div>
          </Act>

          <Notes
            label="What people could remember instead of a title. Illustrative, not quotes."
            stickers={[
              { src: `${MOCK}/lucidchart-doc.svg` },
              { src: `${MOCK}/lucidspark-doc.svg` },
              { text: '@' },
            ]}
            notes={[
              'the board with the pricing tiers on it',
              'the flowchart a teammate shared in May',
              'the retro notes from the last offsite',
            ]}
          />
        </Col>

        <Band dust>
          <Col>
            <KeyQuestion>
              How might we let people find a document by <u>whatever they remember</u> about it?
            </KeyQuestion>
          </Col>
        </Band>

        <Col>
          <Block>
            <div className="cs-prose">
              <p>
                I started scheduling discovery calls as quickly as possible so I could better
                understand the problem. Across conversations with users from around the world, I
                noticed a consistent pattern: people often remembered{' '}
                <strong>what a document was about</strong> or specific content inside it, but they
                rarely remembered its exact title.
              </p>
              <p>
                This created two problems. Users could not translate what they remembered into a
                keyword search, and <strong>document titles alone did not give them enough
                information</strong> to confidently identify the correct result.
              </p>
            </div>
          </Block>

          <Block>
            <SuccessCard>
              Success meant someone <strong>recognizing the right document from what they
              remembered</strong>, without ever knowing its title.
            </SuccessCard>
          </Block>

          <Block>
            <H3 dim="three kinds of homepage visitor">Who it was for</H3>
            <People
              items={[
                {
                  icon: 'building',
                  title: 'The enterprise user',
                  text: 'Belongs to multiple teams, with years of document history to search through.',
                },
                {
                  icon: 'users',
                  title: 'The manager',
                  text: 'Wanted a faster way to understand what their team was working on.',
                },
                {
                  icon: 'chart',
                  title: 'The product leader',
                  text: 'Wanted visibility across the organization and quick summaries of roadmaps and planning documents.',
                },
              ]}
            />
          </Block>

          <Block>
            <H3 dim="one document, four dead ends">The old search</H3>
            <JourneyChart
              label="How finding a document went before Lucid AI: remembering, searching, scrolling, giving up"
              stages={[
                {
                  title: 'Remembering',
                  text: 'Knows what the document was about, or who worked on it, but not what it was called.',
                  y: 9,
                },
                {
                  title: 'Searching',
                  text: 'Types a guess at the title. Search matches keywords in titles and nothing else.',
                  y: 15,
                },
                {
                  title: 'Scrolling',
                  text: 'Falls back to the recent documents list, or to advanced filters many found confusing.',
                  y: 24,
                },
                {
                  title: 'Giving up',
                  text: 'Years of history across several teams. The scroll never ends and the document stays lost.',
                  y: 34,
                },
              ]}
            />
          </Block>
        </Col>

        {/* ══ Act 02 · Define ══ */}
        <Col>
          <Act phase="Define" num="02" title="Lucid AI could help before users opened a document">
            <div className="cs-prose">
              <p>
                Lucid AI already allowed users to generate diagrams and flowcharts inside a
                document, but <strong>none of that natural-language functionality existed on the
                homepage</strong>. We saw an opportunity to bring Lucid AI into this part of the
                product, helping users find existing work and accomplish more before opening a
                document.
              </p>
            </div>
          </Act>

          <Block>
            <H3 dim="the homepage before Lucid AI">The starting point</H3>
            <Callouts
              src={`${IMG}/before-old-search.png`}
              alt="The old Lucid homepage, annotated: a search bar that only matches keywords in titles, nothing beside it, and a long grid of recent documents"
              width={2880}
              height={1800}
              items={[
                {
                  label: 'Title keywords only',
                  text: <>Search matched keywords in <strong>document titles</strong> and nothing else.</>,
                  x: 17,
                  y: 1.5,
                  w: 34,
                  h: 5,
                },
                {
                  label: 'Nothing here yet',
                  text: <>Lucid AI existed <strong>only inside the editor</strong>. The homepage had no natural-language entry point.</>,
                  x: 52.5,
                  y: 1,
                  w: 26,
                  h: 6,
                },
                {
                  label: 'Scroll to find',
                  text: <>Without the title, the fallback was <strong>recent documents</strong>, which run for pages.</>,
                  x: 20,
                  y: 61,
                  w: 78,
                  h: 38,
                  gy: 55,
                },
              ]}
            />
          </Block>

          <Block>
            <H3 dim="the same homepage, with the assistant docked">Before and after</H3>
            <div className="mt-6">
              <CompareStage
                ariaLabel="Before and after: the title-based search versus the Lucid AI assistant on the homepage"
                layers={[
                  {
                    src: `${IMG}/before-old-search.png`,
                    alt: 'The old Lucid homepage: a search bar that only matches keywords against document titles, with no AI entry point',
                    label: 'Before',
                    caption: 'The old homepage. Search matched keywords in titles and nothing else.',
                    width: 2880,
                    height: 1800,
                  },
                  {
                    src: `${IMG}/side-panel-zero.png`,
                    alt: 'The Lucid AI side panel docked beside the homepage document list, offering skill tiles above the chat input',
                    label: 'After',
                    caption:
                      'Lucid AI on the homepage. Describe the document by collaborator, timeframe, or content while the page stays usable. Design-file capture: the third tile here carries the earlier label for Generate a New Board.',
                    width: 2880,
                    height: 1800,
                  },
                ]}
              />
            </div>
          </Block>
        </Col>

        {/* ══ Act 03 · Develop ══ */}
        <Col>
          <Act phase="Develop" num="03" title="Search was only the starting point">
            <div className="cs-prose">
              <p>
                My discovery interviews showed that search was only one of the tasks users
                struggled with from the homepage. Managers wanted a faster way to understand their
                teams&rsquo; work. Product leaders wanted visibility into what was happening across
                their organization and quick summaries of roadmaps and other planning documents.
                More broadly, users wanted the assistant to <strong>help them get started, not only
                find files</strong>.
              </p>
              <p>
                That expanded the scope of the project. We rapidly prototyped and tested{' '}
                <strong>more than 20 potential capabilities</strong> before narrowing the experience
                to four core skills: Find Docs, Summarize, Generate a New Board, and Catch Up.
              </p>
            </div>
          </Act>
        </Col>

        <Band>
          <Col>
            <Reveal>
              <H3 dim="twenty candidates, from the design file">Ideation</H3>
              <div className="cs-paper mt-14">
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

        <Col>
          <Block>
            <H3 dim="what shipped">Four core skills</H3>
            <dl className="cs-defs" aria-label="The four core skills">
              {SKILLS.map((s) => (
                <div key={s.name}>
                  <dt>
                    <MonoLabel>
                      {s.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.icon} alt="" />
                      ) : (
                        <Ico name="clock" />
                      )}
                      {s.name}
                    </MonoLabel>
                  </dt>
                  <dd>{s.desc}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Pair
            num="01"
            task="People could not turn what they remembered into keywords"
            solution="Search by collaborator, timeframe, or what is on the canvas"
            visual={
              <figure className="m-0">
                <div className="cs-fig__frame">
                  <ZoomShot
                    src={`${IMG}/find-docs-flow.png`}
                    alt="The Find Docs skill explaining it can search by collaborators, timeframe, canvas content, and connected project views, with quick view chips"
                    width={2400}
                    height={1600}
                    sizes="(min-width: 60em) 800px, 100vw"
                  />
                </div>
                <figcaption className="cs-cap">
                  Find Docs takes a description instead of a title: who worked on it, roughly when,
                  or what is written on the canvas.
                </figcaption>
              </figure>
            }
          >
            <p>
              Find Docs is the skill the whole project started from. Instead of a keyword that has
              to match the title, it accepts <strong>whatever the person remembers</strong>: a
              collaborator, a timeframe, or the content written on the canvas.
            </p>
          </Pair>

          <Pair
            num="02"
            task="A title alone did not tell people whether a result was the right one"
            solution="A compact result with a one-line AI summary"
            visual={
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
                  },
                  {
                    label: 'AI summary',
                    text: <>One line on <strong>what is inside</strong>, so the title is not the only clue.</>,
                    x: 38,
                    y: 26.5,
                    w: 45.5,
                    h: 4.8,
                    gy: 23,
                  },
                  {
                    label: 'Next step',
                    text: <>Every answer ends with an offer to <strong>narrow or open</strong>.</>,
                    x: 16.5,
                    y: 55.5,
                    w: 40,
                    h: 4.5,
                    gy: 57.7,
                    ax: 56.5,
                    ay: 57.7,
                  },
                ]}
              />
            }
          >
            <p>
              In response, I designed a compact document result with an{' '}
              <strong>AI-generated summary</strong> that explained the contents of each document.
              Hovering over a result revealed additional information, including when the document
              was last modified, who owned it, and which team it belonged to. This gave users enough
              context to recognize the right document and{' '}
              <strong>verify that the assistant had understood their search</strong>.
            </p>
          </Pair>

          <Pair
            num="03"
            task="The assistant guessed wrong when people named a collaborator"
            solution="An @mention that resolves the person before the search runs"
            visual={
              <div>
                <p className="lcs-mention" aria-label="Example query using a resolved mention chip">
                  <span>Boards</span>
                  <span className="lcs-mention__chip">@Sam T.</span>
                  <span>and I worked on in May</span>
                </p>
                <p className="cs-cap">
                  The @mention resolves the person before the search runs, so the assistant never
                  has to guess which Sam you meant.
                </p>
              </div>
            }
          >
            <p>
              Releasing early exposed friction we had not fully anticipated. The assistant
              sometimes guessed incorrectly when users referred to a collaborator. Instead of asking
              the AI to make that assumption, I designed an <strong>@mention interaction</strong>{' '}
              that allowed users to reference a specific team member they had collaborated with on
              a document. This removed ambiguity and gave users more control over the
              assistant&rsquo;s response.
            </p>
          </Pair>

          <Block>
            <H3 dim="summarize, and generate a new board">Beyond search</H3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <figure className="m-0">
                <div className="cs-fig__frame">
                  <ZoomShot
                    src={`${IMG}/summarize-flow.png`}
                    alt="The Summarize skill explaining project syncs, catch-up reports, thematic reviews, and single file deep dives, with cross-file prompt chips"
                    width={2400}
                    height={1600}
                    sizes="(min-width: 60em) 390px, 100vw"
                  />
                </div>
                <figcaption className="cs-cap">
                  Summarize: one document or a group of them. In this capture, catch-up reports
                  still sit under Summarize. Catch Up shipped as its own skill.
                </figcaption>
              </figure>
              <figure className="m-0">
                <div className="cs-fig__frame">
                  <BoardGenClip />
                </div>
                <figcaption className="cs-cap">
                  Generate a New Board, captured live from the product: the board assembles in its
                  own tab while the panel reports progress.
                </figcaption>
              </figure>
            </div>
          </Block>
        </Col>

        {/* ══ Act 04 · Release ══ */}
        <Col>
          <Act phase="Release" num="04" title="Releasing early exposed problems we could not predict">
            <div className="cs-prose">
              <p>
                AI also changed how quickly we could move. By using it throughout prototyping and
                development, we got the assistant in front of <strong>internal users on July 20</strong>{' '}
                and began learning from real usage.
              </p>
            </div>
          </Act>
        </Col>

        <Band dust>
          <Col>
            <Reveal className="cs-centered">
              <div className="cs-spark" aria-hidden="true">
                <Ico name="rocket" />
              </div>
              <p className="cs-release">
                Internal users on <strong>July 20</strong>. General availability on{' '}
                <strong>August 5</strong>, across every Lucid tier.
              </p>
            </Reveal>
            <ShipTimeline />
          </Col>
        </Band>

        <Col>
          <Block>
            <H3 dim="every dead end hands the user a next step">Failure states</H3>
            <p className="cs-prose mt-3">
              Failure states shipped with the release rather than after it.
            </p>
            <div className="mt-6">
              <FailureTabs
                tabs={[
                  {
                    label: 'Out of scope',
                    content: (
                      <figure className="m-0">
                        <ZoomShot
                          src={`${IMG}/out-of-scope.png`}
                          alt="Asked for something it cannot do, the assistant names its limit and offers to find product roadmaps or generate a feature flowchart as buttons, then shows three roadmap results"
                          width={2400}
                          height={1100}
                          eager
                          sizes="(min-width: 60em) 800px, 100vw"
                        />
                        <figcaption className="cs-cap">
                          Asked for something outside its scope, the assistant names the limit and
                          offers two things it can do. This capture predates the compact results
                          component.
                        </figcaption>
                      </figure>
                    ),
                  },
                  {
                    label: 'Working',
                    content: (
                      <figure className="m-0 max-w-[420px]">
                        <ZoomShot
                          src={`${IMG}/working-state.png`}
                          alt="The working state: a spinner labeled generating diagram, under a scanned canvas step, naming what the assistant is doing"
                          width={810}
                          height={1800}
                          eager
                          sizes="420px"
                        />
                        <figcaption className="cs-cap">
                          The working state names each step. It reuses the editor
                          assistant&rsquo;s pattern so the two assistants stay consistent.
                        </figcaption>
                      </figure>
                    ),
                  },
                ]}
              />
            </div>
          </Block>
        </Col>

        {/* ══ Final designs band ══ */}
        <Band tone="accent" className="cs-final">
          <p className="cs-final__word" aria-hidden="true">
            Final designs
          </p>
          <div className="cs-final__stage" style={{ paddingInline: 'var(--cs-pad)' }}>
            <Laptop style={{ '--r': '-5deg', '--y': '6%' } as React.CSSProperties}>
              <Image
                src={`${IMG}/side-panel-zero.png`}
                alt="Lucid AI docked as a side panel beside the homepage document list"
                fill
                sizes="(min-width: 40em) 50vw, 100vw"
              />
            </Laptop>
            <Laptop style={{ '--r': '4deg', '--y': '-4%' } as React.CSSProperties}>
              <Image
                src={`${IMG}/full-page-zero.png`}
                alt="Lucid AI expanded to a full page over the homepage"
                fill
                sizes="(min-width: 40em) 50vw, 100vw"
              />
            </Laptop>
          </div>
        </Band>

        <Col>
          <Block>
            <H3 dim="two layouts, one assistant">Side panel or full page</H3>
            <div className="cs-prose mt-3">
              <p>
                I explored multiple layouts for the assistant. The <strong>side panel</strong>{' '}
                allowed users to continue viewing and interacting with their documents while
                chatting with AI. For people who needed more room for longer conversations, I also
                designed a <strong>full-page state</strong> that was accessible from the panel.
              </p>
            </div>
            <div className="mt-6">
              <CompareStage
                ariaLabel="The shipped expand interaction: side panel versus full page"
                layers={[
                  {
                    src: `${IMG}/side-panel-zero.png`,
                    alt: 'Lucid AI docked as a side panel beside the homepage document list',
                    label: 'Side panel',
                    caption: 'Docked: ask without leaving your documents.',
                    width: 2880,
                    height: 1800,
                  },
                  {
                    src: `${IMG}/full-page-zero.png`,
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

        {/* ══ Act 05 · Handoff ══ */}
        <Col>
          <Act phase="Handoff" num="05" title="The release created a foundation for what came next">
            <div className="cs-prose">
              <p>
                On August 5, we released the experience to <strong>general availability across
                every Lucid tier</strong>. Over the course of my 12-week internship, I helped take
                the project from a blank page through discovery, prototyping, internal testing, and
                an external release.
              </p>
              <p>
                My internship ended shortly after the external release, so I do not have access to
                long-term adoption data. However, I built the foundation for future iterations.
                Before leaving, I also designed and implemented an <strong>A/B test</strong>{' '}
                comparing the side panel and full-page experiences and measuring which capabilities
                performed best. This gave the team a clear way to use real behavior to guide the
                next version.
              </p>
            </div>
          </Act>

          <Block tight>
            <MonoLabel icon="flag">What I handed off</MonoLabel>
            <Checklist
              items={[
                'The side panel and full-page experiences',
                'The results component',
                'Four core skills: Find Docs, Summarize, Generate a New Board, Catch Up',
                'Failure states, shipped with the release',
                'An A/B test comparing the two layouts and the capabilities within them',
                'Designs for memory controls and chat history',
              ]}
            />
          </Block>

          <Block>
            <Two
              items={[
                {
                  label: 'Learnings',
                  icon: 'bulb',
                  body: (
                    <>
                      <p>
                        Every decision on this project involved tradeoffs between{' '}
                        <strong>speed, cost, and usability</strong>. Having enough technical
                        understanding to work through those decisions with engineers expanded what
                        I was able to design.
                      </p>
                      <p>
                        We shipped quickly because <strong>the feedback loop never stopped</strong>.
                        Users saw each round, engineers saw designs within days of their creation,
                        and nothing waited for a big reveal.
                      </p>
                    </>
                  ),
                },
                {
                  label: 'Reflections',
                  icon: 'pen',
                  body: (
                    <p>
                      One limitation remained: the AI inside the editor and the Docs List AI{' '}
                      <strong>could not share context</strong>. Closing that gap was the clear next
                      step. Before leaving, I handed off designs for memory controls and chat
                      history so the team could continue building toward it.
                    </p>
                  ),
                },
              ]}
            />
          </Block>

          <Reveal>
            <GhostCard
              word="What next?"
              title="What would come next?"
              items={[
                <>
                  <strong>Shared context</strong> between the editor assistant and the homepage
                  assistant
                </>,
                <>
                  <strong>Memory controls and chat history</strong>, from the designs handed off
                  before I left
                </>,
                <>
                  Reading the <strong>A/B test</strong> to choose between the side panel and the
                  full page, and to see which skills people reach for
                </>,
              ]}
            />
          </Reveal>
        </Col>

        {/* ══ Read next ══ */}
        <Col>
          <Block>
            <span className="cs-eyebrow">More work</span>
            <h2 className="cs-headline">Read next</h2>
            <div className="cs-next">
              <AwardcoMobileTile />
              <PatternTile />
            </div>
          </Block>
        </Col>
      </div>

      <Footer width="article" />
    </div>
  )
}
