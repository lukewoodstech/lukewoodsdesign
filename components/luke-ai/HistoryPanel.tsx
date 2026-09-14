"use client";

import { useState } from "react";
import { Ps1 } from "./TermChrome";

/*
 * The history panel inside the maximized luke-ai terminal window on /chat:
 * a VS Code-style side panel (HISTORY header, `+ new session`, then past
 * sessions listed like files). Collapsed by default so the transcript gets
 * the width; the panel button in the window bar toggles it. Below 48em it
 * overlays the transcript with a backdrop instead of pushing it.
 */

export type ConversationSummary = {
  id: string;
  title: string;
};

type SidebarProps = {
  isOpen: boolean;
  conversations: ConversationSummary[];
  currentId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onToggle: () => void;
  onDelete: (id: string) => void;
};

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
);

export default function Sidebar({
  isOpen,
  conversations,
  currentId,
  onSelect,
  onNew,
  onToggle,
  onDelete,
}: SidebarProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (pendingDeleteId) {
      onDelete(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      <aside
        className={`term-hist${isOpen ? " is-open" : ""}`}
        aria-label="Chat history"
        aria-hidden={!isOpen}
      >
        <div className="term-hist__head">
          <span className="term-hist__title">history</span>
          <span className="term-hist__count" aria-hidden="true">
            {conversations.length}
          </span>
        </div>

        <button
          type="button"
          className="term-hist__new"
          onClick={onNew}
          tabIndex={isOpen ? 0 : -1}
        >
          <span className="term-hist__plus" aria-hidden="true">
            +
          </span>
          new session
        </button>

        <div className="term-hist__list">
          {conversations.length === 0 ? (
            <p className="term-hist__empty">{"// no sessions yet"}</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`term-hist__row${conv.id === currentId ? " is-active" : ""}`}
              >
                <button
                  type="button"
                  className="term-hist__item"
                  onClick={() => onSelect(conv.id)}
                  title={conv.title}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <span className="term-hist__ext" aria-hidden="true">
                    ›
                  </span>
                  <span className="term-hist__name">{conv.title}</span>
                </button>
                <button
                  type="button"
                  className="term-hist__delete"
                  onClick={() => setPendingDeleteId(conv.id)}
                  aria-label={`Delete "${conv.title}"`}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <IconTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Below 48em the panel overlays the transcript; tap outside to close */}
      {isOpen && (
        <div
          className="term-hist__backdrop"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {pendingDeleteId && (
        <div
          className="term-hist__modal-backdrop"
          onClick={() => setPendingDeleteId(null)}
        >
          <div
            className="term-hist__modal"
            role="alertdialog"
            aria-labelledby="term-hist-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="term-hist-modal-title" className="term-hist__modal-title">
              <Ps1 />
              rm session
            </p>
            <p className="term-hist__modal-body">
              this permanently removes the conversation. continue? [y/n]
            </p>
            <div className="term-hist__modal-actions">
              <button
                type="button"
                className="term-hist__modal-cancel"
                onClick={() => setPendingDeleteId(null)}
              >
                n · cancel
              </button>
              <button
                type="button"
                className="term-hist__modal-delete"
                onClick={confirmDelete}
              >
                y · delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
