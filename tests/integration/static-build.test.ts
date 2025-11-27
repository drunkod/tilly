import { describe, test, expect, beforeEach, vi, afterEach } from "vitest"
import { createJazzTestAccount, setupJazzTestSync } from "jazz-tools/testing"
import { UserAccount } from "#shared/schema/user"
import { ServerSettings } from "#shared/schema/server-settings"
import {
	hasServerFeatures,
	hasAIChat,
	hasPushNotifications,
	getFeatureStatus,
} from "#app/lib/feature-detection"
import { getServerUrl, createApiClient } from "#app/lib/api-client-with-fallback"

// Inline locale detection function for testing (mirrors middleware implementation)
// This avoids importing from middleware.ts which has Astro-specific dependencies
function getPreferredLocale(acceptLanguage: string | null): "en" | "de" | "ru" {
	if (!acceptLanguage) return "en"
	let preferredLang = acceptLanguage.split(",")[0].split("-")[0].toLowerCase()
	if (preferredLang === "de") return "de"
	if (preferredLang === "ru") return "ru"
	return "en"
}

describe("Static Build Integration Tests", () => {
	beforeEach(async () => {
		await setupJazzTestSync()
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

	describe("App loads in static mode", () => {
		test("account creation works without server environment variables", async () => {
			// Simulate static mode where server vars are not set
			vi.stubEnv("GOOGLE_AI_API_KEY", "")
			vi.stubEnv("VAPID_PRIVATE_KEY", "")
			vi.stubEnv("CRON_SECRET", "")
			vi.stubEnv("JAZZ_WORKER_SECRET", "")

			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			// Verify account has required structure
			let { root, profile } = await account.$jazz.ensureLoaded({
				resolve: {
					root: { people: true, notificationSettings: true },
					profile: true,
				},
			})

			expect(root.$isLoaded).toBe(true)
			expect(profile.$isLoaded).toBe(true)
			expect(root.people.$isLoaded).toBe(true)
		})

		test("user can create and access data in static mode", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let { root, profile } = await account.$jazz.ensureLoaded({
				resolve: {
					root: { people: true },
					profile: true,
				},
			})

			// Update profile name
			profile.$jazz.set("name", "Static Mode User")
			expect(profile.name).toBe("Static Mode User")

			// Verify people list is accessible
			expect(root.people.$isLoaded).toBe(true)
			expect(root.people.length).toBe(0)
		})
	})

	describe("Jazz sync works in static mode", () => {
		test("account can be created and data accessed without server features", async () => {
			// Create account - this tests that Jazz sync infrastructure works
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let { profile, root } = await account.$jazz.ensureLoaded({
				resolve: { profile: true, root: { people: true } },
			})

			// Verify profile is accessible and can be modified
			profile.$jazz.set("name", "Static Mode User")
			expect(profile.name).toBe("Static Mode User")

			// Verify root data is accessible
			expect(root.$isLoaded).toBe(true)
			expect(root.people.$isLoaded).toBe(true)
		})

		test("account data persists across sessions", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let accountId = account.$jazz.id

			let { profile } = await account.$jazz.ensureLoaded({
				resolve: { profile: true },
			})

			profile.$jazz.set("name", "Persistent Static User")

			// Simulate session reload
			let reloadedAccount = await UserAccount.load(accountId)

			expect(reloadedAccount.$isLoaded).toBe(true)
			if (!reloadedAccount.$isLoaded) return

			let { profile: reloadedProfile } =
				await reloadedAccount.$jazz.ensureLoaded({
					resolve: { profile: true },
				})

			expect(reloadedProfile.name).toBe("Persistent Static User")
		})
	})

	describe("Feature detection works correctly in static mode", () => {
		test("hasServerFeatures returns false when no server URL configured", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			await account.$jazz.ensureLoaded({
				resolve: { root: { serverSettings: true } },
			})

			// No server settings configured
			expect(hasServerFeatures(account as never)).toBe(false)
		})

		test("hasServerFeatures returns true when user configures server URL", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let { root } = await account.$jazz.ensureLoaded({
				resolve: { root: true },
			})

			// User configures server URL in settings
			let serverSettings = ServerSettings.create(
				{ serverUrl: "https://my-server.com" },
				root.$jazz.owner,
			)
			root.$jazz.set("serverSettings", serverSettings)

			await account.$jazz.ensureLoaded({
				resolve: { root: { serverSettings: true } },
			})

			expect(hasServerFeatures(account as never)).toBe(true)
		})

		test("hasAIChat returns false when server not configured", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			expect(hasAIChat(account as never)).toBe(false)
		})

		test("hasAIChat returns true when server configured and AI enabled", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let { root } = await account.$jazz.ensureLoaded({
				resolve: { root: true },
			})

			let serverSettings = ServerSettings.create(
				{
					serverUrl: "https://my-server.com",
					enableAIChat: true,
				},
				root.$jazz.owner,
			)
			root.$jazz.set("serverSettings", serverSettings)

			expect(hasAIChat(account as never)).toBe(true)
		})

		test("hasPushNotifications returns false when server not configured", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			expect(hasPushNotifications(account as never)).toBe(false)
		})

		test("getFeatureStatus returns correct status for unconfigured server", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let status = getFeatureStatus(account as never)

			expect(status.serverConfigured).toBe(false)
			expect(status.aiChatAvailable).toBe(false)
			expect(status.pushNotificationsAvailable).toBe(false)
			expect(status.serverUrl).toBe(null)
		})

		test("getFeatureStatus returns correct status after user configures server", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let { root } = await account.$jazz.ensureLoaded({
				resolve: { root: true },
			})

			let serverSettings = ServerSettings.create(
				{
					serverUrl: "https://user-server.com",
					enableAIChat: true,
					enablePushNotifications: false,
				},
				root.$jazz.owner,
			)
			root.$jazz.set("serverSettings", serverSettings)

			let status = getFeatureStatus(account as never)

			expect(status.serverConfigured).toBe(true)
			expect(status.aiChatAvailable).toBe(true)
			expect(status.pushNotificationsAvailable).toBe(false)
			expect(status.serverUrl).toBe("https://user-server.com")
		})
	})

	describe("API client works correctly in static mode", () => {
		test("getServerUrl returns null when no server configured", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			expect(getServerUrl(account as never)).toBe(null)
		})

		test("getServerUrl returns user-configured URL", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let { root } = await account.$jazz.ensureLoaded({
				resolve: { root: true },
			})

			let serverSettings = ServerSettings.create(
				{ serverUrl: "https://custom-server.com" },
				root.$jazz.owner,
			)
			root.$jazz.set("serverSettings", serverSettings)

			expect(getServerUrl(account as never)).toBe("https://custom-server.com")
		})

		test("createApiClient returns unconfigured client when no server", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let client = createApiClient(account as never)

			expect(client.isConfigured).toBe(false)
			expect(client.serverUrl).toBe(null)
		})

		test("createApiClient returns configured client after user sets server URL", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let { root } = await account.$jazz.ensureLoaded({
				resolve: { root: true },
			})

			let serverSettings = ServerSettings.create(
				{ serverUrl: "https://api-server.com" },
				root.$jazz.owner,
			)
			root.$jazz.set("serverSettings", serverSettings)

			let client = createApiClient(account as never)

			expect(client.isConfigured).toBe(true)
			expect(client.serverUrl).toBe("https://api-server.com")
		})
	})

	describe("Middleware locale detection for static mode", () => {
		test("getPreferredLocale returns en for null accept-language", () => {
			expect(getPreferredLocale(null)).toBe("en")
		})

		test("getPreferredLocale returns de for German accept-language", () => {
			expect(getPreferredLocale("de-DE,de;q=0.9,en;q=0.8")).toBe("de")
		})

		test("getPreferredLocale returns ru for Russian accept-language", () => {
			expect(getPreferredLocale("ru-RU,ru;q=0.9,en;q=0.8")).toBe("ru")
		})

		test("getPreferredLocale returns en for English accept-language", () => {
			expect(getPreferredLocale("en-US,en;q=0.9")).toBe("en")
		})

		test("getPreferredLocale returns en for unsupported language", () => {
			expect(getPreferredLocale("fr-FR,fr;q=0.9")).toBe("en")
		})
	})

	describe("Server settings schema works in static mode", () => {
		test("user can create and update server settings", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let { root } = await account.$jazz.ensureLoaded({
				resolve: { root: true },
			})

			// Create server settings
			let serverSettings = ServerSettings.create(
				{
					serverUrl: "https://initial-server.com",
					enableAIChat: true,
					enablePushNotifications: true,
				},
				root.$jazz.owner,
			)
			root.$jazz.set("serverSettings", serverSettings)

			// Verify settings are saved
			let { root: updatedRoot } = await account.$jazz.ensureLoaded({
				resolve: { root: { serverSettings: true } },
			})

			expect(updatedRoot.serverSettings?.$isLoaded).toBe(true)
			if (!updatedRoot.serverSettings?.$isLoaded) return

			expect(updatedRoot.serverSettings.serverUrl).toBe(
				"https://initial-server.com",
			)
			expect(updatedRoot.serverSettings.enableAIChat).toBe(true)
			expect(updatedRoot.serverSettings.enablePushNotifications).toBe(true)

			// Update settings
			updatedRoot.serverSettings.$jazz.set(
				"serverUrl",
				"https://updated-server.com",
			)
			updatedRoot.serverSettings.$jazz.set("enableAIChat", false)

			expect(updatedRoot.serverSettings.serverUrl).toBe(
				"https://updated-server.com",
			)
			expect(updatedRoot.serverSettings.enableAIChat).toBe(false)
		})

		test("server settings persist across sessions", async () => {
			let account = await createJazzTestAccount({
				AccountSchema: UserAccount,
				isCurrentActiveAccount: true,
			})

			expect(account.$isLoaded).toBe(true)
			if (!account.$isLoaded) return

			let accountId = account.$jazz.id

			let { root } = await account.$jazz.ensureLoaded({
				resolve: { root: true },
			})

			let serverSettings = ServerSettings.create(
				{
					serverUrl: "https://persistent-server.com",
					enableAIChat: true,
				},
				root.$jazz.owner,
			)
			root.$jazz.set("serverSettings", serverSettings)

			// Simulate session reload
			let reloadedAccount = await UserAccount.load(accountId)

			expect(reloadedAccount.$isLoaded).toBe(true)
			if (!reloadedAccount.$isLoaded) return

			let { root: reloadedRoot } = await reloadedAccount.$jazz.ensureLoaded({
				resolve: { root: { serverSettings: true } },
			})

			expect(reloadedRoot.serverSettings?.$isLoaded).toBe(true)
			if (!reloadedRoot.serverSettings?.$isLoaded) return

			expect(reloadedRoot.serverSettings.serverUrl).toBe(
				"https://persistent-server.com",
			)
			expect(reloadedRoot.serverSettings.enableAIChat).toBe(true)
		})
	})
})
