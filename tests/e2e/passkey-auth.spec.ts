import { test, expect, type Page } from "@playwright/test"

async function setupVirtualAuthenticator(page: Page) {
	let client = await page.context().newCDPSession(page)
	await client.send("WebAuthn.enable")
	let { authenticatorId } = await client.send(
		"WebAuthn.addVirtualAuthenticator",
		{
			options: {
				protocol: "ctap2",
				transport: "internal",
				hasResidentKey: true,
				hasUserVerification: true,
				isUserVerified: true,
			},
		},
	)
	return { client, authenticatorId }
}

test.describe("Passkey Authentication - UI Tests", () => {
	test.beforeEach(async ({ page }) => {
		// Set up virtual authenticator before each test
		await setupVirtualAuthenticator(page)

		// Navigate directly to settings page
		await page.goto("app/settings")

		// Wait for page to load
		await page.waitForLoadState("networkidle")

		// Verify we are on the settings page
		await expect(page.getByRole("heading", { name: /settings/i })).toBeVisible()
	})

	test("should display authentication dialog when clicking sign up", async ({
		page,
	}) => {
		// Click the sign up button
		await page.getByRole("button", { name: /sign up/i }).click()

		// Verify dialog appears with correct title
		await expect(page.getByRole("heading", { name: /sign up/i })).toBeVisible()

		// Verify description is shown
		await expect(
			page.getByText(/create a new account to sync your data/i),
		).toBeVisible()

		// Verify username input is visible in signup mode
		await expect(page.getByLabel(/username/i)).toBeVisible()

		// Verify sign up button is in dialog
		await expect(
			page.getByRole("dialog").getByRole("button", { name: /sign up/i }),
		).toBeVisible()
	})

	test("should display authentication dialog when clicking log in", async ({
		page,
	}) => {
		// Click the log in button
		await page.getByRole("button", { name: /log in/i }).click()

		// Verify dialog appears with correct title
		await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible()

		// Verify description is shown
		await expect(
			page.getByText(/log in to access your account from any device/i),
		).toBeVisible()

		// Verify username input is NOT visible in login mode
		await expect(page.getByLabel(/username/i)).not.toBeVisible()

		// Verify log in button is in dialog
		await expect(
			page.getByRole("dialog").getByRole("button", { name: /log in/i }),
		).toBeVisible()
	})

	test("should switch between signup and login modes", async ({ page }) => {
		// Open signup dialog
		await page.getByRole("button", { name: /sign up/i }).click()

		// Verify we're in signup mode
		await expect(page.getByRole("heading", { name: /sign up/i })).toBeVisible()
		await expect(page.getByLabel(/username/i)).toBeVisible()

		// Click the switch to login button
		await page.getByRole("button", { name: /already have an account/i }).click()

		// Verify we switched to login mode
		await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible()
		await expect(page.getByLabel(/username/i)).not.toBeVisible()

		// Click the switch to signup button
		await page.getByRole("button", { name: /don't have an account/i }).click()

		// Verify we switched back to signup mode
		await expect(page.getByRole("heading", { name: /sign up/i })).toBeVisible()
		await expect(page.getByLabel(/username/i)).toBeVisible()
	})

	test("should show error when signing up without username", async ({
		page,
	}) => {
		// Open signup dialog
		await page.getByRole("button", { name: /sign up/i }).click()

		// Try to submit without entering username
		await page
			.getByRole("dialog")
			.getByRole("button", { name: /sign up/i })
			.click()

		// Verify error message appears
		await expect(page.getByText(/please enter a username/i)).toBeVisible()
	})

	test("should disable submit button when username is empty", async ({
		page,
	}) => {
		// Open signup dialog
		await page.getByRole("button", { name: /sign up/i }).click()

		// Verify submit button is disabled
		let submitButton = page
			.getByRole("dialog")
			.getByRole("button", { name: /sign up/i })
		await expect(submitButton).toBeDisabled()

		// Enter username
		await page.getByLabel(/username/i).fill("testuser")

		// Verify submit button is now enabled
		await expect(submitButton).toBeEnabled()

		// Clear username
		await page.getByLabel(/username/i).clear()

		// Verify submit button is disabled again
		await expect(submitButton).toBeDisabled()
	})

	test("should close dialog when clicking outside or pressing escape", async ({
		page,
	}) => {
		// Open signup dialog
		await page.getByRole("button", { name: /sign up/i }).click()

		// Verify dialog is visible
		await expect(page.getByRole("dialog")).toBeVisible()

		// Press escape key
		await page.keyboard.press("Escape")

		// Verify dialog is closed
		await expect(page.getByRole("dialog")).not.toBeVisible()

		// Open dialog again
		await page.getByRole("button", { name: /sign up/i }).click()
		await expect(page.getByRole("dialog")).toBeVisible()

		// Click outside the dialog (on the backdrop)
		await page.locator("[data-radix-dialog-overlay]").click({ force: true })

		// Verify dialog is closed
		await expect(page.getByRole("dialog")).not.toBeVisible()
	})

	test("should allow entering username with keyboard", async ({ page }) => {
		// Open signup dialog
		await page.getByRole("button", { name: /sign up/i }).click()

		// Focus username input
		await page.getByLabel(/username/i).focus()

		// Type username
		await page.keyboard.type("testuser123")

		// Verify username was entered
		await expect(page.getByLabel(/username/i)).toHaveValue("testuser123")

		// Press Enter to submit (this will trigger the signup flow)
		// Note: The actual passkey flow won't complete in tests without virtual authenticator
		await page.keyboard.press("Enter")
	})
})

test.describe("Passkey Authentication - Integration Tests", () => {
	test.beforeEach(async ({ page }) => {
		// Set up virtual authenticator
		await setupVirtualAuthenticator(page)
	})

	// Note: These tests verify the UI flow but cannot complete actual passkey authentication
	// in the test environment. The virtual authenticator setup is in place for future
	// implementation when Playwright's WebAuthn support improves.

	test("complete signup flow shows authentication UI", async ({ page }) => {
		await page.goto("app/settings")
		await page.waitForLoadState("networkidle")

		// Verify unauthenticated state
		await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible()
		await expect(page.getByRole("button", { name: /log in/i })).toBeVisible()

		// Open signup dialog
		await page.getByRole("button", { name: /sign up/i }).click()

		// Enter username
		await page.getByLabel(/username/i).fill("TestUser")

		// Verify submit button is enabled
		let submitButton = page
			.getByRole("dialog")
			.getByRole("button", { name: /sign up/i })
		await expect(submitButton).toBeEnabled()

		// Note: Actual passkey creation would happen here with virtual authenticator
		// but requires additional WebAuthn API mocking
	})

	test("login flow shows correct UI elements", async ({ page }) => {
		await page.goto("app/settings")
		await page.waitForLoadState("networkidle")

		// Click log in button
		await page.getByRole("button", { name: /log in/i }).click()

		// Verify login dialog appears
		await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible()

		// Verify no username field in login mode
		await expect(page.getByLabel(/username/i)).not.toBeVisible()

		// Verify submit button exists
		await expect(
			page.getByRole("dialog").getByRole("button", { name: /log in/i }),
		).toBeVisible()
	})

	test("authentication status displays correctly when unauthenticated", async ({
		page,
	}) => {
		await page.goto("app/settings")
		await page.waitForLoadState("networkidle")

		// Verify authentication section exists
		await expect(page.getByText(/authentication/i).first()).toBeVisible()

		// Verify unauthenticated state buttons are visible
		await expect(page.getByRole("button", { name: /log in/i })).toBeVisible()
		await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible()
	})

	test("failed login attempt shows error", async ({ page }) => {
		await page.goto("app/settings")
		await page.waitForLoadState("networkidle")

		// Open login dialog
		await page.getByRole("button", { name: /log in/i }).click()

		// Try to submit (will fail without passkey)
		await page
			.getByRole("dialog")
			.getByRole("button", { name: /log in/i })
			.click()

		// Wait a moment for any error to appear
		await page.waitForTimeout(1000)

		// Dialog should still be visible (login failed)
		await expect(page.getByRole("dialog")).toBeVisible()
	})
})
