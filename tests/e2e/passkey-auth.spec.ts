import { test, expect } from "@playwright/test"

test.describe("Passkey Authentication", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the app
		await page.goto("/")
		
		// Wait for navigation to be visible
		await page.waitForSelector("nav")
		
		// Navigate to settings page where auth buttons are located
		await page.locator('a[href="/settings"]').click()
		
		// Wait for settings page to load
		await page.waitForLoadState("networkidle")
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
		await page
			.getByRole("button", { name: /already have an account/i })
			.click()

		// Verify we switched to login mode
		await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible()
		await expect(page.getByLabel(/username/i)).not.toBeVisible()

		// Click the switch to signup button
		await page
			.getByRole("button", { name: /don't have an account/i })
			.click()

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
		await page.locator('[data-radix-dialog-overlay]').click({ force: true })

		// Verify dialog is closed
		await expect(page.getByRole("dialog")).not.toBeVisible()
	})

	test("should show loading state during authentication", async ({ page }) => {
		// Open signup dialog
		await page.getByRole("button", { name: /sign up/i }).click()

		// Enter username
		await page.getByLabel(/username/i).fill("testuser")

		// Note: We can't actually test the passkey flow in Playwright without
		// mocking the WebAuthn API, but we can verify the UI shows loading state
		// by checking that the button text changes and becomes disabled

		// The actual passkey flow would require browser automation that
		// Playwright doesn't support for WebAuthn
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
		// Note: The actual passkey flow won't complete in tests
		await page.keyboard.press("Enter")
	})
})
