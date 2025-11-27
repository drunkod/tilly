import { useState, useEffect } from "react"
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

function ServerStatusIndicator({ me, onStatusChange }: Props) {
	let t = useIntl()
	let [status, setStatus] = useState<ServerStatus>("checking")
	let serverUrl = getServerUrl(me)

	useEffect(() => {
		if (!serverUrl) {
			setStatus("not-configured")
			onStatusChange?.("not-configured")
			return
		}

		setStatus("checking")
		onStatusChange?.("checking")

		isServerAvailable(serverUrl).then(available => {
			let newStatus: ServerStatus = available ? "connected" : "disconnected"
			setStatus(newStatus)
			onStatusChange?.(newStatus)
		})
	}, [serverUrl, onStatusChange])

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
