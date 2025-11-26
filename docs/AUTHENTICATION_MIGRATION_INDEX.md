# Authentication Migration Documentation Index

This document provides an overview of all documentation related to the Clerk to Jazz Passkey authentication migration.

## Overview

Tilly has migrated from Clerk (third-party authentication) to Jazz's native Passkey authentication system. This change simplifies the architecture, improves security, and reduces external dependencies.

## Documentation Structure

### For Users

1. **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Step-by-step guide for existing users
   - How to export data from Clerk account
   - How to create new Passkey account
   - How to import data to new account
   - Troubleshooting common issues
   - FAQ

### For Developers

2. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide for self-hosting
   - Environment variable configuration
   - Platform-specific deployment instructions (Vercel, Docker, etc.)
   - Post-deployment configuration
   - Security considerations
   - Monitoring and troubleshooting

3. **[ROLLBACK_PROCEDURES.md](ROLLBACK_PROCEDURES.md)** - Emergency rollback procedures
   - When to rollback
   - Step-by-step rollback for different platforms
   - Post-rollback verification
   - Data migration considerations
   - Prevention strategies for future migrations

### For Future Development

4. **[GLOBAL_DIRECTORY_FUTURE.md](GLOBAL_DIRECTORY_FUTURE.md)** - Future enhancement plan
   - Current limitation (no server-side user enumeration)
   - Proposed Global Directory CoMap solution
   - Implementation design and timeline
   - Security and privacy considerations
   - Alternative approaches

### Testing Documentation

5. **[AUTHENTICATION_TESTING.md](AUTHENTICATION_TESTING.md)** - Testing guide
   - Unit test examples
   - Integration test examples
   - E2E test examples with Playwright
   - Manual testing checklist

6. **[MANUAL_TESTING_CHECKLIST.md](MANUAL_TESTING_CHECKLIST.md)** - Manual testing checklist
   - Comprehensive checklist for manual testing
   - Browser compatibility testing
   - Device testing
   - Edge cases

7. **[SECURITY_REVIEW.md](SECURITY_REVIEW.md)** - Security review documentation
   - Passkey implementation security
   - Token generation and validation
   - XSS vulnerability protection
   - CSP headers
   - Input sanitization

### Troubleshooting

8. **[TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md)** - Authentication troubleshooting
   - Sign out issues and solutions
   - Sign in problems
   - Data access issues
   - Cross-device authentication
   - Performance and security issues

### Technical Documentation

8. **[CRON_JOBS_LIMITATION.md](CRON_JOBS_LIMITATION.md)** - Current limitation
   - Why push notification cron jobs are disabled
   - Temporary workaround
   - Link to future enhancement plan

## Quick Links

### I want to...

- **Migrate my existing account** → [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **Deploy Tilly with Passkey auth** → [DEPLOYMENT.md](DEPLOYMENT.md)
- **Rollback to Clerk** → [ROLLBACK_PROCEDURES.md](ROLLBACK_PROCEDURES.md)
- **Understand the future roadmap** → [GLOBAL_DIRECTORY_FUTURE.md](GLOBAL_DIRECTORY_FUTURE.md)
- **Test authentication** → [AUTHENTICATION_TESTING.md](AUTHENTICATION_TESTING.md)
- **Review security** → [SECURITY_REVIEW.md](SECURITY_REVIEW.md)
- **Fix sign out issues** → [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md#sign-out-issues)
- **Troubleshoot authentication** → [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md)

## Key Changes Summary

### What Changed

- **Authentication Provider**: Clerk → Jazz Passkey
- **Authentication Method**: Email/password → WebAuthn passkeys
- **Key Storage**: Clerk servers → Device/browser (via WebAuthn)
- **Multi-device**: Clerk session sync → Browser/OS passkey sync
- **Dependencies**: Removed `@clerk/clerk-react` and `@clerk/backend`

### What Stayed the Same

- **Data encryption**: Still end-to-end encrypted
- **Offline-first**: Still works offline
- **Data sync**: Still uses Jazz Cloud
- **AI assistant**: Still uses Google Gemini
- **Push notifications**: Still supported (via VAPID)

### What's Temporarily Disabled

- **Push notification cron jobs**: Disabled due to lack of server-side user enumeration
  - See [CRON_JOBS_LIMITATION.md](CRON_JOBS_LIMITATION.md)
  - Future solution: [GLOBAL_DIRECTORY_FUTURE.md](GLOBAL_DIRECTORY_FUTURE.md)

## Requirements Addressed

This documentation addresses the following requirements from the migration specification:

- **Requirement 8.3**: Document Global Directory future enhancement
- **Requirement 9.1**: Maintain existing user experience
- **Requirement 9.2**: Preserve same UI/UX patterns

## Migration Timeline

### Completed

- ✅ Remove Clerk dependencies
- ✅ Implement PasskeyAuthDialog component
- ✅ Update UserAccount schema with public profile
- ✅ Replace ClerkProvider with JazzReactProvider
- ✅ Update Settings page authentication section
- ✅ Update Welcome page sign-in
- ✅ Implement client-side API authentication
- ✅ Implement server-side API authentication
- ✅ Handle cron job user enumeration limitation
- ✅ Write comprehensive tests
- ✅ Perform security review
- ✅ Perform cross-browser testing
- ✅ Update documentation

### In Progress

- ⏳ Deploy to staging environment
- ⏳ Deploy to production

### Future

- 📋 Implement Global Directory for user enumeration
- 📋 Re-enable push notification cron jobs
- 📋 Add additional authentication methods (passphrase backup)

## Support

If you need help with the migration:

1. Check the relevant documentation above
2. Review the [FAQ in MIGRATION_GUIDE.md](MIGRATION_GUIDE.md#faq)
3. Check [troubleshooting sections](DEPLOYMENT.md#troubleshooting)
4. File an issue on GitHub
5. Email: assmann@hey.com

## Contributing

When updating authentication-related documentation:

1. Update the relevant document(s) above
2. Update this index if adding new documents
3. Ensure cross-references are correct
4. Test all procedures in staging environment
5. Update version history in each document

## Version History

- **v1.0** (2025-01-XX): Initial documentation for Passkey migration
  - Created migration guide
  - Created deployment guide
  - Created rollback procedures
  - Created future enhancement plan
  - Updated README
  - Created this index

## Related Resources

### External Documentation

- [Jazz Documentation](https://jazz.tools/docs)
- [WebAuthn Guide](https://webauthn.guide)
- [Passkeys.dev](https://passkeys.dev)
- [Web Authentication API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)

### Internal Code

- `src/app/components/passkey-auth.tsx` - PasskeyAuthDialog component
- `src/shared/schema/user.ts` - UserAccount schema with public profile
- `src/app/main.tsx` - JazzReactProvider configuration
- `src/app/routes/_app.settings.tsx` - Settings page authentication
- `src/server/features/chat-messages.ts` - Server-side authentication

### Test Files

- `tests/e2e/passkey-auth.spec.ts` - E2E tests
- `tests/integration/auth-flows.test.ts` - Integration tests
- `tests/integration/api-auth.test.ts` - API authentication tests
- `src/app/components/passkey-auth.test.tsx` - Component tests
