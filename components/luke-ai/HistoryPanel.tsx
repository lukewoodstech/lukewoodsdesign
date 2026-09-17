'use client'

import { useState } from 'react'
import { relativeDay, type Conversation } from '@/lib/lukeAiStorage'

/*
 * The conversations panel inside the maximized Luke AI window on /chat:
 * a header, `+ New conversation`, then past conversations as rows. Open
 * by default on large screens, collapsed below; the panel button in the
 * window bar toggles it. Below 48em it overlays the transcript with a
 * backdrop instead of pushing it. When closed it is `inert`, so nothing
 * in it takes focus or is read out.
 */

type Props = {
  isOpen: boolean
  conversations: Conversation[]
  currentId: string
  onSelect: (id: string) => void
  onNew: () => void
  onToggle: () => void
  onDelete: (id: string) => void
}

const IconTrash = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

export default function HistoryPanel({
  isOpen,
  conversations,
  currentId,
  onSelect,
  onNew,
  onToggle,
  onDelete,
}: Props) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const pending = pendingDeleteId
    ? conversations.find((c) => c.id === pendingDeleteId)
    : undefined

  const confirmDelete = () => {
    if (pendingDeleteId) {
      onDelete(pendingDeleteId)
      setPendingDeleteId(null)
    }
  }

  return (
    <>
      <aside
        id="luke-ai-history"
        className={`term-hist${isOpen ? ' is-open' : ''}`}
        aria-label="Conversations"
        inert={!isOpen}
      >
        <div className="term-hist__head">
          <span className="term-hist__title">conversations</span>
          <span className="term-hist__count" aria-hidden="true">
            {conversations.length}
          </span>
        </div>

        <button type="button" className="term-hist__new" onClick={onNew}>
          <span className="term-hist__plus" aria-hidden="true">
            +
          </span>
          new conversation
        </button>

        <div className="term-hist__list">
          {conversations.length === 0 ? (
            <p className="term-hist__empty">no conversations yet</p>
          ) : (
            <ul className="term-hist__rows">
              {conversations.map((conv) => {
                const active = conv.id === currentId
                const questions = conv.messages.filter((m) => m.role === 'user').length
                return (
                  <li
                    key={conv.id}
                    className={`term-hist__row${active ? ' is-active' : ''}`}
                  >
                    <button
                      type="button"
                      className="term-hist__item"
                      onClick={() => onSelect(conv.id)}
                      aria-current={active ? 'true' : undefined}
                    >
                      <span className="term-hist__name">{conv.title}</span>
                      <span className="term-hist__meta">
                        {relativeDay(conv.updatedAt)} · {questions}{' '}
                        {questions === 1 ? 'question' : 'questions'}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="term-hist__delete"
                      onClick={() => setPendingDeleteId(conv.id)}
                      aria-label={`Delete conversation “${conv.title}”`}
                    >
                      <IconTrash />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Below 48em the panel overlays the transcript; tap outside to close */}
      {isOpen && (
        <div className="term-hist__backdrop" onClick={onToggle} aria-hidden="true" />
      )}

      {pending && (
        <div className="term-hist__modal-backdrop" onClick={() => setPendingDeleteId(null)}>
          <div
            className="term-hist__modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="term-hist-modal-title"
            aria-describedby="term-hist-modal-body"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setPendingDeleteId(null)
            }}
          >
            <p id="term-hist-modal-title" className="term-hist__modal-title">
              delete this conversation?
            </p>
            <p id="term-hist-modal-body" className="term-hist__modal-body">
              “{pending.title}” will be removed for good.
            </p>
            <div className="term-hist__modal-actions">
              <button
                type="button"
                className="term-hist__modal-cancel"
                onClick={() => setPendingDeleteId(null)}
                autoFocus
              >
                cancel
              </button>
              <button
                type="button"
                className="term-hist__modal-delete"
                onClick={confirmDelete}
              >
                delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
