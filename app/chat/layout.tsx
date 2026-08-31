import type { Metadata } from 'next'

/*
 * The page itself is a client component, so metadata lives here. Without it
 * the route inherited the root layout's canonical ("/"), telling crawlers
 * /chat is a duplicate of the homepage. robots.txt already disallows /chat;
 * noindex is the belt to that suspender for crawlers that arrive via a link.
 */
export const metadata: Metadata = {
  title: 'Luke AI',
  description:
    'Ask Luke AI anything the case studies don’t cover: map Luke’s experience to your role, compare how he works across teams, or get the 30-second version.',
  alternates: { canonical: '/chat' },
  robots: { index: false, follow: false },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children
}
