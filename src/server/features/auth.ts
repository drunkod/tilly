import { Hono } from "hono"
import { createSession, setSessionCookie } from "../lib/session-auth"
import { TillyAccount } from "#shared/schema/account"
import { tryCatch } from "#shared/lib/trycatch"

export const authApp = new Hono()
  .post("/session", async (c) => {
    const { jazzAccountId, oneTimeToken } = await c.req.json()

    if (!jazzAccountId || !oneTimeToken) {
      return c.json({ error: "Missing credentials" }, 400)
    }

    // Verify the Jazz account exists
    const accountResult = await tryCatch(
      TillyAccount.load(jazzAccountId, {
        resolve: { root: true, profile: true },
      }),
    )

    if (!accountResult.ok || !accountResult.data) {
      return c.json({ error: "Invalid account" }, 401)
    }

    const account = accountResult.data

    if (
      !account.root?.sessionToken ||
      account.root.sessionToken !== oneTimeToken
    ) {
      return c.json({ error: "Invalid session token" }, 401)
    }

    // Clear the one-time token
    account.root.$jazz.set("sessionToken", undefined)

    const email = account.profile?.email

    // Create session token
    const token = await createSession(jazzAccountId, email)

    // Set cookie
    setSessionCookie(c, token)

    return c.json({
      success: true,
      token // Also return token for Authorization header
    })
  })

  .delete("/session", async (c) => {
    // Clear session cookie
    c.header("Set-Cookie", "session=; Path=/; Max-Age=0")
    return c.json({ success: true })
  })
