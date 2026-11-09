import type { Metadata } from 'next'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import ReadNext from '@/components/ReadNext'
import CompareStage from '@/components/lucid/CompareStage'
import ZoomShot from '@/components/lucid/ZoomShot'
import FinalHero from '@/components/awardco/FinalHero'
import FlowWalkthrough, { CodeAlerts, type WalkPath } from '@/components/awardco/FlowWalkthrough'
import LoginLayers from '@/components/awardco/LoginLayers'
import FlowStrip, { type FlowStep } from '@/components/cs/FlowStrip'
import { Iphone, Macbook } from '@/components/cs/Devices'
import BigStats from '@/components/cs/BigStats'
import Stage from '@/components/cs/Stage'
import StageRail from '@/components/cs/StageRail'
import Callouts from '@/components/cs/Callouts'
import { Band, Block, Col, MetaGrid, Notes, Pill, Problem, StoryTitle } from '@/components/cs/Story'
import { SITE } from '@/lib/site'
import { companyAbout } from '@/lib/caseStudies'

/*
 * Custom-built case study — this static route intentionally shadows the
 * generic /work/[slug] template, the same way app/work/lucid-ai does. The
 * home-grid tile still reads from lib/caseStudies.ts; everything below is
 * bespoke to the Awardco story.
 *
 * Story edition (2026-09-21): the five-act structure on the shared
 * `components/cs` primitives, same as Lucid. Copy is Luke's (rewrite of
 * 2026-09-16), re-cut into acts with key phrases bolded; no facts added.
 * Numbers come from the 2026-08-24 interview record, which is kept out
 * of this repo (see .gitignore) and is the single source of truth:
 * - Canonical metrics only: 45.9M attempts / 1 year, 7.7M failures (6.7M
 *   from password), password 34.6% vs SSO 98%, 9,275 support cases / 90 days.
 * - 25% faster login, +4.5% sign-ins, and 27s → 5.9s are BEFORE/AFTER
 *   USABILITY TESTING results, never production analytics — the impact
 *   strip says so in its own caption.
 * - Stages edition (2026-11-03, Luke): acts and the Journey strip gave way
 *   to design-process stages with the StageRail, as on Pitch. Each stage is
 *   a heading and plain body; subheads, task/solution pairs, the checklist
 *   and the What next card were folded into the body or cut.
 * - Implementation happened after the internship — the page says "handed
 *   off", not "live".
 * - Deliberately not rendered (assets stay in the repo): company-login-authed,
 *   iteration and final-unified-auth slides, sms-web, new-reset-mobile,
 *   team quotes.
 * - The "what people ran into" speech bubbles are things users said, in
 *   their own voice (Luke confirmed 2026-11-04; they were labelled
 *   "restated" before).
 *
 * Visuals edition (2026-09-23): the hero and the flow comparison now run on
 * frames pulled straight from the design file (Cleaner Login Flow, file key
 * j2WD4MhXQlW7l7t2cNyC9y) instead of exported deck slides.
 * - The hero is FinalHero: the finished mobile and desktop side by side,
 *   static, Awardco branding only (phone 1102:32286, desktop 1102:37132).
 *   It replaces the before/after slider, which opened the study on the old
 *   design rather than the new one. Devices are drawn in CSS by
 *   components/cs/Devices, not composited into the PNGs, so the same
 *   capture can appear framed here and bare in the brand row.
 * - The brand stage carries the brand-colour constraint: Awardco 1102:37132,
 *   Cinemark 1102:37155, Accenture 1102:37182. Desktop only, because the
 *   customer's tint covers the whole page and the file has no Accenture
 *   mobile with an Okta button to pair honestly against its desktop. The
 *   mobile brand row varies colour only (all three say Google); the
 *   provider variants are a separate, all-Cinemark row (1135:17177 Okta,
 *   1135:17219 Microsoft, 1135:17264 Generic).
 * - All of the above live on the file's SECOND page, "🎨 Company Login
 *   Page" (1102:28152) — get_metadata with no nodeId only lists the first
 *   page, "🛑 READY FOR DEV 🛑", so the high-fidelity work is easy to miss.
 *   The earlier 924:21185 "ACO CLP" is a different, older frame with no
 *   background fill, which is why its export looked washed out.
 * - The old before/after toggle is replaced by two FlowStrips built from
 *   the design file's own "Current Flow - Problem" (1063:11643) and
 *   "Proposed Flow" (1063:11666 / 1063:11746) sections. Both strips share
 *   four screen files; the after flow is the before flow minus two screens.
 * - NEW CLAIMS, from reading those sections rather than from the interview
 *   record — verify before publishing: the old flow is six screens with two
 *   code entries and two trips to the inbox (the deck slide said four steps),
 *   and the universal-login half is unchanged by the redesign.
 * - public/before.png and public/after.png are no longer used here; the
 *   generic /work/[slug] template still reads them.
 */

const TITLE = 'Reducing Authentication Friction'
const DESCRIPTION =
  'Awardco logged 7.7 million failed login attempts in one year. I redesigned its fragmented authentication flows into one guided system across SSO, MFA, password recovery, and mobile.'

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
const FLOW = `${IMG}/flow`

/*
 * The two flows, screen by screen, exported from the design file's own
 * "Current Flow" and "Proposed Flow" sections. The first three screens and
 * the last are byte-identical between them: the redesign changes what
 * happens after domain selection, not the universal login, so both strips
 * point at the same four files and the difference is the two screens the
 * after flow no longer needs.
 */
const SHOT = { width: 1440, height: 1024 }

const BEFORE_FLOW: FlowStep[] = [
  {
    ...SHOT,
    src: `${FLOW}/universal.png`,
    alt: 'The universal login page: an Awardco logo, one Work Email field, and Continue With Email',
    title: 'Universal login',
    note: 'One field, asking for the work email.',
  },
  {
    ...SHOT,
    src: `${FLOW}/code.png`,
    alt: 'The identification code screen: six digit boxes filled with 345900, and a note that a code was emailed',
    title: 'Identification code',
    note: 'Leave the product, open the inbox, come back with six digits.',
    flag: 'Code 1',
  },
  {
    ...SHOT,
    src: `${FLOW}/domain.png`,
    alt: 'Domain selection: Welcome Back, with a list of the workspaces that email belongs to',
    title: 'Domain selection',
    note: 'Pick the workspace. So far, so reasonable.',
  },
  {
    ...SHOT,
    src: `${FLOW}/before-company.png`,
    alt: "The company login page: the tenant's logo, a Sign in with SSO button, and an empty email field",
    title: 'Company login page',
    note: 'The company page does not know who you are. It asks for the email again.',
    flag: 'Asks again',
  },
  {
    ...SHOT,
    src: `${FLOW}/before-code-again.png`,
    alt: 'Check your email: a second six-box code entry on the company login page, filled with C125DA',
    title: 'A second code',
    note: 'Back to the inbox for a different six digits.',
    flag: 'Code 2',
  },
  {
    ...SHOT,
    src: `${FLOW}/app.png`,
    alt: 'The Awardco home page after signing in, with recognition programs and a points balance',
    title: 'In the app',
    note: 'Two codes and two trips to the inbox after the first field.',
  },
]

const AFTER_FLOW: FlowStep[] = [
  {
    ...SHOT,
    src: `${FLOW}/universal.png`,
    alt: 'The same universal login page, unchanged by the redesign',
    title: 'Universal login',
    note: 'Unchanged. The same single field.',
  },
  {
    ...SHOT,
    src: `${FLOW}/code.png`,
    alt: 'The same identification code screen, now the only code the user enters',
    title: 'Identification code',
    note: 'The same six digits, entered once.',
    flag: 'Code 1',
  },
  {
    ...SHOT,
    src: `${FLOW}/domain.png`,
    alt: 'The same domain selection screen, with the authentication now carried forward as a token',
    title: 'Domain selection',
    note: 'Pick the workspace, carrying the authentication along.',
    carry: 'secure token',
  },
  {
    ...SHOT,
    src: `${FLOW}/app.png`,
    alt: 'The same Awardco home page, reached without a second authentication',
    title: 'In the app',
    note: 'The company page has nothing left to ask.',
  },
]

/*
 * How sign-in is put together, before the before/after strips: the two
 * login pages are separate, and the token only makes sense once that's
 * clear. URLs come from the design file's capture names
 * (app.awardco.com_start_login, natalietest.awardco.com).
 */
const LAYERS = [
  {
    kicker: 'app.awardco.com',
    title: 'Universal login',
    asks: 'Who are you, and which company?',
    body: 'Awardco’s front door. It doesn’t know your company yet, so it asks for your work email, sends one code, and has you pick your workspace.',
    src: `${FLOW}/universal.png`,
    alt: 'The universal login page: an Awardco logo, one Work Email field, and Continue With Email',
    width: 1440,
    height: 1024,
    carry: 'secure token',
  },
  {
    kicker: 'yourcompany.awardco.com',
    title: 'Company login page',
    asks: 'How does your company sign in?',
    body: 'Your company’s own branded page. It knows whether you use SSO, a password, a code, or MFA. This is the page I redesigned, and it now picks up where the universal login left off.',
    src: `${IMG}/hero/desk-awardco.png`,
    alt: 'The redesigned company login page in Awardco branding, with Sign in with Google above a single email field',
    width: 2880,
    height: 1600,
  },
  {
    kicker: 'Signed in',
    title: 'The app',
    asks: 'Recognition, points, and rewards.',
    body: 'Where people actually wanted to be. Every screen before this one is friction, so the goal was fewer of them.',
    src: `${FLOW}/app.png`,
    alt: 'The Awardco home page after signing in, with recognition programs and a points balance',
    width: 1440,
    height: 1024,
  },
]

/*
 * The redesigned screens, path by path. Captured from Luke's coded
 * prototype (saved Vibe54 pages in his Awardco files) at 1440x1024 and
 * 393x852, both at 2x; the phone captures add side padding the prototype
 * lacked at that width. The visible-password step flips the field to text
 * and the icon to an open eye, which is what the toggle does.
 */
const PATHS: WalkPath[] = [
  {
    label: 'Password',
    steps: [
      {
        shot: 'signin-filled',
        title: 'Sign in',
        alt: 'The redesigned sign-in: Sign in with Google, then one Email, Username, or ID field and Continue',
        note: 'One field to start. Above it is only the sign-in your company uses, named the way people know it, like Google.',
      },
      {
        shot: 'password',
        title: 'Enter your password',
        alt: 'The password step: the email carried over as plain text, one password field, Continue, and Forgot Password',
        note: 'Your email carries over, so the password is the only thing left. Forgot Password sits right under it.',
      },
      {
        shot: 'password-shown',
        title: 'Show your password',
        alt: 'The password step with the eye toggle on, showing the typed password in plain text',
        note: 'The eye toggle shows what you typed, so a typo gets caught before it becomes a failed attempt.',
      },
    ],
  },
  {
    label: 'Login code',
    steps: [
      {
        shot: 'verify-method',
        title: 'Choose where the code goes',
        alt: 'Let’s verify it’s you: choose email, secondary email, or text message for the one-time code, then Send Code',
        note: 'Email, a secondary email, or a text. Someone on a warehouse floor who can’t open a work inbox on their phone can still get in.',
      },
      {
        shot: 'code',
        title: 'Enter the code',
        alt: 'Check your email: six digit boxes, the address the code went to, Continue, and Resend Code',
        note: 'Six boxes, one per digit, with the address it went to spelled out. If it doesn’t arrive, Resend Code sends another. Ask too many times and it makes you wait, so nobody can flood an account with codes.',
        extra: <CodeAlerts />,
      },
    ],
  },
  {
    label: 'Forgot password',
    steps: [
      {
        shot: 'forgot',
        title: 'Ask for a reset',
        alt: 'Forgot Password: one email field, Send Instructions, and Back to Sign In',
        note: 'Enter your email and the reset instructions come to your inbox.',
      },
      {
        shot: 'reset-hint',
        title: 'Set a new password',
        alt: 'Reset Your Password: new and confirm fields with show-password toggles, and the 12-character rule shown under the first field',
        note: 'The rule shows up before you type, not after you fail: at least 12 characters.',
      },
      {
        shot: 'reset-states',
        title: 'Checks as you type',
        alt: 'Reset Your Password mid-entry: a green check saying the password meets all requirements, and a red confirm field saying passwords do not match',
        note: 'Green once the password meets every requirement, red as soon as the confirmation doesn’t match, and Reset stays off until both are right.',
      },
      {
        shot: 'expired',
        title: 'Expired passwords too',
        alt: 'Your password has expired: the same new and confirm fields, rule, and toggles, with Update Password and Sign Out',
        note: 'When a company makes people change their password, they get the same fields, rules, and checks.',
      },
    ],
  },
]

/*
 * The brand-colour constraint, in its own stage. Desktop frames only: the customer's
 * tint covers the whole page, which a phone would show less of, and the
 * design file has no Accenture mobile with an Okta button to pair honestly
 * against its desktop.
 *
 * The Cinemark and Accenture notes are Luke's reasoning, written up here:
 * red is genuinely hard to use as a primary action, and Accenture held the
 * tightest brand standards of the customers he worked against. Phrased
 * around the brand system rather than the client, since both are real
 * companies named on a public page.
 */
const BRANDS: { name: string; src: string; alt: string; note: string }[] = [
  {
    name: 'Awardco',
    src: `${IMG}/hero/desk-awardco.png`,
    alt: 'The login page in Awardco branding: a pale blue page, a white card, and a blue Continue button',
    note: 'The easy one. Awardco blue works as a main button anywhere on the page.',
  },
  {
    name: 'Cinemark',
    src: `${IMG}/hero/desk-cinemark.png`,
    alt: 'The same login page in Cinemark branding: a pale red page, a white card, and a red Continue button',
    note: 'The hard one. Red usually means error or delete, so the layout has to make Continue feel safe on its own.',
  },
  {
    name: 'Accenture',
    src: `${IMG}/hero/desk-accenture.png`,
    alt: 'The same login page in Accenture branding: a pale purple page, a white card, and a purple Continue button',
    note: 'The strict one. The tightest brand rules of any customer I designed for, so there was no wiggle room.',
  },
]

/* The design process, in the order it happened. Each label is also the
   stage's heading, as on Pitch. */
const STAGES = [
  { id: 'audit', label: 'Auditing the old login' },
  { id: 'data', label: 'Digging into the data' },
  { id: 'testing', label: 'Testing three directions' },
  { id: 'token', label: 'Carrying the login forward' },
  { id: 'flows', label: 'The new sign-in, screen by screen' },
  { id: 'mobile', label: 'Designing for mobile' },
  { id: 'brands', label: 'Designing for every brand' },
  { id: 'prototyping', label: 'Prototyping in code' },
  { id: 'handoff', label: 'Handing off' },
]

export default function AwardcoCaseStudy() {
  return (
    <div className="cs acs cs-surface cs-story min-h-screen text-white">
      <SiteNav
        next={{ href: '/work/pattern-custom-reports', title: 'Custom Reports in Predict' }}
      />

      <main id="main" className="sitenav-offset pb-24">
        {/* ══ Title block ══ */}
        <Col>
          <header className="pt-10">
            <p className="cs-eyebrow mb-5">Awardco · Product Design Internship</p>
            <StoryTitle dim="at Awardco">Reducing authentication friction</StoryTitle>
            {/* Pitch's header (LUK-199): one summary paragraph across the
                column, then Company, Role, Timeline and Tools. Team, Status
                and Skills used came off; the handoff is in the summary. */}
            <MetaGrid
              stacked
              summary={
                <p>
                  Awardco had 7.7 million failed login attempts in one year. I redesigned its
                  scattered login flows (SSO, MFA, password reset, and mobile) into one guided
                  system. I owned it on desktop and mobile, ran in-person testing sessions with 20+
                  people at Awardco, ran Useberry tests with 75 more, and got it through
                  architecture and security review before handing it off to be built.
                </p>
              }
              facts={[
                { label: 'Company', value: companyAbout('awardco-login-flow-redesign'), span: true },
                { label: 'Role', value: 'Product Design Intern' },
                { label: 'Timeline', value: 'October 2025 to April 2026' },
                { label: 'Tools', value: 'Figma, VS Code, GitHub Copilot' },
              ]}
            />
          </header>
        </Col>

        {/* ══ Hero band: the finished thing, mobile first, Awardco's own
            branding and nothing else. It used to cycle three customer brands,
            which buried the point; the brand-colour range now has its own
            stage. Frames are bare captures in CSS-drawn devices
            (components/cs/Devices), so the hardware is real-looking
            without shipping a device mockup PNG. ══ */}
        <Band tone="accent" className="acs-hero-band">
          <FinalHero
            phone={{
              src: `${IMG}/hero/phone-awardco.png`,
              alt: 'The redesigned Awardco mobile sign-in: the Awardco logo, a Sign in with Google button, one email field, and a Continue button',
            }}
            desktop={{
              src: `${IMG}/hero/desk-awardco.png`,
              alt: 'The redesigned Awardco company login page: a pale blue page behind a white card with the Awardco logo, a Sign in with Google button, one email field, and Continue',
            }}
            caption="The redesigned sign-in, on mobile and desktop"
          />
        </Band>

        {/* ══ The problem ══ */}
        <Band dust flush>
          <Col>
            <Problem iconSrc="/logos/awardco.png" iconAlt="Awardco">
              How might we <em>remove the friction from signing in</em>, so every user can
              get into Awardco, whether they use SSO, sign in on their phone, or can&rsquo;t
              reach their email for a code?
            </Problem>
          </Col>
        </Band>

        {/* ══ The impact ══ */}
        <Col wide>
          <Block className="cs-centered">
            <Pill>The impact</Pill>
            <p className="cs-cap cs-cap--mono">
              Before and after usability testing. Not production analytics.
            </p>
            <BigStats
              small
              stats={[
                { value: 25, suffix: '%', caption: <><strong>faster login</strong></> },
                { value: '+4.5%', caption: <>more <strong>successful sign-ins</strong></> },
                {
                  value: 78,
                  suffix: '%',
                  caption: <>less time choosing a method, <strong>27s to 5.9s</strong></>,
                },
                {
                  value: 20,
                  suffix: '+',
                  caption: <>people in <strong>in-person sessions</strong> on working prototypes</>,
                },
              ]}
            />
          </Block>
        </Col>

        {/* ══ The design process, stage by stage, with the rail (LUK-203) ══ */}
        <StageRail stages={STAGES} />

        {/* The old design, shown before anything else argues against it.
            before-login.png is the screen cropped out of
            public/before.png (a password tenant, so all three methods
            show); the laptop frame baked into that file is why it was
            cropped rather than reused. Every callout restates something
            already on this page: the generic SSO label (mobile stage),
            the unreachable work inbox and the password field shown to SSO
            companies (Luke's own paragraphs), and the 34.6% rate. */}
        <Stage
          id="audit"
          title="Auditing the old login"
          body={
            <>
              <p>
                Every Awardco customer sets up login differently. Depending on your company, you
                might need SSO, a password, MFA, or a login code, and the old login made you guess
                which one.
              </p>
              <p>
                My PM brought me the problem: login was driving a ton of support tickets. Before
                looking at any data, I went through it myself the way an employee would.
              </p>
            </>
          }
        >
          <Col>
            <Block>
              <Callouts
                src={`${FLOW}/before-login.png`}
                alt="The old company login page, annotated: a generic Sign in with SSO button, a card that emails a password-free code to an Email, username, or ID field, and a Sign in with Password button underneath. Three ways in, with nothing saying which one the company uses"
                width={880}
                height={700}
                items={[
                  {
                    label: 'Sign in with SSO',
                    text: <>SSO, but which one? It never says <strong>Google, Microsoft, or Okta</strong>, so people didn&rsquo;t recognize it as theirs.</>,
                    x: 25.9,
                    y: 25.3,
                    w: 48,
                    h: 5.4,
                    ax: 30,
                  },
                  {
                    label: 'Email me a code',
                    text: <>The default path sends a code to a <strong>work inbox</strong> that deskless workers often couldn&rsquo;t open on their phones.</>,
                    x: 26.8,
                    y: 43.3,
                    w: 46.2,
                    h: 28.1,
                    ax: 64,
                  },
                  {
                    label: 'Sign in with Password',
                    text: <>Shown even at companies that use SSO. The method people reached for <strong>worked 34.6% of the time</strong>.</>,
                    x: 28.4,
                    y: 73.4,
                    w: 43,
                    h: 5.4,
                    ax: 70,
                  },
                ]}
              />
            </Block>

            <Block>
              <div className="cs-prose">
                <p>
                  Three ways in, two of them the same blue button, and nothing telling you which one
                  your company uses. Guess wrong and you get a failed attempt or a support ticket.
                </p>
                <p>
                  Guess right and you still weren&rsquo;t done. The universal login and the company
                  login page didn&rsquo;t talk to each other, so you could enter a code and get asked
                  to sign in all over again.
                </p>
              </div>
            </Block>

            <Notes
              quotes
              label="What people ran into when they tried to log in"
              notes={[
                'I entered my code, got to the company page, and it asked me to log in again',
                'I picked password login. I didn’t know we used Google or Microsoft sign-in',
                'The code went to my work inbox, and I can’t open that on my phone',
              ]}
            />
          </Col>
        </Stage>

        <Stage
          id="data"
          title="Digging into the data"
          body={
            <p>
              The audit showed why people were confused. To see what it cost, I dug into a year of
              login data and support cases with our tech lead, account managers, and customer
              success.
            </p>
          }
        >
          <Col>
            <Block>
              <div className="cs-prose">
                <p>
                  The numbers backed it up. People weren&rsquo;t forgetting their logins. They were
                  picking the wrong door. Password login alone failed 6.7 million times.
                </p>
              </div>
              <Callouts
                src={`${IMG}/failed-logins-data.png`}
                alt="Charts from a year of login telemetry, annotated: password login shows 6.69 million failures against 3.54 million successes, while login codes, MFA, and SSO succeed 86 to 98 percent of the time"
                width={1433}
                height={806}
                items={[
                  {
                    label: '6.7M failures',
                    text: <>Password login failed <strong>nearly two out of three times</strong>.</>,
                    x: 30.5,
                    y: 26,
                    w: 16.5,
                    h: 39,
                  },
                  {
                    label: '34.6% success',
                    text: <>The method most users reached for was the one <strong>least likely to work</strong>.</>,
                    x: 56.5,
                    y: 50,
                    w: 6.5,
                    h: 15,
                  },
                  {
                    label: '98% for SSO',
                    text: <>Guided methods succeeded. The fix was <strong>routing</strong>, not a better password field.</>,
                    x: 76.5,
                    y: 26,
                    w: 7,
                    h: 39,
                  },
                ]}
              />
            </Block>

            <Block>
              <BigStats
                small
                stats={[
                  { value: '45.9M', caption: <>login attempts in <strong>one year</strong></> },
                  { value: '7.7M', caption: <>of them <strong>failed</strong></> },
                  { value: '9,275', caption: <>login support cases in <strong>90 days</strong></> },
                ]}
              />
            </Block>

            <Block>
              <div className="cs-prose">
                <p>
                  Three groups got hit hardest. Employees at Google or Microsoft companies saw a
                  password field and used it. Deskless workers in warehouses and theaters only had a
                  phone and couldn&rsquo;t get to their work inbox. And company admins dealt with the
                  fallout: login was the top support topic, with 9,275 cases in 90 days.
                </p>
                <p>
                  So the goal was to send each person straight to the method most likely to work,
                  and prove it in before-and-after testing.
                </p>
              </div>
            </Block>
          </Col>
        </Stage>

        <Stage
          id="testing"
          title="Testing three directions"
          body={
            <>
              <p>
                I tested three directions with 75 people at Awardco in Useberry: the current login, an
                SSO-first design, and a password-first design.
              </p>
              <p>
                With the current login, people took 27 seconds on average to figure out where to
                start. SSO-first cut that to 5.9. Password-first was even faster at 4.6 seconds, and
                scored a little higher on confidence. I still picked SSO-first.
              </p>
            </>
          }
        >
          <Col>
            <Block>
              <Callouts
                src={`${IMG}/heatmap-testing.png`}
                alt="Heatmap testing of three login variants, annotated: the control shows scattered attention, the SSO-first variant shows focus on the SSO button, the password-first variant shows focus on the password field. Decision time fell from 27 seconds to 5.9 with SSO-first"
                width={1433}
                height={806}
                items={[
                  {
                    label: 'Control, 27s',
                    text: <>Attention scattered across the page. <strong>Hesitation</strong> before the first tap.</>,
                    x: 7,
                    y: 23,
                    w: 12.5,
                    h: 47,
                  },
                  {
                    label: 'SSO-first, 5.9s',
                    text: <>Focus lands on the SSO button. <strong>The chosen design.</strong></>,
                    x: 20.5,
                    y: 23,
                    w: 12.5,
                    h: 47,
                  },
                  {
                    label: 'Password-first, 4.6s',
                    text: <>Fastest in the test, but it reinforced the method that <strong>failed most in the product</strong>.</>,
                    x: 34,
                    y: 23,
                    w: 12.5,
                    h: 47,
                  },
                ]}
              />
            </Block>

            <Block>
              <div className="cs-prose">
                <p>
                  Password-first did well because it put the familiar option up top. But in the real
                  product, password login failed nearly two out of three times. Picking it would
                  have doubled down on the thing behind most of Awardco&rsquo;s failures.
                </p>
                <p>The fastest design wasn&rsquo;t the one most likely to get people signed in.</p>
              </div>
            </Block>
          </Col>
        </Stage>

        {/* The two flows, one after the other rather than behind a toggle:
            the argument is that the second strip is the first with two
            screens removed, and a toggle hides exactly that. */}
        <Stage
          id="token"
          title="Carrying the login forward"
          body={
            <>
              <p>
                Signing in to Awardco actually means going through two separate login pages. The
                universal login figures out who you are and which company you belong to. Then it
                sends you to your company&rsquo;s own login page, which knows how that company
                signs in.
              </p>
              <p>
                The universal login knew who you were, but didn&rsquo;t pass that along. So
                you&rsquo;d enter a code and immediately get asked for another code or a password.
              </p>
            </>
          }
        >
          <Col>
            <Block>
              <LoginLayers layers={LAYERS} />
            </Block>

            <Block>
              <div className="cs-prose">
                <p>
                  My fix: once you pass the universal login&rsquo;s code, Awardco issues a
                  short-lived, single-use token tied to your session and your company. The company
                  page checks it, uses it up, and skips its own code. It only asks for what&rsquo;s
                  still missing, like a password.
                </p>
                <p>
                  The old flow was six screens, two codes, and two trips to your inbox. Mine is four
                  screens and one code.
                </p>
              </div>
            </Block>

            <Block>
              <p className="cs-row-label">Before</p>
              <FlowStrip
                tone="problem"
                label="The Awardco login flow before the redesign, screen by screen"
                steps={BEFORE_FLOW}
                tracks={BEFORE_FLOW.length}
              />
              <p className="cs-row-label">After</p>
              <FlowStrip
                label="The Awardco login flow after the redesign, screen by screen"
                steps={AFTER_FLOW}
                tracks={BEFORE_FLOW.length}
              />
              <p className="cs-cap">
                The same three screens the old flow opened with, and then straight into the app.
                The company login page and the second code are gone, because the first
                authentication now travels with the user.
              </p>
            </Block>

            <Block>
              <div className="cs-prose">
                <p>
                  If your company only needs a login code, you&rsquo;re already in. If it also needs
                  a password, your email is filled in and that&rsquo;s the only thing left.
                </p>
              </div>
              <figure className="acs-branch">
                <ZoomShot
                  src={`${FLOW}/after-password-branch.png`}
                  alt="The redesigned company login page for a company that also requires a password: the email is already filled in as luke.woods@awardco.com, and only the password field is left"
                  width={1440}
                  height={1024}
                  sizes="(min-width: 60em) 60vw, 100vw"
                />
                <figcaption className="cs-cap">
                  The password branch. One field, not a fresh login.
                </figcaption>
              </figure>
              <div className="cs-prose">
                <p>
                  I mapped it out as states and transitions and worked through it with engineering,
                  architecture, and security. It passed review without major changes. Engineering
                  owned how it&rsquo;s built. I owned the idea and the experience, start to finish.
                </p>
              </div>
            </Block>
          </Col>
        </Stage>

        <Stage
          id="flows"
          title="The new sign-in, screen by screen"
          body={
            <p>
              Here&rsquo;s the redesign end to end, captured from my coded prototype. Pick a path to
              walk through it on a phone and a laptop.
            </p>
          }
        >
          <Col>
            <Block>
              <FlowWalkthrough paths={PATHS} />
            </Block>
          </Col>
        </Stage>

        <Stage
          id="mobile"
          title="Designing for mobile"
          body={
            <p>
              Lots of Awardco users work in warehouses and theaters where their phone is the main
              way in, and their codes went to a work inbox they couldn&rsquo;t open on it. So on
              mobile I added text message verification, showed only the sign-in options your company
              supports, and swapped the generic &ldquo;SSO Login&rdquo; for the name people
              recognize, like Google, Microsoft, or Okta. Nobody has to know how their company does
              login.
            </p>
          }
        >
          <Col>
            <Block>
              <div className="cs-phone-pair">
                <figure>
                  <div className="cs-phone">
                    <div className="cs-phone__screen">
                      <Image
                        src={`${IMG}/figma/new-mobile.png`}
                        alt="The redesigned mobile login: Awardco logo, a Sign in with Google button, and a single email field with one Continue button"
                        fill
                        sizes="(min-width: 40em) 300px, 45vw"
                      />
                    </div>
                  </div>
                  <figcaption className="cs-cap">
                    One provider button and one field. The page shows only the methods the
                    user&rsquo;s company supports.
                  </figcaption>
                </figure>
                <figure>
                  <div className="cs-phone">
                    <div className="cs-phone__screen">
                      <Image
                        src={`${IMG}/figma/sms-mobile.png`}
                        alt="The verification chooser on mobile: receive your one-time code by email, secondary email, or text message"
                        fill
                        sizes="(min-width: 40em) 300px, 45vw"
                      />
                    </div>
                  </div>
                  <figcaption className="cs-cap">
                    Users could verify through email, a secondary email, or text without leaving
                    the mobile flow.
                  </figcaption>
                </figure>
              </div>
            </Block>
          </Col>
        </Stage>

        {/* The brand-colour constraint. Desktop frames only: the whole page
            takes the customer's tint, so a phone would show less of the
            thing being compared, and the file has no Accenture mobile with
            an Okta button to pair honestly against its desktop. */}
        <Stage
          id="brands"
          title="Designing for every brand"
          body={
            <p>
              Every customer&rsquo;s login page gets their own logo and colors, so one layout had to
              work for all of them. I designed against the two hardest cases I could find instead
              of Awardco&rsquo;s easy blue.
            </p>
          }
        >
          <Col>
            <Block>
              <ol className="acs-brands">
                {BRANDS.map((b) => (
                  <li className="acs-brands__item" key={b.src}>
                    <p className="acs-brands__name">{b.name}</p>
                    <ZoomShot
                      src={b.src}
                      alt={b.alt}
                      width={2880}
                      height={1600}
                      sizes="(min-width: 60em) 30vw, 80vw"
                    />
                    <p className="acs-brands__note">{b.note}</p>
                  </li>
                ))}
              </ol>
            </Block>
          </Col>
        </Stage>

        <Stage
          id="prototyping"
          title="Prototyping in code"
          body={
            <>
              <p>
                A Figma prototype can show navigation, but not where people get stuck typing an
                email, entering a code, or making a new password. So I built working prototypes with
                real inputs and validation. In-person testing sessions with 20+ people at Awardco
                showed friction with email entry, codes, and most of all password reset.
              </p>
              <p>
                The old reset page was one blind password field with no rules shown. The new one
                checks as you type, confirms the passwords match, lets you see what you typed, and
                matches the rest of the login.
              </p>
              <p>
                Building in code caught edge cases earlier and gave engineering something close to
                the real thing. I later added the workflow to Awardco&rsquo;s AI prototyping guide
                and helped roll it out to the design team.
              </p>
            </>
          }
        >
          <Col>
            <Block>
              <CompareStage
                ariaLabel="Before and after: the old password reset page versus the redesigned reset flow with inline validation"
                layers={[
                  {
                    src: `${IMG}/figma/old-reset.png`,
                    alt: 'The old reset page: a lone Reset Your Password card with one masked input and no feedback',
                    label: 'Before',
                    caption: 'One blind field, no requirements shown, and no way to see what you typed.',
                    width: 2880,
                    height: 2048,
                  },
                  {
                    src: `${IMG}/figma/new-reset-web.png`,
                    alt: 'The redesigned reset page: password requirements stated up front, live inline validation, a confirm field with match checking, and show-password toggles',
                    label: 'After',
                    caption:
                      'Real inputs and validation exposed problems that could not be tested accurately in Figma.',
                    width: 2880,
                    height: 2048,
                  },
                ]}
              />
            </Block>
          </Col>
        </Stage>

        <Stage
          id="handoff"
          title="Handing off"
          body={
            <>
              <p>
                In before-and-after usability testing, login got 25% faster, successful sign-ins
                went up 4.5%, and time spent picking a method dropped 78%. People felt more
                confident and said it was easier.
              </p>
              <p>
                The token flow passed architecture and security review, and I handed everything off
                to be built after my internship: the token flow, SSO-first login on desktop and
                mobile, text verification and named sign-in buttons on mobile, the new password
                reset, the coded prototypes, and the AI prototyping workflow.
              </p>
            </>
          }
        >
          <Band tone="accent" className="cs-final cs-final--open">
            <p className="cs-final__word" aria-hidden="true">
              Final designs
            </p>
            {/* The same Macbook and Iphone the hero opens on, not the plain
                rectangles the other studies use: the band closes the page on
                the hardware it started with. */}
            <div className="cs-final__stage" style={{ paddingInline: 'var(--cs-pad)' }}>
              <Macbook
                ratio={2880 / 2048}
                style={{ '--r': '-5deg', '--y': '6%' } as React.CSSProperties}
              >
                <Image
                  src={`${IMG}/figma/new-reset-web.png`}
                  alt="The redesigned password reset page with inline validation"
                  fill
                  sizes="(min-width: 40em) 50vw, 100vw"
                />
              </Macbook>
              <div className="cs-phones" style={{ '--r': '4deg', '--y': '-4%' } as React.CSSProperties}>
                <Iphone>
                  <Image
                    src={`${IMG}/figma/new-mobile.png`}
                    alt="The redesigned mobile sign-in"
                    fill
                    sizes="(min-width: 40em) 20vw, 40vw"
                  />
                </Iphone>
                <Iphone>
                  <Image
                    src={`${IMG}/figma/sms-mobile.png`}
                    alt="The mobile verification chooser"
                    fill
                    sizes="(min-width: 40em) 20vw, 40vw"
                  />
                </Iphone>
              </div>
            </div>
          </Band>

          <Col>
            <Block>
              <div className="cs-prose">
                <p>
                  The big lesson for me: don&rsquo;t chase a metric without asking what it&rsquo;s
                  rewarding. Password-first won the test but worked against everything the real data
                  said. The slightly slower design made the better system.
                </p>
                <p>
                  And the biggest win wasn&rsquo;t a cleaner login page. It was changing how login
                  moves between two parts of the product.
                </p>
                <p>
                  One gap is left. Some deskless workers can&rsquo;t carry phones on shift and sign
                  in on shared kiosks, so a texted code doesn&rsquo;t help them. That&rsquo;s where
                  I&rsquo;d look next, along with watching the real numbers once it ships against
                  the 34.6% and 98% baselines.
                </p>
              </div>
            </Block>
          </Col>
        </Stage>

        {/* ══ Read next ══ */}
        <ReadNext current="awardco" />
      </main>

      <Footer width="article" />
    </div>
  )
}
