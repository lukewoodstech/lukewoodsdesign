import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import ReadNext from '@/components/ReadNext'
import HeroMock from '@/components/cs/HeroMock'
import BigStats from '@/components/cs/BigStats'
import Laptop from '@/components/cs/Laptop'
import Sections from '@/components/sections/Sections'
import { Band, Block, Col, MetaGrid, Pill, Problem, StoryTitle } from '@/components/cs/Story'
import { SITE } from '@/lib/site'
import { lucid } from '@/lib/sections/lucid'

/*
 * Custom-built case study: this static route shadows the generic
 * /work/[slug] template. The home-grid tile still reads lib/caseStudies.ts.
 *
 * Visual-first edition (Luke, 2026-11-11): a hero, then sections of one
 * text card and its visuals, rendered from lib/sections/lucid.tsx by the
 * shared components/sections system. The copy is Luke's. The problem banner and the
 * impact numbers are kept from the earlier edition (Luke, 2026-11-11).
 * Rules that still bind: no internal project or team names, no colleague
 * names, no long-term adoption numbers, and the diagram skill is "Build a
 * diagram" (never its internal name).
 */

const TITLE = 'Bringing Lucid AI to the homepage'
const SUMMARY =
  "An AI assistant on the Lucid homepage that helps people find, understand, and create work, even when they don't remember a document's title. Shipped to every Lucid tier on August 5."

export const metadata: Metadata = {
  title: `${TITLE} · Lucid`,
  description: SUMMARY,
  alternates: { canonical: '/work/lucid-ai' },
  openGraph: {
    type: 'article',
    title: `${TITLE} · ${SITE.name}`,
    description: SUMMARY,
    url: '/work/lucid-ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} · ${SITE.name}`,
    description: SUMMARY,
  },
}

export default function LucidCaseStudy() {
  return (
    <div
      className="cs lcs cs-surface cs-story min-h-screen text-white"
      style={{ '--accent': lucid.accent } as React.CSSProperties}
    >
      <SiteNav
        next={{ href: '/work/awardco-login-flow-redesign', title: 'Reducing Authentication Friction' }}
      />

      <main id="main" className="sitenav-offset pb-24">
        {/* ══ Hero ══ */}
        <Col>
          <header className="pt-10">
            <StoryTitle dim="to the homepage">Bringing Lucid AI</StoryTitle>
            <MetaGrid
              stacked
              summary={<p>{SUMMARY}</p>}
              facts={[
                { label: 'Role', value: 'Product Design Intern' },
                { label: 'Timeline', value: 'May to August 2026' },
                { label: 'Team', value: 'PM, design manager, search and AI engineering teams' },
              ]}
            />
          </header>
        </Col>

        {/* The live Find docs loop, behind a laptop's glass */}
        <Band tone="accent" crop className="cs-hero-band">
          <Laptop>
            <HeroMock />
          </Laptop>
        </Band>

        {/* ══ The problem ══ */}
        <Band dust flush>
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
                {
                  value: 12,
                  caption: (
                    <>
                      weeks from a blank page to <strong>general availability</strong>
                    </>
                  ),
                },
                {
                  value: 3,
                  caption: (
                    <>
                      <strong>core skills</strong> shipped: find, summarize, build
                    </>
                  ),
                },
                {
                  value: 20,
                  suffix: '+',
                  caption: <>capabilities prototyped and tested before the cut</>,
                },
                {
                  value: 'All',
                  caption: (
                    <>
                      Lucid tiers at release, <strong>free through enterprise</strong>
                    </>
                  ),
                },
              ]}
            />
          </Block>
        </Col>

        <Sections sections={lucid.sections} />

        <ReadNext current="lucid-ai" />
      </main>

      <Footer width="article" />
    </div>
  )
}
