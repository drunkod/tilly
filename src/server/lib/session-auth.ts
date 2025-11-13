import { createMiddleware } from "hono/factory"
import { setCookie, getCookie } from "hono/cookie"
import { sign, verify } from "hono/jwt"
import { JWT_SECRET } from "astro:env/server"

export type { SessionData, AuthContext, AuthenticatedContext }

type SessionData = {
jazzAccountId: string
email?: string
exp: number
}

type AuthContext = {
Variables: {
jazzAccountId: string | null
sessionData: SessionData | null
}
}

type AuthenticatedContext = {
Variables: {
jazzAccountId: string
sessionData: SessionData
}
}

const SESSION_DURATION = 30 * 24 * 60 * 60 // 30 days in seconds

export const sessionAuthMiddleware = createMiddleware<AuthContext>(
async (c, next) => {
const authHeader = c.req.header("Authorization")
const token = authHeader?.replace("Bearer ", "") || getCookie(c, "session")

if (!token) {
c.set("jazzAccountId", null)
c.set("sessionData", null)
return await next()
}

try {
const payload = await verify(token, JWT_SECRET) as SessionData

// Check expiration
if (payload.exp < Date.now() / 1000) {
c.set("jazzAccountId", null)
c.set("sessionData", null)
return await next()
}

c.set("jazzAccountId", payload.jazzAccountId)
c.set("sessionData", payload)
} catch (error) {
console.warn("Failed to verify session:", error)
c.set("jazzAccountId", null)
c.set("sessionData", null)
}

return await next()
}
)

export const requireAuth = createMiddleware<AuthenticatedContext>(
async (c, next) => {
const jazzAccountId = c.get("jazzAccountId")
const sessionData = c.get("sessionData")

if (!jazzAccountId || !sessionData) {
return c.json({ error: "Authentication required" }, 401)
}

return next()
}
)

export async function createSession(jazzAccountId: string, email?: string): Promise<string> {
const payload: SessionData = {
jazzAccountId,
email,
exp: Math.floor(Date.now() / 1000) + SESSION_DURATION,
}

return await sign(payload, JWT_SECRET)
}

export function setSessionCookie(c: any, token: string) {
setCookie(c, "session", token, {
httpOnly: true,
secure: true,
sameSite: "Lax",
maxAge: SESSION_DURATION,
path: "/",
})
}
