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
  description:
    'Product designer combining research, systems thinking, and code to ship useful products across Lucid, Awardco, Pattern, and Hoth.',
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
