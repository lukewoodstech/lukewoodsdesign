'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * A screen recording you can drive, like a YouTube embed (Luke,
 * 2026-11-03): it starts playing muted on a loop, and a bar along the
 * bottom gives play/pause, a scrubber you can click or drag, the time,
 * and full screen. Clicking the picture toggles play. Space and the arrow
 * keys work when the player has focus. The bar shows on hover and focus,
 * always while paused, and always on touch screens.
 */
const fmt = (t: number) => {
  if (!Number.isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function VideoPlayer({ src, poster, label }: { src: string; poster: string; label: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [dragging, setDragging] = useState(false)

  /* The video can load (and start autoplaying) before React hydrates, so
     the metadata and play events fire with no one listening. Read the
     state it is already in once the player mounts. */
  useEffect(() => {
    const v = video.current
    if (!v) return
    if (v.readyState >= 1 && Number.isFinite(v.duration)) setDuration(v.duration)
    setPlaying(!v.paused)
    setTime(v.currentTime)
  }, [])

  const toggle = useCallback(() => {
    const v = video.current
    if (!v) return
    if (v.paused) void v.play()
    else v.pause()
  }, [])

  const seekTo = useCallback((clientX: number) => {
    const v = video.current
    const t = track.current
    if (!v || !t || !duration) return
    const r = t.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    v.currentTime = p * duration
    setTime(v.currentTime)
  }, [duration])

  useEffect(() => {
    if (!dragging) return
    const move = (e: PointerEvent) => seekTo(e.clientX)
    const up = () => setDragging(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [dragging, seekTo])

  const fullscreen = () => {
    const el = wrap.current
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (document.fullscreenElement) void document.exitFullscreen()
    else if (el?.requestFullscreen) void el.requestFullscreen()
    else v?.webkitEnterFullscreen?.() // iPhone Safari
  }

  const onKey = (e: React.KeyboardEvent) => {
    const v = video.current
    if (!v) return
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); toggle() }
    else if (e.key === 'ArrowRight') { v.currentTime = Math.min(duration, v.currentTime + 5) }
    else if (e.key === 'ArrowLeft') { v.currentTime = Math.max(0, v.currentTime - 5) }
    else if (e.key === 'f') fullscreen()
  }

  const pct = duration ? (time / duration) * 100 : 0

  return (
    <div
      ref={wrap}
      className={`cs-player${playing ? '' : ' is-paused'}`}
      tabIndex={0}
      role="region"
      aria-label={`Video: ${label}`}
      onKeyDown={onKey}
    >
      <video
        ref={video}
        className="cs-player__video"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => { if (!dragging) setTime(e.currentTarget.currentTime) }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      />

      {!playing && (
        <button type="button" className="cs-player__big" onClick={toggle} aria-label="Play">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
        </button>
      )}

      <div className="cs-player__bar">
        <button type="button" className="cs-player__btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="3.5" height="14" rx="1" /><rect x="14" y="5" width="3.5" height="14" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
          )}
        </button>

        <span className="cs-player__time">{fmt(time)} / {fmt(duration)}</span>

        <div
          ref={track}
          className="cs-player__track"
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
          onPointerDown={(e) => { setDragging(true); seekTo(e.clientX) }}
        >
          <span className="cs-player__rail">
            <span className="cs-player__fill" style={{ width: `${pct}%` }} />
          </span>
          <span className="cs-player__knob" style={{ left: `${pct}%` }} />
        </div>

        <button type="button" className="cs-player__btn" onClick={fullscreen} aria-label="Full screen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </div>
    </div>
  )
}
