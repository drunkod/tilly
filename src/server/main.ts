import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { chatMessagesApp } from "./features/chat-messages"
// Disabled for Clerk to Passkey migration - will be re-enabled with Jazz-based user enumeration
// import { cronDeliveryApp } from "./features/push-cron"
// import { testNotificationApp } from "./features/push-test"
// TODO: Replace with Jazz auth middleware in task 8
// import { authMiddleware } from "#shared/clerk/server"

let authenticatedRoutes = new Hono()
	// TODO: Add Jazz auth middleware in task 8
	// .use(authMiddleware)
	.route("/chat", chatMessagesApp)

export let app = new Hono()
	.use(logger())
	.use(cors())
	// Disabled for Clerk to Passkey migration
	// .route("/push", testNotificationApp)
	// .route("/push", cronDeliveryApp)
	.route("/", authenticatedRoutes)

export type AppType = typeof app
