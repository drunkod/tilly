import { ClerkProvider } from "@clerk/clerk-react"
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "astro:env/client"
import { type ReactNode } from "react"

export { AuthProvider }

function AuthProvider({ children }: { children: ReactNode }) {
	return (
		<ClerkProvider
			publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}
			afterSignOutUrl="/app"
		>
			{children}
		</ClerkProvider>
	)
}
