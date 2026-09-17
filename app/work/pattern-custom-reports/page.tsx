import type { Metadata } from 'next'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import BeforeAfterHero from '@/components/BeforeAfterHero'
import AwardcoMobileTile from '@/components/AwardcoMobileTile'
import LucidTile from '@/components/LucidTile'
import Reveal from '@/components/lucid/Reveal'
import CompareStage from '@/components/lucid/CompareStage'
import ImpactStats from '@/components/lucid/ImpactStats'
import { Section, Prose, Bullets, FactStrip } from '@/components/CaseStudy'
import { SITE } from '@/lib/site'

/*
 * Custom-built case study: this static route intentionally shadows the
 * generic /work/[slug] template, the same way app/work/lucid-ai and
 * app/work/awardco-login-flow-redesign do. The home-grid tile still reads
 * from lib/caseStudies.ts; everything below is bespoke to the Pattern story.
 *
 * Copy is Luke's (rewrite of 2026-09-16, ~950 words, recruiter-first).
 * Sourced from the 2026-08 interview record in case-studies/pattern/
 * (notes.md "FINAL BUILD DECISIONS" is binding):
 * - Canonical numbers only: Pendo ~60% trial / ~15% return, 50+ discovery
 *   interviews across the internship, 20 usability sessions, 2 → 5 metrics,
 *   9 weeks. No "400+ hours per week", no adoption / retention / revenue /
 *   time-saved claims, no "everyone tried it, nobody stayed".
 * - The team built and shipped the redesign AFTER the internship: outcomes
 *   are "validated through usability testing and shipped after my internship".
 * - Filter override behavior is unverified, so filters are described only as
 *   clearer and editable after creation.
 * - Deliberately not rendered (assets stay in the repo): discovery-board,
 *   old-edit-mode, modal-scenario, the Will/Trista personas, the
 *   design/code/business strip, the Luke AI prompts.
 * - Screenshots render as plain full-width images (no ZoomShot lightbox):
 *   the visuals are sized to be read in place.
 * - Hero metrics are passed as strings so ImpactStats renders them static
 *   instead of counting up from zero.
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
    <div className="cs pcs min-h-screen bg-black text-white">
      {/* No `next` while the Hoth study is hidden (HIDDEN_TILES in CanvasBits). */}
      <SiteNav width="article" contact={false} />

      <div className="max-w-[860px] mx-auto px-8 pb-32 sitenav-offset">
        {/* ── Hero ── */}
        <header className="pt-10 pb-12">
          <p className="cs-eyebrow mb-4">Pattern · Product Design Internship</p>
          <h1 className="cs-title">
            {TITLE}
          </h1>
          <p className="cs-lede">
            Redesigning a rigid reporting workflow so brand managers could build,
            edit, and share multi-metric client reports without falling back to
            Excel.
          </p>

          <FactStrip
            facts={[
              ['Role', 'Product Design Intern'],
              ['Timeline', 'Jan – Oct 2025 · 9-week project'],
              ['Team', 'Design, product, and engineering'],
            ]}
          />

          {/* String values render static: no count-up from zero. */}
          <ImpactStats
            eyebrow="Project at a glance"
            stats={[
              { value: '50+', label: 'discovery interviews across my internship' },
              { value: '20', label: 'usability sessions on the redesign' },
              { value: '2 → 5', label: 'metrics on one chart' },
              { value: '9', label: 'weeks from ticket to handoff' },
            ]}
            kicker="Validated through usability testing and shipped by the team after my internship. This case study only claims what I observed before handoff."
          />
        </header>

        <BeforeAfterHero
          beforeSrc={`${IMG}/figma/old-home.png`}
          afterSrc={`${IMG}/figma/new-home.png`}
          beforeAlt="The old Custom Reports home: a plain text list of reports hidden behind a Custom Reports sub-tab, with no previews"
          afterAlt="The redesigned Custom Reports home: a template row on top and a grid of report tiles, each with a live chart preview, title, and sharing state"
          aspect={1440 / 1024}
        />
        <p className="cs-cap">
          Drag across the frame. The old home was a text list with no previews.
          The redesign leads with templates and shows each report before it is
          opened.
        </p>

        {/* ── Opening ── */}
        <Reveal className="mt-12">
          <Prose>
            <p>
              Pattern&rsquo;s Predict platform helps brand managers and advertising
              strategists understand ecommerce performance. Custom Reports was
              supposed to replace the work of combining Predict data in Excel and
              presentation slides.
            </p>
            <p>
              The original tool could not support the way people actually reported.
              Charts allowed only two metrics, filters were difficult to change,
              editing was hidden behind a separate mode, and the final output was
              not ready to share with clients.
            </p>
            <p>
              I found the problem while working on a small feature request, brought
              the larger opportunity to the Predict team, and owned a nine-week
              redesign of the core reporting workflow.
            </p>
          </Prose>
        </Reveal>

        {/* ── Origin ── */}
        <Section headline="A one-line ticket exposed a much larger problem.">
          <Prose>
            <p>
              My first assignment was a small ClickUp ticket: let users duplicate a
              widget so they would not have to rebuild the same configuration. It
              was estimated at one or two days.
            </p>
            <p>
              As I worked through the flow, duplication started to look like a
              symptom. Users were cloning widgets because creating and editing
              reports was slow, rigid, and repetitive.
            </p>
            <p>
              Instead of stopping at the requested feature, I looked at the
              workflow surrounding it. That investigation turned a duplicate-widget
              ticket into a proposal to redesign the core report-building
              experience.
            </p>
          </Prose>
          <figure className="my-12">
            <Image
              src={`${IMG}/clickup-ticket.png`}
              alt="The ClickUp ticket that started the project, titled Custom Reports, Duplicate Widget Option, status DEV HANDOFF, t-shirt size X Small, one to two days"
              width={821}
              height={581}
              sizes="(min-width: 860px) 860px, 100vw"
              className="lcs-shot"
            />
            <figcaption className="cs-cap">
              A one-to-two-day duplication ticket revealed problems across the
              entire reporting workflow.
            </figcaption>
          </figure>
        </Section>

        {/* ── Evidence ── */}
        <Section headline="The problem wasn’t demand. It was what happened after the first report.">
          <Prose>
            <p>
              I ran weekly discovery interviews throughout my Pattern internship.
              Reporting workarounds repeatedly appeared in conversations about
              other parts of Predict. I also held a focused session with four UK
              brand managers who had used Custom Reports.
            </p>
            <p>
              Available product data showed that roughly 60% of eligible users
              created at least one report during the feature&rsquo;s first year,
              but only about 15% returned. That suggested people understood the
              potential value but did not find the existing workflow useful enough
              to repeat.
            </p>
            <p>The research revealed four recurring problems:</p>
          </Prose>
          <Bullets
            items={[
              'Charts allowed only two metrics, making comparison difficult.',
              'Filters were unclear and could not be edited after creation.',
              'Separate view and edit modes hid basic actions.',
              'Preparing a client-ready report still required Excel, screenshots, or slides.',
            ]}
          />
          <Prose className="mt-6">
            <p>
              I brought the evidence to the Predict product and design team. With
              my design manager and Director of Product, I scoped a nine-week
              project around the highest-value workflow: creating reports,
              configuring widgets and filters, and editing report content.
            </p>
          </Prose>
          <figure className="my-12">
            <Image
              src={`${IMG}/figma/old-preview-mode.png`}
              alt="The old report in preview mode: a two-metric line chart with editing controls hidden and an Exit Report button in the corner"
              width={2880}
              height={2048}
              sizes="(min-width: 860px) 860px, 100vw"
              className="lcs-shot"
            />
            <figcaption className="cs-cap">
              The original tool separated viewing from editing and limited each
              chart to two metrics.
            </figcaption>
          </figure>
        </Section>

        {/* ── Constraints ── */}
        <Section headline="The most flexible concept was the one we couldn’t build.">
          <Prose>
            <p>
              The largest constraint was engineering capacity. I could not
              introduce new data sources, replace Predict&rsquo;s design system, or
              assume the team could rebuild the report builder from scratch.
            </p>
            <p>
              I explored a Slides-style canvas where users could drag charts, layer
              dimensions, and build highly customized reports. It matched the
              mental model of advanced users, but it exceeded the engineering
              budget.
            </p>
            <p>
              I presented the concept, user evidence, and tradeoffs. Leadership
              made the scope decision, and I focused on preserving the most
              important value inside a structured experience the team could ship.
            </p>
            <p>
              The full canvas moved to the roadmap. Reordering shipped through a
              simpler list with drag handles. Users still gained control over
              report structure without requiring the team to build an entirely new
              editing system.
            </p>
          </Prose>
          <div className="my-12">
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
          </div>
        </Section>

        {/* ── The redesign ── */}
        <Section headline="The redesign guided the first report, then got out of the way.">
          <Prose>
            <p>
              Because many users did not return after their first attempt, the
              redesign focused first on making report creation easier to
              understand.
            </p>
            <p>
              The new home replaced a text list with templates and visual report
              previews. A guided creation flow collected the report name, scope,
              filters, and first widget before placing the user inside a working
              report.
            </p>
            <p>Once inside, users could:</p>
          </Prose>
          <Bullets
            items={[
              'Compare up to five metrics in one chart',
              'Edit filters after creating the report',
              'Add, duplicate, delete, and reorder widgets',
              'Attach notes that travel with shared charts',
              'Export, share, or schedule report delivery',
            ]}
          />
          <Prose className="mt-6">
            <p>
              The goal was not to expose every reporting option immediately. It
              was to help users create a useful first report and reveal more
              control when they needed it.
            </p>
          </Prose>
          <figure className="my-12">
            <Image
              src={`${IMG}/figma/modal-general.png`}
              alt="Create New Custom Report modal, step one: name and description fields, then an explained choice between a single filter for the entire report and unique filters per widget, and between dynamic brand selection and a specified brand group"
              width={1700}
              height={1560}
              sizes="(min-width: 860px) 860px, 100vw"
              className="lcs-shot"
            />
            <figcaption className="cs-cap">
              The creation flow explained report scope and filters before they
              could silently limit the report.
            </figcaption>
          </figure>
          <figure className="my-12">
            <Image
              src={`${IMG}/figma/widget-notes.png`}
              alt="The redesigned report widget: five metrics as color-coded stat headers above one dual-axis line chart, with a note beneath the title explaining what the chart shows"
              width={2656}
              height={1086}
              sizes="(min-width: 860px) 860px, 100vw"
              className="lcs-shot"
            />
            <figcaption className="cs-cap">
              Five metrics could now appear on one chart, replacing the original
              two-metric cap.
            </figcaption>
          </figure>
        </Section>

        {/* ── Testing ── */}
        <Section headline="Testing removed the boundary between viewing and editing.">
          <Prose>
            <p>
              I tested the redesigned flows with 20 users: ten brand managers and
              ten advertising strategists.
            </p>
            <p>
              I expected them to prefer a clean separation between presenting a
              report and editing it. Testing showed the opposite. Brand managers
              often edited charts while presenting them to a client. Switching
              modes added friction at the moment they needed the tool to feel most
              responsive.
            </p>
            <p>
              I removed the separate edit mode and combined viewing and editing
              into one experience. Actions appeared in context, and filters
              remained editable after report creation.
            </p>
            <p>
              This was the most important change testing produced. It simplified
              the interface while supporting the way reports were actually used.
            </p>
          </Prose>
          <figure className="my-12">
            <Image
              src={`${IMG}/figma/widget-redesign.png`}
              alt="The redesigned report in its single combined mode: an Edit button and editable filter chip sit on the widget itself, above a multi-metric chart"
              width={2880}
              height={2048}
              sizes="(min-width: 860px) 860px, 100vw"
              className="lcs-shot"
            />
            <figcaption className="cs-cap">
              Testing showed that presenting and editing were part of the same
              workflow, so the final design stopped separating them.
            </figcaption>
          </figure>
        </Section>

        {/* ── Templates ── */}
        <Section headline="The templates came from the people who built reports every week.">
          <Prose>
            <p>
              I did not want to invent templates based on my assumptions about a
              good client report.
            </p>
            <p>
              Instead, I ran a report-building competition with brand managers and
              advertising strategists. Participants used the new system to create
              the reports they found most useful in their actual work. The
              strongest entries became the starting templates in the product.
            </p>
            <p>
              The competition produced more realistic templates and gave me
              another round of feedback from the people most familiar with the
              workflow.
            </p>
          </Prose>
        </Section>

        {/* ── Outcome ── */}
        <Section headline="Validated in testing and shipped after my internship.">
          <Prose>
            <p>
              The redesign was validated through 20 usability sessions and shipped
              by the Pattern team after my internship.
            </p>
            <p>By handoff:</p>
          </Prose>
          <Bullets
            items={[
              'Users could build reports with up to five metrics per chart.',
              'One combined mode replaced the separate viewing and editing experiences.',
              'Filters could be changed after report creation.',
              'Reports could be reordered, annotated, shared, and exported.',
              'User-created reports supplied the initial template library.',
            ]}
          />
          <Prose className="mt-6">
            <p>
              I delivered annotated designs, the prototype, supporting
              documentation, a prioritized backlog, and a follow-up testing plan.
            </p>
          </Prose>
        </Section>

        {/* ── Reflection ── */}
        <Section headline="More features would have recreated the original problem.">
          <Prose>
            <p>
              My first instinct was to include everything users requested. Every
              brand manager and advertising strategist had features that felt
              essential to their individual workflow.
            </p>
            <p>
              Trying to build all of them would have produced another complicated
              report builder. The harder and more valuable work was identifying
              the changes that improved the core workflow for everyone, then
              fitting them inside what engineering could support.
            </p>
            <p>
              The redesign still did not solve missing forecast, wholesale, or
              logistics data. Those were platform limitations, not interface
              problems. If I continued the work, I would measure whether users
              returned to build a second report and investigate the platform gaps
              preventing Predict from becoming their complete reporting tool.
            </p>
          </Prose>
        </Section>

        {/* ── Read next ── */}
        <Section eyebrow="Read next">
          <div className="cs-next">
            <LucidTile />
            <AwardcoMobileTile />
          </div>
        </Section>
      </div>

      <Footer width="article" />
    </div>
  )
}
