import { test, expect, type Page } from "@playwright/test"

async function checkWebAuthnSupport(page: Page): Promise<boolean> {
	return await page.evaluate(() => {
		return (
			typeof window.PublicKeyCredential !== "undefined" &&
			typeof navigator.credentials !== "undefined" &&
			typeof navigator.credentials.create === "function"
		)
	})
}

test.describe("Cross-Browser Passkey Support", () => {
	test("should detect WebAuthn API availability", async ({ page }) => {
		await page.goto("/settings")
		await page.waitForLoadState("networkidle")

		let isSupported = await checkWebAuthnSupport(page)

		// Log browser support for debugging
		console.log(
			`WebAuthn support in ${page.context().browser()?.browserType().name()}: ${isSupported}`,
		)

		// All modern browsers should support WebAuthn
		// Note: This may fail in older browser versions
		if (isSupported) {
			// Verify authentication UI is available
			await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible()
			await expect(page.getByRole("button", { name: /log in/i })).toBeVisible()
		}
	})

	test("should display authentication buttons regardless of WebAuthn support", async ({
		page,
	}) => {
		await page.goto("/settings")
		await page.waitForLoadState("networkidle")

		// Authentication section should always be visible
		await expect(page.getByText(/authentication/i).first()).toBeVisible()

		// Buttons should be visible
		await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible()
		await expect(page.getByRole("button", { name: /log in/i })).toBeVisible()
	})

	test("should open authentication dialog in all browsers", async ({
		page,
	}) => {
		await page.goto("/settings")
		await page.waitForLoadState("networkidle")

		// Click sign up button
		await page.getByRole("button", { name: /sign up/i }).click()

		// Dialog should open
		await expect(page.getByRole("dialog")).toBeVisible()
		await expect(page.getByRole("heading", { name: /sign up/i })).toBeVisible()

		// Close dialog
		await page.keyboard.press("Escape")

		// Click log in button
		await page.getByRole("button", { name: /log in/i }).click()

		// Dialog should open
		await expect(page.getByRole("dialog")).toBeVisible()
		await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible()
	})

	test("should handle username input correctly across browsers", async ({
		page,
	}) => {
		await page.goto("/settings")
		await page.waitForLoadState("networkidle")

		// Open signup dialog
		await page.getByRole("button", { name: /sign up/i }).click()

		// Enter username
		let usernameInput = page.getByLabel(/username/i)
		await usernameInput.fill("CrossBrowserTest")

		// Verify value
		await expect(usernameInput).toHaveValue("CrossBrowserTest")

		// Clear and type with keyboard
		await usernameInput.clear()
		await usernameInput.focus()
		await page.keyboard.type("KeyboardTest")

		// Verify keyboard input works
		await expect(usernameInput).toHaveValue("KeyboardTest")
	})

	test("should handle dialog interactions consistently", async ({ page }) => {
		await page.goto("/settings")
		await page.waitForLoadState("networkidle")

		// Open dialog
		await page.getByRole("button", { name: /sign up/i }).click()
		await expect(page.getByRole("dialog")).toBeVisible()

		// Test escape key
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).not.toBeVisible()

		// Open again
		await page.getByRole("button", { name: /sign up/i }).click()
		await expect(page.getByRole("dialog")).toBeVisible()

		// Test backdrop click
		await page.locator("[data-radix-dialog-overlay]").click({ force: true })
		await expect(page.getByRole("dialog")).not.toBeVisible()
	})
})
