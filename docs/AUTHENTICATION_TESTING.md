# Authentication Testing Documentation

This document describes the comprehensive testing strategy for passkey authentication in the Tilly application.

## Test Coverage

### 1. Unit Tests (`src/app/components/passkey-auth.test.tsx`)

Unit tests verify the PasskeyAuthDialog component behavior in isolation:

- ✅ Signup mode renders username input
- ✅ Login mode hides username input
- ✅ Submit button triggers correct auth method
- ✅ Error handling displays messages
- ✅ Loading states disable interactions

**Running unit tests:**
```bash
pnpm test
```

### 2. Integration Tests (`tests/integration/auth-flows.test.ts`)

Integration tests verify authentication flows using Jazz's testing utilities:

- ✅ Complete signup creates new account
- ✅ Account data persists after refresh
- ✅ Login with existing passkey succeeds
- ✅ Failed login shows error
- ✅ User is redirected after signup

**Running integration tests:**
```bash
pnpm vitest run tests/integration/auth-flows.test.ts
```

**Known Limitations:**
- Cross-account profile reading tests fail due to Jazz testing utility limitations
- These scenarios are better tested in E2E tests with real browser environments

### 3. E2E Tests (`tests/e2e/passkey-auth.spec.ts`)

E2E tests verify the complete user experience in a real browser:

**UI Tests:**
- ✅ Authentication dialog displays correctly for signup
- ✅ Authentication dialog displays correctly for login
- ✅ Switch between signup and login modes
- ✅ Show error when signing up without username
- ✅ Disable submit button when username is empty
- ✅ Close dialog when clicking outside or pressing escape
- ✅ Allow entering username with keyboard

**Integration Tests:**
- ✅ Complete signup flow shows authentication UI
- ✅ Login flow shows correct UI elements
- ✅ Authentication status displays correctly when unauthenticated
- ✅ Failed login attempt shows error

**Running E2E tests:**
```bash
pnpm test:e2e
```

**Virtual Authenticator Setup:**
The E2E tests include setup for Playwright's Virtual Authenticator API using Chrome DevTools Protocol (CDP). This provides the foundation for testing WebAuthn passkey flows, though full passkey authentication requires additional WebAuthn API mocking.

```typescript
async function setupVirtualAuthenticator(page: Page) {
  let client = await page.context().newCDPSession(page)
  await client.send("WebAuthn.enable")
  let { authenticatorId } = await client.send(
    "WebAuthn.addVirtualAuthenticator",
    {
      options: {
        protocol: "ctap2",
        transport: "internal",
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
      },
    },
  )
  return { client, authenticatorId }
}
```

## Test Requirements Coverage

The tests verify the following requirements from the migration spec:

- **Requirement 2.3**: Complete signup creates new account ✅
- **Requirement 2.4**: Account persistence and login functionality ✅
- **Requirement 3.4**: Profile is publicly readable (integration test limitation)
- **Requirement 6.2**: User redirection after signup ✅
- **Requirement 6.3**: Error handling for failed authentication ✅

## Testing Strategy

### Unit Tests
- Mock Jazz hooks and UI components
- Test component behavior in isolation
- Fast execution, run on every commit

### Integration Tests
- Use Jazz's testing utilities
- Test authentication logic without browser
- Verify account creation, persistence, and login flows
- Limited by Jazz testing environment capabilities

### E2E Tests
- Test complete user flows in real browser
- Verify UI behavior and user experience
- Include virtual authenticator setup for future WebAuthn testing
- Run before deployment

## Future Improvements

1. **Enhanced WebAuthn Testing**: Implement full WebAuthn API mocking in E2E tests to test actual passkey creation and authentication flows

2. **Cross-Account Testing**: Improve integration tests to handle cross-account scenarios when Jazz testing utilities support improves

3. **Performance Testing**: Add tests to verify authentication performance and sync speed

4. **Accessibility Testing**: Add tests to verify keyboard navigation and screen reader support

## Related Documentation

- [Testing Guide](./TESTING.md) - General testing documentation
- [Requirements](../.kiro/specs/clerk-to-passkey-migration/requirements.md) - Authentication requirements
- [Design](../.kiro/specs/clerk-to-passkey-migration/design.md) - Authentication design decisions
