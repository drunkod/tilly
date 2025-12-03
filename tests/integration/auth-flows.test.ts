import { describe, test, expect, beforeEach } from "vitest"
import {
	createJazzTestAccount,
	setupJazzTestSync,
	setActiveAccount,
	runWithoutActiveAccount,
} from "jazz-tools/testing"
import { UserAccount, UserProfile } from "#shared/schema/user"

describe("Authentication Flows Integration Tests", () => {
	beforeEach(async () => {
		await setupJazzTestSync()
	})

	test("complete signup creates new account", async () => {
		// Simulate signup by creating a new account
		let account = await createJazzTestAccount({
			AccountSchema: UserAccount,
			isCurrentActiveAccount: true,
		})

		// Verify account was created
		expect(account.$isLoaded).toBe(true)
		if (!account.$isLoaded) return

		// Verify account has an ID
		expect(account.$jazz.id).toBeDefined()
		expect(account.$jazz.id.startsWith("co_")).toBe(true)

		// Verify account has root and profile
		let { root, profile } = await account.$jazz.ensureLoaded({
			resolve: {
				root: { people: true, notificationSettings: true },
				profile: true,
			},
		})

		expect(root).toBeDefined()
		expect(root.$isLoaded).toBe(true)
		expect(profile).toBeDefined()
		expect(profile.$isLoaded).toBe(true)

		// Verify root structure
		expect(root.people).toBeDefined()
		expect(root.people.$isLoaded).toBe(true)
		expect(root.notificationSettings).toBeDefined()
		expect(root.notificationSettings?.$isLoaded).toBe(true)

		// Verify profile has default name (as set by migration)
		expect(profile.name).toBe("Anonymous")

		// Verify user can update their profile name
		profile.$jazz.set("name", "Test User")
		expect(profile.name).toBe("Test User")
	})

	test("profile is publicly readable", async () => {
		// Create first account
		let account1 = await createJazzTestAccount({
			AccountSchema: UserAccount,
			isCurrentActiveAccount: true,
		})

		expect(account1.$isLoaded).toBe(true)
		if (!account1.$isLoaded) return

		let { profile: profile1 } = await account1.$jazz.ensureLoaded({
			resolve: { profile: true },
		})

		// Set a custom name to verify it's readable
		profile1.$jazz.set("name", "User One")
		let profile1Id = profile1.$jazz.id

		// Create second account
		let account2 = await createJazzTestAccount({
			AccountSchema: UserAccount,
		})

		expect(account2.$isLoaded).toBe(true)
		if (!account2.$isLoaded) return

		// Switch to second account
		setActiveAccount(account2)

		// Try to load first account's profile from second account
		let profile1FromAccount2 = await UserProfile.load(profile1Id, {
			loadAs: account2,
		})

		// Verify profile is readable
		expect(profile1FromAccount2.$isLoaded).toBe(true)
		if (!profile1FromAccount2.$isLoaded) return

		expect(profile1FromAccount2.name).toBe("User One")
	})

	test("account data persists after refresh", async () => {
		// Create account
		let account = await createJazzTestAccount({
			AccountSchema: UserAccount,
			isCurrentActiveAccount: true,
		})

		expect(account.$isLoaded).toBe(true)
		if (!account.$isLoaded) return

		let accountId = account.$jazz.id

		// Load root and profile, then update profile name
		let { root, profile } = await account.$jazz.ensureLoaded({
			resolve: { root: { people: true }, profile: true },
		})

		profile.$jazz.set("name", "Persistent User")
		let initialPeopleCount = root.people.$isLoaded ? root.people.length : 0

		// Simulate refresh by loading account again
		let accountAfterRefresh = await UserAccount.load(accountId)

		expect(accountAfterRefresh.$isLoaded).toBe(true)
		if (!accountAfterRefresh.$isLoaded) return

		// Verify account ID is the same
		expect(accountAfterRefresh.$jazz.id).toBe(accountId)

		// Verify data persists
		let { root: rootAfterRefresh, profile: profileAfterRefresh } =
			await accountAfterRefresh.$jazz.ensureLoaded({
				resolve: {
					root: { people: true },
					profile: true,
				},
			})

		expect(rootAfterRefresh.$isLoaded).toBe(true)
		expect(profileAfterRefresh.$isLoaded).toBe(true)
		expect(profileAfterRefresh.name).toBe("Persistent User")

		if (rootAfterRefresh.people.$isLoaded) {
			expect(rootAfterRefresh.people.length).toBe(initialPeopleCount)
		}
	})

	test("login with existing passkey succeeds", async () => {
		// Create account (simulating signup)
		let account = await createJazzTestAccount({
			AccountSchema: UserAccount,
			isCurrentActiveAccount: true,
		})

		expect(account.$isLoaded).toBe(true)
		if (!account.$isLoaded) return

		let accountId = account.$jazz.id

		// Update profile name
		let { profile: initialProfile } = await account.$jazz.ensureLoaded({
			resolve: { profile: true },
		})
		initialProfile.$jazz.set("name", "Login Test User")

		// Simulate logout by clearing active account
		runWithoutActiveAccount(() => {
			// Verify no active account
			expect(UserAccount.getMe).toThrow()
		})

		// Simulate login by loading the account again
		let accountAfterLogin = await UserAccount.load(accountId)

		expect(accountAfterLogin.$isLoaded).toBe(true)
		if (!accountAfterLogin.$isLoaded) return

		// Set as active account (simulating successful login)
		setActiveAccount(accountAfterLogin)

		// Verify login succeeded
		expect(accountAfterLogin.$jazz.id).toBe(accountId)

		// Verify account data is accessible
		let { profile } = await accountAfterLogin.$jazz.ensureLoaded({
			resolve: { profile: true },
		})

		expect(profile.$isLoaded).toBe(true)
		expect(profile.name).toBe("Login Test User")
	})

	test("login loads correct account data", async () => {
		// Create first account
		let account1 = await createJazzTestAccount({
			AccountSchema: UserAccount,
			isCurrentActiveAccount: true,
		})

		expect(account1.$isLoaded).toBe(true)
		if (!account1.$isLoaded) return

		let account1Id = account1.$jazz.id

		// Update first account's profile
		let { profile: profile1Initial } = await account1.$jazz.ensureLoaded({
			resolve: { profile: true },
		})
		profile1Initial.$jazz.set("name", "Account One")

		// Wait for sync
		await profile1Initial.$jazz.waitForSync()

		// Create second account
		let account2 = await createJazzTestAccount({
			AccountSchema: UserAccount,
		})

		expect(account2.$isLoaded).toBe(true)
		if (!account2.$isLoaded) return

		let account2Id = account2.$jazz.id

		// Update second account's profile
		let { profile: profile2Initial } = await account2.$jazz.ensureLoaded({
			resolve: { profile: true },
		})
		profile2Initial.$jazz.set("name", "Account Two")

		// Wait for sync
		await profile2Initial.$jazz.waitForSync()

		// Simulate login to first account
		let loadedAccount1 = await UserAccount.load(account1Id)
		expect(loadedAccount1.$isLoaded).toBe(true)
		if (!loadedAccount1.$isLoaded) return

		setActiveAccount(loadedAccount1)

		let { profile: profile1 } = await loadedAccount1.$jazz.ensureLoaded({
			resolve: { profile: true },
		})

		expect(profile1.name).toBe("Account One")

		// Simulate login to second account
		let loadedAccount2 = await UserAccount.load(account2Id)
		expect(loadedAccount2.$isLoaded).toBe(true)
		if (!loadedAccount2.$isLoaded) return

		setActiveAccount(loadedAccount2)

		let { profile: profile2 } = await loadedAccount2.$jazz.ensureLoaded({
			resolve: { profile: true },
		})

		expect(profile2.name).toBe("Account Two")

		// Verify accounts are different
		expect(loadedAccount1.$jazz.id).not.toBe(loadedAccount2.$jazz.id)
		expect(profile1.name).not.toBe(profile2.name)
	})

	test("failed login shows error", async () => {
		// Try to load non-existent account
		let invalidAccountId = "co_zinvalidaccountid123"

		let result = await UserAccount.load(invalidAccountId)

		// Verify account failed to load
		expect(result.$isLoaded).toBe(false)
		expect(result.$jazz.loadingState).toBe("unavailable")
	})

	test("user is redirected after signup", async () => {
		// This test verifies the account creation flow completes successfully
		// The actual redirect logic is handled by the UI components
		// Here we verify that after account creation, the account is in a valid state
		// that would allow navigation to proceed

		let account = await createJazzTestAccount({
			AccountSchema: UserAccount,
			isCurrentActiveAccount: true,
		})

		expect(account.$isLoaded).toBe(true)
		if (!account.$isLoaded) return

		// Verify account is fully initialized and ready for use
		let { root, profile } = await account.$jazz.ensureLoaded({
			resolve: {
				root: { people: true, notificationSettings: true },
				profile: true,
			},
		})

		// Verify all required data is present for the app to function
		expect(root.$isLoaded).toBe(true)
		expect(profile.$isLoaded).toBe(true)
		expect(root.people.$isLoaded).toBe(true)
		expect(root.notificationSettings?.$isLoaded).toBe(true)

		// At this point, the UI would be able to navigate to the main app
		// because all required account data is loaded and accessible
		expect(account.$jazz.id).toBeDefined()
		expect(profile.name).toBe("Anonymous") // Default name from migration

		// User can update their profile after signup
		profile.$jazz.set("name", "Redirect Test User")
		expect(profile.name).toBe("Redirect Test User")
	})
})
