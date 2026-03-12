<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Navigation

Use `<Link>` from `next/link` for all internal navigation — never raw `<a href=` tags. Raw anchors bypass client-side routing and disable prefetching.
