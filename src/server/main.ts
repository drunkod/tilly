import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { chatMessagesApp } from "./features/chat-messages"
import { cronDeliveryApp } from "./features/push-cron"
import { testNotificationApp } from "./features/push-test"
import { authApp } from "./features/auth"
import { sessionAuthMiddleware } from "./lib/session-auth"

let authenticatedRoutes = new Hono()
	.use(sessionAuthMiddleware)
	.route("/chat", chatMessagesApp)

export let app = new Hono()
	.use(logger())
	.use(cors())
	.route("/auth", authApp)
	.route("/push", testNotificationApp)
	.route("/push", cronDeliveryApp)
	.route("/", authenticatedRoutes)

export type AppType = typeof app
