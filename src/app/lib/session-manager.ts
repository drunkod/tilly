import { useEffect, useState } from "react"
import { useAccount, useIsAuthenticated } from "jazz-tools/react"
import { TillyAccount } from "#shared/schema/account"
import { nanoid } from "nanoid"

export function useSessionSync() {
  const isAuthenticated = useIsAuthenticated()
  const me = useAccount(TillyAccount, {
    resolve: { root: true },
  })
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !me.$isLoaded) {
      // Clear session when not authenticated
      fetch("/api/auth/session", { method: "DELETE" }).catch(() => {
        // Silent fail - not critical
      })
      return
    }

    if (isCreatingSession) return // Prevent duplicate requests
    if (!me.root) return

    const oneTimeToken = nanoid()
    me.root.$jazz.set("sessionToken", oneTimeToken)

    // Create/refresh session when authenticated
    setIsCreatingSession(true)
    fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jazzAccountId: me.$jazz.id,
        oneTimeToken: oneTimeToken,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Session creation failed: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (data.token) {
          sessionStorage.setItem("session_token", data.token)
        }
      })
      .catch(err => {
        console.error("Failed to create session:", err)
        // Could show a toast notification here
      })
      .finally(() => {
        setIsCreatingSession(false)
      })
  }, [isAuthenticated, me, isCreatingSession])

  useEffect(() => {
    if (!isAuthenticated || !me.$isLoaded) return

    // Refresh session every 24 hours
    const refreshInterval = setInterval(() => {
      if (!me.root) return

      const oneTimeToken = nanoid()
      me.root.$jazz.set("sessionToken", oneTimeToken)

      fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jazzAccountId: me.$jazz.id,
          oneTimeToken: oneTimeToken,
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            sessionStorage.setItem("session_token", data.token)
          }
        })
        .catch(console.error)
    }, 24 * 60 * 60 * 1000) // 24 hours

    return () => clearInterval(refreshInterval)
  }, [isAuthenticated, me])
}
