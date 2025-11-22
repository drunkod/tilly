# Implementation Plan

- [x] 1. Remove Clerk dependencies and configuration
  - Remove Clerk packages from package.json
  - Remove Clerk environment variables from .env files
  - Remove Clerk imports from codebase
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Create PasskeyAuthDialog component
  - Create new file `src/app/components/passkey-auth.tsx`
  - Implement dual-mode dialog (signup/login)
  - Add username input for signup mode
  - Integrate usePasskeyAuth hook
  - Add error handling and loading states
  - Use Shadcn UI components (Dialog, Button, Input, Label)
  - Export APP_NAME constant
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. Update UserAccount schema with public profile migration
  - Modify `src/shared/schema/user.ts`
  - Add profile initialization check in migration
  - Create Group with account as owner
  - Add "everyone" as reader to profile group
  - Create UserProfile with default name
  - Set profile on account with public group
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Replace ClerkProvider with JazzReactProvider
  - Modify `src/app/main.tsx`
  - Remove ClerkProvider import and wrapper
  - Add JazzReactProvider import
  - Configure JazzReactProvider with UserAccount schema
  - Configure sync server connection
  - Remove Clerk-specific configuration
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5. Update Settings page authentication section
  - Modify `src/app/routes/_app.settings.tsx`
  - Import usePasskeyAuth and useIsAuthenticated hooks
  - Create AuthenticationSection component
  - Display authenticated state with passkey indicator
  - Display unauthenticated state with login/signup buttons
  - Add session refresh button for logout
  - Disable actions when offline using useOnlineStatus
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 6. Update Welcome page sign-in
  - Modify `src/app/routes/index.tsx`
  - Import usePasskeyAuth hook
  - Import APP_NAME from passkey-auth component
  - Create handleSignIn function
  - Call setTourSkipped(true) on sign-in
  - Call auth.logIn() to trigger passkey flow
  - Update sign-in button to use handleSignIn
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 7. Implement client-side API authentication
  - Modify `src/app/routes/_app.assistant.tsx`
  - Import generateAuthToken from jazz-tools
  - Add headers to useChat configuration
  - Generate auth token for each request
  - Attach token to Authorization header in "Jazz <token>" format
  - _Requirements: 7.1_

- [x] 8. Implement server-side API authentication
  - Modify `src/server/features/chat-messages.ts`
  - Import authenticateRequest from jazz-tools
  - Remove Clerk imports and middleware
  - Add authenticateRequest call at start of handler
  - Check for authentication errors
  - Return 401 if account is undefined or error exists
  - Use authenticated account as user context
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ] 9. Handle cron job user enumeration
  - Modify `vercel.json` to disable Clerk-dependent cron jobs
  - Add comment documenting temporary nature of solution
  - Create documentation file explaining limitation
  - Document future Global Directory CoMap approach
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 10. Verify TypeScript compilation
  - Run `pnpm check` to verify no type errors
  - Fix any type errors that appear
  - Ensure no "any" types or type casts used
  - Verify proper Jazz type inference
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 11. Write unit tests for PasskeyAuthDialog
  - Test signup mode renders username input
  - Test login mode hides username input
  - Test submit button triggers correct auth method
  - Test error handling displays messages
  - Test loading states disable interactions
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 12. Write unit tests for account schema migration
  - Test root initialization creates expected structure
  - Test profile initialization creates public group
  - Test "everyone" reader permission is set
  - Test migration is idempotent
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 13. Write integration tests for authentication flows
  - Test complete signup creates new account
  - Test profile is publicly readable
  - Test user is redirected after signup
  - Test account data persists after refresh
  - Test login with existing passkey succeeds
  - Test login loads correct account data
  - Test failed login shows error
  - _Requirements: 2.3, 2.4, 3.4, 6.2, 6.3_

- [ ] 14. Write integration tests for API authentication
  - Test authenticated requests succeed
  - Test unauthenticated requests return 401
  - Test expired tokens return 401
  - Test invalid tokens return 401
  - _Requirements: 7.2, 7.3, 7.4_

- [ ] 15. Perform manual testing
  - Test new user signup with passkey
  - Test returning user login with passkey
  - Test profile visibility to other users
  - Test chat API with Jazz auth tokens
  - Test settings page auth status display
  - Test welcome page sign-in
  - Test offline mode disables auth actions
  - Test browser passkey UI appears correctly
  - Test error messages are user-friendly
  - Verify no Clerk references remain
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.4, 5.1, 5.2, 5.3, 5.5, 6.1, 7.1, 7.2, 9.1, 9.2_

- [ ] 16. Perform security review
  - Review passkey implementation for vulnerabilities
  - Review token generation and validation
  - Review local storage security
  - Check for XSS vulnerabilities
  - Verify CSP headers are set
  - Review user input sanitization
  - _Requirements: 2.5, 7.1, 7.2, 7.3, 7.4_

- [ ] 17. Perform cross-browser testing
  - Test in Chrome/Edge (Chromium)
  - Test in Firefox
  - Test in Safari
  - Test on mobile browsers (iOS Safari, Chrome Android)
  - Verify passkey support detection
  - Test fallback behavior for unsupported browsers
  - _Requirements: 2.5, 9.1, 9.2_

- [ ] 18. Update documentation
  - Document authentication changes in README
  - Create migration guide for existing users
  - Document Global Directory future enhancement
  - Update deployment documentation
  - Document rollback procedures
  - _Requirements: 8.3, 9.1, 9.2_

- [ ] 19. Deploy to staging environment
  - Merge feature branch to staging
  - Deploy to staging server
  - Run smoke tests on staging
  - Verify authentication flows work
  - Check for console errors
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 20. Deploy to production
  - Merge to main branch
  - Deploy to production server
  - Monitor error logs
  - Monitor authentication metrics
  - Communicate changes to users
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
