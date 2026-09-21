import EmailLink from '@/components/EmailLink'

/*
 * The close, at the size it deserves: two words and an arrow, the whole
 * width, the whole thing one link. It's an EmailLink underneath — the
 * click opens a mail client and copies the address, and the "copied"
 * toast confirms it — so the biggest thing on the page is also the one
 * that does the most.
 */
export default function LetsTalk() {
  return (
    <EmailLink className="talk">
      <span className="talk__text">Let’s talk</span>
      <svg className="talk__arrow" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M6 24h34M26 10l14 14-14 14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
      </svg>
    </EmailLink>
  )
}
