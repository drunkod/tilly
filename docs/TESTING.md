# Testing Documentation

This document describes the testing setup for the Tilly application.

## Test Types

### Unit Tests (Vitest)

Unit tests are written using Vitest and React Testing Library. They test individual components in isolation.

**Location**: `src/**/*.test.tsx`

**Running tests**:
```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run
```

**Configuration**:
- `vitest.config.ts` - Vitest configuration
- `src/test-setup.ts` - Test setup file that imports jest-dom matchers
- `tsconfig.vitest.json` - TypeScript configuration for tests

**Example**: `src/app/components/passkey-auth.test.tsx`

### E2E Tests (Playwright)

End-to-end tests are written using Playwright. They test the application from a user's perspective in a real browser.

**Location**: `tests/e2e/**/*.spec.ts`

**Running tests**:
```bash
# Run E2E tests in headless mode
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
```

**Configuration**:
- `playwright.config.ts` - Playwright configuration
- Tests run against the Node adapter build (`pnpm build:node`)
- Preview server runs on `http://localhost:4321`

**Example tests**:
- `tests/e2e/home.spec.ts` - Basic navigation tests
- `tests/e2e/passkey-auth.spec.ts` - Authentication flow tests

## CI/CD

### GitHub Actions

The project uses GitHub Actions for continuous integration.

**Workflow**: `.github/workflows/playwright.yml`

**What it does**:
1. Checks out the code
2. Sets up Node.js and pnpm
3. Installs dependencies
4. Installs Playwright browsers
5. Builds the project with Node adapter
6. Runs Playwright E2E tests
7. Uploads test reports as artifacts

**Triggers**:
- Push to `main` branch
- Pull requests (opened, synchronized, reopened)

## Writing Tests

### Unit Test Example

```typescript
import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MyComponent } from "./my-component"

describe("MyComponent", () => {
  test("renders correctly", () => {
    render(<MyComponent />)
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from "@playwright/test"

test.describe("My Feature", () => {
  test("should work correctly", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Welcome")).toBeVisible()
  })
})
```

## Best Practices

### Unit Tests
- Mock external dependencies (Jazz hooks, UI components)
- Test component behavior, not implementation details
- Use `data-testid` attributes sparingly, prefer semantic queries
- Keep tests focused and isolated

### E2E Tests
- Test user flows, not individual components
- Use semantic selectors (role, label, text)
- Wait for elements to be visible before interacting
- Test critical paths first
- Keep tests independent and idempotent

## Troubleshooting

### Unit Tests

**Issue**: Tests fail with "document is not defined"
**Solution**: Ensure `environment: "jsdom"` is set in `vitest.config.ts`

**Issue**: jest-dom matchers not recognized
**Solution**: Check that `src/test-setup.ts` imports `@testing-library/jest-dom/vitest`

### E2E Tests

**Issue**: Tests timeout waiting for server
**Solution**: Ensure the build completes successfully with `pnpm build:node`

**Issue**: Tests fail with "page not found"
**Solution**: Check that the preview server is running on the correct port (4321)

**Issue**: Passkey tests fail
**Solution**: Note that actual passkey authentication cannot be tested in Playwright without mocking the WebAuthn API. Tests focus on UI behavior only.
