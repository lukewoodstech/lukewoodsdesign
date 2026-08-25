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

/** Studies that render the gate instead of the article until unlocked. */
export const PROTECTED_SLUGS = new Set(['hoth'])
