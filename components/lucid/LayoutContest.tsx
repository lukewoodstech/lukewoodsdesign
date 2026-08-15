/*
 * The four layout prototypes as schematic wireframes, drawn in the page's own
 * design language. Deliberately NOT screenshot recreations: the real
 * prototypes were coded and tested, and captures of them are not available,
 * so this renders the shape of each option honestly as a diagram. The winner
 * lifts on hover while the losers recede (CSS in globals.css). Server
 * component — no state, hover is pure CSS.
 */

const OPTIONS = [
  {
    name: 'Side panel',
    winner: true,
    verdict: 'Kept the page usable while you asked',
    blocks: [{ top: 0, right: 0, width: '32%', height: '100%' }],
  },
  {
    name: 'Modal',
    winner: false,
    verdict: 'Blocked the docs list behind it',
    blocks: [{ top: '22%', left: '28%', width: '44%', height: '56%' }],
  },
  {
    name: 'Floating panel',
    winner: false,
    verdict: 'Covered the docs it pointed to',
    blocks: [{ bottom: '6%', right: '5%', width: '38%', height: '52%' }],
  },
  {
    name: 'Inline bar',
    winner: false,
    verdict: 'No room for a real conversation',
    blocks: [{ top: '8%', left: '10%', width: '80%', height: '14%' }],
  },
]

export default function LayoutContest() {
  return (
    <ul className="lcs-lay" aria-label="The four layout prototypes tested">
      {OPTIONS.map((o) => (
        <li
          key={o.name}
          className={`lcs-lay__card ${o.winner ? 'lcs-lay__card--winner' : ''}`}
        >
          {o.winner && <span className="lcs-lay__badge">shipped</span>}
          <div className="lcs-lay__diagram" aria-hidden="true">
            {o.blocks.map((b, i) => (
              <span key={i} className="lcs-lay__block" style={b} />
            ))}
          </div>
          <span className="lcs-lay__name">{o.name}</span>
          <span className="lcs-lay__verdict">{o.verdict}</span>
        </li>
      ))}
    </ul>
  )
}
