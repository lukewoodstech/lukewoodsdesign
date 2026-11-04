'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'

/*
 * Click-to-expand screenshot. The inline shot is a button: hovering
 * surfaces an expand hint, clicking opens the full-resolution capture in a
 * lightbox. The lightbox portals to <body> because Reveal's translate
 * transform would otherwise turn position:fixed into
 * position:absolute-within-the-figure.
 *
 * The lightbox has two sizes. It opens at FIT: the whole capture on
 * screen, as large as the viewport allows. Until 2026-09-28 that was all
 * it did, and "expand" often produced a picture no bigger than the one
 * just clicked: a figure that already ran the width of a phone, or a
 * bled figure on a laptop, fit the viewport before the lightbox opened,
 * so the only thing that changed was the background. Clicking the
 * opened capture now toggles ZOOM, which lays the image out at its own
 * pixels (its natural width over the device pixel ratio, or 1.6x fit,
 * whichever is larger) inside a scrolling box, centred on the point that
 * was clicked. So the expand always expands, and on a phone the same
 * tap-and-drag reads a 2880px capture at retina density.
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
  const [zoom, setZoom] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setZoom(false)
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

  /* Zoom in on the point that was clicked; zoom out back to fit. */
  const toggleZoom = (e: MouseEvent<HTMLImageElement>) => {
    e.stopPropagation()
    const box = scrollRef.current
    const img = imgRef.current
    if (!box || !img) return
    if (zoom) {
      setZoom(false)
      return
    }
    const r = img.getBoundingClientRect()
    const fx = (e.clientX - r.left) / r.width
    const fy = (e.clientY - r.top) / r.height
    const dpr = window.devicePixelRatio || 1
    const zoomW = Math.max(r.width * 1.6, Math.min(width, width / dpr))
    box.style.setProperty('--zoom-w', `${Math.round(zoomW)}px`)
    setZoom(true)
    /* Two frames: one for React to commit the class, one for layout. */
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const zw = img.offsetWidth
        const zh = img.offsetHeight
        box.scrollLeft = fx * zw - box.clientWidth / 2
        box.scrollTop = fy * zh - box.clientHeight / 2
      }),
    )
  }

  /* The scroll box is the backdrop. A click on its own surface (not on
     the picture, and not on its scrollbar) closes. */
  const onBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget
    if (e.target !== box) return
    const r = box.getBoundingClientRect()
    if (e.clientX - r.left > box.clientWidth || e.clientY - r.top > box.clientHeight) return
    close()
  }

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
          /* The stylesheet turns the page's height ceiling into a width
             ceiling with this; see `.cs-canvas .lcs-shot`. */
          style={{ '--shot-ar': String(width / height) } as React.CSSProperties}
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
            className={`lcs-lightbox${zoom ? ' is-zoomed' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <div ref={scrollRef} className="lcs-lightbox__scroll" onClick={onBackdrop}>
              <Image
                ref={imgRef}
                src={src}
                alt={alt}
                width={width}
                height={height}
                /* The capture's own width, not the viewport's: ZOOM lays
                   it out at its own pixels, and a source picked for the
                   viewport was soft by the time it got there. */
                sizes={`${width}px`}
                className="lcs-lightbox__img"
                onClick={toggleZoom}
              />
            </div>
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
            <p className="lcs-lightbox__esc" aria-hidden="true">
              {zoom ? 'Drag to look around · click to fit' : 'Click the image to zoom · Esc to close'}
            </p>
          </div>,
          document.body,
        )}
    </>
  )
}
