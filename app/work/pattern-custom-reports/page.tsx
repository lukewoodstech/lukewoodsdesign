import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import AwardcoMobileTile from '@/components/AwardcoMobileTile'
import LucidTile from '@/components/LucidTile'
import Reveal from '@/components/lucid/Reveal'
import CompareStage from '@/components/lucid/CompareStage'
import ZoomShot from '@/components/lucid/ZoomShot'
import BigStats from '@/components/cs/BigStats'
import Journey from '@/components/cs/Journey'
import Callouts from '@/components/cs/Callouts'
import { Macbook } from '@/components/cs/Devices'
import MetricLab from '@/components/predict/MetricLab'
import MockStage from '@/components/predict/MockStage'
import ReportPage from '@/components/predict/ReportPage'
import ReportsHome from '@/components/predict/ReportsHome'
import {
  Act,
  Band,
  Block,
  Checklist,
  Col,
  GhostCard,
  H3,
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
 * re-cut into acts with key phrases bolded. Sourced from the 2026-08
 * interview record, which is kept out of this repo (see .gitignore); its
 * build decisions are binding:
 * - Canonical numbers only: Pendo ~60% trial / ~15% return, 50+ discovery
 *   interviews across the internship, 20 usability sessions, 2 → 5 metrics,
 *   9 weeks. No "400+ hours per week", no adoption / retention / revenue /
 *   time-saved claims.
 * - The team built and shipped the redesign AFTER the internship: outcomes
 *   are "validated through usability testing and shipped after my internship".
 * - Filter override behavior is unverified, so filters are described only as
 *   clearer and editable after creation.
 *
 * Visuals edition (2026-09-27), from Luke's curated "Case Study" page in
 * the Custom Reports LW design file (GwADcq58t2M1PkBqo1qEWm, page
 * 15635:639). Two kinds of visual, kept deliberately distinct:
 * - The OLD tool is real product captures, shown as screenshots
 *   (public/work/pattern/old): the home hidden under a BETA sub-tab
 *   (15635:3770), the same list six reports deep and four of them copies
 *   (15635:3768), the report view whose second widget is titled "Multiple
 *   metrics on a line chart? AND color customization?????" (15635:19104),
 *   the edit mode (15635:3764), the two drawers, and Predict's own Traffic
 *   page with the platform-wide two-metric chart (15635:19107).
 * - The NEW design is built in code (components/predict, lib/predict) from
 *   the file's tokens (Wix Madefor Display, navy #1d3261) and icon exports:
 *   the home with distinct, named templates and report previews; the
 *   widget with caption, metric cards and the two-axis chart; the customize
 *   drawer; a finished report page. Every number is derived from twelve
 *   monthly series, so ROAS is really Ad Sales over Ad Spend and every
 *   delta is a real change. The design file's cards repeated one
 *   placeholder delta; Luke asked for that to be fixed.
 * - MetricLab is interactive: the axis rules are Luke's (confirmed
 *   2026-09-27) and the drawer's controls drive the real engine.
 * - Two chart hues are deeper steps of the file's teal and lavender so the
 *   coded charts pass contrast; see lib/predict/metrics.ts.
 * - NEW copy in this edition, written from Luke's 2026-09-27 notes and the
 *   captures rather than the interview record: the six problems (export,
 *   captions, modes, look-alike controls added to the original four), the
 *   "Copy of" evidence, the axis-rules section, and the export beat in
 *   What next. The Gmail send-to-client flow is in design now and is not
 *   claimed as shipped.
 * - Deliberately not rendered (in the file, not the repo): the wireframe
 *   home, the mobile prototypes, the Will/Trista personas, discovery-board.
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
const OLD = `${IMG}/old`
const CAP = { width: 2880, height: 2048 }

export default function PatternCaseStudy() {
  return (
    <div className="cs pcs cs-surface cs-story min-h-screen text-white">
      {/*
       * The chain in lib/caseStudies goes Pattern → Hoth → Lucid, but Hoth is
       * hidden (HIDDEN_WORK in lib/work), so `next` skips it and wraps to
       * Lucid — the same study the Read next cards below lead with.
       */}
      <SiteNav next={{ href: '/work/lucid-ai', title: 'Bringing Lucid AI to the homepage' }} />

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
                /* Two spans of time, kept apart: the internship is the
                   role's dates, the project is nine weeks inside them. One
                   fact that said both read as a nine-week internship. */
                { label: 'Role', value: 'Product Design Intern, January to October 2025' },
                { label: 'Team', value: 'Design, product, and engineering' },
                { label: 'Project', value: 'Nine weeks, from the ticket to handoff' },
                { label: 'Tools', value: 'Figma, Pendo, ClickUp' },
                {
                  label: 'Status',
                  value: 'Validated in usability testing, shipped by the team after my internship',
                  span: true,
                },
                {
                  label: 'Skills used',
                  value:
                    'Discovery interviews, product analytics, scoping with leadership, information architecture, prototyping, usability testing, handoff',
                  span: true,
                },
              ]}
            />
          </header>
        </Col>

        {/* ══ Hero band: the redesigned home, built in code, on real hardware.
            Every template and report tile has its own name and its own chart,
            drawn from the same series as the report widgets further down. ══ */}
        <Band tone="accent" className="pcs-hero-band">
          <figure className="m-0">
            <Macbook>
              <MockStage native={1180}>
                <ReportsHome />
              </MockStage>
            </Macbook>
            <figcaption className="cs-cap cs-cap--mono mt-5 text-center">
              The redesigned Custom Reports home, rebuilt in code from the design file
            </figcaption>
          </figure>
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
                {
                  value: '2 → 6',
                  caption: (
                    <>
                      <strong>metrics</strong> on one chart
                    </>
                  ),
                },
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

        <Col>
          <Block>
            <H3 dim="the symptom, in the product">Six reports, four of them copies</H3>
            <div className="cs-prose mt-3">
              <p>
                The Custom Reports list sat behind a <strong>BETA sub-tab</strong> on the Reports
                page, with no previews and no way to tell a report from its copies. The only way to
                reuse a configuration was to duplicate the whole report and edit the copy.
              </p>
            </div>
            <div className="cs-fig__frame mt-6">
              <ZoomShot
                src={`${OLD}/home-copies.png`}
                alt="The old Custom Reports list: a plain table of six reports, four of them named Copy of, with a small menu offering Share, Edit, Make a Copy, and Delete"
                {...CAP}
                sizes="(min-width: 60em) 800px, 100vw"
              />
            </div>
            <p className="cs-cap">
              The old Custom Reports home: a bare list with no previews, where a report and its
              copies look identical. Building was harder than copying, so people copied.
            </p>
          </Block>
        </Col>

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
            <H3 dim="from the research">Six recurring problems</H3>
            <People
              items={[
                {
                  title: 'Two metrics per chart',
                  text: 'Comparison stopped at two lines. Anything more meant Excel.',
                },
                {
                  title: 'Filters locked at creation',
                  text: 'Filters were unclear and could not be edited once a report existed.',
                },
                {
                  title: 'Two confusing modes',
                  text: 'Separate view and edit modes hid basic actions behind a switch nobody expected.',
                },
                {
                  title: 'Look-alike controls',
                  text: 'Buttons looked the same as each other, and some things that looked like buttons did nothing.',
                },
                {
                  title: 'No words on a widget',
                  text: 'A chart could not carry a note, so the explanation lived in the call.',
                },
                {
                  title: 'No export',
                  text: 'Sharing a report with a client meant a screen share, screenshots, or Excel.',
                },
              ]}
            />
          </Block>

          <Block>
            <H3 dim="viewing and editing, kept apart">The old tool</H3>
            <Callouts
              src={`${OLD}/widget-view.png`}
              alt="The old report in view mode, annotated: a two-line chart of Ad Clicks against ACOS, a second widget titled Multiple metrics on a line chart, a cloud icon in each widget header, and an Exit Report button with a pencil icon"
              {...CAP}
              items={[
                {
                  label: 'The ask, in the product',
                  text: (
                    <>
                      A test widget titled{' '}
                      <strong>&ldquo;Multiple metrics on a line chart?&rdquo;</strong> The question
                      was already on screen.
                    </>
                  ),
                  x: 7,
                  y: 65.5,
                  w: 36,
                  h: 4.5,
                  ax: 25,
                  ay: 65.5,
                },
                {
                  label: 'Two lines, then stop',
                  text: (
                    <>
                      Ad Clicks and ACOS. The third metric had <strong>nowhere to go</strong>.
                    </>
                  ),
                  x: 6.5,
                  y: 38.5,
                  w: 92,
                  h: 24,
                },
                {
                  label: 'Looks clickable',
                  text: (
                    <>
                      The cloud in every header <strong>was not a button</strong>. Neither were the
                      metric dots.
                    </>
                  ),
                  x: 95.5,
                  y: 18.5,
                  w: 3.5,
                  h: 3.5,
                  ax: 97,
                  ay: 18.5,
                },
                {
                  label: 'Locked filters',
                  text: <>Set once at creation, then <strong>out of reach</strong>.</>,
                  x: 78.5,
                  y: 10.5,
                  w: 16.5,
                  h: 4,
                  ax: 86.5,
                  ay: 10.5,
                },
                {
                  label: 'Exit to edit',
                  text: (
                    <>
                      A pencil that <strong>leaves the report</strong>. Editing was a different
                      place.
                    </>
                  ),
                  x: 88.5,
                  y: 94.5,
                  w: 10.5,
                  h: 4.5,
                  ax: 93.5,
                  ay: 94.5,
                },
              ]}
            />
          </Block>

          <Block>
            <H3 dim="a switch nobody expected">Two modes</H3>
            <CompareStage
              ariaLabel="The old report in view mode and in edit mode"
              layers={[
                {
                  src: `${OLD}/widget-view.png`,
                  alt: 'The old report in view mode: widgets with charts, an Exit Report button at the bottom right',
                  label: 'View',
                  caption:
                    'Presenting: the chart, but no way to change a filter or a metric without leaving.',
                  ...CAP,
                },
                {
                  src: `${OLD}/widget-edit.png`,
                  alt: 'The old report in edit mode: grey Add Widget bars between widgets, an Edit button on each, and a Done button at the bottom right',
                  label: 'Edit',
                  caption:
                    'Editing: a different page with different controls, reached through a pencil that said Exit Report.',
                  ...CAP,
                },
              ]}
            />
          </Block>

          <Block>
            <div className="cs-prose">
              <p>
                The two-metric limit was not a Custom Reports decision. It came from{' '}
                <strong>Predict&rsquo;s charts everywhere</strong>: every page in the platform drew
                two metrics on two axes, and Custom Reports inherited it.
              </p>
            </div>
            <div className="cs-fig__frame mt-6">
              <ZoomShot
                src={`${OLD}/traffic-two-metrics.png`}
                alt="Predict's Traffic page: a two-line chart of Sales and Ad Sales with one axis on each side, above a row of metric cards"
                width={2940}
                height={1912}
                sizes="(min-width: 60em) 800px, 100vw"
              />
            </div>
            <p className="cs-cap">
              Predict&rsquo;s own Traffic page. Two metrics, two axes, the same ceiling the report
              widget inherited.
            </p>
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
                  title: 'The brand manager',
                  text: 'Builds the client report, and often edits a chart while presenting it on the call.',
                },
                {
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
              <>
                <CompareStage
                  ariaLabel="The cut drag-and-drop canvas concept versus the list-based reordering that shipped"
                  layers={[
                    {
                      src: `${IMG}/figma/canvas-concept.png`,
                      alt: 'The cut concept: a Slides-style report builder with a left rail of draggable widget thumbnails next to the report canvas',
                      label: 'Cut concept',
                      caption:
                        'The canvas concept matched how advanced users thought about building a report, but it needed an editing system engineering could not build in nine weeks.',
                      ...CAP,
                    },
                    {
                      node: (
                        <MockStage native={1180}>
                          <ReportPage />
                        </MockStage>
                      ),
                      label: 'Shipped',
                      caption:
                        'What shipped: a structured report whose widgets carry a written description, up to six metrics on two axes, and the edit controls on the widget itself. Reordering lives in a list, not on a canvas.',
                    },
                  ]}
                />
                {/* The same decision seen from the front door: the old list
                    of copies against the coded home with templates and a
                    live preview per report. */}
                <div className="mt-10">
                  <CompareStage
                    ariaLabel="The Custom Reports home before and after the redesign"
                    layers={[
                      {
                        src: `${OLD}/home-copies.png`,
                        alt: 'The old Custom Reports list: a plain table of six reports, four of them named Copy of, behind a BETA sub-tab',
                        label: 'Home, before',
                        caption:
                          'Before: a text list behind a BETA sub-tab. No previews, and no way to tell a report from its copies.',
                        ...CAP,
                      },
                      {
                        node: (
                          <MockStage native={1180}>
                            <ReportsHome />
                          </MockStage>
                        ),
                        label: 'Home, after',
                        caption:
                          'After: templates to start from, a search and count bar, and a live chart preview on every report.',
                      },
                    ]}
                  />
                </div>
              </>
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
              <CompareStage
                ariaLabel="The two steps of the new Create Custom Report flow"
                layers={[
                  {
                    src: `${IMG}/figma/modal-1.png`,
                    alt: 'Create New Custom Report, step one of three: name and description, then an explained choice between one filter for the whole report and unique filters per widget, and between dynamic brand selection and a specific brand group',
                    label: '1 · Filters',
                    caption:
                      'Report scope and filters are explained in plain words before they can quietly limit the report.',
                    width: 1700,
                    height: 1560,
                  },
                  {
                    src: `${IMG}/figma/modal-2.png`,
                    alt: 'Create New Custom Report, step two of three: a default timeframe chosen from current, previous, trailing, or quarterly ranges, a view-by grain, and a compare-with toggle',
                    label: '2 · Time',
                    caption:
                      'The default timeframe and comparison are set once, and can be changed later on the widget itself.',
                    width: 1700,
                    height: 1560,
                  },
                ]}
              />
            }
          >
            <p>
              The new home replaced a text list with{' '}
              <strong>templates and visual report previews</strong>. A guided creation flow
              collected the report name, scope, filters, and first widget before placing the user
              inside a working report.
            </p>
          </Pair>
        </Col>

        {/* ══ The multi-metric chart: the constraint, the rules, and the lab.
            Wide, because the widget and its drawer need the room. ══ */}
        <Col>
          <Block>
            <H3 dim="two axes, many kinds of number">Up to six metrics on one chart</H3>
            <div className="cs-prose mt-3">
              <p>
                Predict&rsquo;s charts had two y-axes and stopped at two metrics. Users wanted to
                compare five or six, and to mix lines with bars. The hard part was not drawing more
                lines. It was that <strong>the metrics come in different units</strong>: dollars,
                counts, percentages, ratios, and a chart still only has two sides.
              </p>
              <p>
                The rules I landed on: every metric has a unit. The first unit family on the chart
                takes the left axis, the second takes the right, and{' '}
                <strong>a third family is blocked with a reason</strong> rather than squeezed onto a
                scale that would lie. Each metric chooses line or bar. A switch lets same-unit
                metrics share one scale, or split across both axes when one would flatten the other.
              </p>
            </div>
          </Block>
        </Col>

        <Col>
          <Block className="cs-breakout">
            <MetricLab />
          </Block>
          <p className="cs-cap cs-cap--mono mt-4 text-center">
            Live. Change metrics, marks, or the axis switch and the chart, ticks, badges, and header
            follow the same rules.
          </p>
        </Col>

        <Col>
          <Block>
            <div className="cs-prose">
              <p>
                The same widget carries a <strong>caption that travels with the chart</strong>, so a
                report can explain itself when it is shared instead of relying on whoever is
                presenting it. And the numbers on it agree with each other: ROAS on a card is the ad
                sales over ad spend that the chart is drawing.
              </p>
            </div>
          </Block>
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
              {...CAP}
              items={[
                {
                  label: 'Edit in context',
                  text: <>The action sits on the widget. <strong>No mode switch.</strong></>,
                  x: 91,
                  y: 10.5,
                  w: 7,
                  h: 4,
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
                  ax: 77.5,
                  ay: 10.5,
                },
                {
                  label: 'More than two',
                  text: <>The multi-metric chart, <strong>presented and edited in one place</strong>.</>,
                  x: 6.5,
                  y: 16.5,
                  w: 92,
                  h: 14,
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
                <strong>combined viewing and editing into one experience</strong>. Actions appeared
                in context, filters remained editable after report creation, and the controls that
                looked like buttons now were buttons. It simplified the interface while supporting
                the way reports were actually used.
              </p>
            </div>
          </Block>
        </Col>

        <Band dust>
          <Col>
            <Reveal className="cs-centered">
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

        {/* ══ Final designs band: the coded home and a finished report ══ */}
        <Band tone="accent" className="cs-final">
          <p className="cs-final__word" aria-hidden="true">
            Final designs
          </p>
          <div className="cs-final__stage" style={{ paddingInline: 'var(--cs-pad)' }}>
            <Macbook style={{ '--r': '-5deg', '--y': '6%' } as React.CSSProperties}>
              <MockStage native={1180}>
                <ReportsHome />
              </MockStage>
            </Macbook>
            <Macbook style={{ '--r': '4deg', '--y': '-4%' } as React.CSSProperties}>
              <MockStage native={1180}>
                <ReportPage />
              </MockStage>
            </Macbook>
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
            <MonoLabel>By handoff</MonoLabel>
            <Checklist
              items={[
                'Reports with up to six metrics per chart, lines and bars together, on two axes that follow the unit rules',
                'One combined mode in place of separate viewing and editing',
                'Filters that can be changed after report creation',
                'A caption on every widget that travels with the chart',
                'Reports that can be reordered, duplicated, shared, and exported',
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
                  <strong>Send a report to the client from Predict</strong>, through Gmail, so the
                  old routine of a screen share or screenshots ends. That flow is in design now.
                </>,
                <>
                  Measure whether users <strong>return to build a second report</strong>
                </>,
                <>
                  Investigate the <strong>forecast, wholesale, and logistics gaps</strong> that
                  still send people to Excel
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
