# Manual Testing Checklist - Clerk to Passkey Migration

This document provides a comprehensive manual testing checklist for the Clerk to Passkey migration. Complete all tests before deploying to production.

## Pre-Testing Setup

### Environment Setup

- [ ] Ensure you have a clean browser profile or incognito window
- [ ] Clear all browser storage (localStorage, IndexedDB, cookies)
- [ ] Verify the application is running locally: `pnpm dev`
- [ ] Open browser DevTools Console to monitor for errors
- [ ] Open Network tab to monitor API requests

### Test Browsers

Test in the following browsers to ensure cross-browser compatibility:

- [ ] Chrome/Edge (Chromium) - Latest version
- [ ] Firefox - Latest version
- [ ] Safari - Latest version (macOS/iOS)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

---

## 1. New User Signup with Passkey

### Test Steps

1. [ ] Open the application in a fresh browser session
2. [ ] Navigate to the home page
3. [ ] Click "Sign Up" or trigger signup flow
4. [ ] Enter a username in the dialog
5. [ ] Click "Sign Up with Passkey"
6. [ ] Verify browser's native passkey UI appears
7. [ ] Complete biometric authentication (FaceID/TouchID/Windows Hello)
8. [ ] Verify successful signup

### Expected Results

- [ ] PasskeyAuthDialog displays with username input field
- [ ] Submit button is disabled when username is empty
- [ ] Browser shows native WebAuthn credential creation UI
- [ ] After successful creation, user is authenticated
- [ ] User is redirected to the main application
- [ ] No console errors appear
- [ ] User's profile is created with the entered username

### Error Cases to Test

- [ ] Cancel passkey creation → Shows user-friendly error message
- [ ] Empty username → Submit button remains disabled
- [ ] Browser doesn't support WebAuthn → Appropriate fallback or message

---

## 2. Returning User Login with Passkey

### Test Steps

1. [ ] After signing up, log out of the application
2. [ ] Click "Log In" button
3. [ ] Browser shows passkey selection UI
4. [ ] Select the previously created passkey
5. [ ] Complete biometric authentication
6. [ ] Verify successful login

### Expected Results

- [ ] Login button triggers browser's passkey selection UI
- [ ] Previously created passkey appears in the list
- [ ] After authentication, user is logged in
- [ ] User's data is loaded correctly
- [ ] No console errors appear
- [ ] Authentication status shows "logged in"

### Error Cases to Test

- [ ] Cancel passkey selection → Shows user-friendly error message
- [ ] Wrong passkey selected → Appropriate error handling
- [ ] Passkey not found → Clear error message

---

## 3. Profile Visibility to Other Users

### Test Steps

1. [ ] Create Account A in Browser 1
2. [ ] Set profile name for Account A
3. [ ] Create Account B in Browser 2 (incognito)
4. [ ] Share a CoValue between Account A and Account B
5. [ ] Verify Account B can see Account A's profile name

### Expected Results

- [ ] Profile names are visible across accounts
- [ ] Profile data is publicly readable
- [ ] No permission errors when accessing profiles
- [ ] Profile updates sync in real-time

### Notes

- This test verifies Requirement 3.4: Profile is publicly readable
- Use the chat or collaboration features to test cross-account visibility

---

## 4. Chat API with Jazz Auth Tokens

### Test Steps

1. [ ] Log in to the application
2. [ ] Navigate to the Assistant/Chat page
3. [ ] Send a message to the AI assistant
4. [ ] Open Network tab and inspect the request
5. [ ] Verify the Authorization header contains a Jazz token
6. [ ] Verify the server responds successfully

### Expected Results

- [ ] Request includes `Authorization: Jazz <token>` header
- [ ] Token is a valid Jazz authentication token
- [ ] Server successfully validates the token
- [ ] Chat messages are sent and received correctly
- [ ] No 401 Unauthorized errors
- [ ] Server logs show authenticated requests

### Error Cases to Test

- [ ] Send request without authentication → 401 error
- [ ] Send request with invalid token → 401 error
- [ ] Token expiration handling (if applicable)

---

## 5. Settings Page Auth Status Display

### Test Steps

#### When Unauthenticated

1. [ ] Open application without logging in
2. [ ] Navigate to Settings page
3. [ ] Verify authentication section shows unauthenticated state

#### When Authenticated

1. [ ] Log in with passkey
2. [ ] Navigate to Settings page
3. [ ] Verify authentication section shows authenticated state
4. [ ] Verify passkey indicator is displayed
5. [ ] Click logout button
6. [ ] Verify session is cleared and user is logged out

### Expected Results

#### Unauthenticated State

- [ ] Shows "Not logged in" or similar message
- [ ] Displays "Log In" and "Sign Up" buttons
- [ ] No passkey indicator visible

#### Authenticated State

- [ ] Shows "Logged in" or similar message
- [ ] Displays user's profile information
- [ ] Shows passkey indicator/icon
- [ ] Logout button is visible and functional
- [ ] Clicking logout clears session and refreshes app

---

## 6. Welcome Page Sign-In

### Test Steps

1. [ ] Open application as a new user
2. [ ] Verify welcome page is displayed
3. [ ] Click "Sign In" button on welcome page
4. [ ] Complete passkey login flow
5. [ ] Verify tour is skipped after login
6. [ ] Verify user is navigated to main application

### Expected Results

- [ ] "Sign In" button is visible on welcome page
- [ ] Clicking button triggers passkey login flow
- [ ] After successful login, tour is marked as skipped
- [ ] User is redirected to main app (not welcome page)
- [ ] No console errors appear

---

## 7. Offline Mode Disables Auth Actions

### Test Steps

1. [ ] Open application and log in
2. [ ] Open DevTools Network tab
3. [ ] Set network to "Offline" mode
4. [ ] Navigate to Settings page
5. [ ] Verify authentication actions are disabled
6. [ ] Try to perform auth-related actions

### Expected Results

- [ ] Login/Signup buttons are disabled when offline
- [ ] Logout button is disabled when offline
- [ ] Appropriate "offline" indicator is shown
- [ ] User-friendly message explains why actions are disabled
- [ ] No network errors in console (graceful handling)

### Re-enable Network

1. [ ] Set network back to "Online"
2. [ ] Verify auth actions become enabled again
3. [ ] Verify sync resumes automatically

---

## 8. Browser Passkey UI Appears Correctly

### Test Steps

Test in each supported browser:

#### Chrome/Edge (Chromium)

1. [ ] Trigger passkey signup
2. [ ] Verify Windows Hello or security key prompt appears
3. [ ] Complete authentication
4. [ ] Verify passkey is saved

#### Firefox

1. [ ] Trigger passkey signup
2. [ ] Verify Firefox's passkey UI appears
3. [ ] Complete authentication
4. [ ] Verify passkey is saved

#### Safari (macOS)

1. [ ] Trigger passkey signup
2. [ ] Verify TouchID or FaceID prompt appears
3. [ ] Complete authentication
4. [ ] Verify passkey is saved

#### Safari (iOS)

1. [ ] Trigger passkey signup
2. [ ] Verify FaceID or TouchID prompt appears
3. [ ] Complete authentication
4. [ ] Verify passkey is saved

#### Chrome (Android)

1. [ ] Trigger passkey signup
2. [ ] Verify fingerprint or device unlock prompt appears
3. [ ] Complete authentication
4. [ ] Verify passkey is saved

### Expected Results

- [ ] Native browser/OS passkey UI appears in all browsers
- [ ] UI is appropriate for the device (biometric or security key)
- [ ] Authentication completes successfully
- [ ] Passkeys are stored securely by the browser/OS
- [ ] Passkeys sync across devices (if browser supports it)

---

## 9. Error Messages Are User-Friendly

### Test Scenarios

#### Passkey Creation Errors

1. [ ] Cancel passkey creation
   - Expected: "Passkey creation was cancelled. Please try again."
2. [ ] Browser doesn't support WebAuthn
   - Expected: "Your browser doesn't support passkeys. Please use a modern browser."
3. [ ] Biometric authentication fails
   - Expected: "Authentication failed. Please try again."

#### Login Errors

1. [ ] Cancel passkey selection
   - Expected: "Login was cancelled. Please try again."
2. [ ] No passkey found
   - Expected: "No passkey found. Please sign up first."
3. [ ] Wrong passkey selected
   - Expected: "Authentication failed. Please try again with the correct passkey."

#### Network Errors

1. [ ] Offline during signup
   - Expected: "You're offline. Please connect to the internet to sign up."
2. [ ] Offline during login
   - Expected: "You're offline. Please connect to the internet to log in."

#### Server Errors

1. [ ] Server unavailable
   - Expected: "Unable to connect to server. Please try again later."
2. [ ] Invalid token
   - Expected: "Your session has expired. Please log in again."

### Expected Results

- [ ] All error messages are clear and actionable
- [ ] No technical jargon or stack traces shown to users
- [ ] Errors are displayed in a visible, non-intrusive way
- [ ] Users understand what went wrong and how to fix it

---

## 10. Verify No Clerk References Remain

### Code Search

1. [ ] Search codebase for "clerk" (case-insensitive)
   ```bash
   grep -ri "clerk" src/ --exclude-dir=node_modules
   ```
2. [ ] Verify only documentation/comments reference Clerk
3. [ ] No active Clerk imports or API calls

### Package Dependencies

1. [ ] Check `package.json` for Clerk packages
   ```bash
   grep -i "clerk" package.json
   ```
2. [ ] Verify no `@clerk/` packages are installed

### Environment Variables

1. [ ] Check `.env` files for Clerk variables
   ```bash
   grep -i "clerk" .env .env.example .env.local
   ```
2. [ ] Verify no `CLERK_` environment variables

### Build Verification

1. [ ] Run TypeScript compilation
   ```bash
   pnpm check
   ```
2. [ ] Verify no Clerk-related type errors
3. [ ] Run production build
   ```bash
   pnpm build
   ```
4. [ ] Verify build succeeds without Clerk dependencies

### Expected Results

- [ ] No Clerk imports in active code
- [ ] No Clerk packages in dependencies
- [ ] No Clerk environment variables in use
- [ ] Application builds successfully
- [ ] No Clerk-related errors in console

---

## Additional Verification Tests

### Data Persistence

1. [ ] Create data while logged in
2. [ ] Refresh the page
3. [ ] Verify data persists
4. [ ] Log out and log back in
5. [ ] Verify data is still accessible

### Cross-Device Sync

1. [ ] Log in on Device A
2. [ ] Create/modify data
3. [ ] Log in on Device B with same passkey
4. [ ] Verify data syncs to Device B
5. [ ] Modify data on Device B
6. [ ] Verify changes sync back to Device A

### Session Management

1. [ ] Log in to the application
2. [ ] Close browser tab
3. [ ] Reopen application
4. [ ] Verify user is still logged in
5. [ ] Log out
6. [ ] Close and reopen browser
7. [ ] Verify user is logged out

---

## Security Verification

### Token Security

1. [ ] Inspect network requests in DevTools
2. [ ] Verify tokens are not exposed in URLs
3. [ ] Verify tokens are sent over HTTPS only
4. [ ] Verify tokens are short-lived (check expiration)

### Local Storage Security

1. [ ] Inspect browser localStorage
2. [ ] Verify passkey credentials are stored securely
3. [ ] Verify no sensitive data is stored in plain text
4. [ ] Clear storage and verify logout

### XSS Protection

1. [ ] Test user input fields for XSS vulnerabilities
2. [ ] Verify all user input is sanitized
3. [ ] Check Content Security Policy headers

---

## Performance Testing

### Authentication Speed

1. [ ] Measure time to complete signup
2. [ ] Measure time to complete login
3. [ ] Verify authentication is faster than previous Clerk implementation

### Sync Performance

1. [ ] Create large dataset
2. [ ] Measure sync time across devices
3. [ ] Verify acceptable performance

---

## Test Results Summary

### Overall Status

- [ ] All critical tests passed
- [ ] All error cases handled gracefully
- [ ] No Clerk references remain
- [ ] Application is ready for deployment

### Issues Found

Document any issues found during testing:

1. Issue: **\*\***\_\_\_**\*\***
   - Severity: Critical / High / Medium / Low
   - Steps to reproduce: **\*\***\_\_\_**\*\***
   - Expected: **\*\***\_\_\_**\*\***
   - Actual: **\*\***\_\_\_**\*\***

2. Issue: **\*\***\_\_\_**\*\***
   - Severity: Critical / High / Medium / Low
   - Steps to reproduce: **\*\***\_\_\_**\*\***
   - Expected: **\*\***\_\_\_**\*\***
   - Actual: **\*\***\_\_\_**\*\***

### Sign-Off

- [ ] All tests completed
- [ ] All critical issues resolved
- [ ] Application approved for deployment

**Tester Name:** **\*\***\_\_\_**\*\***
**Date:** **\*\***\_\_\_**\*\***
**Signature:** **\*\***\_\_\_**\*\***

---

## Notes

- This checklist should be completed before deploying to production
- Document any deviations or issues found
- Update this checklist as new test cases are identified
- Keep this document in sync with the requirements and design documents

## Related Documentation

- [Authentication Testing](./AUTHENTICATION_TESTING.md) - Automated test documentation
- [Requirements](../.kiro/specs/clerk-to-passkey-migration/requirements.md) - Migration requirements
- [Design](../.kiro/specs/clerk-to-passkey-migration/design.md) - Migration design
- [Testing Guide](./TESTING.md) - General testing documentation
