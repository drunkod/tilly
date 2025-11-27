import type { co } from "jazz-tools"
import type { UserAccount } from "#shared/schema/user"

export { hasServerFeatures, hasAIChat, hasPushNotifications, getFeatureStatus }
export type { FeatureStatus }

type FeatureStatus = {
	serverConfigured: boolean
	aiChatAvailable: boolean
	pushNotificationsAvailable: boolean
	serverUrl: string | null
}

type LoadedAccount = co.loaded<
	typeof UserAccount,
	{ root: { serverSettings: true } }
> | null

function getServerUrl(me: LoadedAccount): string | null {
	let userServerUrl = me?.root?.serverSettings?.serverUrl
	if (userServerUrl) return userServerUrl

	let envServerUrl = import.meta.env.PUBLIC_SERVER_URL
	return envServerUrl || null
}

function hasServerFeatures(me: LoadedAccount): boolean {
	let serverUrl = me?.root?.serverSettings?.serverUrl
	if (serverUrl) return true

	let envServerUrl = import.meta.env.PUBLIC_SERVER_URL
	return !!envServerUrl
}

function hasAIChat(me: LoadedAccount): boolean {
	if (!hasServerFeatures(me)) return false

	let enabled = me?.root?.serverSettings?.enableAIChat
	return enabled !== false
}

function hasPushNotifications(me: LoadedAccount): boolean {
	if (!hasServerFeatures(me)) return false

	if (typeof window !== "undefined") {
		if (!("PushManager" in window) || !("Notification" in window)) return false
	}

	let enabled = me?.root?.serverSettings?.enablePushNotifications
	return enabled !== false
}

function getFeatureStatus(me: LoadedAccount): FeatureStatus {
	let serverUrl = getServerUrl(me)

	return {
		serverConfigured: !!serverUrl,
		aiChatAvailable: hasAIChat(me),
		pushNotificationsAvailable: hasPushNotifications(me),
		serverUrl,
	}
}
