import { JazzReactProvider, useAccount } from "jazz-tools/react"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import {
	PUBLIC_JAZZ_SYNC_SERVER,
} from "astro:env/client"
import { TillyAccount } from "#shared/schema/account"
import { routeTree } from "#app/routeTree.gen"
import { IntlProvider } from "#shared/intl/setup"
import { messagesDe } from "#shared/intl/messages"
import { useServiceWorker } from "#app/lib/service-worker"
import { useSessionSync } from "#app/lib/session-manager"
import { SplashScreen } from "./components/splash-screen"
import { Toaster } from "#shared/ui/sonner"
import { MainErrorBoundary } from "#app/components/main-error-boundary"

export function PWA() {
	return (
		<MainErrorBoundary>
			<JazzApp />
		</MainErrorBoundary>
	)
}

function JazzApp() {
	useServiceWorker({ updateCheckIntervalMs: 2 * 60 * 60 * 1000 })
	useSessionSync()
	let syncConfig = buildSyncConfig()

	return (
		<JazzReactProvider
			AccountSchema={TillyAccount}
			sync={syncConfig}
			fallback={<SplashScreen />}
		>
			<RouterWithJazz />
			<Toaster richColors />
		</JazzReactProvider>
	)
}

function RouterWithJazz() {
	let me = useAccount(TillyAccount, {
		resolve: { root: true, profile: true }
	})

	// Only show splash screen if account is still loading
	if (!me.$isLoaded) return <SplashScreen />

	let contextMe = me
	let locale = me?.root?.language || "en"

	if (locale === "de") {
		return (
			<IntlProvider messages={messagesDe} locale="de">
				<RouterProvider router={router} context={{ me: contextMe }} />
			</IntlProvider>
		)
	}
	return (
		<IntlProvider>
			<RouterProvider router={router} context={{ me: contextMe }} />
		</IntlProvider>
	)
}

function buildSyncConfig(): JazzSyncConfig {
	let syncServer = PUBLIC_JAZZ_SYNC_SERVER
	if (!isSyncPeer(syncServer)) {
		throw new Error("PUBLIC_JAZZ_SYNC_SERVER must be a ws:// or wss:// URL")
	}

	let syncConfig: JazzSyncConfig = {
		peer: syncServer,
	}

	return syncConfig
}

function isSyncPeer(value: string | undefined): value is SyncPeer {
	if (!value) return false
	return value.startsWith("ws://") || value.startsWith("wss://")
}

type JazzSyncProps = Parameters<typeof JazzReactProvider>[0]["sync"]
type JazzSyncConfig = NonNullable<JazzSyncProps>
type SyncPeer = JazzSyncConfig["peer"]

let router = createRouter({
	basepath: "/app",
	routeTree,
	defaultGcTime: 0,
	context: { me: undefined! },
})

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}
