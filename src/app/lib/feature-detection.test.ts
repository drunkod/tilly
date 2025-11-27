import { describe, test, expect, beforeEach, vi, afterEach } from "vitest"
import {
	hasServerFeatures,
	hasAIChat,
	hasPushNotifications,
	getFeatureStatus,
} from "./feature-detection"

type ServerSettings = {
	serverUrl?: string
	enableAIChat?: boolean
	enablePushNotifications?: boolean
	apiKey?: string
}

type MockAccount = {
	root?: {
		serverSettings?: ServerSettings
	}
}

function createMockAccount(settings?: ServerSettings): MockAccount {
	return {
		root: {
			serverSettings: settings,
		},
	}
}

describe("feature-detection", () => {
	beforeEach(() => {
		vi.stubEnv("PUBLIC_SERVER_URL", "")
		vi.stubGlobal("window", {
			PushManager: class {},
			Notification: class {},
		})
	})

	afterEach(() => {
		vi.unstubAllEnvs()
		vi.unstubAllGlobals()
	})

	describe("hasServerFeatures", () => {
		test("returns false when no settings and no env var", () => {
			let account = createMockAccount(undefined)
			expect(hasServerFeatures(account as never)).toBe(false)
		})

		test("returns false when null account", () => {
			expect(hasServerFeatures(null)).toBe(false)
		})

		test("returns true when serverUrl is set in settings", () => {
			let account = createMockAccount({ serverUrl: "https://my-server.com" })
			expect(hasServerFeatures(account as never)).toBe(true)
		})

		test("returns true when PUBLIC_SERVER_URL env var is set", () => {
			vi.stubEnv("PUBLIC_SERVER_URL", "https://env-server.com")
			let account = createMockAccount(undefined)
			expect(hasServerFeatures(account as never)).toBe(true)
		})

		test("settings serverUrl takes priority over env var", () => {
			vi.stubEnv("PUBLIC_SERVER_URL", "https://env-server.com")
			let account = createMockAccount({
				serverUrl: "https://settings-server.com",
			})
			expect(hasServerFeatures(account as never)).toBe(true)
		})
	})

	describe("hasAIChat", () => {
		test("returns false when no server features available", () => {
			let account = createMockAccount(undefined)
			expect(hasAIChat(account as never)).toBe(false)
		})

		test("returns true when server configured and enableAIChat not set (defaults to true)", () => {
			let account = createMockAccount({ serverUrl: "https://my-server.com" })
			expect(hasAIChat(account as never)).toBe(true)
		})

		test("returns true when server configured and enableAIChat is true", () => {
			let account = createMockAccount({
				serverUrl: "https://my-server.com",
				enableAIChat: true,
			})
			expect(hasAIChat(account as never)).toBe(true)
		})

		test("returns false when server configured but enableAIChat is false", () => {
			let account = createMockAccount({
				serverUrl: "https://my-server.com",
				enableAIChat: false,
			})
			expect(hasAIChat(account as never)).toBe(false)
		})

		test("returns true when using env var and enableAIChat not explicitly disabled", () => {
			vi.stubEnv("PUBLIC_SERVER_URL", "https://env-server.com")
			let account = createMockAccount(undefined)
			expect(hasAIChat(account as never)).toBe(true)
		})
	})

	describe("hasPushNotifications", () => {
		test("returns false when no server features available", () => {
			let account = createMockAccount(undefined)
			expect(hasPushNotifications(account as never)).toBe(false)
		})

		test("returns true when server configured and browser supports push", () => {
			let account = createMockAccount({ serverUrl: "https://my-server.com" })
			expect(hasPushNotifications(account as never)).toBe(true)
		})

		test("returns false when server configured but PushManager not supported", () => {
			vi.stubGlobal("window", { Notification: class {} })
			let account = createMockAccount({ serverUrl: "https://my-server.com" })
			expect(hasPushNotifications(account as never)).toBe(false)
		})

		test("returns false when server configured but Notification not supported", () => {
			vi.stubGlobal("window", { PushManager: class {} })
			let account = createMockAccount({ serverUrl: "https://my-server.com" })
			expect(hasPushNotifications(account as never)).toBe(false)
		})

		test("returns false when server configured but enablePushNotifications is false", () => {
			let account = createMockAccount({
				serverUrl: "https://my-server.com",
				enablePushNotifications: false,
			})
			expect(hasPushNotifications(account as never)).toBe(false)
		})

		test("returns true when server configured and enablePushNotifications is true", () => {
			let account = createMockAccount({
				serverUrl: "https://my-server.com",
				enablePushNotifications: true,
			})
			expect(hasPushNotifications(account as never)).toBe(true)
		})
	})

	describe("getFeatureStatus", () => {
		test("returns correct status when no server configured", () => {
			let account = createMockAccount(undefined)
			let status = getFeatureStatus(account as never)

			expect(status.serverConfigured).toBe(false)
			expect(status.aiChatAvailable).toBe(false)
			expect(status.pushNotificationsAvailable).toBe(false)
			expect(status.serverUrl).toBe(null)
		})

		test("returns correct status when server configured via settings", () => {
			let account = createMockAccount({ serverUrl: "https://my-server.com" })
			let status = getFeatureStatus(account as never)

			expect(status.serverConfigured).toBe(true)
			expect(status.aiChatAvailable).toBe(true)
			expect(status.pushNotificationsAvailable).toBe(true)
			expect(status.serverUrl).toBe("https://my-server.com")
		})

		test("returns correct status when server configured via env var", () => {
			vi.stubEnv("PUBLIC_SERVER_URL", "https://env-server.com")
			let account = createMockAccount(undefined)
			let status = getFeatureStatus(account as never)

			expect(status.serverConfigured).toBe(true)
			expect(status.aiChatAvailable).toBe(true)
			expect(status.pushNotificationsAvailable).toBe(true)
			expect(status.serverUrl).toBe("https://env-server.com")
		})

		test("returns correct status with mixed feature settings", () => {
			let account = createMockAccount({
				serverUrl: "https://my-server.com",
				enableAIChat: false,
				enablePushNotifications: true,
			})
			let status = getFeatureStatus(account as never)

			expect(status.serverConfigured).toBe(true)
			expect(status.aiChatAvailable).toBe(false)
			expect(status.pushNotificationsAvailable).toBe(true)
			expect(status.serverUrl).toBe("https://my-server.com")
		})

		test("settings serverUrl takes priority over env var in status", () => {
			vi.stubEnv("PUBLIC_SERVER_URL", "https://env-server.com")
			let account = createMockAccount({
				serverUrl: "https://settings-server.com",
			})
			let status = getFeatureStatus(account as never)

			expect(status.serverUrl).toBe("https://settings-server.com")
		})

		test("returns null account status correctly", () => {
			let status = getFeatureStatus(null)

			expect(status.serverConfigured).toBe(false)
			expect(status.aiChatAvailable).toBe(false)
			expect(status.pushNotificationsAvailable).toBe(false)
			expect(status.serverUrl).toBe(null)
		})
	})
})
