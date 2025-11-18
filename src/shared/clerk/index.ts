// Server-only exports - should be tree-shaken from client bundle
if (typeof window !== "undefined") {
	throw new Error(
		"Clerk server module cannot be imported on the client. " +
			"Use #shared/clerk/client instead.",
	)
}
export * from "./server"
