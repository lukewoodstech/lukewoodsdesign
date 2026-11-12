import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import ReadNext from '@/components/ReadNext'
import BigStats from '@/components/cs/BigStats'
import { Macbook } from '@/components/cs/Devices'
import MockStage from '@/components/predict/MockStage'
import ReportsHome from '@/components/predict/ReportsHome'
import Sections from '@/components/sections/Sections'
import { Band, Block, Col, MetaGrid, Pill, Problem, StoryTitle } from '@/components/cs/Story'
import { SITE } from '@/lib/site'
import { companyAbout } from '@/lib/caseStudies'
import { pattern } from '@/lib/sections/pattern'

/*
 * Custom-built case study: this static route shadows the generic
 * /work/[slug] template. The home-grid tile still reads lib/caseStudies.ts.
 *
 * Visual-first edition (Luke, 2026-11-11): the same section system as
 * Lucid. A hero, the problem banner and the testing numbers, then sections
 * of one text card and its visuals, from lib/sections/pattern.tsx. The copy
 * is Luke's; [bracketed] text is his placeholder.
 *
 * Canonical numbers: Pendo ~60% tried / ~15% came back, 24 usability
 * sessions (12 + 12), 2 to 6 metrics, under 10 minutes vs the 30 to 60
 * minute baseline. This edition's copy says the redesign shipped after the
 * internship, which reverses the 2026-11-09 "never say it shipped" note.
 */

const TITLE = 'Custom Reports in Predict'
const SUMMARY =
  "Predict's reporting tool was so rigid that brand managers built client reports in Excel instead. I found the problem through a small ticket, pitched the bigger opportunity, and owned the redesign through two rounds of testing before handing it off. It shipped after my internship."

export const metadata: Metadata = {
  title: `${TITLE} · Pattern`,
  description: SUMMARY,
  alternates: { canonical: '/work/pattern-custom-reports' },
  openGraph: {
    type: 'article',
    title: `${TITLE} · ${SITE.name}`,
    description: SUMMARY,
    url: '/work/pattern-custom-reports',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} · ${SITE.name}`,
    description: SUMMARY,
  },
}

export default function PatternCaseStudy() {
  return (
    <div
      className="cs pcs cs-surface cs-story min-h-screen text-white"
      style={{ '--accent': pattern.accent } as React.CSSProperties}
    >
      <SiteNav next={{ href: '/work/lucid-ai', title: 'Bringing Lucid AI to the homepage' }} />

      <main id="main" className="sitenav-offset pb-24">
        {/* ══ Hero ══ */}
        <Col>
          <header className="pt-10">
            <StoryTitle dim="in Predict">Custom Reports</StoryTitle>
            <MetaGrid
              stacked
              summary={<p>{SUMMARY}</p>}
              facts={[
                { label: 'Company', value: companyAbout('pattern-custom-reports'), span: true },
                { label: 'Role', value: 'Product Design Intern' },
                { label: 'Timeline', value: 'January to October 2025' },
                { label: 'Team', value: 'design lead, UX manager, PM, Director of Product' },
                { label: 'Tools', value: 'Figma, Pendo, ClickUp' },
              ]}
            />
          </header>
        </Col>

        {/* The redesigned Custom Reports home, built in code, on a laptop */}
        <Band tone="accent" className="pcs-hero-band">
          <figure className="m-0">
            <Macbook>
              <MockStage native={1180}>
                <ReportsHome />
              </MockStage>
            </Macbook>
          </figure>
        </Band>

        {/* ══ The problem ══ */}
        <Band dust flush>
          <Col>
            <Problem iconSrc="/logos/pattern.png" iconAlt="Pattern">
              How might we let brand managers <em>build and share a client-ready report</em> without
              falling back to Excel?
            </Problem>
          </Col>
        </Band>

        {/* ══ From usability testing ══ */}
        <Col wide>
          <Block className="cs-centered">
            <Pill>From usability testing</Pill>
            <BigStats
              small
              stats={[
                { value: 'Under 10', caption: 'min to build a report, down from 30 to 60' },
                { value: '2 to 6', caption: 'metrics on one chart' },
                { value: 24, caption: 'usability sessions' },
                { value: '[+50%]', caption: '[satisfaction, or cut]' },
              ]}
            />
          </Block>
        </Col>

        <Sections sections={pattern.sections} />

        <ReadNext current="pattern" />
      </main>

      <Footer width="article" />
    </div>
  )
}
