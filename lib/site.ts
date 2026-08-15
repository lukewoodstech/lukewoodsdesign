/*
 * Single source for the handful of strings that show up in the nav, the
 * footer, page metadata, robots.txt and the sitemap. They were previously
 * duplicated across components (and the email lived only inside the chat
 * system prompt, which is why it never made it onto the site).
 */
export const SITE = {
  name: 'Luke Woods',
  role: 'Product Designer',
  url: 'https://lukewoodsdesign.vercel.app',
  description:
    'Product designer who uses research, systems thinking, and technical fluency to turn complex product problems into clear, intuitive experiences.',
  email: 'lukewoodstech@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lukewoodstech',
  resume:
    'https://drive.google.com/file/d/18_IQ05ORFpJnJeR42TqPjkL9JoCxSkHX/view?usp=sharing',
} as const

export const MAILTO = `mailto:${SITE.email}?subject=${encodeURIComponent(
  'Hello from your portfolio',
)}`
