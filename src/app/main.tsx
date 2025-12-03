import { useEffect } from "react"
import { JazzReactProvider, useAccount } from "jazz-tools/react"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { PUBLIC_JAZZ_SYNC_SERVER } from "astro:env/client"
import { UserAccount } from "#shared/schema/user"
import { routeTree } from "#app/routeTree.gen"
import { IntlProvider } from "#shared/intl/setup"
import { messagesDe, messagesRu } from "#shared/intl/messages"
import { useServiceWorker } from "#app/lib/service-worker"
import { SplashScreen } from "./components/splash-screen"
import { Toaster } from "#shared/ui/sonner"
import { MainErrorBoundary } from "#app/components/main-error-boundary"

// Get base path from Vite env (set in astro.config.ts)
const BASE_PATH = import.meta.env.BASE_PATH || ""

export function PWA() {
	useServiceWorker({ updateCheckIntervalMs: 2 * 60 * 60 * 1000 })
	let syncConfig = buildSyncConfig()

	return (
		<MainErrorBoundary>
			<JazzReactProvider
				AccountSchema={UserAccount}
				sync={syncConfig}
				fallback={<SplashScreen />}
			>
				<RouterWithJazz />
				<Toaster richColors />
			</JazzReactProvider>
		</MainErrorBoundary>
	)
}

function RouterWithJazz() {
	let me = useAccount(UserAccount, {
		select: me =>
			me.$isLoaded
				? me
				: me.$jazz.loadingState === "loading"
					? undefined
					: null,
	})

	// Handle SPA redirect navigation after router is ready
	useEffect(() => {
		if (initialRedirectPath) {
			router.navigate({ to: initialRedirectPath })
		}
	}, [])

	// Only show splash screen if account is still loading
	if (me === undefined) return <SplashScreen />

	// Pass null for unauthenticated users, me object for authenticated users
	let contextMe = me ? me : null
	let locale =
		(me?.$isLoaded && me.root?.$isLoaded ? me.root.language : undefined) || "en"

	if (locale === "de") {
		return (
			<IntlProvider messages={messagesDe} locale="de">
				<RouterProvider router={router} context={{ me: contextMe }} />
			</IntlProvider>
		)
	}
	if (locale === "ru") {
		return (
			<IntlProvider messages={messagesRu} locale="ru">
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
		when: "signedUp",
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

// Handle SPA redirect from GitHub Pages 404.html
function handleSpaRedirect() {
	let redirectPath = sessionStorage.getItem("spa-redirect-path")
	if (redirectPath) {
		sessionStorage.removeItem("spa-redirect-path")
		// Remove base path if present
		let pathWithoutBase = redirectPath
		if (BASE_PATH && redirectPath.startsWith(BASE_PATH)) {
			pathWithoutBase = redirectPath.slice(BASE_PATH.length)
		}
		// Only handle /app/* paths
		if (pathWithoutBase.startsWith("/app")) {
			// Remove the /app prefix since router uses basepath
			let routerPath = pathWithoutBase.slice(4) || "/"
			window.history.replaceState(null, "", redirectPath)
			return routerPath
		}
	}
	return null
}

let initialRedirectPath = handleSpaRedirect()

let router = createRouter({
	basepath: BASE_PATH ? `${BASE_PATH}/app` : "/app",
	routeTree,
	defaultGcTime: 0,
	context: { me: undefined! },
})

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}
