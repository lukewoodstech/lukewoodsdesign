import Image from 'next/image'
import type { CaseStudySections } from '@/lib/sections'
import Callouts from '@/components/cs/Callouts'
import CompareStage from '@/components/lucid/CompareStage'
import FlowStrip, { type FlowStep } from '@/components/cs/FlowStrip'
import FlowWalkthrough, { CodeAlerts, type WalkPath } from '@/components/awardco/FlowWalkthrough'
import { DeviceSet, Macbook, PhoneShot, ShotRow } from '@/components/sections/frames'

/*
 * The Awardco case study's sections, copy as Luke wrote it (2026-11-11).
 * The visual text above each visual is drawn from the earlier page's own captions.
 * Binding from the interview record: 25% faster, +4.5% and 27s to 5.9s are
 * usability-test results, not production analytics, and the redesign was
 * handed off, not shipped by Luke.
 */

const IMG = '/work/awardco'
const FLOW = `${IMG}/flow`
const SHOT = { width: 1440, height: 1024 }

/* The two flows, from the design file's own "Current Flow" and "Proposed
   Flow" sections. Both start with the same three screens and end in the
   app; the after flow drops the company page and the second code. */
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

/* The redesigned screens, path by path, captured from Luke's coded
   prototype at desktop and phone sizes. */
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

const BRAND = { width: 2880, height: 1600 }

export const awardco: CaseStudySections = {
  accent: '#008fff',
  sections: [
    {
      step: 'Audit',
      subtitle: "Logging in shouldn't take a guess",
      body: "Every company on Awardco signs in differently. Some use SSO, some use passwords, some use codes, and the old login made people figure out which one was theirs. Users bounced between screens, entered codes twice, and ended up in support. The audit turned up three confusing entry points: SSO that didn't name the provider, an email code sent to a work inbox people couldn't always reach, and a password option shown even to SSO companies.",
      visuals: [
        {
          alt: 'The old login, annotated',
          title: 'The old login',
          caption: 'Three ways in, two of them the same blue button, and nothing telling you which one your company uses.',
          element: (
            <Callouts
              src={`${FLOW}/before-login.png`}
              alt="The old company login page, annotated: a generic Sign in with SSO button, a card that emails a password-free code to an Email, username, or ID field, and a Sign in with Password button underneath. Three ways in, with nothing saying which one the company uses"
              width={880}
              height={700}
              sizes="(min-width: 65em) 1040px, 100vw"
              items={[
                {
                  label: 'Sign in with SSO',
                  text: <>SSO, but which one? It never says <strong>Google, Microsoft, or Okta</strong>, so people didn&rsquo;t recognize it as theirs.</>,
                  x: 25.9,
                  y: 25.3,
                  w: 48,
                  h: 5.4,
                },
                {
                  label: 'Email me a code',
                  text: <>The default path sends a code to a <strong>work inbox</strong> that deskless workers often couldn&rsquo;t open on their phones.</>,
                  x: 26.8,
                  y: 43.3,
                  w: 46.2,
                  h: 28.1,
                },
                {
                  label: 'Sign in with Password',
                  text: <>Shown even at companies that use SSO. The method people reached for <strong>worked 34.6% of the time</strong>.</>,
                  x: 28.4,
                  y: 73.4,
                  w: 43,
                  h: 5.4,
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Data',
      subtitle: '7.7 million failed logins in one year',
      body: 'The data backed it up. Out of 45.9 million login attempts in a year, 7.7 million failed, and we had 9,275 login support cases in just 90 days. Password login failed 6.7 million times and only worked about a third of the time. Guided SSO worked 98% of the time. The fix was getting people onto the path that already worked.',
      visuals: [
        {
          alt: 'Login failure data, annotated',
          title: 'Where logins broke',
          caption: 'A year of login data. Password login failed nearly two out of three times, while codes, MFA, and SSO worked 86 to 98% of the time.',
          element: (
            <Callouts
              src={`${IMG}/failed-logins-data.png`}
              alt="Charts from a year of login telemetry, annotated: password login shows 6.69 million failures against 3.54 million successes, while login codes, MFA, and SSO succeed 86 to 98 percent of the time"
              width={1433}
              height={806}
              sizes="(min-width: 65em) 1040px, 100vw"
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
          ),
        },
      ],
    },
    {
      step: 'Testing',
      subtitle: 'Three directions, tested on real users',
      body: "I tested three versions with 75 remote participants on Useberry: the current login, an SSO-first version, and a password-first version. Heatmaps showed where people got stuck. Password-first was the fastest, but it pushed people toward the method that failed the most, so I went with SSO-first. That's what led to asking for an email first, then routing each person to their company's sign-in.",
      visuals: [
        {
          alt: 'Heatmap testing, annotated',
          title: 'Where people looked',
          caption: 'Attention scattered across the current login. In the other two versions, it went straight to whichever option came first.',
          element: (
            <Callouts
              src={`${IMG}/heatmap-testing.png`}
              alt="Heatmap testing of three login variants, annotated: the control shows scattered attention, the SSO-first variant shows focus on the SSO button, the password-first variant shows focus on the password field. Decision time fell from 27 seconds to 5.9 with SSO-first"
              width={1433}
              height={806}
              sizes="(min-width: 65em) 1040px, 100vw"
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
          ),
        },
      ],
    },
    {
      step: 'Simplifying',
      subtitle: 'Six steps down to four',
      body: 'The old flow could ask for a code, send you to a company page, then ask for a code again. Once we know your company from your email, most of that disappears. The second code and the extra company page are gone.',
      visuals: [
        {
          alt: 'The login flow before the redesign',
          title: 'Before',
          caption: 'Six screens, two codes, and two trips to the inbox.',
          element: (
            <FlowStrip
              tone="problem"
              label="The Awardco login flow before the redesign, screen by screen"
              steps={BEFORE_FLOW}
              tracks={BEFORE_FLOW.length}
            />
          ),
        },
        {
          alt: 'The login flow after the redesign',
          title: 'After',
          caption: 'Four screens and one code. The company page and the second code are gone.',
          element: (
            <FlowStrip
              label="The Awardco login flow after the redesign, screen by screen"
              steps={AFTER_FLOW}
              tracks={BEFORE_FLOW.length}
            />
          ),
        },
      ],
    },
    {
      step: 'Flows',
      subtitle: "Switching methods shouldn't restart login",
      body: "If someone picks password instead of a code, they get one field with their email already filled in, not a whole new login. I designed every branch screen by screen so the path stays the same whether you use a password, a code, or forgot your password.",
      visuals: [
        {
          src: `${FLOW}/after-password-branch.png`,
          width: 1440,
          height: 1024,
          alt: 'The redesigned company login page for a company that also requires a password: the email is already filled in as luke.woods@awardco.com, and only the password field is left',
          title: 'The password branch',
          caption: 'One field, not a fresh login. The email carries over, so the password is the only thing left.',
        },
        {
          alt: 'The new sign-in, path by path, on a phone and a laptop',
          title: 'The new sign-in, step by step',
          caption: 'Pick a path to walk through it on a phone and a laptop, captured from my coded prototype.',
          element: <FlowWalkthrough paths={PATHS} />,
        },
      ],
    },
    {
      step: 'Mobile',
      subtitle: 'Mobile only shows what works',
      body: 'A lot of Awardco users are deskless and sign in on their phones. On mobile you get one provider button and one field, and only the methods your company supports. Verification works by email, a secondary email, or text.',
      layout: 'split',
      visuals: [
        {
          orientation: 'tall',
          alt: 'The redesigned mobile sign-in',
          title: 'Mobile sign-in',
          caption: 'One provider button and one field, showing only the methods your company supports.',
          element: (
            <PhoneShot
              src={`${IMG}/figma/new-mobile.png`}
              alt="The redesigned mobile login: Awardco logo, a Sign in with Google button, and a single email field with one Continue button"
            />
          ),
        },
        {
          alt: 'The mobile verification chooser',
          title: 'Choosing how to verify',
          caption: 'Get the code by email, a secondary email, or text, without leaving the mobile flow.',
          element: (
            <PhoneShot
              src={`${IMG}/figma/sms-mobile.png`}
              alt="The verification chooser on mobile: receive your one-time code by email, secondary email, or text message"
            />
          ),
        },
      ],
    },
    {
      step: 'Theming',
      subtitle: 'One flow that fits every brand',
      body: "Awardco runs under each customer's brand, so the sign-in had to work in any color. Cinemark's red was the hardest to make work, and Accenture had the strictest brand rules. Same flow, same structure, their brand on top.",
      visuals: [
        {
          alt: 'The sign-in in three customer brands',
          title: 'Awardco, Cinemark, Accenture',
          caption: 'The same sign-in in Awardco blue, Cinemark red, and Accenture purple.',
          element: (
            <ShotRow
              shots={[
                {
                  ...BRAND,
                  src: `${IMG}/hero/desk-awardco.png`,
                  alt: 'The login page in Awardco branding: a pale blue page, a white card, and a blue Continue button',
                },
                {
                  ...BRAND,
                  src: `${IMG}/hero/desk-cinemark.png`,
                  alt: 'The same login page in Cinemark branding: a pale red page, a white card, and a red Continue button',
                },
                {
                  ...BRAND,
                  src: `${IMG}/hero/desk-accenture.png`,
                  alt: 'The same login page in Accenture branding: a pale purple page, a white card, and a purple Continue button',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Prototyping',
      subtitle: 'I prototyped in code so testing felt real',
      body: "Instead of clickable mockups, I built working prototypes in feature branches with VS Code and GitHub Copilot, then QA'd them with front-end engineers before they shipped. That let me run 20+ in-person sessions on the real thing, including keyboard-only and screen reader sessions.",
      visuals: [
        {
          alt: 'Password reset before and after',
          title: 'Password reset, before and after',
          caption: 'The old reset page was one blind field. The new one shows the rules up front and checks as you type.',
          element: (
            <CompareStage
              ariaLabel="Before and after: the old password reset page versus the redesigned reset flow with inline validation"
              layers={[
                {
                  src: `${IMG}/figma/old-reset.png`,
                  alt: 'The old reset page: a lone Reset Your Password card with one masked input and no feedback',
                  label: 'Before',
                  caption: '',
                  width: 2880,
                  height: 2048,
                },
                {
                  src: `${IMG}/figma/new-reset-web.png`,
                  alt: 'The redesigned reset page: password requirements stated up front, live inline validation, a confirm field with match checking, and show-password toggles',
                  label: 'After',
                  caption: '',
                  width: 2880,
                  height: 2048,
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Handoff',
      subtitle: 'Through security review and handed off',
      body: "The redesign passed architecture and security review before handoff. In testing, login was 25% faster, successful sign-ins went up 4.5%, and choosing a method dropped from 27 seconds to under 6. The biggest gap left is deskless workers signing in on shared kiosks.",
      visuals: [
        {
          alt: 'Final designs on desktop and mobile',
          title: 'Final designs',
          caption: 'The finished sign-in on desktop, the verification chooser on mobile, and password reset with live checks.',
          element: (
            <DeviceSet
              laptop={
                <Macbook ratio={1440 / 1024}>
                  <Image
                    src={`${IMG}/walk/desk-signin-filled.png`}
                    alt="The redesigned sign-in on desktop: Sign in with Google above one email field and Continue"
                    fill
                    sizes="(min-width: 65em) 680px, 100vw"
                  />
                </Macbook>
              }
              phones={[
                {
                  src: `${IMG}/walk/phone-verify-method.png`,
                  alt: 'The mobile verification chooser: email, secondary email, or text message',
                },
                {
                  src: `${IMG}/walk/phone-reset-states.png`,
                  alt: 'The mobile password reset with live checks: requirements met, passwords do not match',
                },
              ]}
            />
          ),
        },
      ],
    },
  ],
}

