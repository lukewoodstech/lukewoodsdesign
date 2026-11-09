<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Workflow

Luke's rule (2026-11-09): when he asks for a change, just do it. Commit and push straight to `main` — no feature branch, no pull request. Vercel deploys `main` to production automatically, so the push is the redeploy. Run `npm test` and `npm run lint` (and `npm run build` for anything structural) before pushing.
