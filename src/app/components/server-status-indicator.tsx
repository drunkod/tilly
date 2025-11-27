import { useState, useEffect, useCallback } from "react"
import type { co } from "jazz-tools"
import {
	isServerAvailable,
	getServerUrl,
} from "#app/lib/api-client-with-fallback"
import type { UserAccount } from "#shared/schema/user"
import { useIntl } from "#shared/intl/setup"

export { ServerStatusIndicator }
export type { ServerStatus }

type ServerStatus = "connected" | "disconnected" | "not-configured" | "checking"

type LoadedAccount = co.loaded<
	typeof UserAccount,
	{ root: { serverSettings: true } }
> | null

type Props = {
	me: LoadedAccount
	onStatusChange?: (status: ServerStatus) => void
}

type CheckState = {
	url: string | null
	result: boolean | null
}

function deriveStatus(serverUrl: string | null, checkState: CheckState): ServerStatus {
	if (!serverUrl) return "not-configured"
	if (checkState.url !== serverUrl || checkState.result === null)
		return "checking"
	return checkState.result ? "connected" : "disconnected"
}

function useServerStatus(
	serverUrl: string | null,
	onStatusChange?: (status: ServerStatus) => void,
): ServerStatus {
	// Initialize state with the URL included so we can detect changes
	let [checkState, setCheckState] = useState<CheckState>(() => ({
		url: serverUrl,
		result: null,
	}))

	// Memoize the callback to handle async result
	let handleResult = useCallback(
		(url: string, available: boolean) => {
			setCheckState(prev => {
				if (prev.url === url) {
					return { url, result: available }
				}
				return prev
			})
		},
		[],
	)

	// Effect only handles the async check - no synchronous setState
	useEffect(() => {
		if (!serverUrl) return

		let cancelled = false
		isServerAvailable(serverUrl).then(available => {
			if (!cancelled) {
				handleResult(serverUrl, available)
			}
		})

		return () => {
			cancelled = true
		}
	}, [serverUrl, handleResult])

	// Compute current status
	let currentStatus = deriveStatus(serverUrl, checkState)

	// Handle URL changes by returning appropriate status
	// If URL changed, we need to reset - but we do this via key prop in parent
	// or by checking if checkState.url matches serverUrl
	let status: ServerStatus
	if (checkState.url !== serverUrl) {
		// URL changed, we're in checking state for new URL
		status = serverUrl ? "checking" : "not-configured"
	} else {
		status = currentStatus
	}

	// Notify parent of status changes via effect (only when result comes back)
	useEffect(() => {
		onStatusChange?.(status)
	}, [status, onStatusChange])

	return status
}

function ServerStatusIndicator({ me, onStatusChange }: Props) {
	let t = useIntl()
	let serverUrl = getServerUrl(me)
	// Use serverUrl as key to reset state when URL changes
	let status = useServerStatus(serverUrl, onStatusChange)

	let colors: Record<ServerStatus, string> = {
		connected: "bg-green-500",
		disconnected: "bg-red-500",
		"not-configured": "bg-gray-400",
		checking: "bg-yellow-500 animate-pulse",
	}

	let labels: Record<ServerStatus, string> = {
		connected: t("settings.server.status.connected"),
		disconnected: t("settings.server.status.disconnected"),
		"not-configured": t("settings.server.status.notConfigured"),
		checking: t("settings.server.status.checking"),
	}

	return (
		<div className="flex items-center gap-2">
			<div className={`h-2 w-2 rounded-full ${colors[status]}`} />
			<span className="text-muted-foreground text-sm">{labels[status]}</span>
		</div>
	)
}
