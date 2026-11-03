/*
 * Shared bits of the case-study password gate. The password itself lives
 * only in app/work/[slug]/actions.ts ('use server' — never bundled for the
 * client); this module is just the names both sides need.
 */
export const UNLOCK_COOKIE = 'cs_unlocked'

/*
 * Client-readable twin of UNLOCK_COOKIE (not httpOnly, path '/'). The tiles
 * use it to decide between opening the password modal and navigating
 * straight to an already-unlocked study. It grants nothing by itself — the
 * server only ever trusts UNLOCK_COOKIE.
 */
export const UNLOCK_HINT_COOKIE = 'cs_unlocked_hint'

/** Studies that render the gate instead of the article until unlocked.
    Pitch left this set on 2026-10-14 (LUK-77) when Luke promoted it, and
    came back on 2026-11-03 (LUK-200) with a password of its own. */
export const PROTECTED_SLUGS = new Set(['hoth', 'pitch'])

/*
 * Each gated study has its own cookie, so one study's password never opens
 * another (LUK-200). Hoth also still honours the old shared cookie, so a
 * visitor who unlocked it before the split is not asked again.
 */
export function unlockCookieFor(slug: string): string {
  return `${UNLOCK_COOKIE}_${slug.replace(/[^a-z0-9]/gi, '_')}`
}

/*
 * The environment variable holding a study's password:
 * CASE_STUDY_GATE_PASSWORD_PITCH for pitch. Hoth keeps the original shared
 * CASE_STUDY_GATE_PASSWORD as its fallback. Server-only: read it in
 * actions.ts, never in a client component.
 */
export function gatePasswordEnvFor(slug: string): string {
  return `CASE_STUDY_GATE_PASSWORD_${slug.replace(/[^a-z0-9]/gi, '_').toUpperCase()}`
}
