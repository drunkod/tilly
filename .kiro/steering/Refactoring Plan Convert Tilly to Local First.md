
# Step-by-Step Refactoring Plan: Convert Tilly to Local-First with Optional Server Features

Based on my analysis of your codebase, here's a comprehensive refactoring plan. Your app is already using Jazz for local-first data storage tilly:36-44 , so the main work is making the server features optional.

## Architecture Overview

**Current State:**
- Server-side rendering with Vercel/Node adapter tilly:14-15 
- Server-side API routes for chat, push notifications, and cron jobs tilly:9-18 
- All user data already stored locally via Jazz (encrypted client-side)

**Target State:**
- Static site generation (SSG) for GitHub Pages
- Optional server URL configuration in user settings
- Client-side fallbacks when server is unavailable

## Step-by-Step TODO

### Phase 1: Configuration Changes

**1.1 Update Astro Configuration**
- **File:** `astro.config.ts`
- **Changes:**
  - Change `output: "server"` to `output: "static"` tilly:14-14 
  - Remove adapter configuration (lines 15)
  - Remove server-only environment variables tilly:56-127 
  - Make server-related env vars optional

**1.2 Update Environment Variables**
- **File:** `astro.config.ts` (env schema section)
- **Changes:**
  - Add new public env var: `PUBLIC_SERVER_URL` (optional)
  - Make all server-only vars optional: `GOOGLE_AI_API_KEY`, `CLERK_SECRET_KEY`, `VAPID_PRIVATE_KEY`, `CRON_SECRET`, `JAZZ_WORKER_SECRET`, etc.

**1.3 Update Package Scripts**
- **File:** `package.json`
- **Changes:**
  - Update build script to use static output
  - Add GitHub Pages deployment script
  - Keep separate build:node script for those who want to self-host with server features

### Phase 2: Add Server Configuration Schema

**2.1 Create Server Settings Schema**
- **New File:** `src/shared/schema/server-settings.ts`
- **Purpose:** Define user-configurable server settings
- **Content:**
  - Add `ServerSettings` co.map with:
    - `serverUrl: z.string().optional()` - custom server endpoint
    - `enableAIChat: z.boolean()`
    - `enablePushNotifications: z.boolean()`
    - `apiKey: z.string().optional()` - optional user-provided API key

**2.2 Update User Schema**
- **File:** `src/shared/schema/user.ts`
- **Changes:**
  - Add `serverSettings` field to `UserAccountRoot` tilly:87-92 
  - Import and use new `ServerSettings` type

### Phase 3: Create Client-Side API Abstraction Layer

**3.1 Create API Client with Fallbacks**
- **New File:** `src/app/lib/api-client-with-fallback.ts`
- **Purpose:** Abstract API calls with server/fallback logic
- **Functions:**
  - `getServerUrl()` - reads from user settings or env var
  - `isServerAvailable()` - health check
  - `callChatAPI()` - with offline fallback
  - `sendPushNotification()` - with graceful degradation

**3.2 Update Existing API Client**
- **File:** `src/app/lib/api-client.ts` (if exists) or create new
- **Changes:**
  - Add server availability checking
  - Add error handling for offline mode
  - Use user's configured server URL

### Phase 4: Refactor AI Chat Feature

**4.1 Add Client-Side AI Fallback**
- **File:** `src/app/routes/_app.assistant.tsx`
- **Changes:**
  - Check if server is configured before using `/api/chat` tilly:190-191 
  - Add UI to show when AI features are unavailable
  - Add link to settings to configure server
  - Consider adding browser-based AI fallback (Web LLM) for advanced users

**4.2 Update Chat Transport**
- **File:** `src/app/routes/_app.assistant.tsx`
- **Changes:**
  - Make transport conditional based on server availability
  - Show helpful error messages when server is not configured

**4.3 Keep Server Implementation**
- **Files:** Keep `src/server/features/chat-messages.ts` unchanged
- **Purpose:** For users who self-host with server features

### Phase 5: Refactor Push Notifications

**5.1 Update Notification Settings UI**
- **File:** `src/app/features/notification-settings.tsx`
- **Changes:**
  - Add server configuration check before enabling push tilly:51-75 
  - Show message when server features are disabled
  - Add link to configure server URL in settings
  - Add alternative: browser-based local reminders (use Notification API directly)

**5.2 Add Client-Side Notification Fallback**
- **New File:** `src/app/lib/local-notifications.ts`
- **Purpose:** Browser-based reminders without server
- **Features:**
  - Use Service Worker alarms API
  - Schedule notifications locally
  - No server dependency

**5.3 Update Service Worker**
- **File:** `src/app/sw.ts`
- **Changes:**
  - Keep push notification handler tilly:90-96 
  - Add local notification scheduling support
  - Make server push optional

**5.4 Keep Server Implementation**
- **Files:** Keep `src/server/features/push-*.ts` unchanged
- **Purpose:** For users with server setup

### Phase 6: Update Settings UI

**6.1 Add Server Configuration Section**
- **File:** `src/app/routes/_app.settings.tsx`
- **Changes:**
  - Add new "Server Features" section after notification settings tilly:59-71 
  - Add form fields:
    - Server URL input
    - Enable/disable AI chat toggle
    - Enable/disable push notifications toggle
    - Optional API key input for bring-your-own-key
  - Add server connectivity test button
  - Show feature availability status

**6.2 Add Server Status Indicator**
- **New Component:** `src/app/components/server-status-indicator.tsx`
- **Purpose:** Show server connection status
- **Display:** In settings page and where server features are used

### Phase 7: Update Middleware

**7.1 Update Astro Middleware**
- **File:** `src/middleware.ts`
- **Changes:**
  - Remove any server-only logic tilly:1-26 
  - Keep only static redirects and rewrites

**7.2 Remove/Adapt API Routes**
- **File:** `src/pages/api/[...path].ts`
- **Option 1 (Recommended):** Delete this file (API routes won't work in static mode)
- **Option 2:** Keep but document it only works with server deployment
- **Decision:** Users who want server features will deploy the server separately

### Phase 8: Deployment Configuration

**8.1 Add GitHub Pages Configuration**
- **New File:** `.github/workflows/deploy.yml`
- **Purpose:** CI/CD for GitHub Pages
- **Steps:**
  - Build static site
  - Deploy to gh-pages branch
  - Set base path if needed

**8.2 Add GitHub Pages Base Path Support**
- **File:** `astro.config.ts`
- **Changes:**
  - Add `site` and `base` configuration for GitHub Pages
  - Make configurable via env var

**8.3 Create Deployment Documentation**
- **New File:** `docs/DEPLOYMENT.md`
- **Sections:**
  - GitHub Pages deployment (static only)
  - Self-hosting with server features (Vercel/Node)
  - Hybrid approach (static frontend + separate API server)

### Phase 9: Update Documentation

**9.1 Update README**
- **File:** `README.md`
- **Changes:**
  - Update architecture description tilly:50-62 
  - Add "Deployment Options" section
  - Document server feature configuration
  - Add GitHub Pages deployment instructions

**9.2 Add Configuration Guide**
- **New File:** `docs/SERVER_SETUP.md`
- **Content:**
  - How to deploy server separately
  - How to configure server URL in app
  - How to use bring-your-own-key for AI
  - Push notification setup with custom server

### Phase 10: Optional Enhancements

**10.1 Add Feature Detection**
- **New File:** `src/app/lib/feature-detection.ts`
- **Purpose:** Detect available features based on configuration
- **Exports:**
  - `hasServerFeatures()`
  - `hasAIChat()`
  - `hasPushNotifications()`
  - `getFeatureStatus()`

**10.2 Add Graceful Degradation UI**
- **Throughout app:** Add UI hints when features are unavailable
- **Examples:**
  - "AI Chat requires server configuration" banner
  - "Configure server for push notifications" in settings
  - Feature badges showing "Available" / "Requires Setup"

**10.3 Add Web LLM Support (Advanced)**
- **Optional:** For fully offline AI chat
- **Library:** Consider @mlc-ai/web-llm
- **Trade-off:** Large download, slower inference

## Files List for Changes

### Files to Modify:
1. `astro.config.ts` - Switch to static output, update env vars
2. `package.json` - Update build scripts
3. `src/shared/schema/user.ts` - Add server settings
4. `src/app/main.tsx` - Add server config context
5. `src/app/routes/_app.settings.tsx` - Add server config UI
6. `src/app/routes/_app.assistant.tsx` - Make AI chat optional
7. `src/app/features/notification-settings.tsx` - Make push optional
8. `src/app/sw.ts` - Add local notification support
9. `src/middleware.ts` - Remove server-only logic
10. `README.md` - Update documentation

### Files to Create:
1. `src/shared/schema/server-settings.ts` - Server settings schema
2. `src/app/lib/api-client-with-fallback.ts` - API abstraction
3. `src/app/lib/local-notifications.ts` - Client-side reminders
4. `src/app/components/server-status-indicator.tsx` - Status UI
5. `src/app/lib/feature-detection.ts` - Feature availability
6. `.github/workflows/deploy.yml` - GitHub Pages CI/CD
7. `docs/DEPLOYMENT.md` - Deployment guide
8. `docs/SERVER_SETUP.md` - Server configuration guide

### Files to Keep (for server deployment):
1. All files in `src/server/` directory
2. `src/pages/api/[...path].ts` (document as optional)

### Files to Delete/Make Optional:
1. `src/pages/api/[...path].ts` - Only needed for server deployment
2. Server adapter imports in `astro.config.ts`

## Implementation Priority

**High Priority (Core Functionality):**
1. Phase 1: Configuration changes
2. Phase 2: Server settings schema  
3. Phase 3: API abstraction layer
4. Phase 6: Settings UI

**Medium Priority (Feature Parity):**
5. Phase 4: AI chat refactoring
6. Phase 5: Push notifications refactoring
7. Phase 8: Deployment configuration

**Low Priority (Polish):**
8. Phase 7: Middleware cleanup
9. Phase 9: Documentation
10. Phase 10: Optional enhancements

## Notes

**Key Architectural Decision:** Your app is already mostly local-first thanks to Jazz tilly:39-39 . The server only provides:
1. AI chat endpoint (can be made optional)
2. Push notification delivery (can use browser Notifications API as fallback)
3. Cron job for scheduled notifications (can be client-side alarms)

**Data Storage:** No changes needed - Jazz already handles offline-first encrypted storage tilly:72-84 

**Authentication:** Clerk works client-side, no changes needed tilly:20-25 

**Service Worker:** Already set up for PWA, just needs local notification enhancement tilly:1-31 

This refactoring maintains backward compatibility - users can still self-host with full server features, while others can use the static version with optional server configuration.
### Citations
**File:** src/app/main.tsx (L20-25)
```typescript
			<ClerkProvider
				publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}
				afterSignOutUrl="/app"
			>
				<JazzWithClerk />
			</ClerkProvider>
```
**File:** src/app/main.tsx (L36-44)
```typescript
		<JazzReactProviderWithClerk
			clerk={clerk}
			AccountSchema={UserAccount}
			sync={syncConfig}
			fallback={<SplashScreen />}
		>
			<RouterWithJazz />
			<Toaster richColors />
		</JazzReactProviderWithClerk>
```
**File:** src/app/main.tsx (L72-84)
```typescript
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
```
**File:** astro.config.ts (L14-15)
```typescript
	output: "server",
	adapter: runtimeAdapter,
```
**File:** astro.config.ts (L56-127)
```typescript
	env: {
		schema: {
			GOOGLE_AI_API_KEY: envField.string({
				context: "server",
				access: "secret",
			}),
			CLERK_SECRET_KEY: envField.string({
				context: "server",
				access: "secret",
			}),
			PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({
				context: "client",
				access: "public",
			}),
			PUBLIC_CLERK_ACCOUNTS_URL: envField.string({
				context: "client",
				access: "public",
			}),
			PUBLIC_JAZZ_SYNC_SERVER: envField.string({
				context: "client",
				access: "public",
			}),
			PUBLIC_VAPID_KEY: envField.string({
				context: "client",
				access: "public",
			}),
			VAPID_PRIVATE_KEY: envField.string({
				context: "server",
				access: "secret",
			}),
			CRON_SECRET: envField.string({
				context: "server",
				access: "secret",
			}),
			PUBLIC_JAZZ_WORKER_ACCOUNT: envField.string({
				context: "client",
				access: "public",
			}),
			JAZZ_WORKER_SECRET: envField.string({
				context: "server",
				access: "secret",
			}),
			PUBLIC_ENABLE_PAYWALL: envField.boolean({
				context: "client",
				access: "public",
			}),
			WEEKLY_BUDGET: envField.number({
				context: "server",
				access: "secret",
			}),
			INPUT_TOKEN_COST_PER_MILLION: envField.number({
				context: "server",
				access: "secret",
			}),
			CACHED_INPUT_TOKEN_COST_PER_MILLION: envField.number({
				context: "server",
				access: "secret",
			}),
			OUTPUT_TOKEN_COST_PER_MILLION: envField.number({
				context: "server",
				access: "secret",
			}),
			MAX_REQUEST_TOKENS: envField.number({
				context: "server",
				access: "secret",
			}),
			PUBLIC_PLAUSIBLE_DOMAIN: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
		},
```
**File:** src/server/main.ts (L9-18)
```typescript
let authenticatedRoutes = new Hono()
	.use(authMiddleware)
	.route("/chat", chatMessagesApp)

export let app = new Hono()
	.use(logger())
	.use(cors())
	.route("/push", testNotificationApp)
	.route("/push", cronDeliveryApp)
	.route("/", authenticatedRoutes)
```
**File:** src/shared/schema/user.ts (L87-92)
```typescript
export let UserAccountRoot = co.map({
	people: co.list(Person),
	notificationSettings: NotificationSettings.optional(),
	usageTracking: UsageTracking.optional(),
	language: z.enum(["de", "en"]).optional(),
})
```
**File:** src/app/routes/_app.assistant.tsx (L190-191)
```typescript
		messages: initialMessages,
		transport: new DefaultChatTransport({ api: "/api/chat" }),
```
**File:** src/app/features/notification-settings.tsx (L51-75)
```typescript
export function NotificationSettings({
	me,
}: {
	me: co.loaded<typeof UserAccount, Query>
}) {
	let t = useIntl()
	let isAuthenticated = useIsAuthenticated()
	let isInAppBrowser = useIsInAppBrowser()

	let [currentEndpoint] = useCurrentEndpoint()

	let devices = me?.root.notificationSettings?.pushDevices || []
	let isCurrentDeviceAdded =
		currentEndpoint && devices.some(d => d.endpoint === currentEndpoint)

	let isServiceWorkerSupported = "serviceWorker" in navigator
	let isPushSupported = "PushManager" in window && "Notification" in window
	let canAddDevice = isServiceWorkerSupported && isPushSupported
	let browserRecommendation = getBrowserRecommendation(isInAppBrowser)

	return (
		<SettingsSection
			title={t("notifications.title")}
			description={t("notifications.description")}
		>
```
**File:** src/app/sw.ts (L1-31)
```typescript
/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"
import { registerRoute } from "workbox-routing"

declare let self: ServiceWorkerGlobalScope & {
	__WB_MANIFEST: Array<{ url: string; revision?: string }>
}

type MessageEventData =
	| { type: "SKIP_WAITING" }
	| { type: "SET_USER_ID"; userId: string }
	| { type: "CLEAR_USER_ID" }

type NotificationPayload = {
	title: string
	body: string
	icon: string
	badge: string
	tag: string
	userId?: string
	url?: string
	count?: number
}

let sw = self
let USER_CACHE = "tilly-user-v1"
let APP_SHELL_CACHE = "tilly-pages-v1"

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)
```
**File:** src/app/sw.ts (L90-96)
```typescript
sw.addEventListener("push", event => {
	let notificationData = mergeNotificationPayload(
		getDefaultNotificationPayload(),
		event.data,
	)
	event.waitUntil(validateAuthAndShowNotification(notificationData))
})
```
**File:** src/app/routes/_app.settings.tsx (L59-71)
```typescript
export const Route = createFileRoute("/_app/settings")({
	loader: async ({ context }) => {
		if (!context.me) {
			return { me: null }
		}
		let loadedMe = await UserAccount.load(context.me.$jazz.id, {
			resolve: query,
		})
		if (!loadedMe) throw notFound()
		return { me: loadedMe }
	},
	component: SettingsScreen,
})
```
**File:** src/middleware.ts (L1-26)
```typescript
import { defineMiddleware } from "astro:middleware"

export let onRequest = defineMiddleware(async (context, next) => {
	if (context.url.pathname === "/") {
		let acceptLanguage = context.request.headers.get("accept-language")
		let preferredLang = acceptLanguage
			?.split(",")[0]
			.split("-")[0]
			.toLowerCase()
		let locale = preferredLang === "de" ? "de" : "en"
		console.log("Root redirect:", { acceptLanguage, preferredLang, locale })
		return context.redirect(`/${locale}/`, 301)
	}

	let response = await next()

	if (response.status === 404) {
		let pathname = context.url.pathname
		let locale = pathname.startsWith("/de") ? "de" : "en"
		let notFoundPage = `/${locale}/404`
		console.log("404 rewrite:", { pathname, locale, notFoundPage })
		return context.rewrite(notFoundPage)
	}

	return response
})
```
**File:** README.md (L50-62)
```markdown
## Architecture

Tilly is a **React PWA** built with:

- **App**: React + TanStack Router + Shadcn/ui + Tailwind CSS
- **API Endpoints**: Astro serving marketing pages + Hono API routes
- **Database**: [Jazz](https://jazz.tools) - Client-side encrypted, distributed, offline-first (keys managed via Clerk for multi-device use)
- **Auth**: Clerk
- **AI**: AI SDK with Google
- **Deployment**: Vercel

**Key Design**: Single Astro dev server hosts marketing site, PWA, and API routes together.

```
**File:** package.json (L39-39)
```json
		"jazz-tools": "^0.18.24",
```
## Q2
my Tilly application is currently configured for server-side rendering with backend API routes. astro.config.ts:14
 The app includes server-side features like AI chat, push notifications, and cron jobs. main.ts:9-18 
please create step by step todo for refactor my code base to optional server functionality app make work without server and deploy to github pages and server functionality
 work optional when user setup this in settings. 
Like localfirst app. get all list files for changes for refactor.
## Tilly Server-Optional Refactoring Plan
This codemap traces Tilly's current server-dependent architecture and identifies the key areas needing refactoring for optional server functionality. The app uses Jazz for local-first data storage [4a] but currently requires server deployment for AI chat [2a], push notifications [3a], and builds with server output mode [1a]. The refactoring would involve changing Astro to static output, adding server configuration UI in settings [5a], and creating client-side fallbacks for server features while maintaining the ability to self-host with full functionality.
### 1. Current Server Configuration
How Tilly currently configures server-side rendering and API routes
### 1a. Server Output Mode (`astro.config.ts:14`)
Astro configured for server-side rendering with Vercel/Node adapter
```text
output: "server",
```
### 1b. Runtime Adapter (`astro.config.ts:15`)
Uses Vercel or Node adapter based on environment
```text
adapter: runtimeAdapter,
```
### 1c. API Route Handler (`[...path].ts:6`)
All API requests routed through Hono app
```text
export let ALL: APIRoute = c => new Hono().route("/api", app).fetch(c.request)
```
### 1d. Server API Routes (`main.ts:13`)
Main server app with chat, push, and cron endpoints
```text
export let app = new Hono()
	.use(logger())
	.use(cors())
	.route("/push", testNotificationApp)
	.route("/push", cronDeliveryApp)
	.route("/", authenticatedRoutes)
```
### 2. AI Chat Server Dependency
How the AI chat feature currently requires server endpoints
### 2a. Chat API Transport (`_app.assistant.tsx:191`)
Client chat configured to use /api/chat endpoint
```text
transport: new DefaultChatTransport({ api: "/api/chat" }),
```
### 2b. Chat Endpoint Handler (`chat-messages.ts:27`)
Server handles chat requests with Google AI integration
```text
.post("/", async c => {
```
### 2c. AI Provider Setup (`chat-messages.ts:64`)
Server uses Google AI API key for chat processing
```text
let google = createGoogleGenerativeAI({ apiKey: GOOGLE_AI_API_KEY })
```
### 2d. Server Secret Key (`astro.config.ts:58`)
Google AI key configured as server-only environment variable
```text
GOOGLE_AI_API_KEY: envField.string({
			context: "server",
			access: "secret",
		}),
```
### 3. Push Notification Server Architecture
How push notifications rely on server-side cron jobs and delivery
### 3a. Cron Endpoint (`push-cron.ts:29`)
Server endpoint for scheduled notification delivery
```text
.get(
		"/deliver-notifications",
		bearerAuth({ token: CRON_SECRET }),
```
### 3b. Service Worker Push Handler (`sw.ts:90`)
Client receives push notifications from server
```text
sw.addEventListener("push", event => {
```
### 3c. Push Server Keys (`astro.config.ts:82`)
VAPID private key stored server-side for push notifications
```text
VAPID_PRIVATE_KEY: envField.string({
			context: "server",
			access: "secret",
		}),
```
### 3d. Cron Authentication (`astro.config.ts:86`)
Secret key for securing cron job endpoint
```text
CRON_SECRET: envField.string({
			context: "server",
			access: "secret",
		}),
```
### 4. Local-First Data Storage Foundation
How Jazz provides the foundation for making server optional
### 4a. Jazz Provider Setup (`main.tsx:36`)
Client-side Jazz provider handles data sync and storage
```text
<JazzReactProviderWithClerk
			clerk={clerk}
			AccountSchema={UserAccount}
			sync={syncConfig}
```
### 4b. Sync Configuration (`main.tsx:78`)
Jazz sync configured to work when user is signed up
```text
let syncConfig: JazzSyncConfig = {
		peer: syncServer,
		when: "signedUp",
	}
```
### 4c. User Data Schema (`user.ts:87`)
All user data stored locally via Jazz maps
```text
export let UserAccountRoot = co.map({
	people: co.list(Person),
	notificationSettings: NotificationSettings.optional(),
	usageTracking: UsageTracking.optional(),
	language: z.enum(["de", "en"]).optional(),
```
### 4d. Jazz Dependency (`package.json:39`)
Jazz tools package enables local-first data storage
```text
jazz-tools": "^0.18.24",
```
### 5. Settings UI for Server Configuration
Where users would configure optional server settings
### 5a. Settings Component (`_app.settings.tsx:81`)
Main settings screen where server configuration would be added
```text
function SettingsScreen() {
```
### 5b. Settings Sections (`_app.settings.tsx:112`)
Current settings sections - server config would be added here
```text
<AuthenticationSection />
			<AgentSection me={currentMe} />
			<LanguageSection />
			<NotificationSettings me={currentMe} />
```
### 5c. Notification Settings (`notification-settings.tsx:51`)
Existing notification settings that would need server optionality
```text
function NotificationSettings({
```
### 5d. API Client (`api-client.ts:4`)
Current API client that would need fallback logic
```text
export const apiClient = hc<AppType>("/api")
```
### 6. Build and Deployment Configuration
Current build setup that needs modification for GitHub Pages
### 6a. Build Script (`package.json:7`)
Current build script for server deployment
```text
"build": "pnpm test:run && astro check && astro build",
```
### 6b. Node Build Script (`package.json:8`)
Separate build script for Node adapter deployment
```text
"build:node": "ASTRO_ADAPTER=node astro check && ASTRO_ADAPTER=node astro build",
```
### 6c. Deployment Documentation (`README.md:79`)
Current deployment docs focused on Vercel self-hosting
```text
## Deployment
```
### 6d. Architecture Description (`README.md:61`)
Current architecture requiring server deployment
```text
**Key Design**: Single Astro dev server hosts marketing site, PWA, and API routes together.
```