import { hc } from "hono/client"
import type { AppType } from "#server/main"

const SESSION_TOKEN_KEY = "session_token"
const SESSION_CREATED_KEY = "session_created_at"
const SESSION_USER_KEY = "session_user_id"

// ✅ Hono RPC client for typed API calls (THIS WAS MISSING!)
export const apiClient = hc<AppType>("/api", {
  fetch: authenticatedFetch,
})

// Custom fetch wrapper that adds authentication
export async function authenticatedFetch(
  url: string | URL | Request,
  options: RequestInit = {}
): Promise<Response> {
  const token = sessionStorage.getItem(SESSION_TOKEN_KEY)

  // Handle Request object (used by Hono client)
  const input = url instanceof Request ? url : url
  const init = url instanceof Request ? options : {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  }

  const response = await fetch(input, init)

  // Handle expired session
  if (response.status === 401) {
    console.warn("[API] Session expired (401), clearing session")
    sessionStorage.removeItem(SESSION_TOKEN_KEY)
    sessionStorage.removeItem(SESSION_CREATED_KEY)
    sessionStorage.removeItem(SESSION_USER_KEY)

    // Dispatch custom event to trigger re-auth UI
    window.dispatchEvent(new CustomEvent("session-expired"))
  }

  return response
}

// Helper to check if session exists
export function hasSession(): boolean {
  return !!sessionStorage.getItem(SESSION_TOKEN_KEY)
}

// Helper to get session age in milliseconds
export function getSessionAge(): number | null {
  const createdAt = sessionStorage.getItem(SESSION_CREATED_KEY)
  if (!createdAt) return null
  return Date.now() - parseInt(createdAt, 10)
}
