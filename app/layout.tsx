import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { ViewTransition } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import Cursor from '@/components/Cursor'
import { SITE } from '@/lib/site'

/*
 * Named --font-plex-* rather than --font-mono/--font-sans: Tailwind v4 defines
 * theme variables with those exact names, and the duplicate definitions left
 * the winning font up to stylesheet order. The @theme block in globals.css
 * maps Tailwind's tokens onto these.
 */
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-plex-mono',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-plex-sans',
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
    <html lang="en" className={`${ibmPlexMono.variable} ${ibmPlexSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <Cursor />
        <ViewTransition>
          <div className="wrapper">
            {children}
          </div>
        </ViewTransition>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
