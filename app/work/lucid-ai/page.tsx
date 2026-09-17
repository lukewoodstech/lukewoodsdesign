import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import AwardcoMobileTile from '@/components/AwardcoMobileTile'
import PatternTile from '@/components/PatternTile'
import Reveal from '@/components/lucid/Reveal'
import CompareStage from '@/components/lucid/CompareStage'
import ShipTimeline from '@/components/lucid/ShipTimeline'
import SearchMock from '@/components/lucid/SearchMock'
import BoardGenClip from '@/components/lucid/BoardGenClip'
import FailureTabs from '@/components/lucid/FailureTabs'
import ZoomShot from '@/components/lucid/ZoomShot'
import ImpactStats from '@/components/lucid/ImpactStats'
import { Section, FactStrip } from '@/components/CaseStudy'
import { SITE } from '@/lib/site'

/*
 * Custom-built case study — this static route intentionally shadows the
 * generic /work/[slug] template. The tile on the home grid still reads from
 * lib/caseStudies.ts; everything below is bespoke to the Lucid story.
 *
 * Copy is Luke's (rewrite of 2026-09-14). Rules that still bind: shipped
 * work only, no internal project or team names, no colleague names, no
 * long-term adoption numbers (the internship ended shortly after GA), no
 * interview count (no single source of truth), honest credit split on the
 * search-bar summary. Captures from the design file predate the release and
 * carry the skill's earlier label, "Build a diagram"; captions say so rather
 * than the artifacts being altered.
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

/* Names as shipped. Descriptions are the design file's own one-liners. */
const SKILLS: [string, string][] = [
  ['Find Docs', 'Locate a doc by topic, person, or what is inside it.'],
  ['Summarize', 'Get the gist of a doc or a group of them.'],
  ['Generate a New Board', 'Create flowcharts and visual layouts from a text prompt.'],
  ['Catch Up', 'See what changed recently or what you missed.'],
]

export default function LucidCaseStudy() {
  return (
    <div className="cs lcs min-h-screen bg-black text-white">
      <SiteNav
        width="article"
        contact={false}
        next={{ href: '/work/awardco-login-flow-redesign', title: 'Reducing Authentication Friction' }}
      />

      <div className="max-w-[860px] mx-auto px-8 pb-32 sitenav-offset">
        {/* ── Hero ── */}
        <header className="pt-10 pb-12">
          <p className="cs-eyebrow mb-4">Lucid · Product Design Internship</p>
          <h1 className="cs-title">
            {TITLE}
          </h1>
          <p className="cs-lede">
            An AI assistant that helps users find, understand, and create work from the
            Lucid homepage.
          </p>

          <FactStrip
            facts={[
              ['Role', 'Product Design Intern'],
              ['Timeline', 'May to August 2026'],
              ['Team', 'Two scrum teams, Search and AI'],
              ['Released', 'General availability, August 5, every Lucid tier'],
            ]}
          />

          <ImpactStats
            eyebrow="At a glance"
            stats={[
              { value: 12, label: 'weeks from a blank page to general availability' },
              { value: 4, label: 'core skills: Find Docs, Summarize, Generate a New Board, Catch Up' },
              { value: 20, suffix: '+', label: 'capabilities prototyped and tested before the cut to four' },
              { value: 'All', label: 'Lucid tiers at release, free through enterprise' },
            ]}
          />
        </header>

        <Reveal as="figure" className="m-0">
          <SearchMock width="100%" height={560} />
          <figcaption className="cs-cap">
            The Find Docs loop, rebuilt in code from our design file rather than
            screenshotted. The documents are the file&rsquo;s demo data.
          </figcaption>
        </Reveal>

        <Reveal className="mt-12">
          <p className="cs-prose cs-prose--intro">
            I designed an AI assistant for Lucid&rsquo;s homepage that allowed users to
            search for documents using whatever details they could remember, not just
            the document title. Within the same experience, I designed high-value AI
            skills for summarizing documents, synthesizing information across multiple
            documents, and generating new documents.
          </p>
        </Reveal>

        {/* ── The problem ── */}
        <Section eyebrow="Before" headline="The problem">
          <div className="cs-prose">
            <p>
              When I joined Lucid, finding documents created a lot of friction,
              especially for enterprise users who belonged to multiple teams and had
              years of document history.
            </p>
            <p>
              The existing search relied on keywords from document titles. If someone
              could not remember the title, finding the right document became
              difficult. Their alternatives were to scroll endlessly through recent
              documents or use advanced filters that many users found confusing and
              cumbersome.
            </p>
          </div>
        </Section>

        {/* ── The opportunity ── */}
        <Section eyebrow="Why now" headline="The opportunity">
          <div className="cs-prose">
            <p>
              Lucid AI already allowed users to generate diagrams and flowcharts inside
              a document, but none of that natural-language functionality existed on
              the homepage. We saw an opportunity to bring Lucid AI into this part of
              the product, helping users find existing work and accomplish more before
              opening a document.
            </p>
          </div>
          <div className="mt-8">
            <CompareStage
              ariaLabel="Before and after: the title-based search versus the Lucid AI assistant on the homepage"
              layers={[
                {
                  src: `${IMG}/before-old-search.png`,
                  alt: 'The old Lucid homepage: a search bar that only matches keywords against document titles, with no AI entry point',
                  label: 'Before',
                  caption:
                    'The old homepage. Search matched keywords in titles and nothing else.',
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
        </Section>

        {/* ── Discovery ── */}
        <Section eyebrow="Discovery" headline="People remembered the document, not its title">
          <div className="cs-prose">
            <p>
              I started scheduling discovery calls as quickly as possible so I could
              better understand the problem. Across conversations with users from
              around the world, I noticed a consistent pattern: people often remembered
              what a document was about or specific content inside it, but they rarely
              remembered its exact title.
            </p>
            <p>
              This created two problems. Users could not translate what they remembered
              into a keyword search, and document titles alone did not give them enough
              information to confidently identify the correct result.
            </p>
            <p>
              In response, I designed a compact document result with an AI-generated
              summary that explained the contents of each document. Hovering over a
              result revealed additional information, including when the document was
              last modified, who owned it, and which team it belonged to. This gave
              users enough context to recognize the right document and verify that the
              assistant had understood their search.
            </p>
          </div>
          <Reveal as="figure" className="my-12 m-0">
            <ZoomShot
              src={`${IMG}/results-final-16px.png`}
              alt="The shipped document results: seven compact document chips, each followed by a one-line AI-generated summary, ranked strongest match first"
              width={2400}
              height={1312}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              The shipped results component: a document chip with a one-line AI summary,
              up to seven in view. Hovering a result showed last modified, owner, and
              team.
            </figcaption>
          </Reveal>
        </Section>

        {/* ── Scope ── */}
        <Section eyebrow="Scope" headline="Search was only the starting point">
          <div className="cs-prose">
            <p>
              My discovery interviews showed that search was only one of the tasks
              users struggled with from the homepage. Managers wanted a faster way to
              understand their teams&rsquo; work. Product leaders wanted visibility into
              what was happening across their organization and quick summaries of
              roadmaps and other planning documents. More broadly, users wanted the
              assistant to help them get started, not only find files.
            </p>
            <p>
              That expanded the scope of the project. We rapidly prototyped and tested
              more than 20 potential capabilities before narrowing the experience to
              four core skills: Find Docs, Summarize, Generate a New Board, and Catch
              Up.
            </p>
          </div>

          <Reveal as="figure" className="my-12 m-0">
            <ZoomShot
              src={`${IMG}/skills-ideation.png`}
              alt="An ideation grid of twenty candidate capabilities for the homepage assistant, including Find docs, Summarize, Catch up, Build a diagram, dormant files, and project status"
              width={1680}
              height={1956}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              Twenty of the candidate capabilities, from the design file, before the
              cut to four.
            </figcaption>
          </Reveal>

          <dl className="lcs-skills" aria-label="The four core skills">
            {SKILLS.map(([name, desc]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{desc}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <figure className="m-0">
              <ZoomShot
                src={`${IMG}/find-docs-flow.png`}
                alt="The Find Docs skill explaining it can search by collaborators, timeframe, canvas content, and connected project views, with quick view chips"
                width={2400}
                height={1600}
                sizes="(min-width: 860px) 430px, 100vw"
              />
              <figcaption className="cs-cap">
                Find Docs: search by collaborator, timeframe, or what is written on the
                canvas.
              </figcaption>
            </figure>
            <figure className="m-0">
              <ZoomShot
                src={`${IMG}/summarize-flow.png`}
                alt="The Summarize skill explaining project syncs, catch-up reports, thematic reviews, and single file deep dives, with cross-file prompt chips"
                width={2400}
                height={1600}
                sizes="(min-width: 860px) 430px, 100vw"
              />
              <figcaption className="cs-cap">
                Summarize: one document or a group of them. In this capture, catch-up
                reports still sit under Summarize. Catch Up shipped as its own skill.
              </figcaption>
            </figure>
          </div>

          <Reveal as="figure" className="my-12 m-0">
            <BoardGenClip />
            <figcaption className="cs-cap">
              Generate a New Board, captured live from the product: the board assembles
              in its own tab while the panel reports progress.
            </figcaption>
          </Reveal>
        </Section>

        {/* ── Release ── */}
        <Section eyebrow="Release" headline="Releasing early exposed problems we could not predict">
          <div className="cs-prose">
            <p>
              AI also changed how quickly we could move. By using it throughout
              prototyping and development, we got the assistant in front of internal
              users on July 20 and began learning from real usage.
            </p>
            <p>
              That early release exposed friction we had not fully anticipated. For
              example, the assistant sometimes guessed incorrectly when users referred
              to a collaborator. Instead of asking the AI to make that assumption, I
              designed an @mention interaction that allowed users to reference a
              specific team member they had collaborated with on a document. This
              removed ambiguity and gave users more control over the assistant&rsquo;s
              response.
            </p>
          </div>
          <p className="lcs-mention mt-6" aria-label="Example query using a resolved mention chip">
            <span>Boards</span>
            <span className="lcs-mention__chip">@Sam T.</span>
            <span>and I worked on in May</span>
          </p>
          <p className="cs-cap">
            The @mention resolves the person before the search runs, so the assistant
            never has to guess which Sam you meant.
          </p>

          <div className="mt-12">
            <p className="cs-cap mb-5">
              Failure states shipped with the release. Every dead end hands the user a
              next step.
            </p>
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
                        sizes="(min-width: 860px) 860px, 100vw"
                      />
                      <figcaption className="cs-cap">
                        Asked for something outside its scope, the assistant names the
                        limit and offers two things it can do. This capture predates the
                        compact results component.
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

          <div className="cs-prose mt-12">
            <p>
              On August 5, we released the experience to general availability across
              every Lucid tier. Over the course of my 12-week internship, I helped take
              the project from a blank page through discovery, prototyping, internal
              testing, and an external release.
            </p>
          </div>
          <ShipTimeline />
        </Section>

        {/* ── Impact ── */}
        <Section eyebrow="Impact" headline="Impact and what came next">
          <div className="cs-prose">
            <p>
              My internship ended shortly after the external release, so I do not have
              access to long-term adoption data. However, I built the foundation for
              future iterations, including the side panel and full-page experiences,
              results component, core skills, and failure states.
            </p>
            <p>
              I explored multiple layouts for the assistant. The side panel allowed
              users to continue viewing and interacting with their documents while
              chatting with AI. For people who needed more room for longer
              conversations, I also designed a full-page state that was accessible from
              the panel.
            </p>
          </div>
          <div className="mt-8">
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
          <div className="cs-prose mt-8">
            <p>
              Before leaving, I also designed and implemented an A/B test comparing the
              side panel and full-page experiences and measuring which capabilities
              performed best. This gave the team a clear way to use real behavior to
              guide the next version.
            </p>
          </div>
        </Section>

        {/* ── Reflection ── */}
        <Section eyebrow="Looking back" headline="Reflection">
          <div className="cs-prose">
            <p>
              Every decision on this project involved tradeoffs between speed, cost, and
              usability. Having enough technical understanding to work through those
              decisions with engineers expanded what I was able to design.
            </p>
            <p>
              We shipped quickly because the feedback loop never stopped. Users saw
              each round, engineers saw designs within days of their creation, and
              nothing waited for a big reveal.
            </p>
            <p>
              One limitation remained: the AI inside the editor and the Docs List AI
              could not share context. Closing that gap was the clear next step. Before
              leaving, I handed off designs for memory controls and chat history so the
              team could continue building toward it.
            </p>
          </div>
        </Section>

        {/* ── Read next ── */}
        <Section eyebrow="More work" headline="Read next">
          <div className="cs-next">
            <AwardcoMobileTile />
            <PatternTile />
          </div>
        </Section>
      </div>

      <Footer width="article" />
    </div>
  )
}
