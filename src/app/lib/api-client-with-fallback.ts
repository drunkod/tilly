import type { co } from "jazz-tools"
import type { UserAccount } from "#shared/schema/user"
import { tryCatch } from "#shared/lib/trycatch"

export { getServerUrl, isServerAvailable, createApiClient }
export type { ApiClient, ConnectionTestResult }

type LoadedAccount = co.loaded<
	typeof UserAccount,
	{ root: { serverSettings: true } }
> | null

type ConnectionTestResult = {
	ok: boolean
	error?: string
}

// Use a subset of RequestInit to avoid ESLint no-undef error
type FetchOptions = {
	headers?: Record<string, string>
	signal?: AbortSignal
}

type ApiClient = {
	serverUrl: string | null
	isConfigured: boolean
	chat: (messages: unknown[], options?: FetchOptions) => Promise<Response>
	testConnection: () => Promise<ConnectionTestResult>
}

function getServerUrl(me: LoadedAccount): string | null {
	let userServerUrl = me?.root?.serverSettings?.serverUrl
	if (userServerUrl) return userServerUrl

	let envServerUrl = import.meta.env.PUBLIC_SERVER_URL
	return envServerUrl || null
}

async function isServerAvailable(serverUrl: string): Promise<boolean> {
	let result = await tryCatch(
		fetch(`${serverUrl}/health`, {
			method: "GET",
			signal: AbortSignal.timeout(5000),
		}),
	)

	if (!result.ok) return false
	return result.data.ok
}

function createApiClient(me: LoadedAccount): ApiClient {
	let serverUrl = getServerUrl(me)

	return {
		serverUrl,
		isConfigured: !!serverUrl,

		async chat(messages: unknown[], options?: FetchOptions): Promise<Response> {
			if (!serverUrl) {
				throw new Error(
					"Server not configured. Configure server URL in settings.",
				)
			}

			let response = await fetch(`${serverUrl}/api/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...options?.headers,
				},
				body: JSON.stringify({ messages }),
				...options,
			})

			if (!response.ok) {
				throw new Error(`Chat API error: ${response.status}`)
			}

			return response
		},

		async testConnection(): Promise<ConnectionTestResult> {
			if (!serverUrl) {
				return { ok: false, error: "Server URL not configured" }
			}

			let result = await tryCatch(isServerAvailable(serverUrl))
			if (!result.ok) {
				return { ok: false, error: result.error.message }
			}

			return { ok: result.data }
		},
	}
}
