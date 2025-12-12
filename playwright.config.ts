import { defineConfig, devices } from "@playwright/test"

// Compute base path from GITHUB_PAGES_BASE if present
let basePath = ""
if (process.env.GITHUB_PAGES_BASE) {
	let pathParts = process.env.GITHUB_PAGES_BASE.split("/")
		.slice(1)
		.filter(Boolean)
	if (pathParts.length > 0) {
		basePath = `/${pathParts.join("/")}`
	}
}

let baseURL = `http://localhost:4321${basePath}`

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["html", { open: "always" }]],

	use: {
		baseURL,
		trace: "on-first-retry",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
		{
			name: "mobile-chrome",
			use: { ...devices["Pixel 5"] },
		},
		{
			name: "mobile-safari",
			use: { ...devices["iPhone 13"] },
		},
	],

	webServer: {
		command: process.env.GITHUB_PAGES_BASE
			? `ASTRO_OUTPUT=static GITHUB_PAGES_BASE=${process.env.GITHUB_PAGES_BASE} npm run preview:static`
			: "npm run preview",
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
	},
})
