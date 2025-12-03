# Security Implementation Guide

This guide provides step-by-step instructions for implementing the critical security recommendations from the security review.

## Quick Start: Critical Fixes

These three fixes should be implemented immediately:

1. [CSP Headers](#1-implement-csp-headers) (2 hours)
2. [Input Sanitization](#2-implement-input-sanitization) (4 hours)
3. [Browser Compatibility Check](#3-add-browser-compatibility-check) (2 hours)

---

## 1. Implement CSP Headers

### Step 1: Update Middleware

Edit `src/middleware.ts` to add security headers:

```typescript
import { defineMiddleware } from "astro:middleware"

export let onRequest = defineMiddleware(async (context, next) => {
	if (context.url.pathname === "/") {
		let acceptLanguage = context.request.headers.get("accept-language")
		let preferredLang = acceptLanguage
			?.split(",")[0]
			.split("-")[0]
			.toLowerCase()
		let locale = preferredLang === "de" ? "de" : "en"
		return context.redirect(`/${locale}/`, 301)
	}

	let response = await next()

	// Add security headers
	if (!response.headers.has("Content-Security-Policy")) {
		response.headers.set(
			"Content-Security-Policy",
			[
				"default-src 'self'",
				// Note: 'unsafe-inline' and 'unsafe-eval' needed for React/Vite
				// TODO: Remove in production with nonce-based CSP
				"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.jazz.tools",
				"style-src 'self' 'unsafe-inline'",
				"img-src 'self' data: https:",
				"font-src 'self' data:",
				"connect-src 'self' wss://cloud.jazz.tools https://cloud.jazz.tools https://generativelanguage.googleapis.com",
				"frame-ancestors 'none'",
				"base-uri 'self'",
				"form-action 'self'",
			].join("; "),
		)
	}

	// Prevent clickjacking
	response.headers.set("X-Frame-Options", "DENY")

	// Prevent MIME type sniffing
	response.headers.set("X-Content-Type-Options", "nosniff")

	// Control referrer information
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

	// Restrict browser features
	response.headers.set(
		"Permissions-Policy",
		"camera=(), microphone=(), geolocation=()",
	)

	if (response.status === 404) {
		let pathname = context.url.pathname

		if (pathname === "/sw.js" || pathname.startsWith("/workbox-")) {
			return response
		}

		let locale = pathname.startsWith("/de") ? "de" : "en"
		let notFoundPage = `/${locale}/404`
		return context.rewrite(notFoundPage)
	}

	return response
})
```

### Step 2: Test CSP Headers

1. Start the development server: `pnpm dev`
2. Open browser DevTools → Network tab
3. Check response headers for any page
4. Verify CSP header is present
5. Check Console for CSP violations

### Step 3: Adjust CSP for Production

For production, create a stricter CSP:

```typescript
// In production, use nonce-based CSP
let isDev = import.meta.env.DEV

let scriptSrc = isDev
	? "'self' 'unsafe-inline' 'unsafe-eval' https://cloud.jazz.tools"
	: "'self' 'nonce-{NONCE}' https://cloud.jazz.tools"

let styleSrc = isDev ? "'self' 'unsafe-inline'" : "'self' 'nonce-{NONCE}'"
```

---

## 2. Implement Input Sanitization

### Step 1: Install DOMPurify

```bash
pnpm add dompurify
pnpm add -D @types/dompurify
```

### Step 2: Create Sanitization Utilities

Create `src/shared/lib/sanitize.ts`:

```typescript
import DOMPurify from "dompurify"

/**
 * Sanitize plain text input (removes all HTML)
 */
export function sanitizeText(input: string): string {
	return DOMPurify.sanitize(input, {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
	}).trim()
}

/**
 * Sanitize markdown content (allows safe formatting tags)
 */
export function sanitizeMarkdown(input: string): string {
	return DOMPurify.sanitize(input, {
		ALLOWED_TAGS: [
			"b",
			"i",
			"em",
			"strong",
			"a",
			"p",
			"br",
			"ul",
			"ol",
			"li",
			"h1",
			"h2",
			"h3",
			"code",
			"pre",
		],
		ALLOWED_ATTR: ["href", "title", "target"],
		ALLOW_DATA_ATTR: false,
	}).trim()
}

/**
 * Sanitize username (alphanumeric + spaces, hyphens, underscores)
 */
export function sanitizeUsername(input: string): string {
	return input
		.replace(/[^a-zA-Z0-9\s\-_]/g, "")
		.trim()
		.slice(0, 50)
}

/**
 * Sanitize person name
 */
export function sanitizePersonName(input: string): string {
	return input
		.replace(/[<>]/g, "") // Remove angle brackets
		.trim()
		.slice(0, 100)
}

/**
 * Sanitize file upload data
 */
export function sanitizeFileData(data: unknown): unknown {
	if (typeof data === "string") {
		return sanitizeText(data)
	}
	if (Array.isArray(data)) {
		return data.map(sanitizeFileData)
	}
	if (data && typeof data === "object") {
		let sanitized: Record<string, unknown> = {}
		for (let [key, value] of Object.entries(data)) {
			sanitized[key] = sanitizeFileData(value)
		}
		return sanitized
	}
	return data
}

/**
 * Validate and sanitize data URL
 */
export function sanitizeDataURL(dataURL: string): string | null {
	// Only allow image data URLs
	if (!dataURL.startsWith("data:image/")) {
		return null
	}

	// Check for valid image formats
	let validFormats = ["jpeg", "jpg", "png", "gif", "webp"]
	let format = dataURL.match(/data:image\/(\w+);/)?.[1]

	if (!format || !validFormats.includes(format.toLowerCase())) {
		return null
	}

	return dataURL
}
```

### Step 3: Apply Sanitization to Passkey Auth

Update `src/app/components/passkey-auth.tsx`:

```typescript
import { sanitizeUsername } from "#shared/lib/sanitize"

// In handleSignUp function:
async function handleSignUp() {
	let sanitizedUsername = sanitizeUsername(username)

	if (!sanitizedUsername) {
		setError("Please enter a valid username")
		return
	}

	setIsLoading(true)
	setError(null)

	try {
		await auth.signUp(sanitizedUsername)
		onOpenChange(false)
	} catch (err) {
		setError(
			err instanceof Error
				? err.message
				: "Failed to sign up. Please try again.",
		)
	} finally {
		setIsLoading(false)
	}
}
```

### Step 4: Apply Sanitization to Notes

Update note creation/editing to sanitize markdown:

```typescript
import { sanitizeMarkdown } from "#shared/lib/sanitize"

// When creating/updating notes:
let sanitizedContent = sanitizeMarkdown(noteContent)
note.$jazz.set("content", sanitizedContent)
```

### Step 5: Apply Sanitization to File Uploads

Update `src/app/features/data-upload-button.tsx`:

```typescript
import { sanitizeFileData, sanitizeDataURL } from "#shared/lib/sanitize"

// In onSubmit function, after parsing JSON:
let jsonData: FileData = check.data

// Sanitize all string fields
for (let personData of jsonData.people) {
	personData.name = sanitizePersonName(personData.name)
	if (personData.summary) {
		personData.summary = sanitizeText(personData.summary)
	}

	// Sanitize avatar data URL
	if (personData.avatar?.dataURL) {
		let sanitized = sanitizeDataURL(personData.avatar.dataURL)
		if (!sanitized) {
			console.warn(`Invalid avatar data URL for ${personData.name}`)
			delete personData.avatar
		} else {
			personData.avatar.dataURL = sanitized
		}
	}

	// Sanitize notes
	if (personData.notes) {
		for (let note of personData.notes) {
			note.content = sanitizeMarkdown(note.content)
		}
	}

	// Sanitize reminders
	if (personData.reminders) {
		for (let reminder of personData.reminders) {
			reminder.text = sanitizeText(reminder.text)
		}
	}
}
```

### Step 6: Test Sanitization

Create test cases:

```typescript
// Test malicious inputs
let maliciousInputs = [
	'<script>alert("XSS")</script>',
	'<img src=x onerror=alert("XSS")>',
	'javascript:alert("XSS")',
	'<iframe src="evil.com"></iframe>',
]

for (let input of maliciousInputs) {
	let sanitized = sanitizeText(input)
	console.assert(
		!sanitized.includes("<script>"),
		"Script tags should be removed",
	)
}
```

---

## 3. Add Browser Compatibility Check

### Step 1: Create Compatibility Utility

Create `src/app/lib/passkey-support.ts`:

```typescript
/**
 * Check if the browser supports WebAuthn/Passkeys
 */
export function isPasskeySupported(): boolean {
	return (
		typeof window !== "undefined" &&
		window.PublicKeyCredential !== undefined &&
		typeof window.PublicKeyCredential === "function"
	)
}

/**
 * Check if the browser supports conditional UI (autofill)
 */
export async function isConditionalUISupported(): Promise<boolean> {
	if (!isPasskeySupported()) {
		return false
	}

	try {
		let available =
			await window.PublicKeyCredential.isConditionalMediationAvailable()
		return available
	} catch {
		return false
	}
}

/**
 * Get user-friendly browser name
 */
export function getBrowserName(): string {
	let userAgent = navigator.userAgent

	if (userAgent.includes("Firefox")) return "Firefox"
	if (userAgent.includes("Chrome")) return "Chrome"
	if (userAgent.includes("Safari")) return "Safari"
	if (userAgent.includes("Edge")) return "Edge"

	return "your browser"
}
```

### Step 2: Update Passkey Auth Component

Update `src/app/components/passkey-auth.tsx`:

```typescript
import { isPasskeySupported, getBrowserName } from "#app/lib/passkey-support"
import { Alert, AlertDescription, AlertTitle } from "#shared/ui/alert"
import { InfoCircleFill } from "react-bootstrap-icons"

function PasskeyAuthDialog({
	open,
	onOpenChange,
	mode = "login",
}: PasskeyAuthDialogProps) {
	let [username, setUsername] = useState("")
	let [isLoading, setIsLoading] = useState(false)
	let [error, setError] = useState<string | null>(null)
	let [currentMode, setCurrentMode] = useState(mode)
	let [passkeySupported] = useState(isPasskeySupported())

	let auth = usePasskeyAuth({ appName: APP_NAME })

	// Show warning if passkeys not supported
	if (!passkeySupported) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<Alert>
						<InfoCircleFill />
						<AlertTitle>Passkeys Not Supported</AlertTitle>
						<AlertDescription>
							{getBrowserName()} doesn't support passkey authentication.
							Please use a modern browser like Chrome, Safari, or Edge.
						</AlertDescription>
					</Alert>
					<Button onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</DialogContent>
			</Dialog>
		)
	}

	// ... rest of component
}
```

### Step 3: Add Fallback Messaging

Add user-friendly messages for unsupported browsers:

```typescript
// In your i18n messages:
export let messages = {
	en: {
		auth: {
			passkeyNotSupported: "Passkeys are not supported in {browser}",
			passkeyNotSupportedDescription:
				"Please use a modern browser like Chrome, Safari, or Edge to use passkey authentication.",
			useModernBrowser: "Use a modern browser",
		},
	},
}
```

---

## 4. Additional Security Enhancements

### Add File Size Limits

```typescript
// In data-upload-button.tsx
let MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

async function onSubmit(values: z.infer<typeof uploadFormSchema>) {
	let file = values.file[0]
	if (!file) return

	// Check file size
	if (file.size > MAX_FILE_SIZE) {
		toast.error("File too large. Maximum size is 10MB.")
		return
	}

	// ... rest of upload logic
}
```

### Add Rate Limiting (Client-Side)

```typescript
// src/app/lib/rate-limit.ts
export class RateLimiter {
	private attempts: Map<string, number[]> = new Map()

	constructor(
		private maxAttempts: number,
		private windowMs: number,
	) {}

	canAttempt(key: string): boolean {
		let now = Date.now()
		let attempts = this.attempts.get(key) || []

		// Remove old attempts outside the window
		attempts = attempts.filter(time => now - time < this.windowMs)

		if (attempts.length >= this.maxAttempts) {
			return false
		}

		attempts.push(now)
		this.attempts.set(key, attempts)
		return true
	}

	reset(key: string): void {
		this.attempts.delete(key)
	}
}

// Usage in passkey auth:
let authRateLimiter = new RateLimiter(5, 60000) // 5 attempts per minute

async function handleSignUp() {
	if (!authRateLimiter.canAttempt("signup")) {
		setError("Too many attempts. Please wait a minute.")
		return
	}

	// ... rest of signup logic
}
```

---

## 5. Testing Your Security Fixes

### Manual Testing Checklist

- [ ] Test CSP headers in browser DevTools
- [ ] Try XSS payloads in all input fields
- [ ] Test passkey auth in different browsers
- [ ] Test file upload with large files
- [ ] Test file upload with malicious content
- [ ] Test rate limiting by rapid submissions
- [ ] Verify error messages don't leak sensitive info

### Automated Testing

Add security tests:

```typescript
// tests/security/sanitization.test.ts
import { describe, it, expect } from "vitest"
import {
	sanitizeText,
	sanitizeMarkdown,
	sanitizeUsername,
} from "#shared/lib/sanitize"

describe("Input Sanitization", () => {
	it("should remove script tags", () => {
		let input = '<script>alert("XSS")</script>Hello'
		let result = sanitizeText(input)
		expect(result).not.toContain("<script>")
		expect(result).toBe("Hello")
	})

	it("should remove event handlers", () => {
		let input = '<img src=x onerror=alert("XSS")>'
		let result = sanitizeText(input)
		expect(result).not.toContain("onerror")
	})

	it("should allow safe markdown", () => {
		let input = "**Bold** and *italic*"
		let result = sanitizeMarkdown(input)
		expect(result).toContain("<strong>")
		expect(result).toContain("<em>")
	})

	it("should sanitize usernames", () => {
		let input = '<script>alert("XSS")</script>John'
		let result = sanitizeUsername(input)
		expect(result).toBe("scriptalertXSSscriptJohn")
	})
})
```

Run tests:

```bash
pnpm vitest run tests/security/
```

---

## 6. Deployment Checklist

Before deploying to production:

- [ ] CSP headers implemented and tested
- [ ] Input sanitization applied to all user inputs
- [ ] Browser compatibility check added
- [ ] File size limits enforced
- [ ] Rate limiting implemented
- [ ] Security tests passing
- [ ] Manual security testing completed
- [ ] Third-party dependencies audited (`npm audit`)
- [ ] Environment variables secured
- [ ] HTTPS enforced
- [ ] Security headers verified in production

---

## 7. Monitoring and Maintenance

### Set Up Security Monitoring

1. **CSP Violation Reporting**
   - Add `report-uri` to CSP header
   - Monitor CSP violations
   - Adjust policy as needed

2. **Error Logging**
   - Log authentication failures
   - Monitor for suspicious patterns
   - Set up alerts for anomalies

3. **Dependency Updates**
   - Run `npm audit` regularly
   - Keep dependencies updated
   - Monitor security advisories

### Regular Security Reviews

- Review security logs weekly
- Update dependencies monthly
- Conduct security audit quarterly
- Penetration testing annually

---

## 8. Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [WebAuthn Guide](https://webauthn.guide/)
- [Jazz Security Docs](https://jazz.tools/docs/reference/encryption)
