/*
 * The @mention interaction as two moments: typing @ opens a short list of
 * matching people and teams, and picking one turns it into a chip the
 * search can act on.
 *
 * Built in code instead of stacking the four Figma exports, which read as
 * a collage: the menu export didn't match the typed query, repeated rows,
 * and sat at a different scale than the bar. Names are invented, like the
 * design file's.
 */

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="lcs-mflow__icon">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.3 15.3 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M10.5 6.8c.3 1.9 1.3 2.9 3.2 3.2-1.9.3-2.9 1.3-3.2 3.2-.3-1.9-1.3-2.9-3.2-3.2 1.9-.3 2.9-1.3 3.2-3.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="lcs-mflow__icon">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="15" cy="7" r="2" fill="#fff" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="12" r="2" fill="#fff" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14" cy="17" r="2" fill="#fff" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function TeamIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5.5" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18.5" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 19c0-2.8 2.2-5 5-5s5 2.2 5 5M2 18c0-2 1.6-3.6 3.5-3.6M22 18c0-2-1.6-3.6-3.5-3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const MATCHES = [
  { name: 'Jiaqi Zhuo', sub: 'jzhuo@lucidchart.com', initials: 'JZ', tone: '#ffd21f' },
  { name: 'Jordan Hale', sub: 'jhale@lucidchart.com', initials: 'JH', tone: '#c7d7fe' },
  { name: 'Journey design', sub: 'Team · 8 people', team: true },
]

export default function MentionFlow() {
  return (
    <div className="lcs-mflow">
      <div className="lcs-mflow__step">
        <p className="lcs-mflow__label">
          <span>01</span> Type @ to choose a person
        </p>
        <div className="lcs-mflow__bar">
          <SearchIcon />
          <span className="lcs-mflow__query">
            Find the 1 on 1 board <span className="lcs-mflow__at">@j</span>
            <span className="lcs-mflow__caret" />
          </span>
          <FilterIcon />
        </div>
        <ul className="lcs-mflow__menu" aria-label="Matching people and teams">
          {MATCHES.map((m, i) => (
            <li key={m.name} className={i === 0 ? 'is-active' : undefined}>
              <span
                className={`lcs-mflow__avatar${m.team ? ' lcs-mflow__avatar--team' : ''}`}
                style={m.tone ? { background: m.tone } : undefined}
                aria-hidden="true"
              >
                {m.team ? <TeamIcon /> : m.initials}
              </span>
              <span className="lcs-mflow__who">
                <strong>{m.name}</strong>
                <span>{m.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="lcs-mflow__step">
        <p className="lcs-mflow__label">
          <span>02</span> The pick becomes a chip the search can act on
        </p>
        <div className="lcs-mflow__bar">
          <SearchIcon />
          <span className="lcs-mflow__query">
            Find the 1 on 1 board <span className="lcs-mflow__chip">Jiaqi Zhuo</span> shared with
            me
          </span>
          <FilterIcon />
        </div>
      </div>
    </div>
  )
}
