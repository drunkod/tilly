// TODO: Remove this file - no longer needed with passkey auth
// Clerk-specific auth utilities are being replaced with passkey authentication

// import { PUBLIC_CLERK_ACCOUNTS_URL } from "astro:env/client"

// export function getSignInUrl(redirectPath: string = "/app"): string {
// 	let currentUrl = window.location.origin
// 	return `${getAccountsUrl()}/sign-in?redirect_url=${currentUrl}${redirectPath}`
// }

// export function getSignUpUrl(redirectPath: string = "/app"): string {
// 	let currentUrl = window.location.origin
// 	return `${getAccountsUrl()}/sign-up?redirect_url=${currentUrl}${redirectPath}`
// }

// function getAccountsUrl(): string {
// 	return PUBLIC_CLERK_ACCOUNTS_URL
// }

// Temporary stubs to prevent build errors - will be removed in task 2
export function getSignInUrl(_redirectPath: string = "/app"): string {
	return "/app"
}

export function getSignUpUrl(_redirectPath: string = "/app"): string {
	return "/app"
}
