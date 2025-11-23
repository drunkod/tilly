import { test, expect } from "@playwright/test"

test.describe("Home Page", () => {
	test("should load the home page", async ({ page }) => {
		await page.goto("/")
		
		// Wait for the page to be fully loaded
		await page.waitForLoadState("networkidle")
		
		// Check that the page loaded successfully
		await expect(page).toHaveTitle(/Tilly/i)
	})

	test("should navigate to settings page", async ({ page }) => {
		await page.goto("/")
		
		// Wait for navigation to be visible
		await page.waitForSelector("nav")
		
		// Find and click the settings link by its href attribute
		let settingsLink = page.locator('a[href="/settings"]')
		await expect(settingsLink).toBeVisible()
		await settingsLink.click()
		
		// Verify we're on the settings page
		await expect(page).toHaveURL(/\/settings/)
	})
})
