import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import BeforeAfterHero from '@/components/BeforeAfterHero'
import Reveal from '@/components/lucid/Reveal'
import ZoomShot from '@/components/lucid/ZoomShot'
import CompareStage from '@/components/lucid/CompareStage'
import ImpactStats from '@/components/lucid/ImpactStats'
import { Section, Prose, Bullets, Reframe, FactStrip } from '@/components/CaseStudy'
import { SITE } from '@/lib/site'

/*
 * Custom-built case study — this static route intentionally shadows the
 * generic /work/[slug] template, the same way app/work/lucid-ai and
 * app/work/awardco-login-flow-redesign do. The home-grid tile still reads
 * from lib/caseStudies.ts; everything below is bespoke to the Pattern story.
 *
 * Sourced from the 2026-08 interview record in case-studies/pattern/
 * (notes.md "FINAL BUILD DECISIONS" is binding):
 * - Canonical numbers only: Pendo ~60% trial / ~15% retention vs ~28–35%
 *   benchmarks, 30–60 min manual reporting, 50+ interviews, 20 test users,
 *   9 weeks. The old 35%/20%/80s stats and the 80%-adoption / +50%-
 *   satisfaction figures are cut — do not reintroduce them.
 * - The team built and shipped the redesign AFTER the internship: impact is
 *   "validated through usability testing and shipped after my internship".
 * - Filter override behavior is unverified — filters are described only as
 *   clearer and editable after creation.
 * - Screenshots are scrubbed: coworker names swapped, brand tag and dollar
 *   figures replaced (see case-studies/pattern/gaps.md).
 */

const TITLE = 'Custom Reports in Predict'
const DESCRIPTION =
  "Pattern's reporting tool had 60% trial and 15% retention — everyone tried it, nobody stayed. Starting from a one-line ticket, I made the case for a redesign, rebuilt the core experience in 9 weeks, and validated it with 20 users."

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

/*
 * The two personas, rebuilt in code rather than embedding the original Figma
 * cards (which had scrambled field labels). Will and Trista are personas Luke
 * created from the research — not real employees.
 */
const PERSONAS = [
  {
    name: 'Will',
    role: 'Ad Strategist',
    detail: 'Oversees ad spend across multiple client accounts',
    pains: [
      'One KPI per chart made comparing ad spend against sales lift impossible',
      'Exported Predict data to Excel and blended it with ad data by hand',
      'Found reports so rigid he avoided using them at all',
    ],
    goal: 'Connect ad performance with sales data in one report — and trust Predict as the one-stop tool.',
  },
  {
    name: 'Trista',
    role: 'Brand Manager',
    detail: 'Manages six mid-size consumer brands, client-facing every week',
    pains: [
      'Stitched one-metric dashboards together to tell one story',
      'Spent 30–60 minutes per brand assembling each report',
      'Screenshots and raw Excel exports looked unprofessional in client meetings',
    ],
    goal: 'Build a polished, multi-metric report fast enough to make it part of the weekly routine.',
  },
]

export default function PatternCaseStudy() {
  return (
    <div className="cs pcs min-h-screen bg-black text-white font-medium">
      <SiteNav
        width="article"
        contact={false}
        next={{ href: '/work/hoth', title: 'Hoth Landing Page' }}
      />

      <div className="max-w-[860px] mx-auto px-8 pb-32 sitenav-offset">
        {/* ── Hero ── */}
        <header className="pt-10 pb-12">
          <p className="cs-eyebrow mb-4">Pattern · Product Design Internship</p>
          <h1 className="text-4xl md:text-6xl font-medium leading-tight tracking-tight text-white">
            {TITLE}
          </h1>
          <p className="mt-5 text-xl text-white/85 leading-snug">
            Redesigning the reporting tool everyone tried once — so brand managers
            could build, edit, and share multi-metric client reports without falling
            back to Excel.
          </p>

          <FactStrip
            facts={[
              ['Role', 'Product Design Intern'],
              ['Timeline', 'Jan – Oct 2025 · 9-week project'],
              ['Team', 'Julie Broadbent (Design Manager) +1'],
            ]}
          />

          <ImpactStats
            stats={[
              { value: 50, suffix: '+', label: 'discovery interviews surfaced the problem' },
              { value: 20, label: 'daily users validated the redesign in live testing' },
              { value: 5, label: 'metrics on one chart — the old cap was two' },
              { value: 9, label: 'weeks from a one-line ticket to full handoff' },
            ]}
            kicker="Validated through usability testing and shipped by the team after my internship — the post-launch numbers belong to them, so this study claims only what testing showed."
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
          Drag across the frame: the old text list on the left, the redesigned
          home — templates plus a tile grid that shows each report before you
          open it — on the right.
        </p>

        <Reveal className="mt-14">
          <Prose>
            <p>
              Pattern&rsquo;s Predict platform tracks billions of ecommerce data
              points, and its Custom Reports tool was built to end the
              export-to-Excel reporting grind. A year in, almost nobody used it —
              not because nobody wanted it, but because the experience failed the
              people who tried. I found the problem through discovery interviews,
              made the case to rebuild it, redesigned the core report-building
              experience in nine weeks, and validated the redesign with twenty of
              the people who&rsquo;d abandoned the original. The team built and
              shipped it after my internship ended.
            </p>
          </Prose>
        </Reveal>

        {/* ── Origin ── */}
        <Section
          eyebrow="The origin"
          headline="My first project was a one-line ticket."
        >
          <Prose>
            <p>
              When I joined the Predict team, I was handed a small ClickUp ticket:
              let users duplicate a widget so they don&rsquo;t rebuild the same
              configuration over and over. Estimate: one to two days.
            </p>
            <p>
              Working the flow, I realized duplication treated a symptom. People
              cloned widgets because building and editing reports was slow,
              confusing, and inflexible. Instead of stopping at the ticket, I
              started pulling on the thread behind it.
            </p>
          </Prose>
          <figure className="my-12 max-w-[640px] mx-auto">
            <ZoomShot
              src={`${IMG}/clickup-ticket.png`}
              alt="The ClickUp ticket that started the project: Custom Reports — Duplicate Widget Option, status DEV HANDOFF, t-shirt size X Small, one to two days"
              width={821}
              height={581}
              sizes="(min-width: 860px) 640px, 100vw"
            />
            <figcaption className="cs-cap">
              The ticket that became the redesign. T-shirt size: X&nbsp;Small, one
              to two days.
            </figcaption>
          </figure>
        </Section>

        {/* ── Evidence ── */}
        <Section
          eyebrow="The evidence"
          headline="Everyone tried it. Nobody stayed."
        >
          <Prose>
            <p>
              Our team was reading <em>Continuous Discovery Habits</em> in book
              club, and I was running weekly discovery interviews with Predict
              users. Reporting workarounds kept surfacing in otherwise unrelated
              conversations — over 50 interviews across the internship, plus a
              focused session with four UK brand managers who had tried the
              original tool and walked away.
            </p>
            <p>
              Pendo told the other half of the story. Roughly 60% of eligible
              users had created at least one Custom Report in the feature&rsquo;s
              first year — strong demand. Only about 15% ever came back, against
              enterprise retention benchmarks around 28–35%. This wasn&rsquo;t a
              discovery problem or a demand problem. It was a usability problem.
            </p>
          </Prose>
          <Bullets
            items={[
              'Charts capped at two metrics — comparing ad spend against sales lift in one view was impossible',
              'Filters were locked at creation, and their effect on what you could build was opaque — so editing often meant rebuilding',
              'Separate view and edit modes hid basic actions like add, duplicate, and rearrange',
              'Assembling one client-ready report took 30–60 minutes across Predict, Excel, and slides — and still looked unpolished',
            ]}
          />
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/figma/old-home.png`}
              alt="The old Reports page: System Reports and Custom Reports as sub-tabs, with custom reports rendered as a plain text list and a context menu open on one row"
              width={2880}
              height={2048}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              Where the old tool lived: a sub-tab behind System Reports — a tab
              most users never touched — and every report a line of text with no
              preview.
            </figcaption>
          </figure>
          <div className="my-12">
            <CompareStage
              ariaLabel="The old report UI's two disconnected modes: preview mode versus edit mode"
              layers={[
                {
                  src: `${IMG}/figma/old-preview-mode.png`,
                  alt: 'The old report in preview mode: charts visible, editing controls hidden, an Exit Report button in the corner',
                  label: 'Preview mode',
                  caption:
                    'Preview mode: where you present — but touch nothing. Editing hides behind a separate mode.',
                  width: 2880,
                  height: 2048,
                },
                {
                  src: `${IMG}/figma/old-edit-mode.png`,
                  alt: 'The same old report in edit mode: Add Widget bars and Edit buttons appear, with a Done button in the corner',
                  label: 'Edit mode',
                  caption:
                    'Edit mode: the same report, different controls. Users lost track of which mode they were in.',
                  width: 2880,
                  height: 2048,
                },
              ]}
            />
          </div>
          <figure className="my-12 max-w-[560px] mx-auto">
            <ZoomShot
              src={`${IMG}/discovery-board.png`}
              alt="A discovery audit board: a grid of annotated screenshots of the old Custom Reports flows with green callout notes"
              width={628}
              height={633}
              sizes="(min-width: 860px) 560px, 100vw"
            />
            <figcaption className="cs-cap">
              The audit board — every screen of the old flow, annotated with what
              users said about it.
            </figcaption>
          </figure>
        </Section>

        {/* ── Users ── */}
        <Section eyebrow="The users" headline="Two jobs, one broken tool.">
          <Prose>
            <p>
              Custom Reports had to serve two internal roles with different jobs
              and the same workaround. I built a persona for each from the
              interviews:
            </p>
          </Prose>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {PERSONAS.map((p) => (
              <div
                key={p.name}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="cs-label-sm">{p.role}</p>
                <p className="mt-1 text-xl text-white font-medium">{p.name}</p>
                <p className="mt-1 text-sm text-white/60">{p.detail}</p>
                <ul className="mt-4 space-y-1.5">
                  {p.pains.map((pain) => (
                    <li key={pain} className="flex gap-2.5 text-sm text-white/85 leading-relaxed">
                      <span aria-hidden="true" className="text-[var(--accent)] flex-shrink-0">—</span>
                      {pain}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-white/70 leading-relaxed">
                  <span className="text-white">Goal:</span> {p.goal}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-white/60">
            Personas built from the research; names are fictional.
          </p>
        </Section>

        {/* ── Reframe ── */}
        <Reframe quote="The ticket is not the problem definition.">
          <Prose>
            <p className="mt-6">
              I synthesized the interview patterns and the Pendo data and brought
              the opportunity to the Predict product and design team. Once we
              agreed it was worth pursuing, I scoped a nine-week redesign with my
              design manager and our Director of Product, focused on the core
              loop: creating reports, configuring widgets and filters, and editing
              content. A duplicate-widget ticket had become a rebuild of the whole
              report-building experience.
            </p>
          </Prose>
        </Reframe>

        {/* ── Constraints ── */}
        <Section
          eyebrow="Constraints"
          headline="No new data. No new components. Not much engineering."
        >
          <Prose>
            <p>
              Three hard limits shaped every decision. I couldn&rsquo;t introduce
              new data sources — missing forecast, wholesale, and logistics
              metrics were platform gaps I could only document and escalate. I was
              bound to Predict&rsquo;s existing design system and component
              library. And engineering had capacity for a slice of the redesign,
              not all of it — so the scope became the smallest set of high-impact
              changes that could realistically ship.
            </p>
            <p>
              The sharpest cut was the drag-and-drop builder. A canvas where you
              drag metrics, layer dimensions, and build pivot-style reports
              matched advanced users&rsquo; mental models — and exceeded the
              engineering budget. I presented the user evidence and the trade-offs,
              leadership made the call, and my job became preserving the value —
              flexible report construction — inside a structured flow that could
              actually ship. Drag-and-drop went to the roadmap; so did per-brand
              report theming, which brands kept asking for.
            </p>
          </Prose>
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/figma/dragdrop-concept.png`}
              alt="The cut concept: a Google Slides-style report builder with a left rail of draggable widget thumbnails next to the report canvas"
              width={2880}
              height={2048}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              The mock that didn&rsquo;t ship: a Slides-style builder with a
              draggable thumbnail rail. Right mental model, wrong engineering
              budget — it lives on the roadmap.
            </figcaption>
          </figure>
        </Section>

        {/* ── The redesign ── */}
        <Section
          eyebrow="The redesign"
          headline="Guide the cold start. Get out of the way after."
        >
          <Prose>
            <p>
              With poor retention, most returning users were effectively beginners
              every time they opened the tool — so the redesign attacks the cold
              start first. The home screen leads with templates and a tile grid
              that previews every report. A large New Report button opens a guided
              modal flow that gathers just enough — name, scope, first widget —
              to land you in a working report, and a first-run wizard explains the
              toggles, settings, and timeframes that used to be opaque.
            </p>
          </Prose>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              {
                src: `${IMG}/figma/modal-general.png`,
                alt: 'Create New Custom Report modal, step one: name and description fields, then an explained choice between a single filter for the entire report and unique filters per widget, and between dynamic brand selection and a specified brand group',
                cap: 'Step one explains the choice that used to be invisible: one filter set for the whole report, or unique filters per widget.',
              },
              {
                src: `${IMG}/figma/modal-scenario.png`,
                alt: 'Create New Custom Report modal, scenario step: a timeframe picker with current, previous, and trailing periods, view-by aggregation, and compare-with options',
                cap: 'The scenario step: timeframes, aggregation, and comparisons picked with context instead of guessed at.',
              },
            ].map((f) => (
              <figure key={f.src} className="m-0">
                <ZoomShot
                  src={f.src}
                  alt={f.alt}
                  width={1700}
                  height={1560}
                  sizes="(min-width: 860px) 410px, 100vw"
                />
                <figcaption className="cs-cap">{f.cap}</figcaption>
              </figure>
            ))}
          </div>
          <Prose>
            <p className="mt-10">
              Inside a report, the view/edit split is gone — one mode serves both
              presenting and editing, with actions in context. Filters became
              clearer and editable after creation instead of locked in. And
              widgets finally reorder: a Widget Order list in the report settings
              with drag handles — the feasible version of reordering, shipped
              while the full canvas drag-and-drop waited on the roadmap.
            </p>
          </Prose>
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/figma/reorder-panel.png`}
              alt="The Edit General Info panel over a report, with a Widget Order list showing six charts, each with a drag handle for reordering"
              width={2880}
              height={2048}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              Reordering that could ship: drag the list, not the canvas. The
              whole report reorders from one panel.
            </figcaption>
          </figure>
          <Prose>
            <p>
              Charts broke the two-metric cap: multi-metric comparison, the
              single most requested capability, became the core of the in-report
              experience. Reports gained share and export, plus scheduled email
              sending, so the weekly client report could leave Predict without a
              screenshot. And because so much sharing happens asynchronously, a
              widget can now carry a note — the context a manager would otherwise
              write in the email next to a pasted screenshot travels with the
              chart itself.
            </p>
          </Prose>
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/figma/widget-redesign.png`}
              alt="The redesigned report widget in context: five metrics — Ad Clicks, ACOS, Ad Sales, Ad Spend, and Ad Orders — as color-coded stat headers above one dual-axis line chart"
              width={2880}
              height={2048}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              The redesigned widget: five metrics on one chart with color
              customization — the old tool allowed two.
            </figcaption>
          </figure>
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/figma/widget-notes.png`}
              alt="A report widget with a note beneath its title explaining what the chart shows and why, above the multi-metric stat row"
              width={2656}
              height={1086}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              Widget notes — one of the most requested features from testing:
              the &ldquo;why&rdquo; behind a chart rides along when it&rsquo;s
              exported or emailed to a brand.
            </figcaption>
          </figure>
        </Section>

        {/* ── Testing ── */}
        <Section
          eyebrow="Testing"
          headline="Twenty users killed my favorite assumption."
        >
          <Prose>
            <p>
              The people this tool was for sat in the same office, so I tested
              with them directly: twenty live usability sessions — ten brand
              managers, ten ad strategists — on the redesigned flows.
            </p>
            <p>
              I assumed people wanted a clean separation between viewing a report
              and editing it. Watching them work killed that: managers present
              reports live and edit the graphs on the fly, with the client in the
              room. A separate edit mode was friction in the exact moment the tool
              had to shine. The shipped design uses one combined mode.
            </p>
            <p>
              Filters were the other reversal. In the old tool, the filters you
              chose at creation were permanent, and they silently constrained
              which metrics and charts you could build — users never understood
              why things wouldn&rsquo;t work. The redesign makes filter setup
              informed up front, and filters editable after the report exists.
            </p>
          </Prose>
        </Section>

        {/* ── Templates ── */}
        <Section
          eyebrow="The templates"
          headline="I didn’t design the templates. I ran a contest for them."
        >
          <Prose>
            <p>
              The Templates feature needed starting points that reflected real
              reporting work, not a designer&rsquo;s guess at it. So I ran a
              report-building competition across the brand managers and ad
              strategists — prizes included — to see who could build the best
              reports in the new system. The winning reports became the shipped
              templates, and the contest doubled as another round of honest
              feedback from the tool&rsquo;s toughest audience.
            </p>
          </Prose>
        </Section>

        {/* ── Outcome ── */}
        <Section eyebrow="Outcome" headline="Validated in testing. Shipped after I left.">
          <Prose>
            <p>
              My internship ended before the rebuild reached production, so
              I&rsquo;m careful about what I claim. The redesign was validated
              through usability testing and shipped by the team after my
              internship — the post-launch numbers belong to them.
            </p>
          </Prose>
          <Bullets
            items={[
              'Twenty daily users built multi-metric reports quickly and confidently in testing, against a 30–60 minute manual baseline',
              'The two-metric chart cap is gone; one combined mode replaced the view/edit split; filters are editable after creation',
              'Templates seeded from contest-winning reports built by the tool’s actual users',
              'Full handoff: annotated specs, the prototype, documentation, a backlog, and a follow-up testing plan for the next team',
            ]}
          />
        </Section>

        {/* ── Reflection ── */}
        <Section
          eyebrow="Reflection"
          headline="More features would have made it worse."
        >
          <Prose>
            <p>
              My first instinct was wrong. Every user I interviewed had a
              different power request, each vital to their own workflow, and early
              on I believed building all of it would make the perfect tool. It
              would have made a slow, overbearing one — and an unbuildable one.
              The discipline of the project was separating the biggest lifts that
              helped every user from the requests that helped one, and protecting
              a simple core experience, because complexity was the original
              product&rsquo;s actual failure.
            </p>
            <p>
              This project also rewired what I think my job is. I don&rsquo;t
              wait for a defined problem anymore — I watch for friction, ask why
              it exists, and turn it into something worth investigating. The
              ticket is the symptom; the workflow around it is the problem. And a
              design that ships beats a design that impresses: pressure-test what
              users actually need to decide before polishing the interface they
              decide it on.
            </p>
            <p>
              With more time, I&rsquo;d have built custom brand themes for
              reports — brands loved seeing their own colors in client decks, and
              it was cut purely for roadmap capacity.
            </p>
          </Prose>
        </Section>

        {/* ── Prev / next ── */}
        <nav
          className="worknav mt-24 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4"
          aria-label="More work"
        >
          <Link href="/work/awardco-login-flow-redesign" className="footer-link -ml-4">
            ← Reducing Authentication Friction
          </Link>
          <Link href="/work/hoth" className="footer-link -mr-4 ml-auto text-right">
            Hoth Landing Page →
          </Link>
        </nav>
      </div>

      <Footer width="article" />
    </div>
  )
}
