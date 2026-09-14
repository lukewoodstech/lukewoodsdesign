import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import BeforeAfterHero from '@/components/BeforeAfterHero'
import Reveal from '@/components/lucid/Reveal'
import ZoomShot from '@/components/lucid/ZoomShot'
import CompareStage from '@/components/lucid/CompareStage'
import { Section, Prose, Bullets, Reframe, FactStrip, ThreeLenses, AskLukeAi } from '@/components/CaseStudy'
import { SITE } from '@/lib/site'

/*
 * Custom-built case study — this static route intentionally shadows the
 * generic /work/[slug] template, the same way app/work/lucid-ai does. The
 * home-grid tile still reads from lib/caseStudies.ts; everything below is
 * bespoke to the Awardco story.
 *
 * Sourced from the 2026-08-24 interview record in case-studies/awardco/
 * (notes.md is the single source of truth for numbers and claims):
 * - Canonical metrics only: 45.9M attempts / 1 year, 7.7M failures,
 *   password 34.6% vs SSO 98%, 9,275 support cases / 90 days.
 * - 25% faster login and +4.5% sign-ins are BEFORE/AFTER TESTING results
 *   and are always framed that way.
 * - Implementation happened after the internship per the team's roadmap —
 *   the page says "handed off", not "live".
 * - Excluded per the scrub list: Tableau dashboard, Confluence screenshot,
 *   raw query output. Customer-branded mockups and team quotes are cleared
 *   (Luke's call 2026-08-24; quote consent obtained).
 */

const TITLE = 'Reducing Authentication Friction'
const DESCRIPTION =
  'Awardco logged 7.7 million failed logins in a year. I redesigned authentication into one guided path across SSO, MFA, and mobile — in testing, login time dropped 25% and successful sign-ins rose 4.5%.'

export const metadata: Metadata = {
  title: `${TITLE} · Awardco`,
  description: DESCRIPTION,
  alternates: { canonical: '/work/awardco-login-flow-redesign' },
  openGraph: {
    type: 'article',
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
    url: '/work/awardco-login-flow-redesign',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
  },
}

const IMG = '/work/awardco'

export default function AwardcoCaseStudy() {
  return (
    <div className="cs acs min-h-screen bg-black text-white font-medium">
      <SiteNav
        width="article"
        contact={false}
        next={{ href: '/work/pattern-custom-reports', title: 'Custom Reports in Predict' }}
      />

      <div className="max-w-[860px] mx-auto px-8 pb-32 sitenav-offset">
        {/* ── Hero ── */}
        <header className="pt-10 pb-12">
          <p className="cs-eyebrow mb-4">Awardco · Product Design Internship</p>
          <h1 className="text-4xl md:text-6xl font-medium leading-tight tracking-tight text-white">
            {TITLE}
          </h1>
          <p className="cs-lede">
            Turning 7.7 million failed logins into a unified, guided authentication
            system across SSO, MFA, and standard login.
          </p>

          <FactStrip
            facts={[
              ['Role', 'Product Design Intern'],
              ['Timeline', 'Oct 2025 – Apr 2026'],
              ['Team', 'Natalie McKenzie (PM) +2'],
            ]}
            impact={[
              '27s → 5.9s login decision (−78%)',
              '25% faster login',
              '+4.5% successful sign-ins',
            ]}
            impactLabel="Impact — before/after testing"
          />
        </header>

        <BeforeAfterHero
          beforeSrc="/before.png"
          afterSrc="/after.png"
          beforeAlt="Awardco's original login screen, showing every authentication method at once"
          afterAlt="The redesigned Awardco login screen, leading with single sign-on"
          aspect={2016 / 1270}
        />
        <p className="cs-cap">
          Drag across the frame: the old login on the left, the redesign on the right.
        </p>

        <ThreeLenses
          design="One guided path across SSO, MFA, reset, and mobile: the system routes you from your email instead of asking you to choose."
          code="Prototypes built as working code so testers could really type; the fix drawn as states and transitions, passed security review unchanged."
          business="7.7M failed logins a year and the top support topic. I chose the slower design because it routed people to the method that works."
        />

        <Reveal className="mt-14">
          <Prose className="cs-prose--intro">
            <p>
              Awardco is a B2B employee-recognition platform, and every company on it
              configures authentication differently — SSO, passwords, MFA, login codes.
              The result was a fragmented login experience that quietly became the
              platform&rsquo;s biggest point of friction: a year of login telemetry
              showed 7.7 million failed attempts, and login help was the top
              customer-support topic. I redesigned authentication end-to-end into a
              single guided path across mobile and desktop, validated it with 20+
              external users and a 75-person internal study, took the system through
              architecture and security review, and handed it off for the team to
              build on their roadmap. In before/after testing, login time dropped 25%
              and successful sign-ins rose 4.5%.
            </p>
          </Prose>
        </Reveal>

        {/* ── Context ── */}
        <Section
          eyebrow="Context"
          headline="Every company logs in differently. Every user paid for it."
        >
          <Prose>
            <p>
              Two surfaces had to work together: a universal login page for anyone who
              didn&rsquo;t know their company&rsquo;s domain, and a company login page
              configured per organization. The universal page only <em>identified</em>{' '}
              you — after entering an email and a login code, you landed on your
              company&rsquo;s page and had to fully authenticate again, often with a
              second code. Users thought the system was broken.
            </p>
            <p>
              The old sign-in surface made it worse: several competing primary
              buttons, an &ldquo;SSO Login&rdquo; button that never said whether it
              meant Google or Microsoft, and a reset flow that looked like a different
              product entirely.
            </p>
          </Prose>
          <div className="mt-8 grid gap-6 sm:grid-cols-[1.55fr_1fr] items-start">
            <figure className="m-0">
              <ZoomShot
                src={`${IMG}/figma/old-login-web.png`}
                alt="The old Awardco login page: a generic Sign in with SSO primary button stacked above a card with email code sign-in and a Sign in with Password option — three competing calls to action"
                width={2880}
                height={2048}
                sizes="(min-width: 860px) 520px, 100vw"
              />
              <figcaption className="cs-cap">
                The old login: three competing calls to action, none of them labeled
                with the provider users actually recognized.
              </figcaption>
            </figure>
            {/* Phone frames render near their natural size, so the zoom
                lightbox (capped at 88vh) would "expand" to the same size or
                smaller — plain images, no expand affordance. */}
            <figure className="m-0">
              <Image
                src={`${IMG}/figma/old-mobile.png`}
                alt="The old mobile login screen stacking the same three call-to-action buttons on a small screen"
                width={1170}
                height={2534}
                sizes="(min-width: 860px) 300px, 60vw"
                className="w-full h-auto rounded-lg border border-white/10"
              />
              <figcaption className="cs-cap">
                The same stack on mobile — where most deskless workers live.
              </figcaption>
            </figure>
          </div>
        </Section>

        {/* ── Evidence ── */}
        <Section eyebrow="The evidence" headline="I didn’t inherit a case. I built one.">
          <Prose>
            <p>
              My PM brought me a known pain point: heavy support volume around login.
              I turned it into a quantified case — I pulled the support numbers,
              interviewed account managers and customer-success reps, ran discovery
              sessions, and had our tech lead query a year of login attempts broken
              down by method.
            </p>
          </Prose>
          <Bullets
            items={[
              '45.9M login attempts in one year — 7.7M failed, 6.7M of those from password login alone',
              'Password login succeeded just 34.6% of the time; SSO succeeded 98% across 32M+ logins, login codes 87.6%, MFA 86.2%',
              '9,275 login-help support cases in 90 days — 4,206 by web, 3,228 by phone, 1,841 by email',
              'Deskless workers were hit hardest: login codes went to work email they couldn’t open on their phones, and there was no SMS fallback',
            ]}
          />
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/failed-logins-data.png`}
              alt="Charts from a year of login telemetry: password login shows 6.69 million failures against 3.54 million successes, while SSO, login codes, and MFA all succeed 86 to 98 percent of the time"
              width={1433}
              height={806}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              A year of login telemetry: password login drove failure at scale while
              every guided method quietly worked.
            </figcaption>
          </figure>
        </Section>

        {/* ── Reframe ── */}
        <Reframe
          quote={<>7.7 million failures weren&rsquo;t security issues. They were UX failures.</>}
        >
          <Prose>
            <p className="mt-6">
              Users weren&rsquo;t choosing wrong passwords — they were choosing wrong
              methods. That reframe produced the strategy: design for the worst case
              first (a deskless worker on a phone with no work email), remove choice
              by routing users automatically from email to the right method, and
              standardize on one system with one predictable path.
            </p>
          </Prose>
        </Reframe>

        {/* ── The decision ── */}
        <Section
          eyebrow="The deciding test"
          headline="The faster design lost."
        >
          <Prose>
            <p>
              I tested three sign-in surfaces with 75 people across the company —
              the old design as control, an SSO-first layout, and a password-first
              layout — using heatmaps and task metrics. SSO-first cut the
              login-method decision from 27 seconds to 5.9 and lifted reported
              confidence over the old design. Password-first was even faster at
              4.6 seconds — and edged out SSO-first on confidence, too.
            </p>
            <p>
              I chose the slower one. Password-first earned its speed by reinforcing
              the one method that failed two times out of three — winning the task
              metric while working directly against the point of the redesign.
              SSO-first routed users to the method that actually works. Speed
              wasn&rsquo;t the goal; the right path was.
            </p>
          </Prose>
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/heatmap-testing.png`}
              alt="Heatmap testing of three login variants: the control shows scattered attention, the SSO-first variant shows focus on the SSO button, the password-first variant shows focus on the password field. Decision time fell from 27 seconds to 5.9 with SSO-first"
              width={1433}
              height={806}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              Control, SSO-first, password-first. The scattered heat on the control is
              27 seconds of hesitation.
            </figcaption>
          </figure>
        </Section>

        {/* ── The token ── */}
        <Section
          eyebrow="The structural fix"
          headline="Authenticate once. The system remembers."
        >
          <Prose>
            <p>
              The deepest fix wasn&rsquo;t a screen — it was a token. In the new flow,
              the code you enter at universal login persists as a secure token that
              travels with you to your company&rsquo;s page and counts toward its MFA
              requirement. If your company only requires a login code, you&rsquo;re
              simply in. If it requires a password, your email is already on the page
              and the second code never happens.
            </p>
            <p>
              I wireframed the entire flow end-to-end and took it through architecture
              review and the security team — it passed without material changes. My CS
              background carried those rooms: the proposal was legible to engineers
              because it was drawn in their terms, states and transitions, not just
              screens. Engineering owned the token&rsquo;s implementation specs; the
              concept and the flow were mine.
            </p>
          </Prose>
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/figma/company-login-authed.png`}
              alt="The redesigned company login page for an already-authenticated user: the email address is pre-filled and displayed, only the password field remains"
              width={2880}
              height={2048}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              Arriving already authenticated: your email is on the page, one field
              stands between you and the product, and the double code entry is gone.
            </figcaption>
          </figure>
        </Section>

        {/* ── Dynamic branding ── */}
        <Section
          eyebrow="Dynamic branding"
          headline="The button says Google, because that’s what users look for."
        >
          <Prose>
            <p>
              The most-used login method was hiding behind the least meaningful label.
              &ldquo;SSO Login&rdquo; means nothing to a warehouse worker who signs
              into everything else with a Google button. The redesign resolves each
              company&rsquo;s actual identity provider onto the button — Google,
              Microsoft, Okta — and themes the page in the company&rsquo;s brand, with
              a gradient of their primary color behind the card.
            </p>
            <p>
              That gradient sparked the project&rsquo;s one real disagreement. My PM
              flagged that certain brands are strict about color use — it had caused
              problems before. Instead of arguing taste, I took it to the PM who owned
              brand-color issues in the product, got his read that it was safe, and
              designed an opt-out toggle account executives can flip for any brand
              that objects. Same design, with an escape hatch. Green light.
            </p>
          </Prose>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                src: `${IMG}/figma/sso-awardco.png`,
                alt: 'The default Awardco-branded login with a Sign in with Google button on a blue-themed page',
                cap: 'Awardco default — Google',
              },
              {
                src: `${IMG}/figma/sso-accenture.png`,
                alt: 'The Accenture-branded login with a Sign in with Okta button on a purple-themed page',
                cap: 'Accenture — Okta',
              },
              {
                src: `${IMG}/figma/sso-cinemark.png`,
                alt: 'The Cinemark-branded login with a Sign in with Microsoft button on a red-themed page',
                cap: 'Cinemark — Microsoft',
              },
            ].map((f) => (
              <figure key={f.src} className="m-0">
                <ZoomShot
                  src={f.src}
                  alt={f.alt}
                  width={2880}
                  height={2048}
                  sizes="(min-width: 860px) 280px, 100vw"
                />
                <figcaption className="cs-cap">{f.cap}</figcaption>
              </figure>
            ))}
          </div>
        </Section>

        {/* ── Mobile first + SMS ── */}
        <Section
          eyebrow="Mobile first"
          headline="Designed for the worker with no work email on their phone."
        >
          <Prose>
            <p>
              Mobile is the primary access point for deskless users, so small screens
              set the constraints: only relevant options shown, one streamlined path,
              and — the single most requested fix from support — SMS verification, so
              a code can reach a worker who has never opened their work inbox on a
              phone. The design then scales up to desktop, where extra space enhances
              the experience instead of defining it.
            </p>
          </Prose>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 justify-items-center">
            {/* Near-natural-size phone frames — no zoom affordance (see note above). */}
            <figure className="m-0 max-w-[300px]">
              <Image
                src={`${IMG}/figma/new-mobile.png`}
                alt="The redesigned mobile login: Awardco logo, a Sign in with Google button, and a single email field with one Continue button"
                width={786}
                height={1704}
                sizes="300px"
                className="w-full h-auto rounded-lg border border-white/10"
              />
              <figcaption className="cs-cap">
                The new mobile login: one provider button, one field, one path.
              </figcaption>
            </figure>
            <figure className="m-0 max-w-[300px]">
              <Image
                src={`${IMG}/figma/sms-mobile.png`}
                alt="The verification chooser on mobile: receive your one-time code by email, secondary email, or text message"
                width={786}
                height={1704}
                sizes="300px"
                className="w-full h-auto rounded-lg border border-white/10"
              />
              <figcaption className="cs-cap">
                Verification, your way: email, secondary email, or text.
              </figcaption>
            </figure>
          </div>
        </Section>

        {/* ── Reset ── */}
        <Section
          eyebrow="Password reset"
          headline="The forgotten flow was the most-used flow."
        >
          <Prose>
            <p>
              Watching people type in the coded prototypes surfaced a finding I
              didn&rsquo;t expect: users forget their passwords constantly, and reset —
              a bare, off-brand page with a single blind input — was the
              highest-friction moment in the entire system. The redesign treats reset
              as a first-class flow: adaptive inline validation that reacts as you
              type, a live match check on the confirm field, a show-password toggle,
              and the same visual system as login, on web and mobile alike.
            </p>
          </Prose>
          <div className="mt-8">
            <CompareStage
              ariaLabel="Before and after: the old password reset page versus the redesigned reset flow with inline validation"
              layers={[
                {
                  src: `${IMG}/figma/old-reset.png`,
                  alt: 'The old reset page: a lone Reset Your Password card with one masked input and no feedback',
                  label: 'Before',
                  caption:
                    'The old reset: one blind field, no requirements shown, no way to see what you typed.',
                  width: 2880,
                  height: 2048,
                },
                {
                  src: `${IMG}/figma/new-reset-web.png`,
                  alt: 'The redesigned reset page: password requirements stated up front, live inline validation, a confirm field with match checking, and show-password toggles',
                  label: 'After',
                  caption:
                    'The redesign: requirements up front, validation as you type, and a confirm field that tells you before you submit.',
                  width: 2880,
                  height: 2048,
                },
              ]}
            />
          </div>
        </Section>

        {/* ── Prototyping ── */}
        <Section
          eyebrow="Prototyping"
          headline="I coded the prototypes, so users could really type."
        >
          <Prose>
            <p>
              A Figma prototype can&rsquo;t tell you where people struggle to type. I
              built the flows as working code in VS Code with Copilot — real fields,
              real validation, real code entry — on a feature branch the front-end
              engineers iterated on with me. Testing them with 20+ recruited admins
              and end users showed exactly where fingers hesitated: code entry, email
              input, and above all, password reset.
            </p>
            <p>
              The workflow outlived the project: I contributed it to the
              team&rsquo;s AI-prototyping guide and led its early adoption across the
              design org.
            </p>
          </Prose>
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/iteration.png`}
              alt="The design's iteration path: notebook sketches and whiteboards, then four ideation directions explored in Figma, then the final SSO-first mobile design"
              width={1433}
              height={806}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              Sketches → four directions → the guided system. Competitive patterns
              (including Stripe&rsquo;s password UX) fed the inline-validation design.
            </figcaption>
          </figure>
        </Section>

        {/* ── Outcome ── */}
        <Section eyebrow="Outcome" headline="Validated, approved, handed off.">
          <Bullets
            items={[
              'In before/after testing, login time dropped 25% and successful sign-ins rose 4.5%',
              'Login-method decision time fell 78% (27s → 5.9s), with confidence and reported difficulty both improved over the old design',
              'Double authentication eliminated — the universal login code persists as a secure token that counts toward MFA',
              'One guided path across mobile and desktop, with SMS verification for deskless workers and dynamic provider branding per company',
              'Approved by architecture and security review; handed off to the team, who built it after my internship on their roadmap',
            ]}
          />
        </Section>

        {/* ── Team quotes ── */}
        <Section eyebrow="The team" headline="What the people I worked with said.">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                quote:
                  'Luke takes strong ownership and proactively explores new tools that elevate the team’s output.',
                name: 'Robert Jensen',
                title: 'Tech Lead',
              },
              {
                quote:
                  'Luke proactively sought feedback throughout the design process, which led to stronger iterations and a more refined final experience.',
                name: 'Natalie McKenzie',
                title: 'Product Manager',
              },
              {
                quote:
                  'Luke made data the foundation of his design process, using analytics and testing to clearly identify problems and justify decisions.',
                name: 'Michelle Rodabough',
                title: 'UX Manager',
              },
            ].map((q) => (
              <figure key={q.name} className="m-0 flex flex-col">
                <blockquote className="text-base text-white leading-[1.6] flex-1">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="cs-meta mt-4">
                  {q.name} · {q.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        {/* ── Reflection ── */}
        <Section
          eyebrow="Reflection"
          headline="The best authentication systems don’t ask users to choose. They route them."
        >
          <Prose>
            <p>
              This project rewired how I work. Design proposals travel exactly as far
              as the evidence attached to them — the data pull is what turned an
              intern&rsquo;s redesign into something architecture review took
              seriously. And the biggest UX win in the project wasn&rsquo;t a page at
              all; it was a token. Redesign the state machine, not just the screens.
            </p>
            <p>
              Rejecting the faster variant taught me to interrogate the question
              behind a metric before obeying it. And coding my own prototypes changed
              what I could learn: code isn&rsquo;t the engineers&rsquo; territory I
              visit, it&rsquo;s part of my design surface.
            </p>
            <p>
              The honest edge of the work: some deskless workers — movie-theater
              staff, warehouse teams — aren&rsquo;t allowed phones on the floor at
              all and log in from shared kiosks. SMS doesn&rsquo;t reach them. With
              more time, kiosk research is the first thing I&rsquo;d do.
            </p>
          </Prose>
        </Section>

        <AskLukeAi
          prompts={[
            'Why did Luke pick the slower login design at Awardco?',
            'How did the token change fix double authentication at Awardco?',
            'What did coding the Awardco prototypes reveal that Figma would have missed?',
            "What would Luke do next on Awardco's login with more time?",
          ]}
        />

        {/* ── Prev / next ── */}
        <nav
          className="worknav mt-24 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4"
          aria-label="More work"
        >
          <Link href="/work/lucid-ai" className="footer-link -ml-4">
            ← Bringing Lucid AI to the homepage
          </Link>
          <Link href="/work/pattern-custom-reports" className="footer-link -mr-4 ml-auto text-right">
            Custom Reports in Predict →
          </Link>
        </nav>
      </div>

      <Footer width="article" />
    </div>
  )
}
