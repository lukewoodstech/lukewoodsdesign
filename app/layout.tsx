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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable} ${ibmPlexSans.variable}`}>
      <body>
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
