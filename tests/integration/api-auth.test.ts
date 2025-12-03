import { describe, test, expect, beforeEach } from "vitest"
import {
	createJazzTestAccount,
	setupJazzTestSync,
	setActiveAccount,
} from "jazz-tools/testing"
import { UserAccount } from "#shared/schema/user"
import { generateAuthToken, authenticateRequest } from "jazz-tools"

describe("API Authentication Integration Tests", () => {
	beforeEach(async () => {
		await setupJazzTestSync()
	})

	test("authenticated requests succeed", async () => {
		// Create an account
		let account = await createJazzTestAccount({
			AccountSchema: UserAccount,
			isCurrentActiveAccount: true,
		})

		expect(account.$isLoaded).toBe(true)
		if (!account.$isLoaded) return

		// Generate auth token
		let token = generateAuthToken(account)
		expect(token).toBeDefined()
		expect(typeof token).toBe("string")
		expect(token.length).toBeGreaterThan(0)

		// Create a mock request with the token
		let request = new Request("http://localhost/api/test", {
			method: "POST",
			headers: {
				Authorization: `Jazz ${token}`,
			},
		})

		// Authenticate the request
		let { account: authenticatedAccount, error } =
			await authenticateRequest(request)

		// Verify authentication succeeded
		expect(error).toBeUndefined()
		expect(authenticatedAccount).toBeDefined()
		expect(authenticatedAccount?.$isLoaded).toBe(true)

		if (authenticatedAccount?.$isLoaded) {
			expect(authenticatedAccount.$jazz.id).toBe(account.$jazz.id)
		}
	})

	test("unauthenticated requests return 401", async () => {
		// Create a request without auth token
		let request = new Request("http://localhost/api/test", {
			method: "POST",
		})

		// Authenticate the request
		let { account, error } = await authenticateRequest(request)

		// Verify authentication failed
		expect(account).toBeUndefined()
		expect(error).toBeUndefined() // No error, just no account

		// In the actual API handler, this would return 401
		// Here we verify the behavior that leads to 401
		expect(account).toBeUndefined()
	})

	test("invalid tokens return 401", async () => {
		// Create a request with an invalid token
		let request = new Request("http://localhost/api/test", {
			method: "POST",
			headers: {
				Authorization: "Jazz invalid_token_here",
			},
		})

		// Authenticate the request
		let { account, error } = await authenticateRequest(request)

		// Verify authentication failed
		expect(account).toBeUndefined()
		expect(error).toBeDefined()
		// The important thing is that authentication failed with an error
		// The specific error format may vary
	})

	test("expired tokens return 401", async () => {
		// Create an account
		let account = await createJazzTestAccount({
			AccountSchema: UserAccount,
			isCurrentActiveAccount: true,
		})

		expect(account.$isLoaded).toBe(true)
		if (!account.$isLoaded) return

		// Generate auth token with very short expiration (1ms)
		let token = generateAuthToken(account)

		// Wait for token to expire
		await new Promise(resolve => setTimeout(resolve, 100))

		// Create a mock request with the expired token
		let request = new Request("http://localhost/api/test", {
			method: "POST",
			headers: {
				Authorization: `Jazz ${token}`,
			},
		})

		// Authenticate the request with very short expiration time
		let { account: authenticatedAccount, error } = await authenticateRequest(
			request,
			{
				expiration: 1, // 1ms expiration
			},
		)

		// Verify authentication failed due to expiration
		expect(authenticatedAccount).toBeUndefined()
		expect(error).toBeDefined()
		// The important thing is that authentication failed with an error
		// The specific error format may vary
	})

	test("tokens work across different accounts", async () => {
		// Create first account
		let account1 = await createJazzTestAccount({
			AccountSchema: UserAccount,
			isCurrentActiveAccount: true,
		})

		expect(account1.$isLoaded).toBe(true)
		if (!account1.$isLoaded) return

		// Generate token for first account
		let token1 = generateAuthToken(account1)

		// Create second account
		let account2 = await createJazzTestAccount({
			AccountSchema: UserAccount,
		})

		expect(account2.$isLoaded).toBe(true)
		if (!account2.$isLoaded) return

		setActiveAccount(account2)

		// Generate token for second account
		let token2 = generateAuthToken(account2)

		// Verify tokens are different
		expect(token1).not.toBe(token2)

		// Authenticate with first account's token
		let request1 = new Request("http://localhost/api/test", {
			method: "POST",
			headers: {
				Authorization: `Jazz ${token1}`,
			},
		})

		let { account: auth1 } = await authenticateRequest(request1)
		expect(auth1?.$isLoaded).toBe(true)
		if (auth1?.$isLoaded) {
			expect(auth1.$jazz.id).toBe(account1.$jazz.id)
		}

		// Authenticate with second account's token
		let request2 = new Request("http://localhost/api/test", {
			method: "POST",
			headers: {
				Authorization: `Jazz ${token2}`,
			},
		})

		let { account: auth2 } = await authenticateRequest(request2)
		expect(auth2?.$isLoaded).toBe(true)
		if (auth2?.$isLoaded) {
			expect(auth2.$jazz.id).toBe(account2.$jazz.id)
		}

		// Verify they're different accounts
		if (auth1?.$isLoaded && auth2?.$isLoaded) {
			expect(auth1.$jazz.id).not.toBe(auth2.$jazz.id)
		}
	})

	test("malformed authorization header returns 401", async () => {
		// Test various malformed headers
		let malformedHeaders = [
			"Bearer token", // Wrong scheme
			"Jazz", // Missing token
			"token", // Missing scheme
			"Jazz token with spaces", // Invalid token format
		]

		for (let header of malformedHeaders) {
			let request = new Request("http://localhost/api/test", {
				method: "POST",
				headers: {
					Authorization: header,
				},
			})

			let { account } = await authenticateRequest(request)

			expect(account).toBeUndefined()
			// Some malformed headers may not produce an error, just no account
			// The important thing is that account is undefined
		}
	})

	test("custom token location works", async () => {
		// Create an account
		let account = await createJazzTestAccount({
			AccountSchema: UserAccount,
			isCurrentActiveAccount: true,
		})

		expect(account.$isLoaded).toBe(true)
		if (!account.$isLoaded) return

		// Generate auth token
		let token = generateAuthToken(account)

		// Create a request with token in custom header
		let request = new Request("http://localhost/api/test", {
			method: "POST",
			headers: {
				"x-jazz-auth-token": token,
			},
		})

		// Authenticate with custom token getter
		let { account: authenticatedAccount, error } = await authenticateRequest(
			request,
			{
				getToken: req => req.headers.get("x-jazz-auth-token"),
			},
		)

		// Verify authentication succeeded
		expect(error).toBeUndefined()
		expect(authenticatedAccount?.$isLoaded).toBe(true)

		if (authenticatedAccount?.$isLoaded) {
			expect(authenticatedAccount.$jazz.id).toBe(account.$jazz.id)
		}
	})
})
