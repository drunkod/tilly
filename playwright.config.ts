import { defineConfig, devices } from "@playwright/test"

// Compute base path from GITHUB_PAGES_BASE if present
let basePath = ""
if (process.env.GITHUB_PAGES_BASE) {
	const rawPath = process.env.GITHUB_PAGES_BASE;
	if (rawPath.includes('/')) {
		let pathParts = rawPath.split("/")
			.slice(1)
			.filter(Boolean);
		if (pathParts.length > 0) {
			basePath = `/${pathParts.join("/")}`;
		}
	} else if (!rawPath.includes('.')) {
		// Assumes a single segment without a dot is a repo name.
		basePath = `/${rawPath}`;
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
		baseURL: process.env.GITHUB_PAGES_BASE
			? `http://localhost:4321/${process.env.GITHUB_PAGES_BASE.split("/").slice(1).join("/")}/`
			: "http://localhost:4321",
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
		command: "pnpm build:static && pnpm preview",
		url: process.env.GITHUB_PAGES_BASE
			? `http://localhost:4321/${process.env.GITHUB_PAGES_BASE.split("/").slice(1).join("/")}/`
			: "http://localhost:4321",
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
	},
})
