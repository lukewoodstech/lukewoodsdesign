'use client'

export type ConversationSummary = {
  id: string
  title: string
}

type SidebarProps = {
  isOpen: boolean
  conversations: ConversationSummary[]
  currentId: string
  onSelect: (id: string) => void
  onNew: () => void
  onToggle: () => void
  onDelete: (id: string) => void
}

const IconPanel = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </svg>
)

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

export default function Sidebar({
  isOpen,
  conversations,
  currentId,
  onSelect,
  onNew,
  onToggle,
  onDelete,
}: SidebarProps) {
  return (
    <>
      <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>

        {/* Rail — clicking anywhere on it (not a button) expands the sidebar */}
        <div className="sidebar__rail" onClick={onToggle}>
          <button className="sidebar__rail-btn" onClick={(e) => { e.stopPropagation(); onToggle(); }} aria-label="Expand sidebar">
            <IconPanel />
          </button>
          <button className="sidebar__rail-btn" onClick={(e) => { e.stopPropagation(); onNew(); }} aria-label="New chat">
            <IconPlus />
          </button>
        </div>

        {/* Panel — explicit close button only; no click-to-collapse on background */}
        <div className="sidebar__panel">
          <div className="sidebar__panel-header">
            <span className="sidebar__brand">luke ai.</span>
            <button className="sidebar__rail-btn" onClick={(e) => { e.stopPropagation(); onToggle(); }} aria-label="Collapse sidebar">
              <IconPanel />
            </button>
          </div>

          <button className="sidebar__new" onClick={(e) => { e.stopPropagation(); onNew(); }}>
            <IconPlus />
            <span>New Chat</span>
          </button>

          <div className="sidebar__list">
            <p className="sidebar__section-label">recents</p>
            {conversations.length === 0 ? (
              <p className="sidebar__empty">no chats yet.</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`sidebar__item-wrap${conv.id === currentId ? ' sidebar__item-wrap--active' : ''}`}
                >
                  <button
                    className="sidebar__item"
                    onClick={() => onSelect(conv.id)}
                    title={conv.title}
                  >
                    {conv.title}
                  </button>
                  <button
                    className="sidebar__delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                    aria-label="Delete conversation"
                  >
                    <IconTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </aside>

      {isOpen && <div className="sidebar__backdrop" onClick={onToggle} />}
    </>
  )
}
