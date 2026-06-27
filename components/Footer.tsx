export default function Footer() {
  return (
    <footer className="footer section">
      <hr />
      <div className="footer__content">
        <a href="/" className="footer-link" style={{ fontWeight: 500 }}>
          luke.
        </a>
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="https://twitter.com" className="footer-link" target="_blank" rel="noopener noreferrer">
            twitter
          </a>
          <a href="https://linkedin.com" className="footer-link" target="_blank" rel="noopener noreferrer">
            linkedin
          </a>
          <a href="https://read.cv" className="footer-link" target="_blank" rel="noopener noreferrer">
            read.cv
          </a>
          <span className="footer-link" style={{ pointerEvents: 'none' }}>
            utah ✦
          </span>
        </nav>
      </div>
    </footer>
  )
}
