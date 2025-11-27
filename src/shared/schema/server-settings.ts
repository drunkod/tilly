import { co, z } from "jazz-tools"

export { ServerSettings }

let ServerSettings = co.map({
	serverUrl: z.string().optional(),
	enableAIChat: z.boolean().optional(),
	enablePushNotifications: z.boolean().optional(),
	apiKey: z.string().optional(),
})
