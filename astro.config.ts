import { defineConfig, envField } from "astro/config"
import react from "@astrojs/react"
import pwa from "@vite-pwa/astro"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"

import vercel from "@astrojs/vercel"
import node from "@astrojs/node"

// Determine output mode from environment
let outputMode = process.env.ASTRO_OUTPUT || "server"
let isStatic = outputMode === "static"

// Only use adapter for server mode
let useNodeAdapter = process.env.ASTRO_ADAPTER === "node"
let runtimeAdapter = isStatic
	? undefined
	: useNodeAdapter
		? node({ mode: "standalone" })
		: vercel()

// Universal base path configuration
// Priority: ASTRO_BASE_PATH > GITHUB_PAGES_BASE > undefined
let basePath = process.env.ASTRO_BASE_PATH
if (!basePath && process.env.GITHUB_PAGES_BASE) {
	let parts = process.env.GITHUB_PAGES_BASE.split("/")
	// Normalize: remove empty parts to handle optional trailing slashes
	// e.g. "drunkod.github.io/tilly/" -> ["drunkod.github.io", "tilly", ""] -> ["tilly"]
	let pathParts = parts.slice(1).filter(Boolean)
	if (pathParts.length > 0) {
		// Astro requires base to start and end with a slash
		basePath = `/${pathParts.join("/")}/`
	}
}

// Ensure strict Astro requirement for trailing slash if base is present
if (basePath && !basePath.endsWith("/")) {
	basePath += "/"
}

// Clean base path for client-side use (no trailing slash) to avoid double slashes in URLs
// e.g. "/tilly" instead of "/tilly/"
let cleanBasePath = basePath ? basePath.replace(/\/$/, "") : ""

// Site URL configuration
let site = process.env.PUBLIC_SITE_URL
if (!site && process.env.GITHUB_PAGES_BASE) {
	let domain = process.env.GITHUB_PAGES_BASE.split("/")[0]
	site = `https://${domain}`
}

export default defineConfig({
	output: isStatic ? "static" : "server",
	adapter: runtimeAdapter,
	site: site || "http://localhost:4321",
	base: basePath || undefined,
	devToolbar: { enabled: false },
	i18n: {
		locales: ["en", "de", "ru"],
		defaultLocale: "en",
		routing: {
			prefixDefaultLocale: false,
		},
	},
	vite: {
		server: { allowedHosts: [".ngrok-free.app"] },
		define: {
			// Make base path available to client code (clean version without trailing slash)
			"import.meta.env.BASE_PATH": JSON.stringify(cleanBasePath),
			// Make output mode available to middleware
			"import.meta.env.ASTRO_OUTPUT": JSON.stringify(outputMode),
		},
		plugins: [
			tanstackRouter({
				target: "react",
				routesDirectory: "./src/app/routes",
				generatedRouteTree: "./src/app/routeTree.gen.ts",
			}),
			tailwindcss(),
			// Plugin to inject BASE_PATH into service worker
			{
				name: "inject-sw-base-path",
				transform(code: string, id: string) {
					if (id.endsWith("sw.ts") || id.includes("sw.js")) {
						return code.replace(
							/"%%BASE_PATH%%"/g,
							`"${cleanBasePath}"`
						);
					}
				},
			},
		] as any,
	},
	integrations: [
		react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
		pwa({
			registerType: "prompt",
			scope: basePath ? `${basePath}app/` : "/app/",
			base: basePath || "/",
			strategies: "injectManifest",
			injectRegister: false,
			srcDir: "src/app",
			filename: "sw.ts",
			manifest: false,
			devOptions: {
				enabled: true,
				type: "module",
			},
			injectManifest: {
				maximumFileSizeToCacheInBytes: 5_000_000,
				globPatterns: [
					"_astro/**/*",
					"app/**/*.{css,html,ico,js,json,png,svg,txt,webp,woff2}",
				],
				globIgnores: ["**/images/**", "**/videos/**"],
			},
		}),
	],
	env: {
		schema: {
			// Server variables - optional in static mode
			GOOGLE_AI_API_KEY: envField.string({
				context: "server",
				access: "secret",
				optional: isStatic,
			}),
			PUBLIC_JAZZ_SYNC_SERVER: envField.string({
				context: "client",
				access: "public",
			}),
			PUBLIC_VAPID_KEY: envField.string({
				context: "client",
				access: "public",
				optional: isStatic,
			}),
			VAPID_PRIVATE_KEY: envField.string({
				context: "server",
				access: "secret",
				optional: isStatic,
			}),
			CRON_SECRET: envField.string({
				context: "server",
				access: "secret",
				optional: isStatic,
			}),
			PUBLIC_JAZZ_WORKER_ACCOUNT: envField.string({
				context: "client",
				access: "public",
				optional: isStatic,
			}),
			JAZZ_WORKER_SECRET: envField.string({
				context: "server",
				access: "secret",
				optional: isStatic,
			}),
			PUBLIC_ENABLE_PAYWALL: envField.boolean({
				context: "client",
				access: "public",
				optional: isStatic,
			}),
			WEEKLY_BUDGET: envField.number({
				context: "server",
				access: "secret",
				optional: isStatic,
			}),
			INPUT_TOKEN_COST_PER_MILLION: envField.number({
				context: "server",
				access: "secret",
				optional: isStatic,
			}),
			CACHED_INPUT_TOKEN_COST_PER_MILLION: envField.number({
				context: "server",
				access: "secret",
				optional: isStatic,
			}),
			OUTPUT_TOKEN_COST_PER_MILLION: envField.number({
				context: "server",
				access: "secret",
				optional: isStatic,
			}),
			MAX_REQUEST_TOKENS: envField.number({
				context: "server",
				access: "secret",
				optional: isStatic,
			}),
			PUBLIC_PLAUSIBLE_DOMAIN: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
			PUBLIC_SERVER_URL: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
		},
	},
})