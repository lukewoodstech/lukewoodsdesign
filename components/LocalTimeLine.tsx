'use client'

import { useEffect, useState } from 'react'

/*
 * "salt lake city, ut · 4:12:33 pm mdt" — a quiet alive-site detail on the
 * landing. Ticks every second in Luke's timezone regardless of where the
 * visitor is. Renders empty on the server and first paint (the time is
 * client-only by nature), so there's nothing to mismatch on hydration.
 */

function now() {
  return new Date()
    .toLocaleTimeString('en-US', { timeZone: 'America/Denver', timeZoneName: 'short' })
    .toLowerCase()
}

export default function LocalTimeLine({ className = '' }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    setTime(now())
    const t = setInterval(() => setTime(now()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <p className={`local-time ${className}`.trim()}>
      salt lake city, ut{time && <> · {time}</>}
    </p>
  )
}
