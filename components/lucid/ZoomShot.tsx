'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/*
 * Click-to-expand screenshot for the Lucid case study. The inline shot is a
 * button: hovering surfaces an expand hint, clicking opens the full-resolution
 * capture in a lightbox. The lightbox portals to <body> because Reveal's
 * translate transform would otherwise turn position:fixed into
 * position:absolute-within-the-figure.
 */
export default function ZoomShot({
  src,
  alt,
  width,
  height,
  sizes,
  eager,
}: {
  src: string
  alt: string
  width: number
  height: number
  sizes?: string
  eager?: boolean
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="lcs-zoom"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Expand image: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={eager ? 'eager' : undefined}
          fetchPriority={eager ? 'high' : undefined}
          className="lcs-shot"
        />
        <span className="lcs-zoom__hint" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M7 1h4v4M11 1 7.5 4.5M5 11H1V7M1 11l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Click to expand
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="lcs-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              className="lcs-lightbox__close"
              aria-label="Close expanded image"
              onClick={close}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2 2l12 12M14 2 2 14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="100vw"
              className="lcs-lightbox__img"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="lcs-lightbox__esc" aria-hidden="true">
              Esc or click anywhere to close
            </p>
          </div>,
          document.body,
        )}
    </>
  )
}
