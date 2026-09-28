import { Wix_Madefor_Display } from 'next/font/google'

/*
 * Predict's typeface, for the coded Custom Reports mock only. next/font
 * self-hosts it, so the mock renders in the real face without a request to
 * Google, and the rest of the site stays in Geist. Applied as a class on the
 * mock's root, never globally.
 */
export const predictFont = Wix_Madefor_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-predict',
  display: 'swap',
})
