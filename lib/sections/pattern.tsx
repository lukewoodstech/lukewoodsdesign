import type { CaseStudySections } from '@/lib/sections'
import Callouts from '@/components/cs/Callouts'
import CompareStage from '@/components/lucid/CompareStage'
import MetricLab from '@/components/predict/MetricLab'
import MockStage from '@/components/predict/MockStage'
import ReportPage from '@/components/predict/ReportPage'
import ReportsHome from '@/components/predict/ReportsHome'
import { DeviceSet, Macbook, ShotRow } from '@/components/sections/frames'

/*
 * The Pattern case study's sections, copy as Luke wrote it (2026-11-11).
 * The visual text above each visual is drawn from the earlier page's own captions.
 * The old tool is real product captures; the new design is built in code
 * (components/predict). This copy says the redesign shipped after the
 * internship, which reverses the 2026-11-09 note that Luke didn't know
 * whether it was built. Confirm before publishing.
 */

const IMG = '/work/pattern'
const OLD = `${IMG}/old`
const CAP = { width: 2880, height: 2048 }

export const pattern: CaseStudySections = {
  accent: '#1d7cf3',
  sections: [
    {
      step: 'Origin',
      subtitle: 'It started as a two-day ticket',
      body: 'I was handed a small ClickUp ticket to add a duplicate button to report widgets. Digging into it, I kept finding problems across the whole reporting workflow. A one-to-two-day fix turned into a case for redesigning the tool.',
      visuals: [
        {
          src: `${IMG}/clickup-ticket.png`,
          width: 821,
          height: 581,
          alt: 'The ClickUp ticket that started the project, titled Custom Reports, Duplicate Widget Option, status DEV HANDOFF, t-shirt size X Small, one to two days',
          title: 'The ticket',
          caption: 'The ClickUp ticket that started it: let people duplicate a widget, sized at one to two days.',
        },
      ],
    },
    {
      step: 'Research',
      subtitle: 'Brand managers gave up and used Excel',
      body: "Pendo data showed about 60% of eligible users made a report in the first year, and only about 15% came back. The report list had no previews, so copies all looked the same. Brand managers were rebuilding client reports in Excel because Predict wouldn't let them make what they needed. I ran weekly interviews plus a session with four UK brand managers.",
      visuals: [
        {
          src: `${OLD}/home-copies.png`,
          ...CAP,
          alt: 'The old Custom Reports list: a plain table of six reports, four of them named Copy of, with a small menu offering Share, Edit, Make a Copy, and Delete',
          title: 'The old reports list',
          caption: 'A bare list with no previews, where a report and its copies look identical. Building was harder than copying, so people copied.',
        },
      ],
    },
    {
      step: 'Friction',
      subtitle: 'Every edit meant leaving the report',
      body: "The old widgets only showed two lines of data, the filters were locked, and changing anything meant exiting to edit mode. Even Predict's own Traffic page could only compare two metrics. You couldn't present a report and adjust it at the same time.",
      visuals: [
        {
          alt: 'The old report widget, annotated',
          title: 'The old widget',
          caption: 'Two lines of data, locked filters, buttons that did nothing, and a pencil that left the report to edit it.',
          element: (
            <Callouts
              src={`${OLD}/widget-view.png`}
              alt="The old report in view mode, annotated: a two-line chart of Ad Clicks against ACOS, a second widget titled Multiple metrics on a line chart, a cloud icon in each widget header, and an Exit Report button with a pencil icon"
              {...CAP}
              sizes="(min-width: 65em) 1040px, 100vw"
              items={[
                {
                  label: 'The ask, in the product',
                  text: (
                    <>
                      A test widget titled{' '}
                      <strong>&ldquo;Multiple metrics on a line chart?&rdquo;</strong> The question was
                      already on screen.
                    </>
                  ),
                  x: 7,
                  y: 65.5,
                  w: 36,
                  h: 4.5,
                },
                {
                  label: 'Two lines, then stop',
                  text: <>Ad Clicks and ACOS. The third metric had <strong>nowhere to go</strong>.</>,
                  x: 6.5,
                  y: 38.5,
                  w: 92,
                  h: 24,
                },
                {
                  label: 'Looks clickable',
                  text: <>The cloud in every header <strong>was not a button</strong>. Neither were the metric dots.</>,
                  x: 95.5,
                  y: 18.5,
                  w: 3.5,
                  h: 3.5,
                },
                {
                  label: 'Locked filters',
                  text: <>Set once at creation, then <strong>out of reach</strong>.</>,
                  x: 78.5,
                  y: 10.5,
                  w: 16.5,
                  h: 4,
                },
                {
                  label: 'Exit to edit',
                  text: <>A pencil that <strong>leaves the report</strong>. Editing was a different place.</>,
                  x: 88.5,
                  y: 94.5,
                  w: 10.5,
                  h: 4.5,
                },
              ]}
            />
          ),
        },
        {
          src: `${OLD}/widget-edit.png`,
          ...CAP,
          alt: 'The old report in edit mode: grey Add Widget bars between widgets, an Edit button on each, and a Done button at the bottom right',
          title: 'Edit mode',
          caption: 'Editing was a different page with different controls, reached through a pencil labeled Exit Report.',
        },
        {
          src: `${OLD}/traffic-two-metrics.png`,
          width: 2940,
          height: 1912,
          alt: "Predict's Traffic page: a two-line chart of Sales and Ad Sales with one axis on each side, above a row of metric cards",
          title: 'Two metrics, max',
          caption: "Predict's own Traffic page. Two metrics on two axes, the same limit the report widget inherited.",
        },
      ],
    },
    {
      step: 'Scoping',
      subtitle: 'I pitched big, then cut it down',
      body: 'I took the bigger opportunity to my design manager and the Director of Product. My first concept was a Slides-style report canvas. Engineering constraints made the canvas too big for this round, so we shipped a structured report instead. We scoped down to fixing report creation and the chart widget, the two places people were getting stuck.',
      visuals: [
        {
          alt: 'The cut canvas concept and the final design',
          title: 'Cut concept vs final design',
          caption: 'Use the toggle to compare the Slides-style canvas I cut with the structured report that replaced it.',
          element: (
            <CompareStage
              ariaLabel="The cut drag-and-drop canvas concept versus the structured report in the final design"
              layers={[
                {
                  src: `${IMG}/figma/canvas-concept.png`,
                  alt: 'The cut concept: a Slides-style report builder with a left rail of draggable widget thumbnails next to the report canvas',
                  label: 'Cut concept',
                  caption: '',
                  ...CAP,
                },
                {
                  node: (
                    <MockStage native={1180}>
                      <ReportPage />
                    </MockStage>
                  ),
                  label: 'Final design',
                  caption: '',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Creation',
      subtitle: 'A new report in three steps',
      body: "Creating a report used to mean a blank page. Now it's three steps: name it and pick the brands, set the timeframe and grain, and decide whether to compare periods. People land in a report that already has the right data.",
      visuals: [
        {
          alt: 'The create report flow',
          title: 'Create a report',
          caption: 'Name the report and set its scope, then set the default timeframe and whether to compare periods.',
          element: (
            <ShotRow
              shots={[
                {
                  src: `${IMG}/figma/modal-1.png`,
                  width: 1700,
                  height: 1560,
                  alt: 'Create New Custom Report, step one of three: name and description, then an explained choice between one filter for the whole report and unique filters per widget, and between dynamic brand selection and a specific brand group',
                },
                {
                  src: `${IMG}/figma/modal-2.png`,
                  width: 1700,
                  height: 1560,
                  alt: 'Create New Custom Report, step two of three: a default timeframe chosen from current, previous, trailing, or quarterly ranges, a view-by grain, and a compare-with toggle',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Charting',
      subtitle: 'Two metrics to six on one chart',
      body: 'The biggest ask was comparing more than two metrics. The new chart widget handles up to six, with lines and bars on two axes. It ended up replacing nearly every chart across Predict, not just in reports.',
      visuals: [
        {
          alt: 'The interactive multi-metric chart',
          title: 'Try the chart',
          caption: 'Live. Change metrics, marks, or the axis switch, and the chart, ticks, and header follow the same rules.',
          element: <MetricLab />,
        },
      ],
    },
    {
      step: 'Testing',
      subtitle: '24 testers, under 10 minutes a report',
      body: 'I tested with 12 brand managers and 12 ad strategists over two rounds. People could edit in place, change filters without leaving, and compare more than two metrics. Building a client report went from 30 to 60 minutes down to under 10.',
      visuals: [
        {
          alt: 'The redesigned widget, annotated',
          title: 'The redesigned widget',
          caption: 'Edit and filter controls sit on the widget itself, above the multi-metric chart. No mode switch.',
          element: (
            <Callouts
              src={`${IMG}/figma/widget-redesign.png`}
              alt="The redesigned report in its single combined mode, annotated: an Edit button and an editable filter chip sit on the widget itself, above a multi-metric chart"
              {...CAP}
              sizes="(min-width: 65em) 1040px, 100vw"
              items={[
                {
                  label: 'Edit in context',
                  text: <>The action sits on the widget. <strong>No mode switch.</strong></>,
                  x: 91,
                  y: 10.5,
                  w: 7,
                  h: 4,
                },
                {
                  label: 'Filters stay editable',
                  text: <>Scope can change <strong>after the report exists</strong>.</>,
                  x: 67,
                  y: 10.5,
                  w: 21,
                  h: 4,
                },
                {
                  label: 'More than two',
                  text: <>The multi-metric chart, <strong>presented and edited in one place</strong>.</>,
                  x: 6.5,
                  y: 16.5,
                  w: 92,
                  h: 14,
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Handoff',
      subtitle: 'Validated in testing, shipped after I left',
      body: "I handed off the designs at the end of my internship and the team shipped them after.",
      visuals: [
        {
          alt: 'Final designs, built in code',
          title: 'Final designs',
          caption: 'The redesigned reports home and a finished Q1 Business Review, rebuilt in code from the design file.',
          element: (
            <DeviceSet
              laptops={[
                <Macbook key="home">
                  <MockStage native={1180}>
                    <ReportsHome />
                  </MockStage>
                </Macbook>,
                <Macbook key="report">
                  <MockStage native={1180}>
                    <ReportPage />
                  </MockStage>
                </Macbook>,
              ]}
            />
          ),
        },
      ],
    },
  ],
}
