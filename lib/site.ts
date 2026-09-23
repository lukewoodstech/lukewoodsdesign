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
   * It used to end "…Lucid, Awardco, Pattern, and Hoth." Hoth is in
   * HIDDEN_WORK and password-gated, so the one sentence with the widest
   * reach on the site was advertising the only work a visitor cannot open.
   * Hoth goes back in the moment its study is written; until then the
   * description promises exactly what the site delivers.
   */
  description:
    'Product designer combining research, systems thinking, and code to ship useful products across Lucid, Awardco, and Pattern.',
  email: 'lukewoodstech@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lukewoodstech',
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
 * The home page's resting sentence, in the pieces it's built from.
 *
 * HeroIntro sets it word by word — the name and both adjectives are hoverable,
 * and the ending rolls over to another phrase — so it reads these pieces rather
 * than the joined string. The link-preview card is a still of the same line, so
 * it uses INTRO_SENTENCE. Both come from here so the two can't drift.
 */
export const INTRO = {
  adjectives: ['creative', 'impact-driven'],
  /* Lower-cased SITE.role, with the full stop. */
  tail: 'product designer.',
} as const

/*
 * The three lines HeroIntro sets, in order. They're fixed there rather than
 * wrapped, because the ending rolls over to phrases of other widths and a
 * shared line would rewrap under the pointer. The preview card keeps the same
 * three — left to wrap on its own it broke "impact-driven" at the hyphen.
 */
export const INTRO_LINES = [
  `${SITE.name} is a`,
  `${INTRO.adjectives[0]} & ${INTRO.adjectives[1]}`,
  INTRO.tail,
]

/** The whole line, joined up — what assistive tech reads. */
export const INTRO_SENTENCE = INTRO_LINES.join(' ')
