import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import ReadNext from '@/components/ReadNext'
import Reveal from '@/components/lucid/Reveal'
import CompareStage from '@/components/lucid/CompareStage'
import ZoomShot from '@/components/lucid/ZoomShot'
import BigStats from '@/components/cs/BigStats'
import Stage from '@/components/cs/Stage'
import StageRail from '@/components/cs/StageRail'
import Callouts from '@/components/cs/Callouts'
import { Macbook } from '@/components/cs/Devices'
import MetricLab from '@/components/predict/MetricLab'
import MockStage from '@/components/predict/MockStage'
import ReportPage from '@/components/predict/ReportPage'
import ReportsHome from '@/components/predict/ReportsHome'
import { Band, Block, Col, MetaGrid, Pill, Problem, StoryTitle } from '@/components/cs/Story'
import { SITE } from '@/lib/site'
import { companyAbout } from '@/lib/caseStudies'

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
 * - Stages edition (2026-11-03, Luke): acts and the Journey strip gave way
 *   to design-process stages with the StageRail, as on Pitch. Each stage is
 *   a heading and plain body; subheads, the task/solution pairs, the six
 *   problem cards, the checklist and the What next card were folded into
 *   the body or cut.
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

/* The design process, in the order it happened. Each label is also the
   stage's heading, as on Pitch. */
const STAGES = [
  { id: 'ticket', label: 'Starting from a ticket' },
  { id: 'research', label: 'Researching the workflow' },
  { id: 'scope', label: 'Scoping with leadership' },
  { id: 'first-report', label: 'Designing the first report' },
  { id: 'chart', label: 'Designing the multi-metric chart' },
  { id: 'testing', label: 'Testing with 20 users' },
  { id: 'handoff', label: 'Handing off' },
]

export default function PatternCaseStudy() {
  return (
    <div className="cs pcs cs-surface cs-story min-h-screen text-white">
      {/* Next leads to Lucid, the same study the Read next cards lead with. */}
      <SiteNav next={{ href: '/work/lucid-ai', title: 'Bringing Lucid AI to the homepage' }} />

      <main id="main" className="sitenav-offset pb-24">
        {/* ══ Title block ══ */}
        <Col>
          <header className="pt-10">
            <p className="cs-eyebrow mb-5">Pattern · Product Design Internship</p>
            <StoryTitle dim="in Predict">Custom Reports</StoryTitle>
            {/* Pitch's header (LUK-199): one summary paragraph across the
                column, then Company, Role, Timeline and Tools. Two spans of
                time stay apart: Timeline is the internship, and the summary
                says the project was nine weeks inside it. One fact that said
                both read as a nine-week internship. */}
            <MetaGrid
              stacked
              summary={
                <p>
                  Predict&rsquo;s reporting tool was so rigid that brand managers kept going back
                  to Excel to build client reports. I found the problem while working on a tiny
                  feature ticket, pitched the bigger opportunity to the team, and owned a
                  nine-week redesign. Usability testing backed it up, and the team shipped it
                  after my internship.
                </p>
              }
              facts={[
                { label: 'Company', value: companyAbout('pattern-custom-reports'), span: true },
                { label: 'Role', value: 'Product Design Intern' },
                { label: 'Timeline', value: 'January to October 2025' },
                { label: 'Tools', value: 'Figma, Pendo, ClickUp' },
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
        <Band dust flush>
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

        {/* ══ The design process, stage by stage, with the rail (LUK-203) ══ */}
        <StageRail stages={STAGES} />

        <Stage
          id="ticket"
          title="Starting from a ticket"
          body={
            <>
              <p>
                My first assignment was a small ClickUp ticket: let people duplicate a widget so they
                didn&rsquo;t have to rebuild it. Estimated at a day or two.
              </p>
              <p>
                But the more I dug in, the more duplication looked like a symptom. People were
                copying widgets because building and editing reports was slow, rigid, and
                repetitive.
              </p>
            </>
          }
        >
          <Band>
            <Col>
              <Reveal>
                <div className="cs-paper cs-paper--sm">
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
              <div className="cs-prose">
                <p>
                  The reports list was tucked behind a BETA tab, with no previews and no way to tell
                  a report from its copies. To reuse a setup, you copied the whole report and edited
                  the copy.
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
        </Stage>

        <Stage
          id="research"
          title="Researching the workflow"
          body={
            <>
              <p>
                I ran weekly discovery interviews my whole internship, and reporting workarounds
                kept coming up, even when we were talking about other parts of Predict. I also ran a
                focused session with four UK brand managers who&rsquo;d used Custom Reports.
              </p>
              <p>
                The data told the same story. Roughly 60% of eligible users made at least one report
                in the feature&rsquo;s first year, but only about 15% came back. People saw the
                value. The tool just wasn&rsquo;t worth coming back to.
              </p>
            </>
          }
        >
          <Col>
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
              <div className="cs-prose">
                <p>
                  It kept coming back to six problems. Charts maxed out at two metrics, so anything
                  more meant Excel. Filters were confusing and locked once a report existed.
                  Separate view and edit modes hid basic actions. Buttons all looked alike, and some
                  things that looked like buttons did nothing. Charts couldn&rsquo;t hold a note, so
                  the explanation lived in the meeting. And there was no export, so sharing meant a
                  screen share, screenshots, or Excel.
                </p>
              </div>
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
                  The two-metric limit didn&rsquo;t start in Custom Reports. Every chart in Predict
                  drew two metrics on two axes, and reports just inherited it.
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
              <div className="cs-prose">
                <p>
                  Two groups report every week. Brand managers build the client report. Ad
                  strategists compare more than two metrics at once and need that in the report too.
                  For both, the goal was a useful first report without Excel, with more control
                  there when they needed it.
                </p>
              </div>
            </Block>
          </Col>
        </Stage>

        <Stage
          id="scope"
          title="Scoping with leadership"
          body={
            <>
              <p>
                I brought what I&rsquo;d found to the Predict team, and with my design manager and
                Director of Product I scoped a nine-week project around the core: creating reports,
                setting up widgets and filters, and editing them.
              </p>
              <p>
                The biggest constraint was engineering time. No new data sources, no replacing the
                design system, and no rebuilding the report builder from scratch.
              </p>
              <p>
                Advanced users wanted a free canvas to drag charts around, so I explored a
                Slides-style version. It matched how they thought, but it was way past the
                engineering budget. I showed leadership the concept, the evidence, and the
                tradeoffs, and they made the call. I kept the core value in a structured report the
                team could actually ship, with list reordering now and the canvas on the roadmap.
              </p>
            </>
          }
        >
          <Col>
            <Block>
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
            </Block>
          </Col>
        </Stage>

        <Stage
          id="first-report"
          title="Designing the first report"
          body={
            <>
              <p>
                So many people never came back after their first try, so I started there. The goal
                wasn&rsquo;t to show every option up front. It was to help people make one useful
                report, and show more control when they needed it.
              </p>
              <p>
                The new home swapped the text list for templates and report previews. A guided flow
                walks you through the name, scope, filters, and first widget, explains scope and
                filters before they can quietly limit your report, and drops you into a working
                report.
              </p>
            </>
          }
        >
          <Col>
            <Block>
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
            </Block>
          </Col>
        </Stage>

        {/* The multi-metric chart: the constraint, the rules, and the lab.
            The lab breaks out of the column, because the widget and its
            drawer need the room. */}
        <Stage
          id="chart"
          title="Designing the multi-metric chart"
          body={
            <>
              <p>
                Predict&rsquo;s charts stopped at two metrics. People wanted to compare five or six,
                and mix lines with bars. The hard part wasn&rsquo;t drawing more lines. It was that
                metrics come in different units (dollars, counts, percentages, ratios) and a chart
                only has two sides.
              </p>
              <p>
                Here&rsquo;s what I landed on. Every metric has a unit. The first kind of unit takes
                the left axis, the second takes the right, and a third is blocked with a reason
                instead of being squished onto a scale that would lie. Each metric can be a line or
                a bar. And a switch lets same-unit metrics share one scale, or split across both
                sides when one would flatten the other.
              </p>
            </>
          }
        >
          <Col>
            <Block>
              <MetricLab />
            </Block>
            <p className="cs-cap cs-cap--mono mt-4 text-center">
              Live. Change metrics, marks, or the axis switch and the chart, ticks, badges, and header
              follow the same rules.
            </p>

            <Block>
              <div className="cs-prose">
                <p>
                  Every chart also gets a caption that travels with it, so a shared report can
                  explain itself without someone presenting it. And the numbers agree: ROAS on a
                  card is the same ad sales over ad spend the chart is drawing.
                </p>
              </div>
            </Block>
          </Col>
        </Stage>

        <Stage
          id="testing"
          title="Testing with 20 users"
          body={
            <>
              <p>
                I tested the redesign with 20 users: ten brand managers and ten ad strategists. I
                expected them to want separate modes for presenting and editing. Turns out, the
                opposite. Brand managers often edited charts live in front of a client, and
                switching modes got in the way right when they needed it to feel fast.
              </p>
              <p>
                So I cut the edit mode and merged viewing and editing into one. Actions show up
                where you need them, filters stay editable after you make a report, and things that
                look like buttons actually are buttons.
              </p>
            </>
          }
        >
          <Col>
            <Block>
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
                  The starting templates came from a report-building competition, not from my
                  guesses about what a good report looks like. Brand managers and ad strategists
                  used the new system to build the reports they&rsquo;d actually use. The best ones
                  became the templates, and I got one more round of feedback from the people who
                  knew the work best.
                </p>
              </div>
            </Block>
          </Col>
        </Stage>

        <Stage
          id="handoff"
          title="Handing off"
          body={
            <>
              <p>
                The redesign was validated in 20 usability sessions and shipped by the Pattern team
                after my internship. By handoff, a chart could hold up to six metrics, lines and bars
                together on two axes. Viewing and editing were one mode, filters could change after
                a report was made, and every chart had a caption. Reports could be reordered,
                duplicated, shared, and exported, and the templates came from reports users built.
              </p>
              <p>
                I handed off annotated designs, the prototype, documentation, a prioritized backlog,
                and a plan for follow-up testing.
              </p>
            </>
          }
        >
          <Band tone="accent" className="cs-final cs-final--open">
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

          <Col>
            <Block>
              <div className="cs-prose">
                <p>
                  My first instinct was to build everything users asked for. That would have just
                  made another complicated report builder. The harder, more useful work was finding
                  the changes that helped everyone, and fitting them into what engineering could
                  build.
                </p>
                <p>
                  It didn&rsquo;t fix the missing forecast, wholesale, and logistics data. Those are
                  platform gaps, not design ones, and they&rsquo;re what still sends people to
                  Excel.
                </p>
                <p>
                  Next, I&rsquo;d let people send a report straight to the client through Gmail (that
                  flow is in design now), and I&rsquo;d track whether people come back to build a
                  second report.
                </p>
              </div>
            </Block>
          </Col>
        </Stage>

        {/* ══ Read next ══ */}
        <ReadNext current="pattern" />
      </main>

      <Footer width="article" />
    </div>
  )
}
