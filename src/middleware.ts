import { defineMiddleware } from "astro:middleware"

export { getPreferredLocale }

// Check if running in static mode - middleware runs at build time for static
let isStaticMode = import.meta.env.ASTRO_OUTPUT === "static"

// Helper function to detect preferred locale from accept-language header
// Exported for potential client-side use
function getPreferredLocale(acceptLanguage: string | null): "en" | "de" | "ru" {
	if (!acceptLanguage) return "en"
	let preferredLang = acceptLanguage.split(",")[0].split("-")[0].toLowerCase()
	if (preferredLang === "de") return "de"
	if (preferredLang === "ru") return "ru"
	return "en"
}

export let onRequest = defineMiddleware(async (context, next) => {
	// In static mode, skip server-only redirects
	// Client-side routing will handle locale detection via JavaScript
	if (isStaticMode) {
		return next()
	}

	// Server mode: handle root redirect with locale detection
	if (context.url.pathname === "/") {
		let acceptLanguage = context.request.headers.get("accept-language")
		let locale = getPreferredLocale(acceptLanguage)
		console.log("Root redirect:", { acceptLanguage, locale })
		return context.redirect(`/${locale}/`, 301)
	}

	let response = await next()

	// Server mode: handle 404 rewrites
	if (response.status === 404) {
		let pathname = context.url.pathname

		// Skip 404 rewrite for service worker files
		if (pathname === "/sw.js" || pathname.startsWith("/workbox-")) {
			return response
		}

		let locale = pathname.startsWith("/de")
			? "de"
			: pathname.startsWith("/ru")
				? "ru"
				: "en"
		let notFoundPage = `/${locale}/404`
		console.log("404 rewrite:", { pathname, locale, notFoundPage })
		return context.rewrite(notFoundPage)
	}

	return response
})
