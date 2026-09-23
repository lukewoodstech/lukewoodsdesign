import type { Metadata } from 'next'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import BeforeAfterHero from '@/components/BeforeAfterHero'
import AwardcoMobileTile from '@/components/AwardcoMobileTile'
import LucidTile from '@/components/LucidTile'
import Reveal from '@/components/lucid/Reveal'
import CompareStage from '@/components/lucid/CompareStage'
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
 * Custom-built case study: this static route intentionally shadows the
 * generic /work/[slug] template, the same way app/work/lucid-ai and
 * app/work/awardco-login-flow-redesign do. The home-grid tile still reads
 * from lib/caseStudies.ts; everything below is bespoke to the Pattern story.
 *
 * Story edition (2026-09-21): the five-act structure on the shared
 * `components/cs` primitives. Copy is Luke's (rewrite of 2026-09-16),
 * re-cut into acts with key phrases bolded; no facts added. Sourced from
 * the 2026-08 interview record in case-studies/pattern/ (notes.md "FINAL
 * BUILD DECISIONS" is binding):
 * - Canonical numbers only: Pendo ~60% trial / ~15% return, 50+ discovery
 *   interviews across the internship, 20 usability sessions, 2 → 5 metrics,
 *   9 weeks. No "400+ hours per week", no adoption / retention / revenue /
 *   time-saved claims.
 * - The team built and shipped the redesign AFTER the internship: outcomes
 *   are "validated through usability testing and shipped after my internship".
 * - Filter override behavior is unverified, so filters are described only as
 *   clearer and editable after creation.
 * - Deliberately not rendered (assets stay in the repo): discovery-board,
 *   old-edit-mode, modal-scenario, the Will/Trista personas, the
 *   design/code/business strip, the Luke AI prompts.
 */

const TITLE = 'Custom Reports in Predict'
const DESCRIPTION =
  'Redesigning a rigid reporting workflow so brand managers could build, edit, and share multi-metric client reports without falling back to Excel.'

export const metadata: Metadata = {
  title: `${TITLE} · Pattern`,
  description: DESCRIPTION,
  alternates: { canonical: '/work/pattern-custom-reports' },
  openGraph: {
    type: 'article',
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
    url: '/work/pattern-custom-reports',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
  },
}

const IMG = '/work/pattern'

export default function PatternCaseStudy() {
  return (
    <div className="cs pcs cs-surface cs-story min-h-screen text-white">
      {/* No `next` while the Hoth study is hidden (HIDDEN_WORK in lib/work). */}
      <SiteNav />

      <main id="main" className="sitenav-offset pb-24">
        {/* ══ Title block ══ */}
        <Col>
          <header className="pt-10">
            <p className="cs-eyebrow mb-5">Pattern · Product Design Internship</p>
            <StoryTitle dim="in Predict">Custom Reports</StoryTitle>
            <MetaGrid
              summary={
                <>
                  <p>
                    Redesigning a rigid reporting workflow so brand managers could{' '}
                    <strong>build, edit, and share multi-metric client reports</strong>{' '}
                    without falling back to Excel.
                  </p>
                  <p>
                    I found the problem while working on a small feature request, brought the
                    larger opportunity to the Predict team, and owned a{' '}
                    <strong>nine-week redesign</strong> of the core reporting workflow.
                  </p>
                </>
              }
              facts={[
                { label: 'Role', value: 'Product Design Intern', icon: 'user' },
                { label: 'Team', value: 'Design, product, and engineering', icon: 'users' },
                {
                  label: 'Timeline',
                  value: 'January to October 2025, a nine-week project',
                  icon: 'clock',
                },
                { label: 'Tools', value: 'Figma, Pendo, ClickUp', icon: 'tool' },
                {
                  label: 'Status',
                  value: 'Validated in usability testing, shipped by the team after my internship',
                  icon: 'flag',
                  span: true,
                },
                {
                  label: 'Skills used',
                  value:
                    'Discovery interviews, product analytics, scoping with leadership, information architecture, prototyping, usability testing, handoff',
                  icon: 'sparkle',
                  span: true,
                },
              ]}
            />
          </header>
        </Col>

        {/* ══ Hero band: the old home against the new, behind a laptop's glass ══ */}
        <Band tone="accent" crop className="cs-hero-band">
          <Laptop ratio={2880 / 2048}>
            <BeforeAfterHero
              beforeSrc={`${IMG}/figma/old-home.png`}
              afterSrc={`${IMG}/figma/new-home.png`}
              beforeAlt="The old Custom Reports home: a plain text list of reports hidden behind a Custom Reports sub-tab, with no previews"
              afterAlt="The redesigned Custom Reports home: a template row on top and a grid of report tiles, each with a live chart preview, title, and sharing state"
              aspect={2880 / 2048}
              frameless
            />
          </Laptop>
        </Band>

        {/* ══ The problem ══ */}
        <Band dust>
          <Col>
            <Problem iconSrc="/logos/pattern.png" iconAlt="Pattern">
              How might we let brand managers{' '}
              <em>build and share a client-ready report</em> without falling back to
              Excel?
            </Problem>
          </Col>
        </Band>

        {/* ══ At a glance ══ */}
        <Col wide>
          <Block className="cs-centered">
            <Pill>The project at a glance</Pill>
            <p className="cs-cap cs-cap--mono">
              Validated through usability testing and shipped by the team after my
              internship. This page only claims what I observed before handoff.
            </p>
            <BigStats
              small
              stats={[
                {
                  value: 50,
                  suffix: '+',
                  caption: <><strong>discovery interviews</strong> across my internship</>,
                },
                { value: 20, caption: <><strong>usability sessions</strong> on the redesign</> },
                { value: '2 → 5', caption: <><strong>metrics</strong> on one chart</> },
                { value: 9, caption: <>weeks from <strong>ticket to handoff</strong></> },
              ]}
            />
          </Block>
        </Col>

        {/* ══ The journey ══ */}
        <Col>
          <Block className="cs-centered">
            <Pill>The journey</Pill>
            <Journey stops={['Discover', 'Scope', 'Design', 'Test', 'Handoff']} />
          </Block>
        </Col>

        {/* ══ Act 01 · Discover ══ */}
        <Col>
          <Act phase="Discover" num="01" title="A one-line ticket exposed a much larger problem">
            <div className="cs-prose">
              <p>
                My first assignment was a small ClickUp ticket: let users{' '}
                <strong>duplicate a widget</strong> so they would not have to rebuild the
                same configuration. It was estimated at one or two days.
              </p>
              <p>
                As I worked through the flow, duplication started to look like a symptom.
                Users were cloning widgets because{' '}
                <strong>creating and editing reports was slow, rigid, and repetitive</strong>.
              </p>
            </div>
          </Act>
        </Col>

        <Band>
          <Col>
            <Reveal>
              <H3 dim="where it started">The ticket</H3>
              <div className="cs-paper cs-paper--sm mt-14">
                <ZoomShot
                  src={`${IMG}/clickup-ticket.png`}
                  alt="The ClickUp ticket that started the project, titled Custom Reports, Duplicate Widget Option, status DEV HANDOFF, t-shirt size X Small, one to two days"
                  width={821}
                  height={581}
                  sizes="(min-width: 40em) 440px, 100vw"
                />
              </div>
              <p className="cs-cap cs-cap--mono">
                A one-to-two-day duplication ticket revealed problems across the entire
                reporting workflow.
              </p>
            </Reveal>
          </Col>
        </Band>

        <Band dust>
          <Col>
            <KeyQuestion>
              Why were people <u>cloning widgets</u> instead of building the report they
              needed?
            </KeyQuestion>
          </Col>
        </Band>

        <Col>
          <Block>
            <H3 dim="the problem was not demand">The evidence</H3>
            <div className="cs-prose mt-3">
              <p>
                I ran weekly discovery interviews throughout my Pattern internship. Reporting
                workarounds repeatedly appeared in conversations about other parts of Predict.
                I also held a focused session with <strong>four UK brand managers</strong> who
                had used Custom Reports.
              </p>
              <p>
                Available product data showed that roughly 60% of eligible users created at
                least one report during the feature&rsquo;s first year, but{' '}
                <strong>only about 15% returned</strong>. People understood the potential
                value but did not find the existing workflow useful enough to repeat.
              </p>
            </div>
          </Block>

          <Block>
            <BigStats
              small
              stats={[
                { value: '~60%', caption: <>of eligible users <strong>tried</strong> a report in year one</> },
                { value: '~15%', caption: <>of them <strong>came back</strong></> },
              ]}
            />
          </Block>

          <Block>
            <H3 dim="from the research">Four recurring problems</H3>
            <People
              items={[
                {
                  icon: 'chart',
                  title: 'Two metrics per chart',
                  text: 'Comparison was difficult when a chart could hold only two lines.',
                },
                {
                  icon: 'layers',
                  title: 'Filters locked at creation',
                  text: 'Filters were unclear and could not be edited once a report existed.',
                },
                {
                  icon: 'pen',
                  title: 'A hidden edit mode',
                  text: 'Separate view and edit modes hid basic actions behind a switch.',
                },
                {
                  icon: 'mail',
                  title: 'Not client-ready',
                  text: 'Preparing a report still meant Excel, screenshots, or slides.',
                },
              ]}
            />
          </Block>

          <Block>
            <H3 dim="viewing and editing, kept apart">The old tool</H3>
            <Callouts
              src={`${IMG}/figma/old-preview-mode.png`}
              alt="The old report in preview mode, annotated: a two-metric line chart, a filter chip that could not be changed after creation, and an Exit Report button revealing a separate edit mode"
              width={2880}
              height={2048}
              items={[
                {
                  label: 'Two metrics',
                  text: <>One chart, two lines. <strong>Comparison stopped there.</strong></>,
                  x: 6.5,
                  y: 36,
                  w: 92,
                  h: 24,
                  gy: 33,
                },
                {
                  label: 'Locked filters',
                  text: <>Set once at creation, then <strong>out of reach</strong>.</>,
                  x: 78.5,
                  y: 10.5,
                  w: 16.5,
                  h: 4,
                  gy: 7,
                  ax: 86.5,
                  ay: 10.5,
                },
                {
                  label: 'Separate modes',
                  text: <>Editing lived behind a switch, so <strong>basic actions hid</strong> while presenting.</>,
                  x: 88.5,
                  y: 94.5,
                  w: 10.5,
                  h: 4.5,
                  gy: 5,
                  ax: 98.5,
                  ay: 94.5,
                },
              ]}
            />
          </Block>

          <Block>
            <SuccessCard>
              Success meant a <strong>useful first report without Excel</strong>, with more
              control revealed only when someone needed it.
            </SuccessCard>
          </Block>

          <Block>
            <H3 dim="two groups who reported every week">Who it was for</H3>
            <People
              items={[
                {
                  icon: 'building',
                  title: 'The brand manager',
                  text: 'Builds the client report, and often edits a chart while presenting it on the call.',
                },
                {
                  icon: 'chart',
                  title: 'The advertising strategist',
                  text: 'Compares more than two metrics at a time and needs the comparison to travel with the report.',
                },
              ]}
            />
          </Block>

        </Col>

        {/* ══ Act 02 · Scope ══ */}
        <Col>
          <Act phase="Scope" num="02" title="The most flexible concept was the one we could not build">
            <div className="cs-prose">
              <p>
                I brought the evidence to the Predict product and design team. With my design
                manager and Director of Product, I scoped a nine-week project around the
                highest-value workflow: <strong>creating reports, configuring widgets and
                filters, and editing report content</strong>.
              </p>
              <p>
                The largest constraint was <strong>engineering capacity</strong>. I could not
                introduce new data sources, replace Predict&rsquo;s design system, or assume
                the team could rebuild the report builder from scratch.
              </p>
            </div>
          </Act>

          <Pair
            level={3}
            num="01"
            task="Advanced users wanted a free canvas to drag charts and layer dimensions"
            solution="A structured report with list-based reordering, and the canvas on the roadmap"
            visual={
              <CompareStage
                ariaLabel="The cut drag-and-drop canvas concept versus the list-based reordering that shipped"
                layers={[
                  {
                    src: `${IMG}/figma/dragdrop-concept.png`,
                    alt: 'The cut concept: a Slides-style report builder with a left rail of draggable widget thumbnails next to the report canvas',
                    label: 'Cut concept',
                    caption:
                      'The canvas concept matched how advanced users thought about building a report, but it needed an editing system engineering could not build in nine weeks.',
                    width: 2880,
                    height: 2048,
                  },
                  {
                    src: `${IMG}/figma/reorder-panel.png`,
                    alt: 'The Edit General Info panel over a report, with a Widget Order list showing six charts, each with a drag handle for reordering',
                    label: 'Shipped',
                    caption:
                      'The canvas was more flexible, but list-based reordering delivered the core value within the available engineering capacity.',
                    width: 2880,
                    height: 2048,
                  },
                ]}
              />
            }
          >
            <p>
              I explored a Slides-style canvas. It matched the mental model of advanced users,
              but it exceeded the engineering budget. I presented the concept, user evidence,
              and tradeoffs. <strong>Leadership made the scope decision</strong>, and I focused
              on preserving the most important value inside a structured experience the team
              could ship. Users still gained control over report structure without requiring
              the team to build an entirely new editing system.
            </p>
          </Pair>
        </Col>

        {/* ══ Act 03 · Design ══ */}
        <Col>
          <Act phase="Design" num="03" title="The redesign guided the first report, then got out of the way">
            <div className="cs-prose">
              <p>
                Because many users did not return after their first attempt, the redesign
                focused first on making <strong>report creation easier to understand</strong>.
                The goal was not to expose every reporting option immediately. It was to help
                users create a useful first report and reveal more control when they needed
                it.
              </p>
            </div>
          </Act>

          <Pair
            level={3}
            num="02"
            task="A first report could be silently limited by scope and filters nobody explained"
            solution="A guided creation flow that explains scope and filters before they bite"
            visual={
              <figure className="m-0">
                <div className="cs-fig__frame">
                  <ZoomShot
                    src={`${IMG}/figma/modal-general.png`}
                    alt="Create New Custom Report modal, step one: name and description fields, then an explained choice between a single filter for the entire report and unique filters per widget, and between dynamic brand selection and a specified brand group"
                    width={1700}
                    height={1560}
                    sizes="(min-width: 60em) 800px, 100vw"
                  />
                </div>
                <figcaption className="cs-cap">
                  The creation flow explained report scope and filters before they could
                  silently limit the report.
                </figcaption>
              </figure>
            }
          >
            <p>
              The new home replaced a text list with <strong>templates and visual report
              previews</strong>. A guided creation flow collected the report name, scope,
              filters, and first widget before placing the user inside a working report.
            </p>
          </Pair>

          <Pair
            level={3}
            num="03"
            task="Charts stopped at two metrics, so comparison happened in Excel"
            solution="Up to five metrics on one chart, with notes that travel with it"
            visual={
              <Callouts
                src={`${IMG}/figma/widget-notes.png`}
                alt="The redesigned report widget, annotated: five metrics as color-coded stat headers above one dual-axis line chart, with a note beneath the title explaining what the chart shows"
                width={2656}
                height={1086}
                items={[
                  {
                    label: 'A note that travels',
                    text: <>Context under the title, so a shared chart <strong>explains itself</strong>.</>,
                    x: 1,
                    y: 9,
                    w: 50,
                    h: 12,
                    gy: 5,
                  },
                  {
                    label: 'Five metrics',
                    text: <>Colour-coded headers, one per line on the chart. <strong>Was two.</strong></>,
                    x: 1,
                    y: 25,
                    w: 98,
                    h: 26,
                    gy: 5,
                    ax: 50,
                    ay: 25,
                  },
                  {
                    label: 'Filters, editable',
                    text: <>The report&rsquo;s scope sits on the widget and can be <strong>changed after creation</strong>.</>,
                    x: 73,
                    y: 8,
                    w: 26,
                    h: 8,
                    gy: 4,
                    ax: 86,
                    ay: 8,
                  },
                ]}
              />
            }
          >
            <p>
              Once inside, users could compare up to five metrics in one chart, edit filters
              after creating the report, add, duplicate, delete, and reorder widgets, attach
              notes that travel with shared charts, and{' '}
              <strong>export, share, or schedule report delivery</strong>.
            </p>
          </Pair>
        </Col>

        {/* ══ Act 04 · Test ══ */}
        <Col>
          <Act phase="Test" num="04" title="Testing removed the boundary between viewing and editing">
            <div className="cs-prose">
              <p>
                I tested the redesigned flows with <strong>20 users</strong>: ten brand
                managers and ten advertising strategists. I expected them to prefer a clean
                separation between presenting a report and editing it. Testing showed the
                opposite. Brand managers often <strong>edited charts while presenting them
                to a client</strong>. Switching modes added friction at the moment they needed
                the tool to feel most responsive.
              </p>
            </div>
          </Act>

          <Block>
            <H3 dim="the most important change testing produced">One combined mode</H3>
            <Callouts
              src={`${IMG}/figma/widget-redesign.png`}
              alt="The redesigned report in its single combined mode, annotated: an Edit button and an editable filter chip sit on the widget itself, above a multi-metric chart"
              width={2880}
              height={2048}
              items={[
                {
                  label: 'Edit in context',
                  text: <>The action sits on the widget. <strong>No mode switch.</strong></>,
                  x: 91,
                  y: 10.5,
                  w: 7,
                  h: 4,
                  gy: 6,
                  ax: 94.5,
                  ay: 10.5,
                },
                {
                  label: 'Filters stay editable',
                  text: <>Scope can change <strong>after the report exists</strong>.</>,
                  x: 67,
                  y: 10.5,
                  w: 21,
                  h: 4,
                  gy: 8,
                  ax: 77.5,
                  ay: 10.5,
                },
                {
                  label: 'Five metrics',
                  text: <>The multi-metric chart, <strong>presented and edited in one place</strong>.</>,
                  x: 6.5,
                  y: 16.5,
                  w: 92,
                  h: 14,
                  gy: 14,
                  ax: 50,
                  ay: 16.5,
                },
              ]}
            />
          </Block>

          <Block>
            <div className="cs-prose">
              <p>
                I removed the separate edit mode and{' '}
                <strong>combined viewing and editing into one experience</strong>. Actions
                appeared in context, and filters remained editable after report creation. It
                simplified the interface while supporting the way reports were actually used.
              </p>
            </div>
          </Block>
        </Col>

        <Band dust>
          <Col>
            <Reveal className="cs-centered">
              <div className="cs-spark" aria-hidden="true">
                <Ico name="users" />
              </div>
              <p className="cs-release">
                The starting templates came from a <strong>report-building competition</strong>{' '}
                with brand managers and advertising strategists, not from my assumptions
                about a good client report.
              </p>
            </Reveal>
            <Reveal className="mt-8">
              <div className="cs-prose mx-auto text-center">
                <p>
                  Participants used the new system to create the reports they found most
                  useful in their actual work. The strongest entries became the templates in
                  the product, and the competition gave me another round of feedback from the
                  people most familiar with the workflow.
                </p>
              </div>
            </Reveal>
          </Col>
        </Band>

        {/* ══ Final designs band ══ */}
        <Band tone="accent" className="cs-final">
          <p className="cs-final__word" aria-hidden="true">
            Final designs
          </p>
          <div className="cs-final__stage" style={{ paddingInline: 'var(--cs-pad)' }}>
            <Laptop
              ratio={2880 / 2048}
              style={{ '--r': '-5deg', '--y': '6%' } as React.CSSProperties}
            >
              <Image
                src={`${IMG}/figma/new-home.png`}
                alt="The redesigned Custom Reports home with templates and report previews"
                fill
                sizes="(min-width: 40em) 50vw, 100vw"
              />
            </Laptop>
            <Laptop
              ratio={2880 / 2048}
              style={{ '--r': '4deg', '--y': '-4%' } as React.CSSProperties}
            >
              <Image
                src={`${IMG}/figma/widget-redesign.png`}
                alt="The redesigned report in its single combined mode"
                fill
                sizes="(min-width: 40em) 50vw, 100vw"
              />
            </Laptop>
          </div>
        </Band>

        {/* ══ Act 05 · Handoff ══ */}
        <Col>
          <Act phase="Handoff" num="05" title="Validated in testing and shipped after my internship">
            <div className="cs-prose">
              <p>
                The redesign was validated through 20 usability sessions and{' '}
                <strong>shipped by the Pattern team after my internship</strong>. I delivered
                annotated designs, the prototype, supporting documentation, a prioritized
                backlog, and a follow-up testing plan.
              </p>
            </div>
          </Act>

          <Block tight>
            <MonoLabel icon="flag">By handoff</MonoLabel>
            <Checklist
              items={[
                'Reports with up to five metrics per chart',
                'One combined mode in place of separate viewing and editing',
                'Filters that can be changed after report creation',
                'Reports that can be reordered, annotated, shared, and exported',
                'A template library seeded by user-built reports',
                'Annotated designs, prototype, documentation, backlog, and a testing plan',
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
                        My first instinct was to include everything users requested. Trying to
                        build all of it would have produced{' '}
                        <strong>another complicated report builder</strong>.
                      </p>
                      <p>
                        The harder and more valuable work was identifying the changes that
                        improved the core workflow for everyone, then{' '}
                        <strong>fitting them inside what engineering could support</strong>.
                      </p>
                    </>
                  ),
                },
                {
                  label: 'Reflections',
                  icon: 'pen',
                  body: (
                    <p>
                      The redesign still did not solve missing forecast, wholesale, or
                      logistics data. Those were <strong>platform limitations, not interface
                      problems</strong>, and they are what stands between Predict and being
                      someone&rsquo;s complete reporting tool.
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
                  Measure whether users <strong>return to build a second report</strong>
                </>,
                <>
                  Investigate the <strong>forecast, wholesale, and logistics gaps</strong>{' '}
                  that still send people to Excel
                </>,
                <>
                  Run the <strong>follow-up testing plan</strong> handed off with the designs
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
              <LucidTile />
              <AwardcoMobileTile />
            </div>
          </Block>
        </Col>
      </main>

      <Footer width="article" />
    </div>
  )
}
