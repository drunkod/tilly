import { useState } from "react"
import type { co } from "jazz-tools"
import { T, useIntl } from "#shared/intl/setup"
import { SettingsSection } from "#app/components/settings-section"
import { Input } from "#shared/ui/input"
import { Switch } from "#shared/ui/switch"
import { Button } from "#shared/ui/button"
import { Label } from "#shared/ui/label"
import { ServerSettings } from "#shared/schema/server-settings"
import { createApiClient } from "#app/lib/api-client-with-fallback"
import type { UserAccount } from "#shared/schema/user"

export { ServerSettingsSection }
export type { ServerSettingsQuery }

type ServerSettingsQuery = {
	root: { serverSettings: true }
}

type Props = {
	me: co.loaded<typeof UserAccount, ServerSettingsQuery>
}

function ServerSettingsSection({ me }: Props) {
	let t = useIntl()
	let [testing, setTesting] = useState(false)
	let [testResult, setTestResult] = useState<{
		ok: boolean
		error?: string
	} | null>(null)

	let settings = me.root?.serverSettings
	let serverUrl = settings?.serverUrl || ""
	let enableAIChat = settings?.enableAIChat ?? true
	let enablePush = settings?.enablePushNotifications ?? true

	function ensureSettings() {
		if (!me.root?.$isLoaded) return null
		if (!me.root.serverSettings) {
			me.root.$jazz.set("serverSettings", ServerSettings.create({}))
		}
		return me.root.serverSettings
	}

	function handleServerUrlChange(url: string) {
		let s = ensureSettings()
		if (!s?.$isLoaded) return
		s.$jazz.set("serverUrl", url || undefined)
		setTestResult(null)
	}

	function handleAIChatToggle(enabled: boolean) {
		let s = ensureSettings()
		if (!s?.$isLoaded) return
		s.$jazz.set("enableAIChat", enabled)
	}

	function handlePushToggle(enabled: boolean) {
		let s = ensureSettings()
		if (!s?.$isLoaded) return
		s.$jazz.set("enablePushNotifications", enabled)
	}

	async function handleTestConnection() {
		setTesting(true)
		setTestResult(null)

		let client = createApiClient(me)
		let result = await client.testConnection()

		setTestResult(result)
		setTesting(false)
	}

	return (
		<SettingsSection
			title={t("settings.server.title")}
			description={t("settings.server.description")}
		>
			<div className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="serverUrl">
						<T k="settings.server.url.label" />
					</Label>
					<div className="flex gap-2">
						<Input
							id="serverUrl"
							type="url"
							placeholder={t("settings.server.url.placeholder")}
							value={serverUrl}
							onChange={e => handleServerUrlChange(e.target.value)}
							className="flex-1"
						/>
						<Button
							variant="outline"
							onClick={handleTestConnection}
							disabled={!serverUrl || testing}
						>
							{testing ? (
								<T k="settings.server.testing" />
							) : (
								<T k="settings.server.test" />
							)}
						</Button>
					</div>
					{testResult && (
						<p
							className={
								testResult.ok
									? "text-sm text-green-600 dark:text-green-400"
									: "text-sm text-red-600 dark:text-red-400"
							}
						>
							{testResult.ok ? (
								<T k="settings.server.connected" />
							) : (
								testResult.error || <T k="settings.server.connectionFailed" />
							)}
						</p>
					)}
				</div>

				{serverUrl && (
					<>
						<div className="flex items-center justify-between">
							<Label htmlFor="enableAIChat">
								<T k="settings.server.aiChat.label" />
							</Label>
							<Switch
								id="enableAIChat"
								checked={enableAIChat}
								onCheckedChange={handleAIChatToggle}
							/>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="enablePush">
								<T k="settings.server.push.label" />
							</Label>
							<Switch
								id="enablePush"
								checked={enablePush}
								onCheckedChange={handlePushToggle}
							/>
						</div>
					</>
				)}

				{!serverUrl && (
					<p className="text-muted-foreground text-sm">
						<T k="settings.server.notConfigured" />
					</p>
				)}
			</div>
		</SettingsSection>
	)
}
