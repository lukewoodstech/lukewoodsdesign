import Link from 'next/link'

/*
 * Dead links used to land on Next's stock white 404 — the one unstyled
 * flash on an all-black site. Same terminal voice as the canvas nav.
 */
export default function NotFound() {
  return (
    <main className="notfound">
      <p className="notfound__term" aria-hidden="true">
        <span className="notfound__arrow">➜</span>
        <span className="notfound__dir">~</span> cd ./this-page
        <br />
        cd: no such file or directory
      </p>
      <h1 className="notfound__code">404</h1>
      <p className="notfound__msg">this page doesn&rsquo;t exist — the work does, though.</p>
      <Link href="/" className="footer-link notfound__home">
        ← back home
      </Link>
    </main>
  )
}
