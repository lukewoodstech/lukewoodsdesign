'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UNLOCK_HINT_COOKIE, gatePasswordEnvFor, unlockCookieFor } from '@/lib/gate'

/*
 * Casual gate for studies that aren't ready for public eyes — it keeps the
 * article out of the response until the password cookie is set, but it is
 * not real security: the cookie is a plain flag. Good enough for "don't
 * stumble into my draft".
 *
 * The password is read from the environment and has no fallback, on
 * purpose. It used to be a literal in this file, which was defensible
 * while the repo was private and is not now that it is going public: a
 * literal here is in every commit that ever touched it, so relocating it
 * only fixes the tip. With no default, there is nothing left in the source
 * to find, and nothing for a future history scrub to chase.
 *
 * Set CASE_STUDY_GATE_PASSWORD in .env.local and in the Vercel project.
 * If it is unset the gate fails closed (see below) rather than falling
 * open, because a gate that stops working should hide the draft, not
 * publish it.
 */
/*
 * Since 2026-11-03 (LUK-200) each study can carry its own password in
 * CASE_STUDY_GATE_PASSWORD_<SLUG> (Pitch's in Vercel only). Hoth has none
 * of its own and keeps the shared variable. Pitch does NOT fall back to the
 * shared one: if its own is unset it fails closed like any other.
 */
function passwordFor(slug: string): string | undefined {
  const own = process.env[gatePasswordEnvFor(slug)]
  if (own) return own
  return slug === 'hoth' ? process.env.CASE_STUDY_GATE_PASSWORD : undefined
}

export async function unlockCaseStudy(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const slug = formData.get('slug')
  if (typeof slug !== 'string' || !slug) return { error: 'Something went wrong.' }

  /*
   * Fail closed. Without this an unset variable would make GATE_PASSWORD
   * `undefined`, and `formData.get('password')` returns null for an absent
   * field — a mismatch today, but it is one refactor away from comparing
   * two empty values and letting everyone in. A misconfigured gate should
   * refuse everybody.
   */
  const GATE_PASSWORD = passwordFor(slug)
  if (!GATE_PASSWORD) {
    console.error(`[gate] no password set for ${slug} (${gatePasswordEnvFor(slug)}); refusing every unlock.`)
    return { error: 'This study can’t be unlocked right now.' }
  }

  if (formData.get('password') !== GATE_PASSWORD) {
    return { error: 'That password isn’t right.' }
  }

  const store = await cookies()
  store.set(unlockCookieFor(slug), '1', {
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
