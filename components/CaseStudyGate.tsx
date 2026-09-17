'use client'

import { useActionState } from 'react'
import { MAILTO } from '@/lib/site'

/*
 * The locked face of a protected case study. The article never reaches the
 * browser — the server renders this instead until the unlock action sets
 * the cookie. Fits the deck-on-dark system; for Hoth in particular the
 * lock is on-brand ("work, encrypted").
 */
export default function CaseStudyGate({
  slug,
  company,
  title,
  action,
  variant = 'page',
}: {
  slug: string
  company: string
  title: string
  action: (
    prev: { error: string | null },
    formData: FormData,
  ) => Promise<{ error: string | null }>
  /** 'page' fills the article column; 'modal' is the compact dialog body */
  variant?: 'page' | 'modal'
}) {
  const [state, formAction, pending] = useActionState(action, { error: null })

  return (
    <div
      className={
        variant === 'modal'
          ? 'flex flex-col items-center px-8 py-10 text-center'
          : 'flex min-h-[70vh] flex-col items-center justify-center px-6 text-center'
      }
    >
      <p className="cs-eyebrow">
        {company}
      </p>
      <h1
        className={
          variant === 'modal'
            ? 'cs-subhead mt-3'
            : 'cs-title mt-4'
        }
      >
        {title}
      </h1>

      <div
        className="mt-10 flex size-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.04]"
        aria-hidden="true"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/80"
        >
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </div>

      <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
        This case study is locked while it&apos;s being written. Enter the
        password, or{' '}
        <a href={MAILTO} className="text-white underline underline-offset-4">
          email me
        </a>{' '}
        for access.
      </p>

      <form action={formAction} className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3">
        <input type="hidden" name="slug" value={slug} />
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="password"
          aria-label="Case study password"
          className="w-full rounded-lg border border-white/20 bg-white/[0.04] px-4 py-3 font-mono text-base text-white placeholder:text-white/35 focus:border-[var(--accent)] focus:outline-none"
        />
        <button type="submit" className="btn justify-center" disabled={pending}>
          <span className="btn__text">
            <span className="btn__text__main">{pending ? 'checking…' : 'unlock'}</span>
          </span>
        </button>
        {state.error && (
          <p role="alert" className="text-sm text-mono-red">
            {state.error}
          </p>
        )}
      </form>
    </div>
  )
}
