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
import FailureTabs from '@/components/lucid/FailureTabs'
import ZoomShot from '@/components/lucid/ZoomShot'
import BigStats from '@/components/cs/BigStats'
import Journey from '@/components/cs/Journey'
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
const MOCK = `${IMG}/mock`

/* Names as shipped. Descriptions are the design file's own one-liners. */
const SKILLS: { name: string; desc: string; icon: string }[] = [
  { name: 'Find docs', desc: 'Locate a doc by topic, person, or what is inside it.', icon: `${MOCK}/intelligent-search-24.svg` },
  { name: 'Summarize', desc: 'Get the gist of a doc or a group of them.', icon: `${MOCK}/summarize-24.svg` },
  { name: 'Build a diagram', desc: 'Create flowcharts and visual layouts from a text prompt.', icon: `${MOCK}/diagram-shapes-24.svg` },
  { name: 'Catch up', desc: 'See what changed recently or what you missed.', icon: `${MOCK}/clock-24.svg` },
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
                { label: 'Tools', value: 'Figma, Lucid, Claude Code', icon: 'tool' },
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

        {/* ══ Hero band: the live Find docs loop, behind a laptop's glass ══ */}
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
                { value: 4, caption: <><strong>core skills</strong> shipped: find, summarize, build, catch up</> },
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
            notes={[
              'the pricing one with the big comparison table, finance made it I think',
              'our onboarding flowchart, the one with all the red decision diamonds',
              'the offsite retro from spring, three columns of sticky notes',
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
                  gy: 1,
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
                  gy: 1,
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
                  gy: 61.5,
                  ax: 83.3,
                  ay: 61.5,
                },
              ]}
            />
          </Block>

          <Block>
            <H3 dim="one new entry point, beside search">Before and after</H3>
            <div className="mt-6">
              <CompareStage
                ariaLabel="Before and after: the old homepage versus the same homepage with the Lucid AI entry point beside search"
                layers={[
                  {
                    src: `${IMG}/home-before.png`,
                    alt: 'The old Lucid homepage: a search bar that only matches keywords against document titles, with nothing beside it',
                    label: 'Before',
                    caption: 'The old homepage. Search matched keywords in titles and nothing else.',
                    width: 2880,
                    height: 1800,
                  },
                  {
                    src: `${IMG}/home-entry.png`,
                    alt: 'The same homepage with one addition: a Lucid AI sparkle button beside the search bar',
                    label: 'After',
                    caption:
                      'One addition to the homepage: the Lucid AI entry point beside search, in the spot that was empty. Everything else stays where people expect it.',
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
                to four core skills: Find docs, Summarize, Build a diagram, and Catch up.
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.icon} alt="" />
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
            }
          >
            <p>
              Find docs is the skill the whole project started from. Instead of a keyword that has
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
                    gy: 41,
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
                    gy: 20,
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
                    gy: 57.7,
                    ax: 57,
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
              <figure className="m-0">
                <div className="cs-fig__frame">
                  <div className="lcs-mentionfig">
                    <div className="lcs-mentionfig__stage">
                      <Image
                        className="lcs-mentionfig__typing"
                        src={`${IMG}/mention/typing.png`}
                        alt="The search bar mid-mention: Find the 1 on 1 board, then an at sign and the first letters of a name"
                        width={1440}
                        height={96}
                        sizes="(min-width: 60em) 460px, 90vw"
                      />
                      <Image
                        className="lcs-mentionfig__menu"
                        src={`${IMG}/mention/menu.png`}
                        alt="The collaborator menu under the mention: people with their handle and email, and teams below them"
                        width={981}
                        height={981}
                        sizes="(min-width: 60em) 345px, 65vw"
                      />
                      <Image
                        className="lcs-mentionfig__person"
                        src={`${IMG}/mention/person.png`}
                        alt="The same query with the person resolved into a chip inside the search bar"
                        width={1440}
                        height={96}
                        sizes="(min-width: 60em) 460px, 90vw"
                      />
                      <Image
                        className="lcs-mentionfig__team"
                        src={`${IMG}/mention/team.png`}
                        alt="The same query with a team resolved into a chip: Enterprise scrum"
                        width={1440}
                        height={96}
                        sizes="(min-width: 60em) 460px, 90vw"
                      />
                    </div>
                  </div>
                </div>
                <figcaption className="cs-cap">
                  Typing @ opens the collaborator list; choosing someone resolves them into a chip
                  the search can act on. A team resolves the same way.
                </figcaption>
              </figure>
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
            <p>
              The mention tool shipped in <strong>both surfaces</strong>: the assistant panel and
              the keyword search bar.
            </p>
          </Pair>

          <Block>
            <H3 dim="the other half of search">What I owned across both surfaces</H3>
            <div className="cs-prose mt-3">
              <p>
                Search kept its keyword bar. Past four words, it also returns an{' '}
                <strong>AI answer</strong> above the results, so a sentence gets an answer and a
                keyword still gets a list.
              </p>
              <p>
                <strong>My manager owned the design of that AI answer section, and I contributed
                to it.</strong> Across both surfaces I owned the mention tool, the document search
                results, and the interaction that opened the chat from inside the answer and led
                into the full Lucid AI experience.
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
                  gy: 1,
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
                  gy: 12,
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
                  gy: 40,
                  ax: 83.3,
                  ay: 42.5,
                },
              ]}
            />
          </Block>

          <Block>
            <H3 dim="the same panel, two more skills">Beyond search</H3>
            <p className="cs-prose mt-3">
              Summarize and Catch up answer in the same panel as Find docs. Each one opens by
              saying <strong>what it can do</strong> and offering a prompt to start from.
            </p>
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
            <H3 dim="the one skill that leaves the panel">Build a diagram</H3>
            <p className="cs-prose mt-3">
              Build a diagram runs as a conversation. The assistant asks what kind of diagram, takes
              a prompt, and <strong>assembles the board in its own tab</strong> while the panel
              reports progress.
            </p>
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

        {/* ══ Final designs band ══ */}
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
                'Four core skills: Find docs, Summarize, Build a diagram, Catch up',
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
