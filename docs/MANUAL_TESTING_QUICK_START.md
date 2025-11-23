# Manual Testing Quick Start Guide

This guide helps you quickly start manual testing for the Clerk to Passkey migration.

## Quick Setup (5 minutes)

### 1. Start the Application
```bash
# Install dependencies (if not already done)
pnpm install

# Start the development server
pnpm dev
```

The application should be running at `http://localhost:4321`

### 2. Prepare Your Browser
- Open Chrome/Edge in Incognito mode (or clear browser storage)
- Open DevTools (F12)
- Keep Console and Network tabs visible

### 3. Quick Smoke Test (10 minutes)

#### Test 1: New User Signup ✅
1. Click "Sign Up" button
2. Enter username: "Test User"
3. Click "Sign Up with Passkey"
4. Complete biometric authentication
5. ✅ Verify you're logged in

#### Test 2: Logout and Login ✅
1. Click "Log Out" button
2. Click "Log In" button
3. Select your passkey
4. Complete biometric authentication
5. ✅ Verify you're logged in again

#### Test 3: Chat with AI ✅
1. Navigate to Assistant page
2. Send a message: "Hello"
3. Open Network tab
4. ✅ Verify request has `Authorization: Jazz <token>` header
5. ✅ Verify you get a response

#### Test 4: Settings Page ✅
1. Navigate to Settings page
2. ✅ Verify authentication status shows "Logged in"
3. ✅ Verify passkey indicator is visible
4. Click "Log Out"
5. ✅ Verify status changes to "Not logged in"

#### Test 5: Offline Mode ✅
1. Log in to the application
2. Open DevTools Network tab
3. Set to "Offline" mode
4. Navigate to Settings
5. ✅ Verify auth buttons are disabled
6. ✅ Verify offline indicator is shown

### 4. Check for Errors
```bash
# Search for Clerk references
grep -ri "clerk" src/ --exclude-dir=node_modules

# Run TypeScript check
pnpm check

# Run build
pnpm build
```

✅ All should pass with no Clerk references or errors

## Full Testing

For comprehensive testing, see [MANUAL_TESTING_CHECKLIST.md](./MANUAL_TESTING_CHECKLIST.md)

## Common Issues

### Issue: Passkey UI doesn't appear
**Solution:** Ensure you're using HTTPS or localhost. WebAuthn requires a secure context.

### Issue: "Browser doesn't support passkeys"
**Solution:** Update your browser to the latest version. Chrome 108+, Firefox 119+, Safari 16+ required.

### Issue: Passkey creation fails
**Solution:** 
- Check if you have biometric authentication set up on your device
- Try using a security key instead
- Check browser console for specific errors

### Issue: Network errors in offline mode
**Solution:** This is expected. Verify that:
- Auth buttons are disabled
- User sees appropriate offline message
- No unhandled errors in console

## Test Results

After completing the quick smoke test, document your results:

- [ ] All 5 smoke tests passed
- [ ] No console errors
- [ ] No Clerk references found
- [ ] Build succeeds

**Issues Found:**
_Document any issues here_

## Next Steps

1. ✅ Complete quick smoke test (above)
2. 📋 Complete full manual testing checklist
3. 🧪 Run automated tests: `pnpm test:e2e`
4. 🚀 Ready for deployment

## Need Help?

- Check [AUTHENTICATION_TESTING.md](./AUTHENTICATION_TESTING.md) for automated test info
- Review [MANUAL_TESTING_CHECKLIST.md](./MANUAL_TESTING_CHECKLIST.md) for detailed tests
- See [TESTING.md](./TESTING.md) for general testing guidelines
