'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MouseEvent, ReactNode } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

/*
 * `<Link href="/">` only scrolls when it actually navigates, so on the home
 * page itself the nav name was a no-op. Here we intercept that case and scroll
 * back up by hand — both the window and the work grid, which is its own
 * 100vh scroll container on mobile (see `.workgrid` in globals.css).
 */
export default function HomeLink({
  className,
  children,
  'aria-label': ariaLabel,
}: {
  className?: string
  children: ReactNode
  'aria-label'?: string
}) {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Off the home page, let Link navigate — Next scrolls to the top for us.
    if (pathname !== '/') return

    e.preventDefault()

    const behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth'

    window.scrollTo({ top: 0, behavior })
    document.querySelector('.workgrid')?.scrollTo({ top: 0, behavior })
  }

  return (
    <Link href="/" className={className} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </Link>
  )
}
