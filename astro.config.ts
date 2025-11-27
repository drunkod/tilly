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

export default defineConfig({
	output: isStatic ? "static" : "server",
	adapter: runtimeAdapter,
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
		plugins: [
			tanstackRouter({
				target: "react",
				routesDirectory: "./src/app/routes",
				generatedRouteTree: "./src/app/routeTree.gen.ts",
			}),
			tailwindcss(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		] as any,
	},
	integrations: [
		react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
		pwa({
			registerType: "prompt",
			scope: "/app/",
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
			// New: Public server URL for static builds to connect to optional server
			PUBLIC_SERVER_URL: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
		},
	},
})
