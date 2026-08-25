'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import CaseStudyGate from './CaseStudyGate'

/*
 * The case-study password gate as a dialog, so a locked tile can ask for
 * the password in place instead of navigating to the gate page. Wraps the
 * same CaseStudyGate form (and the same server action — on success the
 * action's redirect carries the visitor into the unlocked study).
 *
 * Portaled to <body>: the tiles clip overflow and listen for clicks, so
 * the dialog must live outside their DOM. Portals still bubble events
 * through the React tree, hence the stopPropagation on the backdrop.
 */
export default function GateModal({
  open,
  onClose,
  slug,
  company,
  title,
  action,
}: {
  open: boolean
  onClose: () => void
  slug: string
  company: string
  title: string
  action: (
    prev: { error: string | null },
    formData: FormData,
  ) => Promise<{ error: string | null }>
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation()
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Password required: ${title}`}
    >
      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-white/15 bg-[#0d0d12] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M3 3 L13 13 M13 3 L3 13" />
          </svg>
        </button>
        <CaseStudyGate
          slug={slug}
          company={company}
          title={title}
          action={action}
          variant="modal"
        />
      </div>
    </div>,
    document.body,
  )
}
