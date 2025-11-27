import type { APIRoute, GetStaticPaths } from "astro"

import { Hono } from "hono"
import { app } from "../../server/main"

// In static mode, return empty paths so no API routes are generated
// In server mode, this function is not called (prerender = false)
export let getStaticPaths: GetStaticPaths = () => []

// Disable prerendering for API routes - they only work in server mode
export let prerender = false

export let ALL: APIRoute = c => new Hono().route("/api", app).fetch(c.request)
