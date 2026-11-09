/*
 * Single source for the handful of strings that show up in the nav, the
 * footer, page metadata, robots.txt and the sitemap. They were previously
 * duplicated across components (and the email lived only inside the chat
 * system prompt, which is why it never made it onto the site).
 */
export const SITE = {
  name: 'Luke Woods',
  role: 'Product Designer',
  url: 'https://lukewoodsdesign.com',
  /*
   * The line Google prints under the name, and the one every page falls back
   * to. It names the three published studies and stops there.
   *
   * It used to end "…Lucid, Awardco, Pattern, and Hoth." The Hoth study was
   * dropped on 2026-11-09, so the description names only work a visitor can
   * open.
   */
  description:
    'Product designer combining research, systems thinking, and code to ship useful products: Pitch, Lucid, Awardco, and Pattern.',
  email: 'lukewoodstech@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lukewoodstech',
  github: 'https://github.com/lukewoodstech',
  /*
   * Self-hosted: the Drive link required Google's viewer and could silently
   * break on a permissions change. The PDF ships with the site instead —
   * update it by replacing public/resume.pdf.
   */
  resume: '/resume.pdf',
} as const

export const MAILTO = `mailto:${SITE.email}?subject=${encodeURIComponent(
  'Hello from your portfolio',
)}`

/*
 * The home page's sentence (2026-11-05), in the lines it sets in.
 *
 * HeroIntro sets it word by word, with these breaks on wide screens; the
 * link-preview card is a still of the same lines. Both come from here so
 * the two can't drift.
 */
export const INTRO_LINES = [
  'Hi, I’m Luke, a product designer',
  'that enjoys building data-driven',
  'and user-centric experiences',
  'for other humans.',
] as const

/** The whole line, joined up — what assistive tech reads. */
export const INTRO_SENTENCE = INTRO_LINES.join(' ')
