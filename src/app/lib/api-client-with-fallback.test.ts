import { describe, test, expect, beforeEach, vi, afterEach } from "vitest"
import {
	getServerUrl,
	isServerAvailable,
	createApiClient,
} from "./api-client-with-fallback"

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

describe("api-client-with-fallback", () => {
	beforeEach(() => {
		vi.stubEnv("PUBLIC_SERVER_URL", "")
	})

	afterEach(() => {
		vi.unstubAllEnvs()
		vi.restoreAllMocks()
	})

	describe("getServerUrl", () => {
		test("returns null when no settings and no env var", () => {
			let account = createMockAccount(undefined)
			expect(getServerUrl(account as never)).toBe(null)
		})

		test("returns null when null account", () => {
			expect(getServerUrl(null)).toBe(null)
		})

		test("returns serverUrl from settings when set", () => {
			let account = createMockAccount({
				serverUrl: "https://settings-server.com",
			})
			expect(getServerUrl(account as never)).toBe("https://settings-server.com")
		})

		test("returns PUBLIC_SERVER_URL env var when settings not set", () => {
			vi.stubEnv("PUBLIC_SERVER_URL", "https://env-server.com")
			let account = createMockAccount(undefined)
			expect(getServerUrl(account as never)).toBe("https://env-server.com")
		})

		test("settings serverUrl takes priority over env var", () => {
			vi.stubEnv("PUBLIC_SERVER_URL", "https://env-server.com")
			let account = createMockAccount({
				serverUrl: "https://settings-server.com",
			})
			expect(getServerUrl(account as never)).toBe("https://settings-server.com")
		})

		test("returns env var when settings serverUrl is empty string", () => {
			vi.stubEnv("PUBLIC_SERVER_URL", "https://env-server.com")
			let account = createMockAccount({ serverUrl: "" })
			expect(getServerUrl(account as never)).toBe("https://env-server.com")
		})
	})

	describe("isServerAvailable", () => {
		test("returns true when server responds with ok status", async () => {
			vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }))

			let result = await isServerAvailable("https://my-server.com")
			expect(result).toBe(true)
			expect(fetch).toHaveBeenCalledWith(
				"https://my-server.com/health",
				expect.objectContaining({ method: "GET" }),
			)
		})

		test("returns false when server responds with non-ok status", async () => {
			vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))

			let result = await isServerAvailable("https://my-server.com")
			expect(result).toBe(false)
		})

		test("returns false when fetch throws an error", async () => {
			vi.stubGlobal(
				"fetch",
				vi.fn().mockRejectedValue(new Error("Network error")),
			)

			let result = await isServerAvailable("https://my-server.com")
			expect(result).toBe(false)
		})

		test("uses 5 second timeout for health check", async () => {
			vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }))

			await isServerAvailable("https://my-server.com")

			expect(fetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					signal: expect.any(AbortSignal),
				}),
			)
		})
	})

	describe("createApiClient", () => {
		describe("initialization", () => {
			test("returns client with serverUrl from settings", () => {
				let account = createMockAccount({
					serverUrl: "https://my-server.com",
				})
				let client = createApiClient(account as never)

				expect(client.serverUrl).toBe("https://my-server.com")
				expect(client.isConfigured).toBe(true)
			})

			test("returns client with serverUrl from env var", () => {
				vi.stubEnv("PUBLIC_SERVER_URL", "https://env-server.com")
				let account = createMockAccount(undefined)
				let client = createApiClient(account as never)

				expect(client.serverUrl).toBe("https://env-server.com")
				expect(client.isConfigured).toBe(true)
			})

			test("returns client with null serverUrl when not configured", () => {
				let account = createMockAccount(undefined)
				let client = createApiClient(account as never)

				expect(client.serverUrl).toBe(null)
				expect(client.isConfigured).toBe(false)
			})
		})

		describe("chat method", () => {
			test("throws error when server not configured", async () => {
				let account = createMockAccount(undefined)
				let client = createApiClient(account as never)

				await expect(
					client.chat([{ role: "user", content: "Hello" }]),
				).rejects.toThrow(
					"Server not configured. Configure server URL in settings.",
				)
			})

			test("sends POST request to chat endpoint with messages", async () => {
				vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }))
				let account = createMockAccount({
					serverUrl: "https://my-server.com",
				})
				let client = createApiClient(account as never)
				let messages = [{ role: "user", content: "Hello" }]

				await client.chat(messages)

				expect(fetch).toHaveBeenCalledWith(
					"https://my-server.com/api/chat",
					expect.objectContaining({
						method: "POST",
						headers: expect.objectContaining({
							"Content-Type": "application/json",
						}),
						body: JSON.stringify({ messages }),
					}),
				)
			})

			test("throws error when chat API returns non-ok response", async () => {
				vi.stubGlobal(
					"fetch",
					vi.fn().mockResolvedValue({ ok: false, status: 500 }),
				)
				let account = createMockAccount({
					serverUrl: "https://my-server.com",
				})
				let client = createApiClient(account as never)

				await expect(client.chat([])).rejects.toThrow("Chat API error: 500")
			})

			test("returns response when chat API succeeds", async () => {
				let mockResponse = {
					ok: true,
					json: () => Promise.resolve({ result: "success" }),
				}
				vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse))
				let account = createMockAccount({
					serverUrl: "https://my-server.com",
				})
				let client = createApiClient(account as never)

				let response = await client.chat([])
				expect(response).toBe(mockResponse)
			})

			test("passes custom options to fetch", async () => {
				vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }))
				let account = createMockAccount({
					serverUrl: "https://my-server.com",
				})
				let client = createApiClient(account as never)

				await client.chat([], { headers: { Authorization: "Bearer token" } })

				expect(fetch).toHaveBeenCalledWith(
					"https://my-server.com/api/chat",
					expect.objectContaining({
						headers: expect.objectContaining({
							Authorization: "Bearer token",
						}),
					}),
				)
			})
		})

		describe("testConnection method", () => {
			test("returns error when server not configured", async () => {
				let account = createMockAccount(undefined)
				let client = createApiClient(account as never)

				let result = await client.testConnection()

				expect(result.ok).toBe(false)
				expect(result.error).toBe("Server URL not configured")
			})

			test("returns ok true when server is available", async () => {
				vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }))
				let account = createMockAccount({
					serverUrl: "https://my-server.com",
				})
				let client = createApiClient(account as never)

				let result = await client.testConnection()

				expect(result.ok).toBe(true)
				expect(result.error).toBeUndefined()
			})

			test("returns ok false when server is not available", async () => {
				vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))
				let account = createMockAccount({
					serverUrl: "https://my-server.com",
				})
				let client = createApiClient(account as never)

				let result = await client.testConnection()

				expect(result.ok).toBe(false)
			})

			test("returns ok false when fetch fails", async () => {
				vi.stubGlobal(
					"fetch",
					vi.fn().mockRejectedValue(new Error("Connection refused")),
				)
				let account = createMockAccount({
					serverUrl: "https://my-server.com",
				})
				let client = createApiClient(account as never)

				let result = await client.testConnection()

				expect(result.ok).toBe(false)
			})
		})
	})
})
