import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ViewTransition } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import Cursor from '@/components/Cursor'
import { LukeAiProvider } from '@/components/luke-ai/LukeAiProvider'
import { SITE } from '@/lib/site'

/*
 * Geist Sans is the site's typeface; Geist Mono is reserved for the terminal
 * surfaces (Luke AI, the Explorer nav, code) and small technical labels.
 * Both are variable fonts, so one file per family covers every weight the
 * stylesheet asks for (400–700). Named --font-geist-* rather than
 * --font-mono/--font-sans: Tailwind v4 defines theme variables with those
 * exact names, and the duplicate definitions left the winning font up to
 * stylesheet order. The @theme block in globals.css maps Tailwind's tokens
 * onto these. `display: swap` plus next/font's size-adjusted fallback keeps
 * the swap from shifting layout.
 */
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  // metadataBase makes every relative OG/canonical URL below resolve absolutely.
  // Swap this the moment a custom domain goes live.
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · ${SITE.role}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} · ${SITE.role}`,
    description: SITE.description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} · ${SITE.role}`,
    description: SITE.description,
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  /* Lets /chat pad its composer past the iPhone home indicator. */
  viewportFit: 'cover',
}

/*
 * Person + WebSite structured data for the knowledge graph. Kept to public
 * facts already on the page — name, role, site, LinkedIn — nothing scrapers
 * couldn't read off the footer.
 */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE.url}/#person`,
      name: SITE.name,
      jobTitle: SITE.role,
      url: SITE.url,
      sameAs: [SITE.linkedin],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      name: `${SITE.name} · ${SITE.role}`,
      description: SITE.description,
      url: SITE.url,
      author: { '@id': `${SITE.url}/#person` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      /* globals.css sets scroll-behavior: smooth; this tells Next so route
         transitions don't inherit the glide. */
      data-scroll-behavior="smooth"
    >
      <body>
        <Cursor />
        {/* Luke AI's one session for the whole site: the homepage terminal
            and /chat are two views of the same thread (see LukeAiProvider). */}
        <LukeAiProvider>
          <ViewTransition>
            <div className="wrapper">
              {children}
            </div>
          </ViewTransition>
        </LukeAiProvider>
        <Analytics />
        <SpeedInsights />
        {/*
         * suppressHydrationWarning: PostHog's loader inserts its own <script>
         * directly before the first script in the document — this one — so at
         * hydration React finds PostHog's tag where it expects the JSON-LD and
         * threw a mismatch on every page (forcing a full client re-render in
         * prod). The tag is static and never updates, so letting React skip
         * the comparison is safe; the server-rendered JSON-LD stays in the DOM.
         */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </body>
    </html>
  )
}
