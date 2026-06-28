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
}

const IconPanel = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </svg>
)

const IconCompose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)

export default function Sidebar({
  isOpen,
  conversations,
  currentId,
  onSelect,
  onNew,
  onToggle,
}: SidebarProps) {
  return (
    <>
      <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>

        {/* Rail — always visible on desktop, collapsed icon strip */}
        <div className="sidebar__rail">
          <button className="sidebar__rail-btn" onClick={onToggle} aria-label="Expand sidebar">
            <IconPanel />
          </button>
          <button className="sidebar__rail-btn" onClick={onNew} aria-label="New chat">
            <IconCompose />
          </button>
        </div>

        {/* Panel — slides over the rail when open */}
        <div className="sidebar__panel">
          <div className="sidebar__panel-header">
            <span className="sidebar__brand">luke ai.</span>
            <button className="sidebar__rail-btn" onClick={onToggle} aria-label="Collapse sidebar">
              <IconPanel />
            </button>
          </div>

          <button className="sidebar__new" onClick={onNew}>
            <span>new chat</span>
            <IconCompose />
          </button>

          <div className="sidebar__list">
            {conversations.length === 0 ? (
              <p className="sidebar__empty">no chats yet.</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  className={`sidebar__item${conv.id === currentId ? ' sidebar__item--active' : ''}`}
                  onClick={() => onSelect(conv.id)}
                  title={conv.title}
                >
                  {conv.title}
                </button>
              ))
            )}
          </div>
        </div>

      </aside>

      {isOpen && <div className="sidebar__backdrop" onClick={onToggle} />}
    </>
  )
}
