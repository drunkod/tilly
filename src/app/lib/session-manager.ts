import { useEffect } from "react"
import { useAccount, useIsAuthenticated } from "jazz-tools/react"
import { TillyAccount } from "#shared/schema/account"

export function useSessionSync() {
  const isAuthenticated = useIsAuthenticated()
  const me = useAccount(TillyAccount)

  useEffect(() => {
    if (!isAuthenticated || !me.$isLoaded) {
      // Clear session when not authenticated
      fetch("/api/auth/session", { method: "DELETE" })
      return
    }

    // Create/refresh session when authenticated
    fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jazzAccountId: me.$jazz.id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          // Store token for API requests
          sessionStorage.setItem("session_token", data.token)
        }
      })
      .catch(err => console.error("Failed to create session:", err))
  }, [isAuthenticated, me])
}
