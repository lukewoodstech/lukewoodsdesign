import posthog from 'posthog-js'

// PostHog powers scroll depth, time-on-page, and session replays.
// It only activates when NEXT_PUBLIC_POSTHOG_KEY is set (locally in
// .env.local, and in the Vercel project's environment variables).
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (key) {
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    defaults: '2025-05-24',
  })
}
