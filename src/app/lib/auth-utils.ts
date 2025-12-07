// Authentication utility stubs for routing
// These functions provide type-safe routing helpers that currently return static paths.
// With passkey authentication, users are automatically signed in, so these just redirect to /app.

export function getSignInUrl(_redirectPath: string = "/app"): string {
	return "/app"
}

export function getSignUpUrl(_redirectPath: string = "/app"): string {
	return "/app"
}
