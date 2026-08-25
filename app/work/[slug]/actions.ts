'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UNLOCK_COOKIE, UNLOCK_HINT_COOKIE } from '@/lib/gate'

/*
 * Casual gate for studies that aren't ready for public eyes — it keeps the
 * article out of the response until the password cookie is set, but it is
 * not real security: the password lives in this server-only file and the
 * cookie is a plain flag. Good enough for "don't stumble into my draft".
 */
const GATE_PASSWORD = 'REDACTED-SEE-CASE_STUDY_GATE_PASSWORD'

export async function unlockCaseStudy(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const slug = formData.get('slug')
  if (typeof slug !== 'string' || !slug) return { error: 'Something went wrong.' }

  if (formData.get('password') !== GATE_PASSWORD) {
    return { error: 'That password isn’t right.' }
  }

  const store = await cookies()
  store.set(UNLOCK_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/work',
  })
  // Readable flag so the home-grid tiles skip the modal once unlocked.
  store.set(UNLOCK_HINT_COOKIE, '1', {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  // Re-renders the page server-side, now with the cookie present.
  redirect(`/work/${slug}`)
}
